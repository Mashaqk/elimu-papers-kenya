import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { RESOURCES, SUBJECTS } from "@/data/catalog";
import { ResourceCard } from "@/components/site/resource-card";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/subjects/$subject")({
  loader: ({ params }) => {
    const subject = SUBJECTS.find((s) => s.slug === params.subject);
    if (!subject) throw notFound();
    return { subject };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Subject not found — ELIMUPEPE" }, { name: "robots", content: "noindex" }] };
    const { subject } = loaderData;
    return {
      meta: [
        { title: `${subject.name} Papers & Revision — ELIMUPEPE` },
        { name: "description", content: `${subject.name} CBC papers, marking schemes and revision materials for Kenyan learners.` },
        { property: "og:title", content: `${subject.name} — ELIMUPEPE` },
        { property: "og:description", content: `${subject.blurb}` },
        { property: "og:url", content: `/subjects/${subject.slug}` },
      ],
      links: [{ rel: "canonical", href: `/subjects/${subject.slug}` }],
    };
  },
  component: SubjectPage,
});

function SubjectPage() {
  const { subject } = Route.useLoaderData();
  const resources = RESOURCES.filter((r) => r.subjectSlug === subject.slug);

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-[oklch(0.24_0.11_269)] py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Subject</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{subject.name}</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">{subject.blurb}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Papers" title={`${subject.name} papers`} description="Across all grades where this subject is offered." />
          <Link to="/latest-papers" className="text-sm font-semibold text-primary hover:underline">Advanced search →</Link>
        </div>
        {resources.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No papers yet for this subject — check back soon.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => <ResourceCard key={r.id} r={r} />)}
          </div>
        )}
      </section>
    </>
  );
}
