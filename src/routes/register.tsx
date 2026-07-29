import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — ELIMUPEPE" },
      { name: "description", content: "Create a free ELIMUPEPE account to save purchases, favourites and download papers again anytime." },
      { property: "og:title", content: "Create account — ELIMUPEPE" },
      { property: "og:description", content: "Create a free ELIMUPEPE account." },
      { property: "og:url", content: "/register" },
    ],
    links: [{ rel: "canonical", href: "/register" }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="rounded-2xl border bg-card p-8 shadow-card">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-secondary-foreground"><GraduationCap className="h-5 w-5" /></span>
        <h1 className="mt-4 font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Free — takes less than a minute.</p>

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            toast.info("Accounts coming soon", { description: "Enable Lovable Cloud to activate registrations." });
          }}
        >
          <Input label="Full name" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Phone (M-PESA)" name="phone" placeholder="07XXXXXXXX" />
          <Input label="Password" name="password" type="password" required />
          <button className="inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-card transition hover:bg-secondary/90">Create account</button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already registered? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </section>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input {...props} className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-primary focus:ring-2" />
    </label>
  );
}
