export type Level = "junior" | "senior";

export type Grade = {
  slug: string; // "grade-7"
  number: 7 | 8 | 9 | 10 | 11 | 12;
  label: string; // "Grade 7"
  level: Level;
  blurb: string;
};

export const GRADES: Grade[] = [
  { slug: "grade-7", number: 7, label: "Grade 7", level: "junior", blurb: "Foundational CBC papers, weekly tests, and assessments." },
  { slug: "grade-8", number: 8, label: "Grade 8", level: "junior", blurb: "Term-based assignments, CATs, and marking schemes." },
  { slug: "grade-9", number: 9, label: "Grade 9", level: "junior", blurb: "End-of-junior-school prep with topical revision." },
  { slug: "grade-10", number: 10, label: "Grade 10", level: "senior", blurb: "Pathway-aligned CATs and end-term examinations." },
  { slug: "grade-11", number: 11, label: "Grade 11", level: "senior", blurb: "Mid-term, mock, and topical questions with schemes." },
  { slug: "grade-12", number: 12, label: "Grade 12", level: "senior", blurb: "Mock exams, past papers, and full revision packs." },
];

export type Subject = {
  slug: string;
  name: string;
  blurb: string;
  icon: string; // lucide name
  levels: Level[];
};

export const SUBJECTS: Subject[] = [
  { slug: "mathematics", name: "Mathematics", blurb: "Numbers, algebra, geometry and applied problems.", icon: "Sigma", levels: ["junior"] },
  { slug: "essential-mathematics", name: "Essential Mathematics", blurb: "Practical, everyday mathematics for senior school.", icon: "Calculator", levels: ["senior"] },
  { slug: "core-mathematics", name: "Core Mathematics", blurb: "Advanced mathematics for STEM and technical pathways.", icon: "Sigma", levels: ["senior"] },
  { slug: "english", name: "English", blurb: "Grammar, comprehension, composition and literature.", icon: "BookOpen", levels: ["junior", "senior"] },
  { slug: "kiswahili", name: "Kiswahili", blurb: "Sarufi, ufahamu, insha na fasihi.", icon: "Languages", levels: ["junior", "senior"] },
  { slug: "integrated-science", name: "Integrated Science", blurb: "Combined science strand for junior school.", icon: "FlaskConical", levels: ["junior"] },
  { slug: "social-studies", name: "Social Studies", blurb: "Society, governance and citizenship.", icon: "Users", levels: ["junior"] },
  { slug: "pre-technical-studies", name: "Pre-Technical Studies", blurb: "Technical drawing, tools, materials and safety.", icon: "Ruler", levels: ["junior"] },
  { slug: "creative-arts", name: "Creative Arts", blurb: "Art, craft, music and performing arts.", icon: "Palette", levels: ["junior"] },
  { slug: "agriculture", name: "Agriculture", blurb: "Crop, animal and agribusiness studies.", icon: "Sprout", levels: ["junior", "senior"] },
  { slug: "business-studies", name: "Business Studies", blurb: "Commerce, accounting and entrepreneurship.", icon: "Briefcase", levels: ["senior"] },
  { slug: "biology", name: "Biology", blurb: "Cells, organisms, ecology and physiology.", icon: "Leaf", levels: ["senior"] },
  { slug: "chemistry", name: "Chemistry", blurb: "Matter, reactions and industrial chemistry.", icon: "FlaskConical", levels: ["senior"] },
  { slug: "physics", name: "Physics", blurb: "Mechanics, electricity, waves and modern physics.", icon: "Atom", levels: ["senior"] },
  { slug: "electricity", name: "Electricity", blurb: "Circuits, installation, wiring and electrical safety.", icon: "Zap", levels: ["senior"] },
  { slug: "power-mechanics", name: "Power Mechanics", blurb: "Engines, transmission systems and vehicle maintenance.", icon: "Wrench", levels: ["senior"] },
  { slug: "aviation", name: "Aviation", blurb: "Aviation technology, flight principles and air transport.", icon: "Plane", levels: ["senior"] },
  { slug: "media-technology", name: "Media Technology", blurb: "Photography, audio, video and digital publishing.", icon: "Clapperboard", levels: ["senior"] },
  { slug: "building-and-construction", name: "Building and Construction", blurb: "Masonry, structures, materials and site practice.", icon: "HardHat", levels: ["senior"] },
  { slug: "community-service-learning", name: "Community Service Learning", blurb: "Service projects, civic values and reflective reports.", icon: "HeartHandshake", levels: ["senior"] },
  { slug: "history", name: "History", blurb: "Kenyan, African and world history.", icon: "Landmark", levels: ["senior"] },
  { slug: "geography", name: "Geography", blurb: "Physical and human geography of Kenya and beyond.", icon: "Globe2", levels: ["senior"] },
  { slug: "cre", name: "CRE", blurb: "Christian Religious Education.", icon: "BookHeart", levels: ["junior", "senior"] },
  { slug: "ire", name: "IRE", blurb: "Islamic Religious Education.", icon: "BookHeart", levels: ["junior", "senior"] },
];


export const RESOURCE_TYPES = [
  "Assignment",
  "CAT",
  "Weekly Assessment",
  "Monthly Test",
  "Mid-Term Exam",
  "End-Term Exam",
  "Holiday Assignment",
  "Mock Exam",
  "Marking Scheme",
  "Revision Paper",
  "Topical Questions",
  "Past Paper",
] as const;
export type ResourceType = typeof RESOURCE_TYPES[number];

export const TERMS = ["Term 1", "Term 2", "Term 3"] as const;
export type Term = typeof TERMS[number];

export type Resource = {
  id: string;
  title: string;
  gradeSlug: string;
  subjectSlug: string;
  type: ResourceType;
  term: Term;
  priceKES: number;
  includes: string[];
  createdAt: string; // ISO
  popular?: boolean;
};

// Sample catalog covering the three explicit examples + a spread across grades/subjects.
export const RESOURCES: Resource[] = [
  { id: "g7-math-assign-t1", title: "Grade 7 Mathematics Assignment", gradeSlug: "grade-7", subjectSlug: "mathematics", type: "Assignment", term: "Term 1", priceKES: 100, includes: ["Assignment PDF", "Marking Scheme", "Instant Download"], createdAt: "2026-06-14", popular: true },
  { id: "g8-math-assign-t2", title: "Grade 8 Mathematics Assignment", gradeSlug: "grade-8", subjectSlug: "mathematics", type: "Assignment", term: "Term 2", priceKES: 100, includes: ["Assignment PDF", "Marking Scheme", "Instant Download"], createdAt: "2026-07-02", popular: true },
  { id: "g10-chem-cat-t1", title: "Grade 10 Chemistry CAT", gradeSlug: "grade-10", subjectSlug: "chemistry", type: "CAT", term: "Term 1", priceKES: 150, includes: ["CAT Paper", "Marking Scheme"], createdAt: "2026-07-12", popular: true },
  { id: "g12-phy-endterm-t2", title: "Grade 12 Physics End Term Exam", gradeSlug: "grade-12", subjectSlug: "physics", type: "End-Term Exam", term: "Term 2", priceKES: 250, includes: ["Examination Paper", "Marking Scheme", "Suggested Answers"], createdAt: "2026-07-18", popular: true },
  { id: "g9-eng-midterm-t2", title: "Grade 9 English Mid-Term Exam", gradeSlug: "grade-9", subjectSlug: "english", type: "Mid-Term Exam", term: "Term 2", priceKES: 180, includes: ["Examination Paper", "Marking Scheme"], createdAt: "2026-07-10" },
  { id: "g11-bio-mock-t3", title: "Grade 11 Biology Mock Exam", gradeSlug: "grade-11", subjectSlug: "biology", type: "Mock Exam", term: "Term 3", priceKES: 220, includes: ["Mock Paper 1 & 2", "Marking Schemes"], createdAt: "2026-07-20" },
  { id: "g7-sci-weekly-t1", title: "Grade 7 Integrated Science Weekly Assessment", gradeSlug: "grade-7", subjectSlug: "integrated-science", type: "Weekly Assessment", term: "Term 1", priceKES: 80, includes: ["Assessment PDF", "Marking Scheme"], createdAt: "2026-05-30" },
  { id: "g8-kis-monthly-t2", title: "Grade 8 Kiswahili Monthly Test", gradeSlug: "grade-8", subjectSlug: "kiswahili", type: "Monthly Test", term: "Term 2", priceKES: 120, includes: ["Karatasi ya Mtihani", "Mwongozo wa Kusahihisha"], createdAt: "2026-06-25" },
  { id: "g9-ss-topical", title: "Grade 9 Social Studies Topical Questions", gradeSlug: "grade-9", subjectSlug: "social-studies", type: "Topical Questions", term: "Term 2", priceKES: 150, includes: ["Topical PDF", "Marking Scheme"], createdAt: "2026-06-18" },
  { id: "g10-math-endterm-t1", title: "Grade 10 Mathematics End-Term Exam", gradeSlug: "grade-10", subjectSlug: "mathematics", type: "End-Term Exam", term: "Term 1", priceKES: 200, includes: ["Paper 1", "Paper 2", "Marking Schemes"], createdAt: "2026-04-22" },
  { id: "g11-chem-holiday", title: "Grade 11 Chemistry Holiday Assignment", gradeSlug: "grade-11", subjectSlug: "chemistry", type: "Holiday Assignment", term: "Term 2", priceKES: 130, includes: ["Assignment PDF", "Marking Scheme"], createdAt: "2026-07-05" },
  { id: "g12-geo-past", title: "Grade 12 Geography Past Paper Pack", gradeSlug: "grade-12", subjectSlug: "geography", type: "Past Paper", term: "Term 3", priceKES: 260, includes: ["10 Past Papers", "Full Marking Schemes"], createdAt: "2026-07-22", popular: true },
  { id: "g8-agri-cat-t1", title: "Grade 8 Agriculture CAT", gradeSlug: "grade-8", subjectSlug: "agriculture", type: "CAT", term: "Term 1", priceKES: 120, includes: ["CAT Paper", "Marking Scheme"], createdAt: "2026-05-14" },
  { id: "g10-bs-revision", title: "Grade 10 Business Studies Revision Paper", gradeSlug: "grade-10", subjectSlug: "business-studies", type: "Revision Paper", term: "Term 3", priceKES: 170, includes: ["Revision Paper", "Marking Scheme"], createdAt: "2026-07-16" },
  { id: "g9-cs-cat", title: "Grade 9 Computer Studies CAT", gradeSlug: "grade-9", subjectSlug: "computer-studies", type: "CAT", term: "Term 2", priceKES: 140, includes: ["CAT Paper", "Marking Scheme"], createdAt: "2026-07-08" },
  { id: "g12-his-mock", title: "Grade 12 History Mock Exam", gradeSlug: "grade-12", subjectSlug: "history", type: "Mock Exam", term: "Term 3", priceKES: 240, includes: ["Mock Paper", "Marking Scheme", "Suggested Answers"], createdAt: "2026-07-19" },
  { id: "g7-cre-weekly", title: "Grade 7 CRE Weekly Assessment", gradeSlug: "grade-7", subjectSlug: "cre", type: "Weekly Assessment", term: "Term 2", priceKES: 80, includes: ["Assessment PDF", "Marking Scheme"], createdAt: "2026-06-11" },
  { id: "g11-ire-midterm", title: "Grade 11 IRE Mid-Term Exam", gradeSlug: "grade-11", subjectSlug: "ire", type: "Mid-Term Exam", term: "Term 2", priceKES: 180, includes: ["Examination Paper", "Marking Scheme"], createdAt: "2026-07-14" },
  { id: "g10-phy-topical", title: "Grade 10 Physics Topical Questions", gradeSlug: "grade-10", subjectSlug: "physics", type: "Topical Questions", term: "Term 1", priceKES: 160, includes: ["Topical PDF", "Marking Scheme"], createdAt: "2026-05-02" },
  { id: "g12-eng-endterm", title: "Grade 12 English End-Term Exam", gradeSlug: "grade-12", subjectSlug: "english", type: "End-Term Exam", term: "Term 2", priceKES: 250, includes: ["Paper 1", "Paper 2", "Paper 3", "Marking Schemes"], createdAt: "2026-07-24", popular: true },
];

export const TESTIMONIALS = [
  { name: "Achieng' O.", role: "Grade 10 Learner, Kisumu", quote: "The marking schemes are so clear. I revise, check my answers, and I actually understand where I went wrong." },
  { name: "Mr. Kamau", role: "Teacher, Nairobi", quote: "I use ELIMUPEPE papers for my CATs. Well-structured, aligned to CBC, and my learners take them seriously." },
  { name: "Mrs. Wanjiru", role: "Parent, Nakuru", quote: "No expensive subscription. I buy exactly the paper my son needs and he downloads it right away." },
  { name: "Brian M.", role: "Grade 12 Learner, Eldoret", quote: "Mock exams here saved my Physics grade. The suggested answers explain the method, not just the answer." },
];

export const FAQS = [
  { q: "Do I need a subscription?", a: "No. Every resource is a one-time purchase. Pay only for what you need." },
  { q: "How do I receive my paper after paying?", a: "Payment is confirmed automatically and the download becomes available immediately. The resource also stays in your account for future access." },
  { q: "Which payment methods are supported?", a: "M-PESA (primary), Airtel Money, Visa and Mastercard." },
  { q: "Are the papers aligned to CBC?", a: "Yes. All resources follow the Kenyan Competency-Based Curriculum and, at senior school, the relevant pathway." },
  { q: "Can I download a paper again later?", a: "Yes. Purchased resources remain in your account and can be re-downloaded anytime." },
  { q: "Can teachers or schools buy in bulk?", a: "Yes. Contact us through the Contact page for school and teacher packages." },
];
