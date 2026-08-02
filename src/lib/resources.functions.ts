import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { mapResource, type ResourceRow } from "@/lib/resources-map";
import { createPublicSupabase } from "@/lib/supabase-public.server";

export const listResources = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("resources")
    .select("id,title,grade_slug,subject_slug,type,term,price_kes,includes,paper_path,scheme_path,popular,published,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapResource(row as ResourceRow));
});

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data) };
  });

export const adminListResources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapResource(row as ResourceRow));
  });

export const createResource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    title: string;
    gradeSlug: string;
    subjectSlug: string;
    type: string;
    term: string;
    priceKES: number;
    includes: string[];
    paperPath: string | null;
    schemePath: string | null;
    popular: boolean;
    published: boolean;
  }) => {
    const title = String(input?.title ?? "").trim();
    if (title.length < 3) throw new Error("Title is required");
    if (!input?.gradeSlug || !input?.subjectSlug || !input?.type || !input?.term) throw new Error("Grade, subject, type and term are required");
    const priceKES = Number(input.priceKES);
    if (!Number.isFinite(priceKES) || priceKES < 0 || priceKES > 100000) throw new Error("Enter a valid price");
    return {
      title: title.slice(0, 200),
      gradeSlug: input.gradeSlug,
      subjectSlug: input.subjectSlug,
      type: input.type,
      term: input.term,
      priceKES: Math.round(priceKES),
      includes: (Array.isArray(input.includes) ? input.includes : []).map((i) => String(i).slice(0, 120)).slice(0, 12),
      paperPath: input.paperPath ? String(input.paperPath).slice(0, 500) : null,
      schemePath: input.schemePath ? String(input.schemePath).slice(0, 500) : null,
      popular: Boolean(input.popular),
      published: input.published !== false,
    };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: row, error } = await context.supabase
      .from("resources")
      .insert({
        title: data.title,
        grade_slug: data.gradeSlug,
        subject_slug: data.subjectSlug,
        type: data.type,
        term: data.term,
        price_kes: data.priceKES,
        includes: data.includes,
        paper_path: data.paperPath,
        scheme_path: data.schemePath,
        popular: data.popular,
        published: data.published,
        created_by: context.userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapResource(row as ResourceRow);
  });

export const setResourcePublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; published: boolean }) => {
    if (!input?.id || typeof input.id !== "string") throw new Error("Invalid paper");
    return { id: input.id, published: Boolean(input.published) };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase.from("resources").update({ published: data.published }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteResource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => {
    if (!input?.id || typeof input.id !== "string") throw new Error("Invalid paper");
    return { id: input.id };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase.from("resources").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");

    const [purchasesRes, profilesRes, resourcesRes] = await Promise.all([
      context.supabase.from("purchases").select("resource_id,resource_title,price_kes,payment_method,status,download_count,created_at,user_id"),
      context.supabase.from("profiles").select("id,created_at"),
      context.supabase.from("resources").select("id"),
    ]);
    if (purchasesRes.error) throw new Error(purchasesRes.error.message);
    if (profilesRes.error) throw new Error(profilesRes.error.message);

    const purchases = purchasesRes.data ?? [];
    const paid = purchases.filter((p) => p.status === "paid");
    const revenue = paid.reduce((s, p) => s + (p.price_kes ?? 0), 0);
    const downloads = purchases.reduce((s, p) => s + (p.download_count ?? 0), 0);

    const byMethod: Record<string, { count: number; revenue: number }> = {};
    for (const p of paid) {
      const key = p.payment_method ?? "mpesa";
      byMethod[key] = byMethod[key] ?? { count: 0, revenue: 0 };
      byMethod[key]!.count += 1;
      byMethod[key]!.revenue += p.price_kes ?? 0;
    }

    const byPaper: Record<string, { title: string; count: number; revenue: number; downloads: number }> = {};
    for (const p of purchases) {
      const key = p.resource_id;
      byPaper[key] = byPaper[key] ?? { title: p.resource_title, count: 0, revenue: 0, downloads: 0 };
      byPaper[key]!.count += 1;
      byPaper[key]!.revenue += p.status === "paid" ? (p.price_kes ?? 0) : 0;
      byPaper[key]!.downloads += p.download_count ?? 0;
    }

    const byDay: Record<string, { count: number; revenue: number }> = {};
    for (const p of paid) {
      const day = (p.created_at ?? "").slice(0, 10);
      byDay[day] = byDay[day] ?? { count: 0, revenue: 0 };
      byDay[day]!.count += 1;
      byDay[day]!.revenue += p.price_kes ?? 0;
    }

    const profiles = profilesRes.data ?? [];
    const signupsByDay: Record<string, number> = {};
    for (const p of profiles) {
      const day = (p.created_at ?? "").slice(0, 10);
      signupsByDay[day] = (signupsByDay[day] ?? 0) + 1;
    }

    return {
      totals: {
        revenue,
        orders: paid.length,
        downloads,
        users: profiles.length,
        papers: (resourcesRes.data ?? []).length,
        buyers: new Set(paid.map((p) => p.user_id)).size,
      },
      byMethod: Object.entries(byMethod).map(([method, v]) => ({ method, ...v })).sort((a, b) => b.revenue - a.revenue),
      topPapers: Object.entries(byPaper)
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => b.revenue - a.revenue || b.count - a.count)
        .slice(0, 10),
      salesByDay: Object.entries(byDay).map(([day, v]) => ({ day, ...v })).sort((a, b) => a.day.localeCompare(b.day)).slice(-30),
      signupsByDay: Object.entries(signupsByDay).map(([day, count]) => ({ day, count })).sort((a, b) => a.day.localeCompare(b.day)).slice(-30),
      recent: purchases
        .slice()
        .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
        .slice(0, 15)
        .map((p) => ({
          title: p.resource_title,
          price: p.price_kes,
          method: p.payment_method,
          status: p.status,
          created_at: p.created_at,
        })),
    };
  });

export const getDownloadLinks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { purchaseId: string }) => {
    if (!input?.purchaseId || typeof input.purchaseId !== "string") throw new Error("Invalid purchase");
    return { purchaseId: input.purchaseId };
  })
  .handler(async ({ data, context }) => {
    const { data: purchase, error } = await context.supabase
      .from("purchases")
      .select("id,resource_id,status,user_id")
      .eq("id", data.purchaseId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!purchase || purchase.user_id !== context.userId) throw new Error("Purchase not found");
    if (purchase.status !== "paid") throw new Error("Payment is not confirmed yet");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: resource } = await supabaseAdmin
      .from("resources")
      .select("paper_path,scheme_path")
      .eq("id", purchase.resource_id)
      .maybeSingle();

    const links: { label: string; url: string }[] = [];
    for (const [label, path] of [
      ["Paper", resource?.paper_path],
      ["Marking scheme", resource?.scheme_path],
    ] as const) {
      if (!path) continue;
      const signed = await supabaseAdmin.storage.from("papers").createSignedUrl(path, 60 * 10);
      if (signed.data?.signedUrl) links.push({ label, url: signed.data.signedUrl });
    }

    if (links.length === 0) throw new Error("The file for this paper has not been uploaded yet");
    return { links };
  });
