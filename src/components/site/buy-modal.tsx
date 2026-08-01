import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Smartphone, CreditCard, CheckCircle2 } from "lucide-react";
import type { Resource } from "@/data/catalog";
import { formatKES } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { createPurchases } from "@/lib/purchases.functions";

const METHODS = [
  { id: "mpesa", label: "M-PESA", note: "Primary", icon: Smartphone },
  { id: "airtel", label: "Airtel Money", note: "", icon: Smartphone },
  { id: "visa", label: "Visa", note: "", icon: CreditCard },
  { id: "mastercard", label: "Mastercard", note: "", icon: CreditCard },
];

export function BuyModal({
  resource,
  open,
  onOpenChange,
}: {
  resource: Resource;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [method, setMethod] = useState("mpesa");
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const buy = useServerFn(createPurchases);

  const purchase = useMutation({
    mutationFn: () => buy({ data: { resourceIds: [resource.id], method } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      onOpenChange(false);
      toast.success("Purchase recorded", { description: "Find it in your dashboard under purchased papers." });
      navigate({ to: "/dashboard" });
    },
    onError: (error: Error) => toast.error("Purchase failed", { description: error.message }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{resource.title}</DialogTitle>
          <DialogDescription>
            Confirm your purchase to download the paper instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-xl bg-surface p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">You'll pay</span>
            <span className="font-display text-2xl font-bold text-primary">{formatKES(resource.priceKES)}</span>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {resource.includes.map((i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" /> {i}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment method</p>
          <div className="grid grid-cols-2 gap-2">
            {METHODS.map((m) => {
              const Icon = m.icon;
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition ${
                    active ? "border-primary bg-primary-soft" : "hover:border-primary/40"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold">{m.label}</span>
                  {m.note && <span className="ml-auto rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">{m.note}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {user ? (
          <button
            onClick={() => purchase.mutate()}
            disabled={purchase.isPending}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-3 font-semibold text-secondary-foreground shadow-card transition hover:bg-secondary/90 disabled:opacity-60"
          >
            {purchase.isPending ? "Processing…" : "Complete Purchase"}
          </button>
        ) : (
          <Link
            to="/login"
            onClick={() => onOpenChange(false)}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90"
          >
            Log in to pay
          </Link>
        )}
        <p className="text-center text-xs text-muted-foreground">
          Payment is confirmed automatically. Download becomes available immediately in your dashboard.
        </p>
      </DialogContent>
    </Dialog>
  );
}
