import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import SiteFrame from '@/components/layout/SiteFrame';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Dijinot | 1. Sınıftan Doçentliğe Akademik Ders Notu Paylaşım Platformu',
  description: 'Türkiye\'nin en kapsamlı üniversite ders notları, çıkmış sınav soruları, AI OCR özetleri ve öğretim üyesi onaylı akademik kütüphanesi.',
  keywords: ['ders notları', 'üniversite notları', 'çıkmış sorular', 'vize final notları', 'İTÜ', 'ODTÜ', 'Hacettepe Tıp', 'AI OCR not özeti'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${jakarta.variable}`}>
      {/* Background/foreground come from the CSS variables in globals.css so the
          `.dark` class is the single source of truth — adding bg/text utilities
          here would race with that rule and win in some builds. */}
      <body className="min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
