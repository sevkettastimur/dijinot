'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Crown, Medal, Search, Award, Upload, Download, Coins,
  Star, ShieldCheck, TrendingUp, TrendingDown, Minus, Users,
  ChevronDown, Inbox, Sparkles, Microscope, GraduationCap,
} from 'lucide-react';
import { LeaderboardEntry, EducationTier, SubscriptionRole } from '@/lib/types';
import { MOCK_TIERS } from '@/lib/mock-data';

type SortKey = 'reputationScore' | 'earnedDijipuan' | 'totalDownloads' | 'totalUploads';

const SORT_OPTIONS: { key: SortKey; label: string; icon: typeof Award }[] = [
  { key: 'reputationScore', label: 'Liderlik Puanı', icon: Award },
  { key: 'earnedDijipuan', label: 'Dijipuan', icon: Coins },
  { key: 'totalDownloads', label: 'İndirme', icon: Download },
  { key: 'totalUploads', label: 'Yükleme', icon: Upload },
];

const ROLE_META: Record<SubscriptionRole, { label: string; icon: typeof Sparkles; cls: string }> = {
  FREE_STUDENT: { label: 'Ücretsiz', icon: GraduationCap, cls: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
  PRO_STUDENT: { label: 'Pro & YKS', icon: Sparkles, cls: 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700' },
  RESEARCHER_DOCENT: { label: 'Araştırmacı & Doçent', icon: Microscope, cls: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700' },
};

const PODIUM = [
  { ring: 'border-amber-400', bg: 'from-amber-400 to-yellow-500', text: 'text-amber-600 dark:text-amber-400', label: 'Şampiyon', icon: Crown },
  { ring: 'border-slate-300', bg: 'from-slate-300 to-slate-400', text: 'text-slate-600 dark:text-slate-300', label: '2. Sıra', icon: Medal },
  { ring: 'border-orange-400', bg: 'from-orange-400 to-amber-600', text: 'text-orange-600 dark:text-orange-400', label: '3. Sıra', icon: Medal },
];

const nf = (n: number) => n.toLocaleString('tr-TR');

function RankDelta({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
        <Minus className="w-3 h-3" /> —
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(delta)}
    </span>
  );
}

function RoleBadge({ role }: { role: SubscriptionRole }) {
  const m = ROLE_META[role];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold ${m.cls}`}>
      <Icon className="w-2.5 h-2.5 shrink-0" /> {m.label}
    </span>
  );
}

export default function LeaderboardClient({ entries }: { entries: LeaderboardEntry[] }) {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<EducationTier | 'all'>('all');
  const [role, setRole] = useState<SubscriptionRole | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('reputationScore');

  /** Filter first, then rank by the active metric so positions always reflect the current view. */
  const ranked = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return entries
      .filter((e) => {
        const matchesQuery =
          !q ||
          e.name.toLocaleLowerCase('tr').includes(q) ||
          e.university.toLocaleLowerCase('tr').includes(q) ||
          e.department.toLocaleLowerCase('tr').includes(q);
        return matchesQuery && (tier === 'all' || e.educationTier === tier) && (role === 'all' || e.role === role);
      })
      .slice()
      .sort((a, b) => b[sortKey] - a[sortKey])
      .map((e, i) => ({ ...e, rank: i + 1 }));
  }, [entries, query, tier, role, sortKey]);

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const totals = useMemo(
    () => ({
      members: entries.length,
      uploads: entries.reduce((s, e) => s + e.totalUploads, 0),
      downloads: entries.reduce((s, e) => s + e.totalDownloads, 0),
      dijipuan: entries.reduce((s, e) => s + e.earnedDijipuan, 0),
    }),
    [entries]
  );

  const activeSort = SORT_OPTIONS.find((s) => s.key === sortKey)!;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-white to-cyan-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-cyan-950/20 border border-amber-200 dark:border-amber-500/20 p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wide">
              <Trophy className="w-3.5 h-3.5" /> Topluluk Liderlik Tablosu
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Liderlik Sıralaması
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Üyeler, paylaştıkları notların indirilme sayısı, aldığı puanlar ve topluluk katkılarından oluşan
              <strong className="text-slate-800 dark:text-slate-200"> liderlik puanına</strong> göre sıralanır.
            </p>
          </div>
          <Trophy className="hidden sm:block w-20 h-20 text-amber-400/30 shrink-0" />
        </div>

        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Sıralanan Üye', value: nf(totals.members), Icon: Users, tone: 'text-cyan-600 dark:text-cyan-400' },
            { label: 'Toplam Yükleme', value: nf(totals.uploads), Icon: Upload, tone: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'Toplam İndirme', value: nf(totals.downloads), Icon: Download, tone: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Dağıtılan Dijipuan', value: nf(totals.dijipuan), Icon: Coins, tone: 'text-amber-600 dark:text-amber-400' },
          ].map(({ label, value, Icon, tone }) => (
            <div key={label} className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <Icon className={`w-4 h-4 ${tone}`} />
              <p className={`text-lg font-black mt-1 ${tone}`}>{value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Üye adı, üniversite veya bölüm ara..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
            />
          </div>

          <div className="relative">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as EducationTier | 'all')}
              className="appearance-none w-full lg:w-52 pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 cursor-pointer"
            >
              <option value="all">Tüm Eğitim Kademeleri</option>
              {MOCK_TIERS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as SubscriptionRole | 'all')}
              className="appearance-none w-full lg:w-48 pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 cursor-pointer"
            >
              <option value="all">Tüm Üyelikler</option>
              <option value="FREE_STUDENT">Ücretsiz Öğrenci</option>
              <option value="PRO_STUDENT">Pro Öğrenci &amp; YKS</option>
              <option value="RESEARCHER_DOCENT">Araştırmacı &amp; Doçent</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Sort metric */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 shrink-0 mr-1">
            Sırala:
          </span>
          {SORT_OPTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = sortKey === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSortKey(s.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Podium */}
      {podium.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {podium.map((e, i) => {
            const p = PODIUM[i];
            const PIcon = p.icon;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 ${p.ring} shadow-sm text-center space-y-3 ${
                  i === 0 ? 'sm:-mt-3 sm:pb-7' : ''
                }`}
              >
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${p.bg} text-white text-[10px] font-black`}>
                  <PIcon className="w-3 h-3" /> {p.label}
                </span>

                <div className="relative w-20 h-20 mx-auto">
                  <img src={e.avatar} alt={e.name} className={`w-20 h-20 rounded-2xl object-cover border-4 ${p.ring}`} />
                  <span className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${p.bg} text-white text-sm font-black flex items-center justify-center border-2 border-white dark:border-slate-900`}>
                    {e.rank}
                  </span>
                  {e.isVerifiedEducator && (
                    <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center border-2 border-white dark:border-slate-900">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{e.name}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{e.university}</p>
                  <div className="flex justify-center"><RoleBadge role={e.role} /></div>
                </div>

                <div className={`py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700`}>
                  <p className={`text-2xl font-black ${p.text}`}>{nf(e[sortKey])}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{activeSort.label}</p>
                </div>

                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400">🏅 {e.badgeTitle}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full ranking table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-[18px] h-[18px] text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Genel Sıralama ({ranked.length})
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            {activeSort.label} değerine göre sıralandı
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[820px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider bg-slate-50/60 dark:bg-slate-800/30">
                <th className="py-3 px-4 w-16">Sıra</th>
                <th className="py-3 px-3">Üye</th>
                <th className="py-3 px-3">Kademe</th>
                <th className="py-3 px-3">Liderlik Puanı</th>
                <th className="py-3 px-3">Yükleme</th>
                <th className="py-3 px-3">İndirme</th>
                <th className="py-3 px-3">Dijipuan</th>
                <th className="py-3 px-3">Puan</th>
                <th className="py-3 px-3 text-right">Hafta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence initial={false}>
                {rest.map((e, i) => {
                  const tierName = MOCK_TIERS.find((t) => t.id === e.educationTier)?.shortName ?? e.educationTier;
                  return (
                    <motion.tr
                      key={e.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.2) }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-black">
                          {e.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img src={e.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
                            {e.isVerifiedEducator && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center border border-white dark:border-slate-900">
                                <ShieldCheck className="w-2 h-2 text-white" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{e.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{e.university}</p>
                            <RoleBadge role={e.role} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-[9px] font-bold whitespace-nowrap">
                          {tierName}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-black text-amber-600 dark:text-amber-400">{nf(e.reputationScore)}</span>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500">{e.badgeTitle}</p>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">{nf(e.totalUploads)}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">{nf(e.totalDownloads)}</td>
                      <td className="py-3.5 px-3 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {nf(e.earnedDijipuan)} DP
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {e.averageRating.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right"><RankDelta delta={e.rankDelta} /></td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {ranked.length === 0 && (
            <div className="py-16 text-center space-y-2">
              <Inbox className="w-9 h-9 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Bu filtreyle eşleşen üye yok</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Arama terimini veya filtreleri değiştirin.</p>
            </div>
          )}
        </div>
      </div>

      {/* How scoring works */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-[18px] h-[18px] text-cyan-600 dark:text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Liderlik Puanı Nasıl Hesaplanır?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { Icon: Upload, title: 'Onaylı Not Yüklemesi', detail: 'Moderasyondan geçen her not +50 puan. Pro üyelerde 2X çarpan uygulanır.', tone: 'text-cyan-600 dark:text-cyan-400' },
            { Icon: Download, title: 'İndirilme & Kullanım', detail: 'Notunuz her indirildiğinde puan kazanırsınız; en çok indirilenler hızla yükselir.', tone: 'text-indigo-600 dark:text-indigo-400' },
            { Icon: Star, title: 'Değerlendirme & Onay', detail: 'Yüksek yıldız ortalaması ve öğretmen/akademisyen onayı puanı katlar.', tone: 'text-amber-600 dark:text-amber-400' },
          ].map(({ Icon, title, detail, tone }) => (
            <div key={title} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <Icon className={`w-5 h-5 ${tone}`} />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{detail}</p>
            </div>
          ))}
        </div>
        <Link href="/upload">
          <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition">
            Not Paylaş & Sıralamada Yüksel
          </button>
        </Link>
      </div>
    </div>
  );
}
