import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — ELIMUPEPE" },
      { name: "description", content: "Create a free ELIMUPEPE account to save purchases, favourites and download papers again anytime." },
      { property: "og:title", content: "Create account — ELIMUPEPE" },
      { property: "og:description", content: "Create a free ELIMUPEPE account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: String(form.get("name") ?? "").trim(),
          phone: String(form.get("phone") ?? "").trim(),
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error("Could not create account", { description: error.message });
      return;
    }
    if (!data.session) {
      setSent(true);
      toast.success("Check your email", { description: "Click the confirmation link to activate your account." });
      return;
    }
    toast.success("Account created!");
    navigate({ to: "/dashboard" });
  }


  return (
    <section className="mx-auto grid min-h-[70vh] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="rounded-2xl border bg-card p-8 shadow-card">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-secondary-foreground"><GraduationCap className="h-5 w-5" /></span>
        <h1 className="mt-4 font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Free — takes less than a minute.</p>

        {sent ? (
          <div className="mt-6 rounded-xl bg-surface p-4 text-sm">
            We sent a confirmation link to your email. Confirm it, then{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">log in</Link>.
          </div>
        ) : (
          <>
            <form className="mt-6 space-y-3" onSubmit={onSubmit}>
              <Input label="Full name" name="name" required />
              <Input label="Email" name="email" type="email" required />
              <Input label="Phone (M-PESA)" name="phone" placeholder="07XXXXXXXX" />
              <Input label="Password" name="password" type="password" required minLength={6} />
              <button disabled={busy} className="inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-card transition hover:bg-secondary/90 disabled:opacity-60">
                {busy ? "Creating…" : "Create account"}
              </button>
            </form>
          </>
        )}

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
