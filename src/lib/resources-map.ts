import type { Resource, ResourceType, Term } from "@/data/catalog";

export type ResourceRow = {
  id: string;
  title: string;
  grade_slug: string;
  subject_slug: string;
  type: string;
  term: string;
  price_kes: number;
  includes: string[] | null;
  paper_path?: string | null;
  scheme_path?: string | null;
  published?: boolean;
  popular?: boolean;
  created_at: string;
};

export function mapResource(row: ResourceRow): Resource {
  return {
    id: row.id,
    title: row.title,
    gradeSlug: row.grade_slug,
    subjectSlug: row.subject_slug,
    type: row.type as ResourceType,
    term: row.term as Term,
    priceKES: row.price_kes,
    includes: row.includes ?? [],
    createdAt: row.created_at,
    popular: row.popular ?? false,
    published: row.published ?? true,
    hasPaper: Boolean(row.paper_path),
    hasScheme: Boolean(row.scheme_path),
  };
}
