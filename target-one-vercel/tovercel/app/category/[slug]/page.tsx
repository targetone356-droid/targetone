import { supabase, Product, Category } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { data: cat } = await supabase.from('categories').select('*').eq('slug', params.slug).eq('is_active', true).maybeSingle();
  if (!cat) return notFound();
  const c = cat as Category;
  const { data: products } = await supabase.from('products').select('*').eq('category_id', c.id).eq('is_active', true).order('created_at', { ascending: false });
  const items = (products || []) as Product[];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{c.name}</h1>
      {c.description && <p className="text-muted-foreground mb-6">{c.description}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
