'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, FileText, Eye, CheckCircle2, XCircle, Flag, Sparkles,
  ShieldAlert, Filter, FileWarning, Bot, Copy, User, Calendar, HardDrive,
  ChevronDown, Inbox,
} from 'lucide-react';
import {
  AdminModal, ActionButton, Pill, ScoreBadge, SectionCard, KpiCard,
} from './AdminUI';
import { ModerationBadge } from './StatusBadges';
import { ModerationItem, ModerationStatus, EducationTier } from '@/lib/types';
import { MOCK_TIERS } from '@/lib/mock-data';

const STATUS_FILTERS: { key: ModerationStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending_ai', label: 'AI İncelemesinde' },
  { key: 'flagged', label: 'İşaretlendi' },
  { key: 'approved', label: 'Onaylandı' },
  { key: 'rejected', label: 'Reddedildi' },
];

const REJECT_REASONS = [
  'Düşük görüntü kalitesi / okunaksız tarama',
  'İçerik ders notu formatına uygun değil',
  'Yüksek intihal oranı tespit edildi',
  'Eksik/yanıltıcı ders ve kademe bilgisi',
  'Telif hakkı ihlali şüphesi',
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const fmtSize = (b: number) => `${(b / 1024 / 1024).toFixed(1)} MB`;

const tierLabel = (t: EducationTier) => MOCK_TIERS.find((x) => x.id === t)?.shortName ?? t;

const tierTone: Record<EducationTier, 'emerald' | 'cyan' | 'indigo' | 'blue' | 'purple'> = {
  ilkokul: 'emerald', ortaokul: 'cyan', lise: 'indigo', lisans: 'blue', akademik: 'purple',
};

export default function ContentModerationClient({ items }: { items: ModerationItem[] }) {
  const [rows, setRows] = useState<ModerationItem[]>(items);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ModerationStatus | 'all'>('all');
  const [tier, setTier] = useState<EducationTier | 'all'>('all');
  const [selected, setSelected] = useState<ModerationItem | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return rows.filter((r) => {
      const matchesQuery =
        !q ||
        r.noteTitle.toLocaleLowerCase('tr').includes(q) ||
        r.authorName.toLocaleLowerCase('tr').includes(q) ||
        r.courseCode.toLocaleLowerCase('tr').includes(q);
      const matchesStatus = status === 'all' || r.status === status;
      const matchesTier = tier === 'all' || r.educationTier === tier;
      return matchesQuery && matchesStatus && matchesTier;
    });
  }, [rows, query, status, tier]);

  const counts = useMemo(
    () => ({
      pending: rows.filter((r) => r.status === 'pending_ai').length,
      flagged: rows.filter((r) => r.status === 'flagged').length,
      approved: rows.filter((r) => r.status === 'approved').length,
      highRisk: rows.filter((r) => r.plagiarismScore >= 60 || r.aiGeneratedScore >= 60).length,
    }),
    [rows]
  );

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const applyStatus = (id: string, next: ModerationStatus, reason?: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next, flagReason: reason ?? r.flagReason } : r)));
    setSelected(null);
    setRejectOpen(false);
    const label = { approved: 'onaylandı ve yayına alındı', rejected: 'reddedildi', flagged: 'telif ihlali olarak işaretlendi', pending_ai: 'kuyruğa geri alındı' }[next];
    notify(`Not ${label}.`);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">İçerik & Not Moderasyonu</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            AI OCR ve intihal denetiminden geçen notları inceleyin, onaylayın veya reddedin.
          </p>
        </div>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard index={0} label="AI İncelemesinde" value={counts.pending} icon={Bot} accent="amber" sub="OCR + intihal taraması sürüyor" />
        <KpiCard index={1} label="İşaretlenen Not" value={counts.flagged} icon={Flag} accent="rose" sub="Manuel inceleme gerekiyor" />
        <KpiCard index={2} label="Yüksek Riskli" value={counts.highRisk} icon={FileWarning} accent="purple" sub="%60+ intihal veya AI skoru" />
        <KpiCard index={3} label="Onaylanan" value={counts.approved} icon={CheckCircle2} accent="emerald" sub="Yayına alındı" />
      </div>

      {/* Filters + table */}
      <SectionCard
        title={`Moderasyon Kuyruğu (${filtered.length})`}
        icon={ShieldAlert}
        action={
          <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500">
            Satıra tıklayarak hızlı inceleme açın
          </span>
        }
      >
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Not başlığı, yazar veya ders kodu ara..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
              />
            </div>

            {/* Education tier select */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as EducationTier | 'all')}
                className="appearance-none w-full lg:w-56 pl-8 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 cursor-pointer"
              >
                <option value="all">Tüm Eğitim Kademeleri</option>
                {MOCK_TIERS.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((f) => {
              const count = f.key === 'all' ? rows.length : rows.filter((r) => r.status === f.key).length;
              const isActive = status === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setStatus(f.key)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  {f.label}
                  <span className={`px-1.5 rounded-full text-[9px] ${isActive ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Data table */}
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-left text-xs border-collapse min-w-[860px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Ders Notu</th>
                  <th className="py-3 px-3">Kademe</th>
                  <th className="py-3 px-3">Yükleyen</th>
                  <th className="py-3 px-3">AI Denetim</th>
                  <th className="py-3 px-3">Durum</th>
                  <th className="py-3 px-3">Tarih</th>
                  <th className="py-3 px-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <td className="py-3.5 px-3 max-w-[280px]">
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 rounded">
                        {r.courseCode}
                      </span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-1">{r.noteTitle}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {r.pageCount} sayfa • {fmtSize(r.fileSizeBytes)} • {r.examType}
                      </p>
                    </td>
                    <td className="py-3.5 px-3">
                      <Pill tone={tierTone[r.educationTier]}>{tierLabel(r.educationTier)}</Pill>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <img src={r.authorAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{r.authorName}</p>
                          {r.isVerifiedAuthor && (
                            <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold">✓ Doğrulanmış Eğitmen</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1">
                        <ScoreBadge score={r.plagiarismScore} label="İntihal" />
                        <ScoreBadge score={r.aiGeneratedScore} label="AI" />
                      </div>
                    </td>
                    <td className="py-3.5 px-3"><ModerationBadge status={r.status} /></td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {fmtDate(r.submittedAt)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(r); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 text-[10px] font-bold transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> İncele
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-14 text-center space-y-2">
                <Inbox className="w-9 h-9 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Bu filtreyle eşleşen not yok</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Arama terimini veya kademe/durum filtresini değiştirin.</p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ============ QUICK ACTION MODAL ============ */}
      <AdminModal open={!!selected && !rejectOpen} onClose={() => setSelected(null)} maxWidth="max-w-4xl">
        {selected && (
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* PDF preview pane */}
            <div className="lg:col-span-2 p-5 sm:p-6 bg-slate-50 dark:bg-slate-950/50 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <FileText className="w-3.5 h-3.5" /> PDF Önizleme
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 aspect-[3/4]">
                <img src={selected.previewImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/85 to-transparent">
                  <p className="text-[10px] text-white font-bold">Sayfa 1 / {selected.pageCount}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-slate-400"><HardDrive className="w-3 h-3" /> Dosya</span>
                  <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{fmtSize(selected.fileSizeBytes)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-slate-400"><Calendar className="w-3 h-3" /> Yüklenme</span>
                  <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{fmtDate(selected.submittedAt)}</p>
                </div>
              </div>
            </div>

            {/* Details + actions */}
            <div className="lg:col-span-3 p-5 sm:p-6 space-y-5">
              <div className="space-y-2 pr-8">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 rounded">
                    {selected.courseCode}
                  </span>
                  <Pill tone={tierTone[selected.educationTier]}>{tierLabel(selected.educationTier)}</Pill>
                  <ModerationBadge status={selected.status} />
                </div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                  {selected.noteTitle}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selected.courseName} • {selected.level} • {selected.examType}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={selected.authorAvatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> {selected.authorName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {selected.isVerifiedAuthor ? 'Akademik Doğrulanmış Eğitmen' : 'Standart Kullanıcı'}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-400">Fiyat</p>
                  <p className="text-xs font-black text-amber-600 dark:text-amber-400">
                    {selected.dijipuanPrice === 0 ? 'Ücretsiz' : `${selected.dijipuanPrice} DP`}
                  </p>
                </div>
              </div>

              {/* AI scores */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Yapay Zekâ Denetim Raporu
                </div>
                {[
                  { label: 'İntihal / Benzerlik Skoru', value: selected.plagiarismScore, icon: Copy },
                  { label: 'AI Üretim Olasılığı', value: selected.aiGeneratedScore, icon: Bot },
                ].map(({ label, value, icon: Icon }) => {
                  const tone = value >= 60 ? 'bg-rose-500' : value >= 30 ? 'bg-amber-500' : 'bg-emerald-500';
                  const text = value >= 60 ? 'text-rose-600 dark:text-rose-400' : value >= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';
                  return (
                    <div key={label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
                          <Icon className="w-3.5 h-3.5 text-slate-400" /> {label}
                        </span>
                        <span className={`font-black ${text}`}>%{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={`h-full rounded-full ${tone}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {selected.flagReason && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                  <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                    <FileWarning className="w-3.5 h-3.5" /> Sistem Uyarısı
                  </p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 leading-snug">{selected.flagReason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <ActionButton tone="emerald" icon={CheckCircle2} onClick={() => applyStatus(selected.id, 'approved')} className="flex-1 min-w-[150px] mt-4">
                  Onayla & Yayınla
                </ActionButton>
                <ActionButton tone="rose" icon={XCircle} variant="soft" onClick={() => setRejectOpen(true)} className="flex-1 min-w-[130px] mt-4">
                  Gerekçeyle Reddet
                </ActionButton>
                <ActionButton tone="amber" icon={Flag} variant="soft" onClick={() => applyStatus(selected.id, 'flagged', 'Yönetici tarafından telif ihlali şüphesiyle işaretlendi.')} className="flex-1 min-w-[150px] mt-4">
                  Telif İhlali İşaretle
                </ActionButton>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* ============ REJECT WITH REASON MODAL ============ */}
      <AdminModal open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="max-w-lg">
        {selected && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="min-w-0 pr-6">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Gerekçeyle Reddet</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{selected.noteTitle}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Red Gerekçesi (yükleyene bildirilecek)
              </label>
              <div className="space-y-1.5">
                {REJECT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setRejectReason(reason)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[11px] font-semibold border transition ${
                      rejectReason === reason
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-300'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <ActionButton tone="rose" icon={XCircle} onClick={() => applyStatus(selected.id, 'rejected', rejectReason)} className="flex-1">
                Reddet & Bildir
              </ActionButton>
              <ActionButton tone="slate" variant="soft" onClick={() => setRejectOpen(false)} className="flex-1">
                Vazgeç
              </ActionButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
