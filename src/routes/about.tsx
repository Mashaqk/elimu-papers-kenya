import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ELIMUPEPE — Our Mission" },
      { name: "description", content: "ELIMUPEPE is a Kenyan digital learning platform providing affordable, CBC-aligned examinations and revision materials for Grades 7–12." },
      { property: "og:title", content: "About ELIMUPEPE" },
      { property: "og:description", content: "Our mission: quality Kenyan CBC papers, without expensive subscriptions." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-[oklch(0.24_0.11_269)] py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Our Mission</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Quality Kenyan CBC papers, without the subscription.</h1>
          <p className="mt-4 max-w-3xl text-lg text-primary-foreground/85">
            ELIMUPEPE is a Kenyan digital learning platform providing high-quality examinations, assignments, revision papers, marking schemes and learning resources for learners from Grade 7 to Grade 12. Buy exactly what you need — no monthly or yearly fees.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Who we serve" title="Built for the whole learning community" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {["Grade 7 Learners","Grade 8 Learners","Grade 9 Learners","Grade 10 Learners","Grade 11 Learners","Grade 12 Learners","Parents","Teachers","Schools"].map((a) => (
            <div key={a} className="flex items-center gap-2 rounded-xl border bg-card p-4 text-sm">
              <CheckCircle2 className="h-4 w-4 text-secondary" /> {a}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Curriculum" title="Aligned to CBC and senior school pathways" />
          <p className="mt-4 text-muted-foreground">
            All resources are organised according to the Kenyan Competency-Based Curriculum. Junior School (Grades 7–9) papers cover the full range of CBC learning areas. Senior School (Grades 10–12) papers are grouped by subject and, where applicable, by pathway.
          </p>
        </div>
      </section>
    </>
  );
}
