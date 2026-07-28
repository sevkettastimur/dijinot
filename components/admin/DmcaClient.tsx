'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Scale, Flag, ShieldOff, CheckCircle2, Inbox, Mail, Send,
  AlertTriangle, FileText, User, Building2, Calendar, ChevronDown, Gavel,
} from 'lucide-react';
import { AdminModal, ActionButton, SectionCard, KpiCard, Pill } from './AdminUI';
import { ClaimBadge, SeverityBadge } from './StatusBadges';
import { CopyrightClaim, ClaimStatus, EducationTier } from '@/lib/types';
import { MOCK_TIERS } from '@/lib/mock-data';

const STATUS_FILTERS: { key: ClaimStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'open', label: 'Açık' },
  { key: 'investigating', label: 'İnceleniyor' },
  { key: 'taken_down', label: 'Kaldırıldı' },
  { key: 'dismissed', label: 'Reddedildi' },
];

const CONTACT_TEMPLATES = [
  'Telif sahibinin talebi doğrultusunda notunuz geçici olarak incelemeye alınmıştır. 7 gün içinde kaynak/izin belgesi paylaşmanızı rica ederiz.',
  'Yüklediğiniz içerik hakkında bir intihal bildirimi aldık. Lütfen özgün kaynaklarınızı ve atıflarınızı iletin.',
  'Notunuzda üçüncü kişilere ait kişisel veri tespit edildi. İlgili sayfaları düzenleyip yeniden yüklemeniz gerekmektedir.',
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const tierLabel = (t: EducationTier) => MOCK_TIERS.find((x) => x.id === t)?.shortName ?? t;
const tierTone: Record<EducationTier, 'emerald' | 'cyan' | 'indigo' | 'blue' | 'purple'> = {
  ilkokul: 'emerald', ortaokul: 'cyan', lise: 'indigo', lisans: 'blue', akademik: 'purple',
};

export default function DmcaClient({ claims }: { claims: CopyrightClaim[] }) {
  const [rows, setRows] = useState<CopyrightClaim[]>(claims);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ClaimStatus | 'all'>('all');
  const [severity, setSeverity] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selected, setSelected] = useState<CopyrightClaim | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [template, setTemplate] = useState(CONTACT_TEMPLATES[0]);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return rows.filter((c) => {
      const matchesQuery =
        !q ||
        c.noteTitle.toLocaleLowerCase('tr').includes(q) ||
        c.claimantName.toLocaleLowerCase('tr').includes(q) ||
        c.uploaderName.toLocaleLowerCase('tr').includes(q);
      return (status === 'all' || c.status === status) && (severity === 'all' || c.severity === severity) && matchesQuery;
    });
  }, [rows, query, status, severity]);

  const counts = useMemo(
    () => ({
      open: rows.filter((c) => c.status === 'open').length,
      investigating: rows.filter((c) => c.status === 'investigating').length,
      high: rows.filter((c) => c.severity === 'high').length,
      takenDown: rows.filter((c) => c.status === 'taken_down').length,
    }),
    [rows]
  );

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const resolve = (id: string, next: ClaimStatus) => {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, status: next } : c)));
    setSelected(null);
    const label = { taken_down: 'Not yayından kaldırıldı.', dismissed: 'Talep geçersiz sayıldı.', investigating: 'Talep incelemeye alındı.', open: 'Talep yeniden açıldı.' }[next];
    notify(label);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Telif & DMCA Talepleri</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bildirilen notları inceleyin; kaldırma, talebi reddetme veya yükleyiciyle iletişim işlemlerini yürütün.
          </p>
        </div>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard index={0} label="Açık Talep" value={counts.open} icon={Flag} accent="rose" sub="İlk değerlendirme bekliyor" />
        <KpiCard index={1} label="İnceleniyor" value={counts.investigating} icon={Scale} accent="amber" sub="Hukuki değerlendirme sürüyor" />
        <KpiCard index={2} label="Yüksek Öncelikli" value={counts.high} icon={AlertTriangle} accent="purple" sub="Acil müdahale gerekebilir" />
        <KpiCard index={3} label="Kaldırılan Not" value={counts.takenDown} icon={ShieldOff} accent="slate" sub="Yayından kaldırıldı" />
      </div>

      <SectionCard title={`Telif Talepleri (${filtered.length})`} icon={Gavel}>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Not başlığı, şikayetçi veya yükleyen ara..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
              />
            </div>
            <div className="relative">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as typeof severity)}
                className="appearance-none w-full lg:w-48 pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 cursor-pointer"
              >
                <option value="all">Tüm Öncelikler</option>
                <option value="high">Yüksek Öncelik</option>
                <option value="medium">Orta Öncelik</option>
                <option value="low">Düşük Öncelik</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((f) => {
              const count = f.key === 'all' ? rows.length : rows.filter((r) => r.status === f.key).length;
              const isActive = status === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setStatus(f.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
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

          {/* Claim list */}
          <div className="space-y-3">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`p-4 rounded-2xl border transition ${
                  c.severity === 'high' && c.status === 'open'
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Pill tone="rose">{c.claimType}</Pill>
                      <SeverityBadge severity={c.severity} />
                      <Pill tone={tierTone[c.educationTier]}>{tierLabel(c.educationTier)}</Pill>
                      <ClaimBadge status={c.status} />
                    </div>

                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{c.noteTitle}</span>
                    </p>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      &ldquo;{c.reason}&rdquo;
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Şikayetçi: <strong className="text-slate-700 dark:text-slate-200">{c.claimantName}</strong>
                        {c.claimantOrg !== '—' && ` (${c.claimantOrg})`}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> Yükleyen: <strong className="text-slate-700 dark:text-slate-200">{c.uploaderName}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {fmtDate(c.reportedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2 shrink-0">
                    <ActionButton tone="rose" icon={ShieldOff} onClick={() => resolve(c.id, 'taken_down')} className="flex-1 lg:w-40">
                      Notu Kaldır
                    </ActionButton>
                    <ActionButton tone="emerald" icon={CheckCircle2} variant="soft" onClick={() => resolve(c.id, 'dismissed')} className="flex-1 lg:w-40">
                      Talebi Reddet
                    </ActionButton>
                    <ActionButton tone="cyan" icon={Mail} variant="soft" onClick={() => { setSelected(c); setContactOpen(true); }} className="flex-1 lg:w-40">
                      Yükleyiciye Yaz
                    </ActionButton>
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="py-14 text-center space-y-2">
                <Inbox className="w-9 h-9 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Bu filtrede telif talebi yok</p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ============ CONTACT UPLOADER MODAL ============ */}
      <AdminModal open={contactOpen} onClose={() => setContactOpen(false)} maxWidth="max-w-lg">
        {selected && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 pr-8">
              <img src={selected.uploaderAvatar} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Yükleyiciyle İletişim</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {selected.uploaderName} • {selected.noteTitle}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Hazır Bildirim Şablonu
              </label>
              <div className="space-y-1.5">
                {CONTACT_TEMPLATES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[11px] leading-snug border transition ${
                      template === t
                        ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-700 text-cyan-800 dark:text-cyan-200 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-cyan-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 resize-none"
            />

            <div className="flex gap-2">
              <ActionButton
                tone="cyan"
                icon={Send}
                onClick={() => { setContactOpen(false); resolve(selected.id, 'investigating'); notify('Bildirim yükleyiciye gönderildi.'); }}
                className="flex-1"
              >
                Gönder & İncelemeye Al
              </ActionButton>
              <ActionButton tone="slate" variant="soft" onClick={() => setContactOpen(false)} className="flex-1">
                Vazgeç
              </ActionButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
