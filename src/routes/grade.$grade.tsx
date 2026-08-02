import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GRADES, SUBJECTS } from "@/data/catalog";
import { useResources } from "@/lib/use-resources";
import { ResourceCard } from "@/components/site/resource-card";
import { SubjectCard } from "@/components/site/subject-card";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/grade/$grade")({
  loader: ({ params }) => {
    const grade = GRADES.find((g) => g.slug === params.grade);
    if (!grade) throw notFound();
    return { grade };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Grade not found — ELIMUPEPE" }, { name: "robots", content: "noindex" }] };
    }
    const { grade } = loaderData;
    return {
      meta: [
        { title: `${grade.label} Papers & Revision Materials — ELIMUPEPE` },
        { name: "description", content: `Buy CBC-aligned ${grade.label} papers, marking schemes and revision materials. Instant download, no subscription.` },
        { property: "og:title", content: `${grade.label} Papers — ELIMUPEPE` },
        { property: "og:description", content: `Buy CBC-aligned ${grade.label} papers and marking schemes.` },
        { property: "og:url", content: `/grade/${grade.slug}` },
      ],
      links: [{ rel: "canonical", href: `/grade/${grade.slug}` }],
    };
  },
  component: GradePage,
});

function GradePage() {
  const { grade } = Route.useLoaderData();
  const { resources: all } = useResources();
  const resources = all.filter((r) => r.gradeSlug === grade.slug);
  const subjects = SUBJECTS.filter((s) => s.levels.includes(grade.level));

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-[oklch(0.24_0.11_269)] py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {grade.level === "senior" ? "Senior School" : "Junior School"} · CBC
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{grade.label}</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">{grade.blurb}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Subjects" title={`${grade.label} subjects`} />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => <SubjectCard key={s.slug} subject={s} />)}
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Papers" title={`Available ${grade.label} papers`} />
            <Link to="/latest-papers" className="text-sm font-semibold text-primary hover:underline">See all papers →</Link>
          </div>
          {resources.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No papers yet for this grade — check back soon.</p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((r) => <ResourceCard key={r.id} r={r} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
