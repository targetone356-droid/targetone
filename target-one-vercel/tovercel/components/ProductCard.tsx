'use client';
import Link from 'next/link';
import { Product, formatEGP } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const out = product.stock <= 0;

  return (
    <div className="group rounded-2xl border border-border overflow-hidden bg-white">
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-muted overflow-hidden">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.badge && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="p-3 space-y-2">
        <h3 className="font-medium line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">{formatEGP(product.price)}</span>
          <button
            disabled={out}
            onClick={() => { add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, stock: product.stock }); toast.success('أُضيف للسلة'); }}
            className="rounded-full bg-foreground text-white text-xs px-3 py-1.5 disabled:opacity-40"
          >
            {out ? 'نفد' : 'أضف'}
          </button>
        </div>
      </div>
    </div>
  );
}
