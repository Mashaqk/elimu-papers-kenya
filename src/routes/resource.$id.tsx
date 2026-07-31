import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, CheckCircle2, Download, FileText, Plus, ShieldCheck, Smartphone } from "lucide-react";
import { useCart } from "@/lib/cart";
import { GRADES, RESOURCES, SUBJECTS } from "@/data/catalog";
import { formatKES } from "@/lib/format";
import { BuyModal } from "@/components/site/buy-modal";
import { ResourceCard } from "@/components/site/resource-card";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/resource/$id")({
  loader: ({ params }) => {
    const resource = RESOURCES.find((r) => r.id === params.id);
    if (!resource) throw notFound();
    return { resource };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Resource not found — ELIMUPEPE" }, { name: "robots", content: "noindex" }] };
    const { resource } = loaderData;
    return {
      meta: [
        { title: `${resource.title} — ELIMUPEPE` },
        { name: "description", content: `${resource.title}. ${resource.includes.join(", ")}. ${formatKES(resource.priceKES)}.` },
        { property: "og:title", content: `${resource.title} — ELIMUPEPE` },
        { property: "og:description", content: `${resource.title}. Includes ${resource.includes.join(", ")}.` },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/resource/${resource.id}` },
      ],
      links: [{ rel: "canonical", href: `/resource/${resource.id}` }],
    };
  },
  component: ResourcePage,
});

function ResourcePage() {
  const { resource } = Route.useLoaderData();
  const grade = GRADES.find((g) => g.slug === resource.gradeSlug);
  const subject = SUBJECTS.find((s) => s.slug === resource.subjectSlug);
  const related = RESOURCES.filter((r) => r.id !== resource.id && (r.subjectSlug === resource.subjectSlug || r.gradeSlug === resource.gradeSlug)).slice(0, 3);

  const [open, setOpen] = useState(false);
  const { has, toggle } = useCart();
  const inCart = has(resource.id);

  return (
    <>
      <section className="border-b bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/latest-papers" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to papers
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div>
          <div className="flex flex-wrap gap-2">
            {[grade?.label, subject?.name, resource.type, resource.term, "PDF Format"].map((t) => t && (
              <span key={t} className="rounded-md bg-primary-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">{t}</span>
            ))}
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{resource.title}</h1>
          <p className="mt-3 text-muted-foreground">Professionally prepared for Kenyan learners and aligned to the Competency-Based Curriculum. Includes a full marking scheme so you can revise, self-mark and understand every question.</p>

          <div className="mt-8 rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">What's included</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {resource.includes.map((i: string) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Download, t: "Instant download", d: "Right after payment" },
              { icon: Smartphone, t: "M-PESA supported", d: "Plus Airtel, Visa, Mastercard" },
              { icon: ShieldCheck, t: "Kept in your account", d: "Re-download anytime" },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-xl border bg-card p-4">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-semibold">{t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <FileText className="h-4 w-4" /> PDF · Instant download
            </div>
            <p className="mt-4 font-display text-4xl font-extrabold text-primary">{formatKES(resource.priceKES)}</p>
            <p className="text-xs text-muted-foreground">One-time purchase · no subscription</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 font-semibold text-secondary-foreground shadow-card transition hover:bg-secondary/90"
            >
              <Download className="h-4 w-4" /> Buy Now
            </button>
            <button
              onClick={() => toggle(resource.id)}
              className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${inCart ? "border-primary bg-primary-soft text-primary" : "hover:border-primary/40 hover:text-primary"}`}
            >
              {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {inCart ? "In your cart" : "Add to cart"}
            </button>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["M-PESA", "Airtel Money", "Visa", "Mastercard"].map((m) => (
                <span key={m} className="rounded-md bg-surface px-2 py-1 text-[11px] font-semibold text-foreground ring-1 ring-border">{m}</span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="bg-surface py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="You may also like" title="Related papers" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <ResourceCard key={r.id} r={r} />)}
            </div>
          </div>
        </section>
      )}

      <BuyModal resource={resource} open={open} onOpenChange={setOpen} />
    </>
  );
}
