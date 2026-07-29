import { createFileRoute } from "@tanstack/react-router";
import { SUBJECTS } from "@/data/catalog";
import { SubjectCard } from "@/components/site/subject-card";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "All Subjects — ELIMUPEPE" },
      { name: "description", content: "Browse all CBC subjects on ELIMUPEPE — from Mathematics and Kiswahili to Chemistry, Physics and beyond." },
      { property: "og:title", content: "All Subjects — ELIMUPEPE" },
      { property: "og:description", content: "Browse every CBC subject on ELIMUPEPE for Grades 7–12." },
      { property: "og:url", content: "/subjects" },
    ],
    links: [{ rel: "canonical", href: "/subjects" }],
  }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const junior = SUBJECTS.filter((s) => s.levels.includes("junior"));
  const senior = SUBJECTS.filter((s) => s.levels.includes("senior"));
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-[oklch(0.24_0.11_269)] py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Subjects</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Every CBC subject, one place.</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">Pick a subject to see grade-specific papers, marking schemes and revision materials.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Junior School" title="Grade 7–9 subjects" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {junior.map((s) => <SubjectCard key={s.slug} subject={s} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Senior School" title="Grade 10–12 subjects" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {senior.map((s) => <SubjectCard key={s.slug} subject={s} />)}
        </div>
      </section>
    </>
  );
}
