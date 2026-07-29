import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/junior-school", label: "Junior School" },
  { to: "/senior-school", label: "Senior School" },
  { to: "/subjects", label: "Subjects" },
  { to: "/latest-papers", label: "Latest Papers" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-lg font-bold tracking-tight text-primary">ELIMUPEPE</span>
            <span className="hidden text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:block">Learn Today. Excel Tomorrow.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary-soft hover:text-primary [&.active]:bg-primary-soft [&.active]:text-primary"
            >
              {n.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-soft">Login</Link>
            <Link to="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90">Register</Link>
          </div>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-primary-soft hover:text-primary [&.active]:bg-primary-soft [&.active]:text-primary"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg border px-3 py-2 text-center text-sm font-semibold text-primary">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">Register</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
