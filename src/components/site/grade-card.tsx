import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Grade } from "@/data/catalog";

export function GradeCard({ grade }: { grade: Grade }) {
  const isSenior = grade.level === "senior";
  return (
    <Link
      to="/grade/$grade"
      params={{ grade: grade.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="flex items-center justify-between">
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${isSenior ? "bg-accent text-accent-foreground" : "bg-secondary-soft text-secondary"}`}>
          {isSenior ? "Senior" : "Junior"}
        </span>
        <span className="font-display text-3xl font-extrabold leading-none text-primary/20 transition group-hover:text-primary/40">
          {grade.number}
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold text-foreground">{grade.label}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{grade.blurb}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Browse resources <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
