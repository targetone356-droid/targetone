import Link from 'next/link';
import { supabase, Category, Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60;

export default async function HomePage() {
  const { data: categories } = await supabase
    .from('categories').select('*').eq('is_active', true).order('sort_order');
  const { data: products } = await supabase
    .from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });

  const cats = (categories || []) as Category[];
  const prods = (products || []) as Product[];

  return (
    <div>
      <section className="bg-gradient-to-b from-green-50 to-white py-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">منتجات صحية خالية من الجلوتين</h1>
          <p className="text-muted-foreground text-lg">توصيل لكل محافظات مصر — الدفع عند الاستلام</p>
          <Link href="#products" className="inline-block bg-primary text-primary-foreground rounded-full px-6 py-3 font-medium">
            تسوق الآن
          </Link>
        </div>
      </section>

      <div id="products" className="container mx-auto px-4 py-12 space-y-12">
        {cats.map((cat) => {
          const items = prods.filter((p) => p.category_id === cat.id).slice(0, 8);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} id={cat.slug}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {cat.logo_url && <img src={cat.logo_url} alt={cat.name} className="w-12 h-12 rounded-2xl object-cover" />}
                  <div>
                    <h2 className="text-2xl font-bold">{cat.name}</h2>
                    {cat.description && <p className="text-sm text-muted-foreground">{cat.description}</p>}
                  </div>
                </div>
                <Link href={`/category/${cat.slug}`} className="text-sm text-primary">عرض الكل ←</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
