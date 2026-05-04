import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const formatEGP = (n: number) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n);

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  badge: string | null;
  category_id: string | null;
  is_active: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  sort_order: number;
};

export type ShippingRate = {
  governorate: string;
  fee: number;
  estimated_days: string | null;
};
