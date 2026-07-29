import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import type { Subject } from "@/data/catalog";

export function SubjectCard({ subject }: { subject: Subject }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[subject.icon] ?? Icons.BookOpen;
  return (
    <Link
      to="/subjects/$subject"
      params={{ subject: subject.slug }}
      className="group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-semibold text-foreground">{subject.name}</p>
        <p className="truncate text-xs text-muted-foreground">{subject.blurb}</p>
      </div>
    </Link>
  );
}
