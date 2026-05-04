'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase, formatEGP, ShippingRate } from '@/lib/supabase';
import { toast } from 'sonner';

type Step = 'cart' | 'checkout' | 'success';

export default function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total: subtotal, updateQty, remove, clear } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [shipping, setShipping] = useState<ShippingRate[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', governorate: '', customer_address: '', notes: '' });

  useEffect(() => {
    supabase.from('shipping_rates').select('governorate, fee, estimated_days').eq('is_active', true).order('governorate')
      .then(({ data }) => data && setShipping(data as any));
  }, []);

  const sel = shipping.find((s) => s.governorate === form.governorate);
  const fee = Number(sel?.fee || 0);
  const grand = subtotal + fee;

  const handleClose = () => {
    if (step === 'success') { clear(); setStep('cart'); setOrder(null); setForm({ customer_name: '', customer_phone: '', governorate: '', customer_address: '', notes: '' }); }
    onClose();
  };

  const submit = async () => {
    if (!form.customer_name.trim()) return toast.error('الاسم مطلوب');
    if (!/^01[0-9]{9}$/.test(form.customer_phone)) return toast.error('رقم هاتف غير صحيح');
    if (!form.governorate) return toast.error('اختر المحافظة');
    if (!form.customer_address.trim()) return toast.error('العنوان مطلوب');
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('create-order', {
      body: { ...form, items: items.map((i) => ({ product_id: i.id, qty: i.qty })) },
    });
    setSubmitting(false);
    if (error || data?.error) return toast.error(data?.error || error?.message || 'خطأ');
    setOrder(data.order); setStep('success');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={handleClose} />
      <aside className="w-full max-w-md bg-white h-full flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {step === 'cart' && `السلة (${items.length})`}
            {step === 'checkout' && 'بيانات التوصيل'}
            {step === 'success' && '✅ تم استلام الطلب'}
          </h2>
          <button onClick={handleClose} className="text-2xl">×</button>
        </div>

        {step === 'cart' && (
          items.length === 0 ? <p className="text-muted-foreground text-center py-20">السلة فارغة</p> : (
            <>
              <ul className="flex-1 space-y-3">
                {items.map((it) => (
                  <li key={it.id} className="flex gap-3 border border-border rounded-xl p-3">
                    {it.image_url && <img src={it.image_url} className="w-16 h-16 rounded-lg object-cover" alt="" />}
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{it.name}</p>
                      <p className="text-xs text-muted-foreground">{formatEGP(it.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(it.id, it.qty - 1)} className="w-6 h-6 rounded-full border">−</button>
                        <span className="text-sm">{it.qty}</span>
                        <button onClick={() => updateQty(it.id, it.qty + 1)} disabled={it.qty >= it.stock} className="w-6 h-6 rounded-full border disabled:opacity-30">+</button>
                        <button onClick={() => remove(it.id)} className="ml-auto text-red-500 text-xs">حذف</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <div className="flex justify-between font-bold"><span>{formatEGP(subtotal)}</span><span>المجموع</span></div>
                <button onClick={() => setStep('checkout')} className="w-full bg-primary text-primary-foreground rounded-full py-3 font-medium">
                  متابعة الشراء
                </button>
              </div>
            </>
          )
        )}

        {step === 'checkout' && (
          <div className="space-y-3 flex-1">
            <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="الاسم بالكامل" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
            <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="01xxxxxxxxx" dir="ltr" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
            <select className="w-full border border-border rounded-lg px-3 py-2" value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.target.value })}>
              <option value="">اختر المحافظة</option>
              {shipping.map((s) => <option key={s.governorate} value={s.governorate}>{s.governorate} — {formatEGP(s.fee)}</option>)}
            </select>
            <textarea className="w-full border border-border rounded-lg px-3 py-2" rows={3} placeholder="العنوان التفصيلي" value={form.customer_address} onChange={(e) => setForm({ ...form, customer_address: e.target.value })} />
            <textarea className="w-full border border-border rounded-lg px-3 py-2" rows={2} placeholder="ملاحظات (اختياري)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="bg-muted rounded-xl p-3 text-sm space-y-1">
              <div className="flex justify-between"><span>{formatEGP(subtotal)}</span><span>المنتجات</span></div>
              <div className="flex justify-between"><span>{form.governorate ? formatEGP(fee) : '—'}</span><span>الشحن</span></div>
              <div className="flex justify-between font-bold border-t border-border pt-1"><span>{formatEGP(grand)}</span><span>الإجمالي (الدفع عند الاستلام)</span></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep('cart')} className="rounded-full border px-4 py-2">رجوع</button>
              <button onClick={submit} disabled={submitting} className="flex-1 bg-primary text-primary-foreground rounded-full py-2 disabled:opacity-50">
                {submitting ? '...جاري' : 'تأكيد الطلب'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && order && (
          <div className="space-y-4">
            <p className="text-green-600 text-center">تم استلام طلبك بنجاح!</p>
            <div className="bg-muted rounded-xl p-4 text-sm space-y-2">
              <p><b>رقم الطلب:</b> {order.id.slice(0, 8)}</p>
              <p><b>الإجمالي:</b> {formatEGP(order.total)}</p>
              <p><b>المحافظة:</b> {order.governorate}</p>
              <p>هنتواصل معاك قريب لتأكيد الطلب 📞</p>
            </div>
            <button onClick={handleClose} className="w-full bg-primary text-primary-foreground rounded-full py-3">إغلاق</button>
          </div>
        )}
      </aside>
    </div>
  );
}
