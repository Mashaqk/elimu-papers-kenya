# Subject catalogue update, contact details, and Lovable Cloud

## 1. Enable Lovable Cloud

Turn on Lovable Cloud so the site can later have real accounts, purchase records and secure PDF downloads. This step only provisions the backend — no auth or payment logic changes in this pass unless you ask for it next.

## 2. Senior school subjects

Add to the senior list:
- Electricity
- Power Mechanics
- Aviation
- Media Technology
- Building and Construction
- Community Service Learning

Split Mathematics for senior school into:
- Essential Mathematics
- Core Mathematics

Mathematics stays as a single subject for junior school (Grades 7–9); the split applies only to Grades 10–12.

## 3. Junior school subjects

Add:
- Pre-Technical Studies
- Creative Arts

Remove Computer Studies entirely (both levels).

## 4. Contact details

Replace everywhere they appear (footer and Contact page):
- Phone / WhatsApp: 0728417172
- Email: ElimuPepe001@gmail.com

## Technical notes

- `src/data/catalog.ts`: update `SUBJECTS` — remove `computer-studies`, change `mathematics` to junior-only, add `essential-mathematics` and `core-mathematics` (senior), plus the new junior and senior entries with suitable lucide icons and short blurbs.
- Sample resources: replace the Grade 9 Computer Studies CAT with a Pre-Technical Studies paper, and add a few sample papers for the new senior subjects so their subject pages aren't empty. Retarget the Grade 10 Mathematics end-term to Core Mathematics.
- `src/components/site/site-footer.tsx` and `src/routes/contact.tsx`: new phone and email.
- Subject pages, grade pages, filters and the footer subject list all read from the catalogue, so they update automatically.
