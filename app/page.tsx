'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  BrainCircuit, 
  Zap, 
  Award, 
  CheckCircle2, 
  FileText, 
  Star, 
  Download, 
  ArrowRight, 
  Smile,
  Microscope,
  ShieldCheck,
  Coins,
  Flame,
  Check,
  Eye
} from 'lucide-react';
import { 
  MOCK_TIERS,
  MOCK_NOTES, 
  MOCK_PRICING_TIERS,
  MOCK_COURSES
} from '@/lib/mock-data';
import { EducationTier } from '@/lib/types';

export default function HomePage() {
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<EducationTier>('lise');
  const [isYearlyBilling, setIsYearlyBilling] = useState(true);

  const activeTierObj = MOCK_TIERS.find(t => t.id === selectedTier) || MOCK_TIERS[2];
  const activeTierNotes = MOCK_NOTES.filter(n => n.educationTier === selectedTier);
  const activeTierCourses = MOCK_COURSES.filter(c => c.educationTier === selectedTier);

  return (
    <div className="space-y-16 lg:space-y-24 pb-12">
      
      {/* 1. HERO SECTION WITH ALL-IN-ONE EDUCATIONAL BANNER */}
      <section className="relative rounded-3xl overflow-hidden glass-panel bg-white/90 dark:bg-slate-900/90 p-6 sm:p-10 lg:p-14 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>1. Sınıftan Profesörlüğe Tüm Eğitim Kademeleri</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            1. Sınıftan Profesörlüğe <br className="hidden sm:inline" />
            <span className="gradient-text">Eksiksiz Ders Notları & Akademik Materyaller</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            İlkokul okuma-yazma setlerinden LGS, YKS (TYT/AYT) soru bankalarına, üniversite vize/final çıkmış sorularından doktora tez özetlerine kadar tek platform!
          </motion.p>

          {/* Hero Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative flex items-center rounded-2xl bg-white dark:bg-slate-900 border border-cyan-500/40 p-2 shadow-xl overflow-hidden">
              <Search className="w-5 h-5 text-cyan-600 dark:text-cyan-400 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                value={heroSearchQuery}
                onChange={(e) => setHeroSearchQuery(e.target.value)}
                placeholder="Örn: LGS Matematik, TYT Fizik, CENG 201..."
                className="flex-1 min-w-0 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none py-2"
              />
              <Link href="/notes/note-high-101" className="shrink-0 ml-2">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/20 whitespace-nowrap">
                  <span>Notları Bul</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Metrics Counter */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="block text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-400">45,000+</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Toplam İndirme</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="block text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">12,400+</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Doğrulanmış Not</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">5 Kademe</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">İlkokuldan Profesörlüğe</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="block text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">%99.4</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">AI OCR Doğruluğu</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. EDUCATION LEVEL SWITCHER TABS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Kademeli Eğitim Hiyerarşisi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Eğitim Kademesini Seçin
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hangi seviyede eğitim alıyorsanız ona uygun ders notlarını ve soru kaynaklarını anında listeleyin.
          </p>
        </div>

        {/* Tier Buttons Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOCK_TIERS.map((tier) => {
            const isSelected = tier.id === selectedTier;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 scale-[1.03]'
                    : 'bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{tier.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tier Info Box & Notes Grid */}
        <div className="p-6 rounded-3xl glass-panel bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${activeTierObj.badgeColor}`}>
                {activeTierObj.shortName}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{activeTierObj.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeTierObj.description}</p>
            </div>
            <Link href={`/kategori/${activeTierObj.id}`}>
              <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-600 text-slate-800 dark:text-slate-200 hover:text-white text-xs font-bold transition">
                Tüm {activeTierObj.shortName} Kataloğunu Aç →
              </button>
            </Link>
          </div>

          {/* Filtered Notes for Selected Tier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTierNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl glass-card bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-500/30">
                      {note.level}
                    </span>
                    <span className="text-[10px] text-slate-500">{note.examType}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{note.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{note.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">{note.rating}</span>
                    <span>({note.downloadCount} indirme)</span>
                  </div>
                  <Link href={`/notes/${note.id}`}>
                    <button className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition">
                      İncele & İndir
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MEMBERSHIP MATRIX */}
      <section className="space-y-8 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">
            Esnek Üyelik Planları
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Eğitim Yolculuğunuza Uygun Planı Seçin
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-6 sm:p-8 rounded-3xl glass-card bg-white dark:bg-slate-900/90 border space-y-6 flex flex-col justify-between relative ${
                tier.popular ? 'border-cyan-500 shadow-xl scale-[1.03]' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tier.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {tier.priceMonthly === 0 ? '0 TL' : `${tier.priceMonthly} TL`}
                  </span>
                  <span className="text-xs text-slate-500">{tier.priceMonthly === 0 ? '' : '/ ay'}</span>
                </div>
                <ul className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition">
                {tier.ctaText}
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
