'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldAlert, Heart, Sparkles, Scale, BookOpen, ExternalLink } from 'lucide-react';
import DmcaModal from '../modals/DmcaModal';

export default function Footer() {
  const [isDmcaOpen, setIsDmcaOpen] = useState(false);

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Academic Disclaimer */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white">
                diji<span className="text-cyan-400">not</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Türkiye’nin en gelişmiş hiyerarşik akademik not paylaşım ve AI OCR özet platformu. 1. Sınıftan Doçentliğe kadar tüm ders materyalleri.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              7 Üniversitede 45,000+ Aktif Öğrenci
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Popüler Fakülteler
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/faculties/muhendislik" className="hover:text-cyan-300 transition">Mühendislik Fakültesi</Link></li>
              <li><Link href="/faculties/tip-ve-saglik" className="hover:text-cyan-300 transition">Tıp ve Sağlık Bilimleri</Link></li>
              <li><Link href="/faculties/hukuk" className="hover:text-cyan-300 transition">Hukuk Fakültesi</Link></li>
              <li><Link href="/faculties/iktisat-ve-isletme" className="hover:text-cyan-300 transition">İktisadi ve İdari Bilimler</Link></li>
            </ul>
          </div>

          {/* Academic Features & Gamification */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Platform & Araçlar
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/upload" className="hover:text-cyan-300 transition">AI OCR Not Tarayıcı</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-300 transition">Dijipuan Ödül Sistemi</Link></li>
              <li><Link href="/leaderboard" className="hover:text-cyan-300 transition">Liderlik Sıralaması</Link></li>
              <li><Link href="/notes/note-101" className="hover:text-cyan-300 transition">Profesör Onay Mekanizması</Link></li>
            </ul>
          </div>

          {/* Legal & DMCA */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-rose-400" /> Telif & Hukuk
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => setIsDmcaOpen(true)}
                  className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold transition"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> DMCA Bildirimi Yap
                </button>
              </li>
              <li><a href="#" className="hover:text-slate-200 transition">Kullanım Koşulları & KVKK</a></li>
              <li><a href="#" className="hover:text-slate-200 transition">Akademik Dürüstlük İlkesi</a></li>
              <li><a href="#" className="hover:text-slate-200 transition">Topluluk Kuralları</a></li>
            </ul>
          </div>
        </div>

        {/* Academic Disclaimer Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-500 leading-relaxed space-y-1">
          <p className="font-bold text-slate-400">Yasal Uyarı & Yer Sağlayıcı Bildirimi:</p>
          <p>
            Dijinot (dijinot.com), 5651 Sayılı Kanun’un 2. maddesinin 1. fıkrasının (m) bendi uyarınca "Yer Sağlayıcı" sıfatıyla hizmet vermektedir. Platformda paylaşılan içeriklerin doğruluğu ve telif hakları sorumluluğu içeriği yükleyen kullanıcıya aittir. Hak sahibi olduğunuz bir notun kaldırılması için lütfen DMCA bildirim sistemini kullanınız.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 Dijinot Academic Platform. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Türkiye Akademisi için Sevgi ve Tutkuyla Geliştirildi</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>

      <DmcaModal isOpen={isDmcaOpen} onClose={() => setIsDmcaOpen(false)} />
    </footer>
  );
}
