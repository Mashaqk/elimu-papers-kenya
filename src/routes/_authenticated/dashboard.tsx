import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, ShoppingBag, Wallet, User } from "lucide-react";
import { toast } from "sonner";
import { GRADES, SUBJECTS } from "@/data/catalog";
import { SectionHeading } from "@/components/site/section-heading";
import { formatKES } from "@/lib/format";
import { listPurchases, recordDownload } from "@/lib/purchases.functions";
import { getDownloadLinks } from "@/lib/resources.functions";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ELIMUPEPE" },
      { name: "description", content: "View your purchased papers, downloads and profile on ELIMUPEPE." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dashboard — ELIMUPEPE" },
      { property: "og:description", content: "Your purchased papers and downloads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fetchPurchases = useServerFn(listPurchases);
  const markDownload = useServerFn(recordDownload);
  const fetchLinks = useServerFn(getDownloadLinks);

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => fetchPurchases(),
  });

  const download = useMutation({
    mutationFn: async (purchaseId: string) => {
      const { links } = await fetchLinks({ data: { purchaseId } });
      await markDownload({ data: { purchaseId } });
      return links;
    },
    onSuccess: (links) => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      for (const link of links) window.open(link.url, "_blank", "noopener,noreferrer");
      toast.success("Download started", { description: links.map((l) => l.label).join(" + ") });
    },
    onError: (error: Error) => toast.error("Could not start download", { description: error.message }),
  });

  const totalSpent = purchases.reduce((s, p) => s + p.price_kes, 0);
  const downloads = purchases.reduce((s, p) => s + (p.download_count ?? 0), 0);
  const name = (user?.user_metadata?.["full_name"] as string | undefined) || user?.email?.split("@")[0] || "Learner";

  return (
    <>
      <section className="border-b bg-surface py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Dashboard</p>
            <h1 className="mt-1 truncate font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Habari, {name} 👋</h1>
            <p className="mt-2 text-sm text-muted-foreground">All the papers you have bought, ready to download again anytime.</p>
          </div>
          <Link to="/latest-papers" className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90">Find more papers</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={ShoppingBag} label="Purchased" value={String(purchases.length)} />
          <StatCard icon={Download} label="Downloads" value={String(downloads)} />
          <StatCard icon={Wallet} label="Total spent" value={formatKES(totalSpent)} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Your library" title="Purchased papers" />
        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading your library…</p>
        ) : purchases.length === 0 ? (
          <div className="mt-6 rounded-2xl border bg-card p-10 text-center shadow-card">
            <p className="font-display text-lg font-semibold">No purchases yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Pick a subject, choose a paper and press Buy to get started.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link to="/subjects" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse subjects</Link>
              <Link to="/latest-papers" className="rounded-lg border px-4 py-2 text-sm font-semibold text-primary">Latest papers</Link>
            </div>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {purchases.map((p) => {
              const grade = GRADES.find((g) => g.slug === p.grade_slug);
              const subject = SUBJECTS.find((s) => s.slug === p.subject_slug);
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 shadow-card">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {grade?.label} · {subject?.name} · {new Date(p.created_at).toLocaleDateString()}
                    </p>
                    <Link to="/resource/$id" params={{ id: p.resource_id }} className="font-display text-sm font-semibold hover:text-primary">
                      {p.resource_title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatKES(p.price_kes)} · {p.payment_method.toUpperCase()} · {p.status} · {p.download_count ?? 0} download{(p.download_count ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button
                    onClick={() => download.mutate(p.id)}
                    disabled={download.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-card transition hover:bg-secondary/90 disabled:opacity-60"
                  >
                    <Download className="h-4 w-4" /> Download
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary"><User className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile</p>
              <p className="truncate font-display text-base font-semibold">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary"><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold">{value}</p>
    </div>
  );
}
