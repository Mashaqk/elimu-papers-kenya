import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — ELIMUPEPE" },
      { name: "description", content: "Log in to your ELIMUPEPE account to access purchased papers and revision materials." },
      { property: "og:title", content: "Login — ELIMUPEPE" },
      { property: "og:description", content: "Log in to your ELIMUPEPE account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);
    if (error) {
      toast.error("Could not log in", { description: error.message });
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  async function google() {
    try {
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    } catch (error) {
      toast.error("Google sign-in failed", { description: error instanceof Error ? error.message : undefined });
    }
  }

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="rounded-2xl border bg-card p-8 shadow-card">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" /></span>
        <h1 className="mt-4 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to access your purchased papers.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <Input label="Email" name="email" type="email" required />
          <Input label="Password" name="password" type="password" required minLength={6} />
          <button disabled={busy} className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:opacity-60">
            {busy ? "Logging in…" : "Log in"}
          </button>
        </form>

        <button onClick={google} className="mt-3 inline-flex w-full items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition hover:border-primary/40 hover:text-primary">
          Continue with Google
        </button>

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
