import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { SUBJECTS } from "@/data/catalog";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">ELIMUPEPE</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80">
            Kenya's trusted digital library for CBC examinations, assignments and revision materials for Grades 7–12.
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-accent">Learn Today. Excel Tomorrow.</p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/", "Home"], ["/junior-school", "Junior School"], ["/senior-school", "Senior School"],
              ["/subjects", "Subjects"], ["/latest-papers", "Latest Papers"], ["/about", "About"], ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-primary-foreground/80 hover:text-accent">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">Popular Subjects</h4>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            {SUBJECTS.slice(0, 10).map((s) => (
              <li key={s.slug}>
                <Link to="/subjects/$subject" params={{ subject: s.slug }} className="text-primary-foreground/80 hover:text-accent">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> ElimuPepe001@gmail.com</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> 0728417172</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Nairobi, Kenya</li>
          </ul>
          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-primary-foreground/60">We accept</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["M-PESA", "Airtel Money", "Visa", "Mastercard"].map((p) => (
                <span key={p} className="rounded-md bg-primary-foreground/10 px-2.5 py-1 text-xs font-semibold text-primary-foreground/90 ring-1 ring-primary-foreground/15">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/70 sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} ELIMUPEPE. All rights reserved.</p>
          <p>Aligned to the Kenyan Competency-Based Curriculum (CBC).</p>
        </div>
      </div>
    </footer>
  );
}
