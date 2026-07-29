import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — ELIMUPEPE" },
      { name: "description", content: "Log in to your ELIMUPEPE account to access purchased papers and revision materials." },
      { property: "og:title", content: "Login — ELIMUPEPE" },
      { property: "og:description", content: "Log in to your ELIMUPEPE account." },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="rounded-2xl border bg-card p-8 shadow-card">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" /></span>
        <h1 className="mt-4 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to access your purchased papers.</p>

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            toast.info("Accounts coming soon", { description: "Enable Lovable Cloud to activate real logins." });
          }}
        >
          <Input label="Email" name="email" type="email" required />
          <Input label="Password" name="password" type="password" required />
          <button className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90">Log in</button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          New to ELIMUPEPE? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
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
