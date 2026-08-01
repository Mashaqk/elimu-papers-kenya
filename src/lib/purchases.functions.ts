import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { RESOURCES } from "@/data/catalog";

const METHODS = ["mpesa", "airtel", "visa", "mastercard"] as const;

export const listPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createPurchases = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { resourceIds: string[]; method: string }) => {
    const resourceIds = Array.isArray(input?.resourceIds)
      ? input.resourceIds.filter((id) => typeof id === "string").slice(0, 50)
      : [];
    if (resourceIds.length === 0) throw new Error("No items selected");
    const method = (METHODS as readonly string[]).includes(input?.method) ? input.method : "mpesa";
    return { resourceIds, method };
  })
  .handler(async ({ data, context }) => {
    const rows = data.resourceIds
      .map((id) => RESOURCES.find((r) => r.id === id))
      .filter((r): r is (typeof RESOURCES)[number] => Boolean(r))
      .map((r) => ({
        user_id: context.userId,
        resource_id: r.id,
        resource_title: r.title,
        grade_slug: r.gradeSlug,
        subject_slug: r.subjectSlug,
        price_kes: r.priceKES,
        payment_method: data.method,
        status: "paid",
      }));

    if (rows.length === 0) throw new Error("No valid items to purchase");

    const { error } = await context.supabase
      .from("purchases")
      .upsert(rows, { onConflict: "user_id,resource_id" });
    if (error) throw new Error(error.message);

    return { count: rows.length, total: rows.reduce((s, r) => s + r.price_kes, 0) };
  });

export const recordDownload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { purchaseId: string }) => {
    if (!input?.purchaseId || typeof input.purchaseId !== "string") throw new Error("Invalid purchase");
    return { purchaseId: input.purchaseId };
  })
  .handler(async ({ data, context }) => {
    const { data: current, error: readError } = await context.supabase
      .from("purchases")
      .select("download_count")
      .eq("id", data.purchaseId)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!current) throw new Error("Purchase not found");

    const { error } = await context.supabase
      .from("purchases")
      .update({ download_count: (current.download_count ?? 0) + 1 })
      .eq("id", data.purchaseId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
