'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type CartItem = {
  id: string; name: string; price: number; image_url: string | null; stock: number; qty: number;
};

type Ctx = {
  items: CartItem[];
  total: number;
  add: (item: Omit<CartItem, 'qty'>) => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = 'targetone_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items]);

  const add: Ctx['add'] = (it) => setItems((cur) => {
    const ex = cur.find((c) => c.id === it.id);
    if (ex) return cur.map((c) => c.id === it.id ? { ...c, qty: Math.min(c.qty + 1, c.stock) } : c);
    return [...cur, { ...it, qty: 1 }];
  });
  const updateQty: Ctx['updateQty'] = (id, qty) =>
    setItems((cur) => qty <= 0 ? cur.filter((c) => c.id !== id) : cur.map((c) => c.id === id ? { ...c, qty: Math.min(qty, c.stock) } : c));
  const remove: Ctx['remove'] = (id) => setItems((cur) => cur.filter((c) => c.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return <CartCtx.Provider value={{ items, total, add, updateQty, remove, clear }}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart outside provider');
  return ctx;
};
