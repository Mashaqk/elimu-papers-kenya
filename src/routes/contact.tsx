import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ELIMUPEPE" },
      { name: "description", content: "Get in touch with ELIMUPEPE for support, teacher packages or school partnerships." },
      { property: "og:title", content: "Contact ELIMUPEPE" },
      { property: "og:description", content: "Reach the ELIMUPEPE team for support and partnerships." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-[oklch(0.24_0.11_269)] py-14 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Contact</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">We're here to help</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/85">Questions about a paper, teacher packages or school partnerships? Send us a message.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div className="space-y-4">
          {[
            { icon: Mail, t: "Email", d: "support@elimupepe.co.ke" },
            { icon: Phone, t: "Phone / WhatsApp", d: "+254 700 000 000" },
            { icon: MapPin, t: "Location", d: "Nairobi, Kenya" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-start gap-3 rounded-2xl border bg-card p-5 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t}</p>
                <p className="font-display text-base font-semibold">{d}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          className="rounded-2xl border bg-card p-6 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            setSending(true);
            setTimeout(() => {
              setSending(false);
              (e.target as HTMLFormElement).reset();
              toast.success("Message received", { description: "We'll get back to you within one working day." });
            }, 600);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone (optional)" name="phone" />
            <Field label="I am a…" name="role" as="select" options={["Learner","Parent","Teacher","School","Other"]} />
          </div>
          <Field label="Message" name="message" as="textarea" required />
          <button disabled={sending} className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-secondary px-5 py-3 font-semibold text-secondary-foreground shadow-card transition hover:bg-secondary/90 disabled:opacity-60 sm:w-auto">
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </>
  );
}

function Field({
  label, name, type = "text", required, as, options,
}: {
  label: string; name: string; type?: string; required?: boolean;
  as?: "textarea" | "select"; options?: string[];
}) {
  const cls = "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-primary focus:ring-2";
  return (
    <label className={`${as === "textarea" ? "mt-4 block sm:col-span-2" : "block"}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {as === "textarea" ? (
        <textarea name={name} required={required} rows={5} className={`${cls} h-auto py-2`} />
      ) : as === "select" ? (
        <select name={name} required={required} className={cls}>
          {options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input name={name} type={type} required={required} className={cls} />
      )}
    </label>
  );
}
