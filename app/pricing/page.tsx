'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, X, Sparkles, GraduationCap, Microscope,
  Zap, ShieldCheck, BrainCircuit, BookOpen,
  Download, Coins, Crown, Star, ArrowRight
} from 'lucide-react';
import { MOCK_PRICING_TIERS } from '@/lib/mock-data';

const TIER_ICONS = [GraduationCap, Sparkles, Microscope];
const TIER_GRADIENTS = [
  'from-slate-400 to-slate-600',
  'from-indigo-500 to-cyan-500',
  'from-purple-600 to-indigo-600',
];
const TIER_GLOW = [
  '',
  'shadow-2xl shadow-indigo-500/20 ring-2 ring-indigo-500/40',
  'shadow-xl shadow-purple-500/15',
];

const FEATURE_TABLE = [
  { feature: 'Aylık İndirme Limiti', free: '5 not / ay', pro: 'Sınırsız', researcher: 'Sınırsız' },
  { feature: 'AI OCR Not Özetleyici', free: false, pro: true, researcher: true },
  { feature: 'Sınav Tüyoları & Strateji', free: false, pro: true, researcher: true },
  { feature: 'Öğretmen & Prof. Onaylı Notlar', free: false, pro: true, researcher: true },
  { feature: 'Çevrimdışı Okuma Modu', free: false, pro: true, researcher: true },
  { feature: 'Mobil Senkronizasyon', free: false, pro: true, researcher: true },
  { feature: 'Dijipuan Çarpanı', free: '1X', pro: '2X', researcher: '3X' },
  { feature: 'Not / Fasikül Satışa Çıkarma', free: false, pro: false, researcher: true },
  { feature: 'Telif Geliri Paneli', free: false, pro: false, researcher: true },
  { feature: 'AI Plagiat & Telif Denetimi', free: false, pro: false, researcher: true },
  { feature: 'Akademik Doğrulanmış Rozet', free: false, pro: false, researcher: true },
  { feature: 'Doktora Sunum Şablonları', free: false, pro: false, researcher: true },
];

const TESTIMONIALS = [
  { name: 'Ege K. Şahin', role: 'İTÜ — Bilgisayar Müh.', text: 'Pro üyelikle CENG 201 vizesine 2 günde hazırlandım. AI OCR özeti inanılmaz derecede işe yaradı!', rating: 5, tier: 'Pro' },
  { name: 'Dr. Arda Yılmaz', role: 'ODTÜ — Araştırmacı', text: 'Tez özetlerimi satışa çıkardım, aylık düzenli gelir elde ediyorum. Akademisyen hesabı gerçekten değerini buluyor.', rating: 5, tier: 'Araştırmacı' },
  { name: 'Zeynep Aydın', role: 'Hacettepe — 1. Sınıf Tıp', text: 'Ücretsiz hesapla başladım, hızla Pro\'ya geçtim. Anatomi notları sayesinde final dönemini çok rahat geçirdim.', rating: 5, tier: 'Pro' },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  return (
    <div className="space-y-16 pb-12">

      {/* Header */}
      <section className="text-center space-y-5 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold"
        >
          <Crown className="w-3.5 h-3.5" />
          Eğitim Yolculuğunuza Uygun Plan
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          İlkokul'dan Doçentliğe <br />
          <span className="gradient-text">Esnek Üyelik Planları</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 text-sm sm:text-base"
        >
          Tüm eğitim kademelerine uygun, şeffaf fiyatlarla başlayın. İstediğiniz zaman planınızı değiştirin.
        </motion.p>

        {/* Monthly / Yearly toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Aylık</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-12 h-6 rounded-full transition-colors ${isYearly ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isYearly ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-sm font-bold ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            Yıllık
            <AnimatePresence>
              {isYearly && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="ml-2 px-2 py-0.5 text-[10px] font-black bg-emerald-500 text-white rounded-full"
                >
                  %20 İndirim
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {MOCK_PRICING_TIERS.map((tier, i) => {
          const Icon = TIER_ICONS[i];
          const price = isYearly
            ? Math.round(tier.priceYearly / 12)
            : tier.priceMonthly;
          const isPopular = tier.popular;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onHoverStart={() => setHoveredTier(tier.id)}
              onHoverEnd={() => setHoveredTier(null)}
              className={`relative p-7 rounded-3xl bg-white dark:bg-slate-900 border flex flex-col justify-between transition-transform duration-200 ${
                isPopular
                  ? `border-indigo-400 dark:border-indigo-600 scale-[1.02] ${TIER_GLOW[i]}`
                  : 'border-slate-200 dark:border-slate-800'
              } ${hoveredTier === tier.id && !isPopular ? 'scale-[1.01]' : ''}`}
            >
              {/* Popular badge */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-black shadow-md shadow-indigo-500/30">
                    ⭐ En Popüler
                  </span>
                </div>
              )}

              {tier.badge && !isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black shadow-md shadow-purple-500/30">
                    🔬 {tier.badge}
                  </span>
                </div>
              )}

              <div className="space-y-5">
                {/* Plan icon + name */}
                <div className="flex items-center gap-3 pt-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TIER_GRADIENTS[i]} flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{tier.name}</h2>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${tier.id}-${isYearly}`}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="text-4xl font-black text-slate-900 dark:text-white"
                    >
                      {price === 0 ? '0' : price.toLocaleString('tr-TR')} ₺
                    </motion.span>
                  </AnimatePresence>
                  {price > 0 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ ay</span>
                  )}
                </div>
                {isYearly && tier.priceYearly > 0 && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold -mt-3">
                    Yılda {tier.priceYearly.toLocaleString('tr-TR')} ₺ — {Math.round((1 - tier.priceYearly / (tier.priceMonthly * 12)) * 100)}% tasarruf
                  </p>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{tier.description}</p>

                {/* Features list */}
                <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-indigo-500' : i === 2 ? 'text-purple-500' : 'text-emerald-500'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA button */}
              <Link href="/dashboard" className="block mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 text-white shadow-md shadow-indigo-500/20'
                      : i === 2
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow-md shadow-purple-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {tier.ctaText}
                  {price > 0 && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {/* Feature Comparison Table */}
      <section className="space-y-5 max-w-5xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Özellik Karşılaştırması</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Hangi planda ne var, tam bir bakışta</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <div className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Özellik</div>
            {MOCK_PRICING_TIERS.map((tier, i) => {
              const Icon = TIER_ICONS[i];
              return (
                <div key={tier.id} className={`p-4 text-center ${tier.popular ? 'bg-indigo-50 dark:bg-indigo-950/30' : ''}`}>
                  <Icon className={`w-4 h-4 mx-auto mb-1 ${tier.popular ? 'text-indigo-600 dark:text-indigo-400' : i === 2 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{tier.name}</p>
                </div>
              );
            })}
          </div>

          {/* Table rows */}
          {FEATURE_TABLE.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 ${i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-900/30'}`}
            >
              <div className="p-3.5 text-xs text-slate-700 dark:text-slate-300 font-medium">{row.feature}</div>
              {[row.free, row.pro, row.researcher].map((val, j) => (
                <div key={j} className={`p-3.5 text-center ${MOCK_PRICING_TIERS[j]?.popular ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''}`}>
                  {val === true ? (
                    <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                  ) : val === false ? (
                    <X className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                  ) : (
                    <span className={`text-xs font-bold ${j === 1 ? 'text-indigo-600 dark:text-indigo-400' : j === 2 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {val}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-5 max-w-5xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Dijinot Kullanıcıları Ne Diyor?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">&quot;{t.text}&quot;</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  t.tier === 'Pro' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                }`}>{t.tier}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ / CTA Banner */}
      <section className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-center text-white space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-4 right-8 w-24 h-24 bg-white rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 space-y-4">
          <BrainCircuit className="w-10 h-10 mx-auto opacity-90" />
          <h2 className="text-2xl sm:text-3xl font-extrabold">7 Gün Ücretsiz Dene</h2>
          <p className="text-sm opacity-80 max-w-md mx-auto">Kredi kartı gerekmez. İstediğiniz zaman iptal edin. Pro özellikleri 7 gün boyunca tam erişimle deneyin.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-extrabold text-sm hover:bg-indigo-50 transition shadow-xl"
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Pro&apos;ya Geç — 7 Gün Ücretsiz
              </motion.button>
            </Link>
            <Link href="/">
              <button className="px-6 py-3.5 rounded-xl border border-white/40 text-white font-bold text-sm hover:bg-white/10 transition">
                Önce Notlara Bak
              </button>
            </Link>
          </div>
          <p className="text-[11px] opacity-60 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL şifrelemesi ile güvenli ödeme
          </p>
        </div>
      </section>

    </div>
  );
}
