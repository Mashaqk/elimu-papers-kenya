import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, Download, GraduationCap, Search, ShieldCheck, Smartphone, Sparkles, Star } from "lucide-react";
import { GRADES, SUBJECTS, RESOURCES, TESTIMONIALS, FAQS } from "@/data/catalog";
import { GradeCard } from "@/components/site/grade-card";
import { SubjectCard } from "@/components/site/subject-card";
import { ResourceCard } from "@/components/site/resource-card";
import { SectionHeading } from "@/components/site/section-heading";
import heroImage from "@/assets/hero-students.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ELIMUPEPE — Kenya's Digital Library for Exams & Revision" },
      { name: "description", content: "Buy CBC-aligned examinations, assignments, CATs, marking schemes and revision materials for Grades 7–12. No subscriptions. Instant downloads." },
      { property: "og:title", content: "ELIMUPEPE — Learn Today. Excel Tomorrow." },
      { property: "og:description", content: "Kenya's trusted digital library for CBC examinations, assignments and revision materials for Grades 7–12." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const latest = [...RESOURCES].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const popular = RESOURCES.filter((r) => r.popular).slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.24_0.11_269)] text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "40px 40px, 30px 30px" }} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent ring-1 ring-primary-foreground/15">
              <Sparkles className="h-3.5 w-3.5" /> CBC · Grade 7 to Grade 12
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Kenya's Trusted Digital Library for <span className="text-accent">Examinations</span> and Revision Materials
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
              Improve your academic performance with professionally prepared examinations, assignments, CATs, end-term exams, marking schemes and revision papers designed for Kenyan learners. Buy only what you need — download instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/latest-papers" className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground shadow-lift transition hover:bg-secondary/90">
                <BookOpen className="h-4 w-4" /> Browse Resources
              </Link>
              <a href="#choose-level" className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground/10 px-5 py-3 text-sm font-semibold text-primary-foreground ring-1 ring-primary-foreground/25 backdrop-blur transition hover:bg-primary-foreground/15">
                <GraduationCap className="h-4 w-4" /> Select Your Grade
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-primary-foreground/80">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Secure M-PESA payments</span>
              <span className="inline-flex items-center gap-1.5"><Download className="h-4 w-4 text-accent" /> Instant PDF downloads</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Marking schemes included</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-accent/20 blur-2xl" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-primary-foreground/15 shadow-lift sm:aspect-[3/4] lg:aspect-[4/3]">
              <img src={heroImage.url} alt="Kenyan learner using a tablet for revision" width={1393} height={1742} className="h-full w-full object-cover object-center" />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-card p-4 text-foreground shadow-lift ring-1 ring-border sm:block">
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">Sample</p>
              <p className="mt-0.5 font-display text-sm font-bold">Grade 10 Chemistry CAT</p>
              <p className="text-xs text-muted-foreground">Includes marking scheme</p>
              <p className="mt-1 font-display text-lg font-bold text-primary">KES 150</p>
            </div>
            <div className="absolute -right-4 -top-4 hidden rounded-2xl bg-accent p-3 text-accent-foreground shadow-lift sm:block">
              <p className="text-[11px] font-bold uppercase tracking-wider">One-time</p>
              <p className="font-display text-sm font-bold">No subscriptions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHOOSE LEVEL */}
      <section id="choose-level" className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Step 1" title="Choose your education level" description="Pick a grade to see subjects, papers, marking schemes and revision materials aligned to CBC." />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {GRADES.map((g) => <GradeCard key={g.slug} grade={g} />)}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Link to="/junior-school" className="group flex items-center justify-between rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-secondary">Junior School</p>
                <p className="mt-1 font-display text-xl font-bold">Grades 7, 8 & 9</p>
                <p className="mt-1 text-sm text-muted-foreground">Foundational CBC learning with weekly and term-based assessments.</p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5" />
            </Link>
            <Link to="/senior-school" className="group flex items-center justify-between rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-secondary">Senior School</p>
                <p className="mt-1 font-display text-xl font-bold">Grades 10, 11 & 12</p>
                <p className="mt-1 text-sm text-muted-foreground">Pathway-aligned CATs, mock exams, past papers and revision packs.</p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Browse" title="Every CBC subject, covered." description="From Mathematics to Kiswahili, IRE to Physics — organised by grade and pathway." />
            <Link to="/subjects" className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex sm:items-center sm:gap-1">
              View all subjects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.map((s) => <SubjectCard key={s.slug} subject={s} />)}
          </div>
        </div>
      </section>

      {/* LATEST RESOURCES */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="New this week" title="Latest resources" description="Fresh papers uploaded by our teaching panel — assignments, CATs, mock exams and more." />
            <Link to="/latest-papers" className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90">
              <Search className="h-4 w-4" /> Search & filter
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((r) => <ResourceCard key={r.id} r={r} />)}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Most bought" title="Popular right now" description="What learners across Kenya are buying this term." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((r) => <ResourceCard key={r.id} r={r} />)}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Why ELIMUPEPE</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Built for Kenyan learners, parents and teachers.</h2>
            <p className="mt-3 text-primary-foreground/80">No monthly fees. No hidden costs. Just professional CBC materials, ready when you need them.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Download, title: "Instant PDF downloads", body: "Get your paper the second payment is confirmed." },
              { icon: Smartphone, title: "Secure M-PESA payments", body: "Plus Airtel Money, Visa and Mastercard." },
              { icon: BookOpen, title: "Organized by grade & subject", body: "Filter by term, examination type and keyword." },
              { icon: CheckCircle2, title: "Marking schemes included", body: "Learn from your answers — not just tick them." },
              { icon: ShieldCheck, title: "No subscriptions", body: "Pay once for the specific resource you need." },
              { icon: Star, title: "Professional papers", body: "Prepared by experienced Kenyan teachers." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-primary-foreground/5 p-5 ring-1 ring-primary-foreground/10">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How it works" title="From search to study in under a minute" align="center" />
          <ol className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { n: "01", t: "Find your paper", d: "Filter by grade, subject, term and type — or search by keyword." },
              { n: "02", t: "Pay once via M-PESA", d: "Or Airtel Money, Visa, Mastercard. No subscription required." },
              { n: "03", t: "Download instantly", d: "Your paper stays in your account for future re-downloads." },
            ].map((s) => (
              <li key={s.n} className="relative rounded-2xl border bg-card p-6 shadow-card">
                <span className="font-display text-4xl font-extrabold text-accent">{s.n}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Loved by learners" title="What Kenyan families say" align="center" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-3 flex-1 text-sm text-foreground/85">"{t.quote}"</blockquote>
                <figcaption className="mt-4 border-t pt-3">
                  <p className="font-display text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Answers" title="Frequently asked questions" align="center" />
          <div className="mt-10 divide-y rounded-2xl border bg-card shadow-card">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-display text-sm font-semibold text-foreground">{f.q}</span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-[oklch(0.5_0.16_148)] p-8 text-secondary-foreground shadow-lift sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to excel this term?</h2>
              <p className="mt-2 max-w-xl text-secondary-foreground/90">Pick your grade, choose a paper and start revising in minutes. No sign-up required to browse.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 lg:mt-0">
              <Link to="/latest-papers" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lift hover:bg-primary/90">
                Browse resources <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-secondary-foreground/10 px-5 py-3 text-sm font-semibold ring-1 ring-secondary-foreground/25 hover:bg-secondary-foreground/15">
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
