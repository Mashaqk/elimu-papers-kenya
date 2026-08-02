import { createFileRoute, Link } from "@tanstack/react-router";
import { GRADES, SUBJECTS } from "@/data/catalog";
import { useResources } from "@/lib/use-resources";
import { GradeCard } from "@/components/site/grade-card";
import { SubjectCard } from "@/components/site/subject-card";
import { ResourceCard } from "@/components/site/resource-card";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/senior-school")({
  head: () => ({
    meta: [
      { title: "Senior School (Grade 10–12) — ELIMUPEPE" },
      { name: "description", content: "Pathway-aligned CATs, end-term exams, mock exams and past papers for Grade 10, 11 and 12 learners in Kenya." },
      { property: "og:title", content: "Senior School (Grade 10–12) — ELIMUPEPE" },
      { property: "og:description", content: "Pathway-aligned CATs, end-term exams, mock exams and past papers for Grade 10, 11 and 12." },
      { property: "og:url", content: "/senior-school" },
    ],
    links: [{ rel: "canonical", href: "/senior-school" }],
  }),
  component: SeniorSchoolPage,
});

function SeniorSchoolPage() {
  const grades = GRADES.filter((g) => g.level === "senior");
  const subjects = SUBJECTS.filter((s) => s.levels.includes("senior"));
  const { resources } = useResources();
  const samples = resources.filter((r) => ["grade-10", "grade-11", "grade-12"].includes(r.gradeSlug)).slice(0, 6);
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-[oklch(0.24_0.11_269)] py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Senior School</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Grade 10, 11 & 12 resources</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">Pathway-aligned CATs, mid-term and end-term examinations, mock exams, revision papers and past papers with full marking schemes.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Grades" title="Pick a grade" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {grades.map((g) => <GradeCard key={g.slug} grade={g} />)}
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Subjects" title="Senior School subjects" description="Grouped across the CBC senior school pathways." />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => <SubjectCard key={s.slug} subject={s} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Papers" title="Sample senior school papers" />
          <Link to="/latest-papers" className="text-sm font-semibold text-primary hover:underline">See all →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((r) => <ResourceCard key={r.id} r={r} />)}
        </div>
      </section>
    </>
  );
}
