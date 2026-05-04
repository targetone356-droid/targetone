# Target One — Next.js (Vercel)

نسخة Next.js كاملة من متجر Target One، مربوطة بنفس قاعدة بيانات Lovable Cloud.

## ⚡ التشغيل المحلي

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

افتح http://localhost:3000

## 🚀 النشر على Vercel

### الطريقة 1: من الـ CLI
```bash
npm i -g vercel
vercel
```

### الطريقة 2: من الموقع
1. ارفع المشروع على GitHub
2. روح [vercel.com/new](https://vercel.com/new)
3. اختار الريبو
4. أضف المتغيرات في **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. اضغط Deploy 🎉

## 📦 المميزات

- ✅ صفحة رئيسية بكل الكاتيجوريز والمنتجات
- ✅ صفحة كاتيجوري `/category/[slug]`
- ✅ صفحة منتج `/product/[id]`
- ✅ سلة تسوق (localStorage)
- ✅ Checkout كامل + اختيار محافظة + حساب شحن
- ✅ صفحة تتبع الطلبات `/track`
- ✅ ISR كل 60 ثانية (تحديث تلقائي للمنتجات)
- ✅ RTL + خط Cairo

## 🔌 الـ API

كل البيانات بتيجي من Lovable Cloud عبر:
- `supabase.from('products')` — قراءة المنتجات
- `supabase.from('categories')` — الكاتيجوريز
- `supabase.from('shipping_rates')` — أسعار الشحن
- `supabase.functions.invoke('create-order')` — إنشاء طلب
- `supabase.functions.invoke('track-orders')` — تتبع

## 🔄 التحديثات

أي تعديل تعمله من Lovable Admin بيظهر تلقائياً على الموقع خلال 60 ثانية (ISR).

لو عايز تحديث فوري، استخدم Realtime:
```ts
supabase.channel('products').on('postgres_changes', {...}).subscribe()
```
