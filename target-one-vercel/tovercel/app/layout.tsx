import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Target One 🎯 — متجر المنتجات الخالية من الجلوتين',
  description: 'تسوق منتجات خالية من الجلوتين وصلصات يومية طازجة. توصيل لكل محافظات مصر.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
