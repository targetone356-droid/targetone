'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartSheet from './CartSheet';

export default function Navbar() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Target One 🎯</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/track" className="text-sm hover:text-primary">تتبع طلبي</Link>
            <button
              onClick={() => setOpen(true)}
              className="relative rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
            >
              السلة {count > 0 && <span className="mr-1">({count})</span>}
            </button>
          </nav>
        </div>
      </header>
      <CartSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
