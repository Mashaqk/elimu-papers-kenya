import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Heart, ShoppingBag, User } from "lucide-react";
import { RESOURCES } from "@/data/catalog";
import { ResourceCard } from "@/components/site/resource-card";
import { SectionHeading } from "@/components/site/section-heading";
import { formatKES } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ELIMUPEPE" },
      { name: "description", content: "View your purchased papers, downloads, favourites and profile on ELIMUPEPE." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/dashboard" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const purchased = RESOURCES.slice(0, 3);
  const favourites = RESOURCES.slice(4, 7);
  const totalSpent = purchased.reduce((s, r) => s + r.priceKES, 0);

  return (
    <>
      <section className="border-b bg-surface py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Dashboard</p>
            <h1 className="mt-1 truncate font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Habari, Learner 👋</h1>
            <p className="mt-2 text-sm text-muted-foreground">Preview only — sign in to see your actual purchases and downloads.</p>
          </div>
          <Link to="/latest-papers" className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90">Find more papers</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={ShoppingBag} label="Purchased" value={String(purchased.length)} />
          <StatCard icon={Download} label="Downloads" value="12" />
          <StatCard icon={Heart} label="Total spent" value={formatKES(totalSpent)} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Your library" title="Recent purchases" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {purchased.map((r) => <ResourceCard key={r.id} r={r} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Wishlist" title="Saved for later" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favourites.map((r) => <ResourceCard key={r.id} r={r} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary"><User className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile</p>
              <p className="font-display text-base font-semibold">Update your details, phone number and password</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Profile management activates once accounts are enabled.</p>
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
