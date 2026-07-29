import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RESOURCES } from "@/data/catalog";
import { ResourceCard } from "@/components/site/resource-card";
import { SectionHeading } from "@/components/site/section-heading";
import { SearchFilters, emptyFilters, type Filters } from "@/components/site/search-filters";

export const Route = createFileRoute("/latest-papers")({
  head: () => ({
    meta: [
      { title: "Latest Papers — ELIMUPEPE" },
      { name: "description", content: "Search and filter the latest CBC papers, CATs, mocks and revision materials by grade, subject, term and type." },
      { property: "og:title", content: "Latest Papers — ELIMUPEPE" },
      { property: "og:description", content: "Search and filter the latest CBC papers and revision materials." },
      { property: "og:url", content: "/latest-papers" },
    ],
    links: [{ rel: "canonical", href: "/latest-papers" }],
  }),
  component: LatestPapersPage,
});

function LatestPapersPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      if (filters.grade && r.gradeSlug !== filters.grade) return false;
      if (filters.subject && r.subjectSlug !== filters.subject) return false;
      if (filters.type && r.type !== filters.type) return false;
      if (filters.term && r.term !== filters.term) return false;
      if (q && !`${r.title} ${r.type} ${r.term}`.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [filters]);

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-[oklch(0.24_0.11_269)] py-14 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Search library</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Find the exact paper you need</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/85">Filter by grade, subject, examination type or term — or search by keyword.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SearchFilters value={filters} onChange={setFilters} />

        <div className="mt-8 flex items-center justify-between">
          <SectionHeading title={`${results.length} paper${results.length === 1 ? "" : "s"}`} />
        </div>

        {results.length === 0 ? (
          <p className="mt-6 rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
            No papers match your filters. Try clearing them or broadening the search.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => <ResourceCard key={r.id} r={r} />)}
          </div>
        )}
      </section>
    </>
  );
}
