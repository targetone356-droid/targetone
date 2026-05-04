import { supabase, Product, formatEGP } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { data } = await supabase.from('products').select('*').eq('id', params.id).eq('is_active', true).maybeSingle();
  if (!data) return notFound();
  const p = data as Product;

  return (
    <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
        {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{p.name}</h1>
        <p className="text-2xl text-primary font-bold">{formatEGP(p.price)}</p>
        {p.description && <p className="text-muted-foreground whitespace-pre-line">{p.description}</p>}
        <p className="text-sm">المخزون: {p.stock > 0 ? `${p.stock} قطعة متاحة` : 'نفد'}</p>
        <AddToCartButton product={p} />
      </div>
    </div>
  );
}
