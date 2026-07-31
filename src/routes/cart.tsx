import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, ShoppingCart, Smartphone, Trash2 } from "lucide-react";
import { GRADES, SUBJECTS } from "@/data/catalog";
import { formatKES } from "@/lib/format";
import { useCart } from "@/lib/cart";

const METHODS = [
  { id: "mpesa", label: "M-PESA", note: "Primary", icon: Smartphone },
  { id: "airtel", label: "Airtel Money", note: "", icon: Smartphone },
  { id: "visa", label: "Visa", note: "", icon: CreditCard },
  { id: "mastercard", label: "Mastercard", note: "", icon: CreditCard },
];

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — ELIMUPEPE" },
      { name: "description", content: "Review the papers and marking schemes you selected, then pay once with M-PESA, Airtel Money, Visa or Mastercard." },
      { property: "og:title", content: "Your Cart — ELIMUPEPE" },
      { property: "og:description", content: "Review your selected CBC papers and check out with M-PESA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, remove, clear } = useCart();
  const [method, setMethod] = useState("mpesa");

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
          <ShoppingCart className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Your selected items</h1>
          <p className="text-sm text-muted-foreground">Pay once per paper — no subscriptions.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border bg-card p-10 text-center shadow-card">
          <p className="font-display text-lg font-semibold">Your cart is empty</p>
          <p className="mt-2 text-sm text-muted-foreground">Browse subjects and add the papers you need.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/subjects" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse subjects</Link>
            <Link to="/latest-papers" className="rounded-lg border px-4 py-2 text-sm font-semibold text-primary">Latest papers</Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ul className="space-y-3">
            {items.map((r) => {
              const grade = GRADES.find((g) => g.slug === r.gradeSlug);
              const subject = SUBJECTS.find((s) => s.slug === r.subjectSlug);
              return (
                <li key={r.id} className="flex items-start gap-4 rounded-xl border bg-card p-4 shadow-card">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {grade?.label} · {subject?.name} · {r.term}
                    </p>
                    <Link to="/resource/$id" params={{ id: r.id }} className="font-display text-sm font-semibold hover:text-primary">
                      {r.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{r.includes.join(" · ")}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="font-display text-base font-bold text-primary">{formatKES(r.priceKES)}</span>
                    <button
                      onClick={() => remove(r.id)}
                      aria-label={`Remove ${r.title}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</span>
                <span className="font-display text-3xl font-extrabold text-primary">{formatKES(total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{items.length} item{items.length > 1 ? "s" : ""} · instant PDF download</p>

              <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment method</p>
              <div className="grid grid-cols-2 gap-2">
                {METHODS.map((m) => {
                  const Icon = m.icon;
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition ${active ? "border-primary bg-primary-soft" : "hover:border-primary/40"}`}
                    >
                      <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  toast.info("Checkout coming soon", {
                    description: "M-PESA payments will activate once the payment provider is connected.",
                  })
                }
                className="mt-5 w-full rounded-xl bg-secondary px-5 py-3 font-semibold text-secondary-foreground shadow-card transition hover:bg-secondary/90"
              >
                Proceed to Payment
              </button>
              <button onClick={clear} className="mt-3 w-full text-xs font-semibold text-muted-foreground hover:text-destructive">
                Clear cart
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
