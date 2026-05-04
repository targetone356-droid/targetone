'use client';
import { useState } from 'react';
import { supabase, formatEGP } from '@/lib/supabase';
import { toast } from 'sonner';

export default function TrackPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!/^01[0-9]{9}$/.test(phone)) return toast.error('رقم هاتف غير صحيح');
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('track-orders', { body: { phone } });
    setLoading(false);
    if (error || data?.error) return toast.error(data?.error || error?.message);
    setOrders(data.orders || []);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">تتبع طلباتك</h1>
      <div className="flex gap-2 mb-6">
        <input dir="ltr" className="flex-1 border border-border rounded-lg px-3 py-2" placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button onClick={search} disabled={loading} className="bg-primary text-primary-foreground rounded-full px-6">
          {loading ? '...' : 'بحث'}
        </button>
      </div>
      {orders && orders.length === 0 && <p className="text-muted-foreground">لا توجد طلبات لهذا الرقم.</p>}
      <div className="space-y-3">
        {orders?.map((o) => (
          <div key={o.id} className="border border-border rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted">{o.status}</span>
            </div>
            <p className="text-sm">{o.governorate} — {o.customer_address}</p>
            <p className="font-bold text-primary">{formatEGP(o.total)}</p>
            <ul className="text-xs text-muted-foreground">
              {(o.items || []).map((i: any, idx: number) => <li key={idx}>{i.name} × {i.qty}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
