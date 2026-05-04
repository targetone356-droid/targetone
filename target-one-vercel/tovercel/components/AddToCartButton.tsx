'use client';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button
      disabled={product.stock <= 0}
      onClick={() => { add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, stock: product.stock }); toast.success('أُضيف للسلة'); }}
      className="rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium disabled:opacity-40"
    >
      {product.stock <= 0 ? 'نفد المخزون' : 'أضف إلى السلة'}
    </button>
  );
}
