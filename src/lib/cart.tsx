import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type Resource } from "@/data/catalog";
import { useResources } from "@/lib/use-resources";


const STORAGE_KEY = "elimupepe.cart.v1";

type CartContextValue = {
  ids: string[];
  items: Resource[];
  total: number;
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setIds(parsed.filter((i): i is string => typeof i === "string"));
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // storage unavailable
    }
  }, [ids]);

  const add = useCallback((id: string) => setIds((prev) => (prev.includes(id) ? prev : [...prev, id])), []);
  const remove = useCallback((id: string) => setIds((prev) => prev.filter((i) => i !== id)), []);
  const toggle = useCallback(
    (id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])),
    [],
  );
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items = ids
      .map((id) => RESOURCES.find((r) => r.id === id))
      .filter((r): r is Resource => Boolean(r));
    return {
      ids,
      items,
      count: items.length,
      total: items.reduce((sum, r) => sum + r.priceKES, 0),
      has: (id: string) => ids.includes(id),
      add,
      remove,
      toggle,
      clear,
    };
  }, [ids, add, remove, toggle, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
