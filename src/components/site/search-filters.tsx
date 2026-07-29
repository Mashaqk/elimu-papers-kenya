import { Search } from "lucide-react";
import { GRADES, SUBJECTS, RESOURCE_TYPES, TERMS } from "@/data/catalog";

export type Filters = {
  grade: string;
  subject: string;
  type: string;
  term: string;
  q: string;
};

export const emptyFilters: Filters = { grade: "", subject: "", type: "", term: "", q: "" };

export function SearchFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <Select label="Grade" value={value.grade} onChange={(v) => set({ grade: v })}>
          <option value="">All grades</option>
          {GRADES.map((g) => <option key={g.slug} value={g.slug}>{g.label}</option>)}
        </Select>
        <Select label="Subject" value={value.subject} onChange={(v) => set({ subject: v })}>
          <option value="">All subjects</option>
          {SUBJECTS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </Select>
        <Select label="Examination Type" value={value.type} onChange={(v) => set({ type: v })}>
          <option value="">All types</option>
          {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select label="Term" value={value.term} onChange={(v) => set({ term: v })}>
          <option value="">All terms</option>
          {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Keyword</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={value.q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="e.g. algebra, insha…"
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-primary focus:ring-2"
            />
          </div>
        </label>
      </div>
      {(value.grade || value.subject || value.type || value.term || value.q) && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => onChange(emptyFilters)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-primary focus:ring-2"
      >
        {children}
      </select>
    </label>
  );
}
