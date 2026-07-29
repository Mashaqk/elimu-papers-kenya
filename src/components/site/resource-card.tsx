import { Link } from "@tanstack/react-router";
import { FileText, CheckCircle2, Download } from "lucide-react";
import type { Resource } from "@/data/catalog";
import { GRADES, SUBJECTS } from "@/data/catalog";
import { formatKES } from "@/lib/format";

export function ResourceCard({ r }: { r: Resource }) {
  const grade = GRADES.find((g) => g.slug === r.gradeSlug);
  const subject = SUBJECTS.find((s) => s.slug === r.subjectSlug);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative flex items-center justify-between bg-gradient-to-br from-primary to-primary/85 px-5 py-4 text-primary-foreground">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wider text-primary-foreground/80">{grade?.label} · {subject?.name}</p>
            <p className="truncate text-sm font-semibold">{r.type}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-accent px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">PDF</span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="font-display text-base font-semibold leading-snug">{r.title}</h3>

        <div className="flex flex-wrap gap-1.5">
          <Tag>{grade?.label}</Tag>
          <Tag>{subject?.name}</Tag>
          <Tag>{r.type}</Tag>
          <Tag>{r.term}</Tag>
        </div>

        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {r.includes.map((i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <span>{i}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Price</p>
            <p className="font-display text-xl font-bold text-primary">{formatKES(r.priceKES)}</p>
          </div>
          <Link
            to="/resource/$id"
            params={{ id: r.id }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-card transition hover:bg-secondary/90"
          >
            <Download className="h-4 w-4" /> Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-primary-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
      {children}
    </span>
  );
}
