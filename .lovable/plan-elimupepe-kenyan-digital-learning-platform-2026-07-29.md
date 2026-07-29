# ELIMUPEPE — Kenyan Digital Learning Platform

Build the marketing + browsing frontend for ELIMUPEPE, a resource marketplace for Grades 7–12 (CBC) with one-time purchases. This first pass is a polished, responsive, static frontend using your specified brand system. Backend (accounts, payments, downloads) is scoped as a follow-up.

## Scope of this build

Pages (each a separate TanStack route with its own SEO metadata):

- `/` Home — hero, education level chooser, browse by grade, browse by subject, latest resources, popular resources, why choose us, how it works, testimonials, FAQ, CTA, contact strip.
- `/junior-school` — Grades 7–9 overview with subject grid.
- `/senior-school` — Grades 10–12 overview with pathway note.
- `/grade/$grade` — dynamic route for Grade 7–12; lists subjects and sample resources.
- `/subjects` — full subject directory.
- `/subjects/$subject` — subject landing with sample resources across grades.
- `/latest-papers` — grid of newest resources with filters (grade, subject, type, term, keyword).
- `/resource/$id` — product detail page with price, what's included, Buy Now.
- `/about` — mission, audience, curriculum alignment.
- `/contact` — contact form (frontend-only, no submission wiring yet).
- `/login`, `/register` — form UI only (non-functional placeholders).
- `/dashboard` — static preview of purchased papers, downloads, wishlist, profile.

Shared chrome:

- Header with logo (ELIMUPEPE wordmark), nav (Home, Junior School, Senior School, Subjects, Latest Papers, About, Contact), Login / Register buttons, mobile hamburger.
- Footer with quick links, subjects, contact info, payment method badges (M-PESA, Airtel Money, Visa, Mastercard), copyright.

Reusable components: `ResourceCard`, `GradeCard`, `SubjectCard`, `SearchFilters`, `SectionHeading`, `FeatureItem`, `TestimonialCard`, `FAQAccordion`, `CTASection`.

## Design system

- Colors mapped as semantic tokens in `src/styles.css` (oklch equivalents of):
  - Primary Royal Blue `#1E3A8A`
  - Secondary Emerald Green `#16A34A`
  - Accent Golden Yellow `#FACC15`
  - Background White `#FFFFFF`, muted section Light Gray `#F8FAFC`
- Typography: Poppins (headings), Inter (body), loaded via Google Fonts `<link>` in `__root.tsx`.
- Rounded cards (radius ~14px), soft shadows, subtle hover lift, mobile-first responsive grid, generous spacing.
- Iconography: `lucide-react`.
- Imagery: a hero illustration/photo (Kenyan learners studying) generated via image generation; subject cards use icons rather than photos to stay fast.

## Content data

To keep the site data-driven without a backend yet, add `src/data/`:

- `grades.ts` — Grades 7–12 with descriptions and level (junior/senior).
- `subjects.ts` — subject list with icon + short blurb.
- `resources.ts` — sample resources (matching your three examples plus ~20 more) with fields: id, title, grade, subject, type, term, format, priceKES, includes[].
- `testimonials.ts`, `faqs.ts`.

Filters and search on `/latest-papers` read from `resources.ts`.

## Purchase flow (frontend-only for now)

- "Buy Now" opens a modal showing price, included items, and payment method options (M-PESA / Airtel / Visa / Mastercard) with a disabled "Complete Purchase" button and a note that checkout activates once payments are enabled.
- Actual M-PESA/Card processing, accounts, downloads, and dashboard data are deferred (see Follow-ups).

## Technical notes

- TanStack Start routes under `src/routes/`. Replace the placeholder `index.tsx`. Add `__root.tsx` header/footer around `<Outlet />`.
- Google Fonts loaded via `<link>` in root `head()`; families referenced in `@theme` (`--font-display: Poppins`, `--font-sans: Inter`).
- Each route defines its own `head()` with unique title/description/og.
- Dynamic routes: `grade.$grade.tsx`, `subjects.$subject.tsx`, `resource.$id.tsx`.
- No business logic beyond client-side filtering/sorting of the sample dataset.
- Fully responsive; verified at mobile widths using the grid+min-w-0+shrink-0 header pattern.

## Follow-ups (not in this build)

- Lovable Cloud: auth (learner/parent/teacher), user profiles, purchase records, secure PDF storage + signed download URLs, wishlist.
- Payments: M-PESA Daraja STK Push integration, card processor, webhook verification.
- Admin area for uploading resources and managing catalog.
- Real content ingestion (actual PDFs and marking schemes).

Confirm this scope and I'll build it. If you want auth + M-PESA wired now, say so and I'll fold it in before starting.
