'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BadgeCheck, Hourglass, XCircle, Inbox,
  FileCheck2, FileX2, Fingerprint, Building2, Mail, BookMarked,
  TrendingUp, ShieldCheck, Eye, ExternalLink, Microscope,
} from 'lucide-react';
import { AdminModal, ActionButton, SectionCard, KpiCard, Pill } from './AdminUI';
import { VerificationBadge } from './StatusBadges';
import { VerificationRequest, VerificationStatus } from '@/lib/types';

const STATUS_FILTERS: { key: VerificationStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Beklemede' },
  { key: 'under_review', label: 'İncelemede' },
  { key: 'approved', label: 'Onaylandı' },
  { key: 'rejected', label: 'Reddedildi' },
];

const REJECT_REASONS = [
  'Akademik kimlik belgesinin süresi dolmuş',
  'ORCID profili başvuru sahibiyle eşleşmiyor',
  'Kurum belgesi doğrulanamadı',
  'Unvan için yeterli yayın kriteri sağlanmıyor',
  'Belgeler okunaksız / eksik yüklenmiş',
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

const titleTone = (t: string): 'purple' | 'indigo' | 'blue' | 'cyan' =>
  t === 'Prof. Dr.' ? 'purple' : t === 'Doç. Dr.' ? 'indigo' : t === 'Dr. Öğr. Üyesi' ? 'blue' : 'cyan';

export default function VerificationsClient({ requests }: { requests: VerificationRequest[] }) {
  const [rows, setRows] = useState<VerificationRequest[]>(requests);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<VerificationStatus | 'all'>('all');
  const [selected, setSelected] = useState<VerificationRequest | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
  const [docChecks, setDocChecks] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return rows.filter((r) => {
      const matchesQuery =
        !q ||
        r.applicantName.toLocaleLowerCase('tr').includes(q) ||
        r.university.toLocaleLowerCase('tr').includes(q) ||
        r.orcidId.toLocaleLowerCase('tr').includes(q);
      return (status === 'all' || r.status === status) && matchesQuery;
    });
  }, [rows, query, status]);

  const counts = useMemo(
    () => ({
      pending: rows.filter((r) => r.status === 'pending').length,
      review: rows.filter((r) => r.status === 'under_review').length,
      approved: rows.filter((r) => r.status === 'approved').length,
      docents: rows.filter((r) => r.requestedTitle === 'Doç. Dr.' || r.requestedTitle === 'Prof. Dr.').length,
    }),
    [rows]
  );

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const openInspector = (r: VerificationRequest) => {
    setSelected(r);
    setDocChecks(Object.fromEntries(r.documents.map((d, i) => [i, d.verified])));
  };

  const decide = (id: string, next: VerificationStatus, note?: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next, note: note ?? r.note } : r)));
    setSelected(null);
    setRejectOpen(false);
    notify(next === 'approved' ? 'Akademik Doğrulanmış Rozet verildi.' : 'Başvuru reddedildi ve bildirildi.');
  };

  const allDocsChecked = selected ? selected.documents.every((_, i) => docChecks[i]) : false;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Akademik Doğrulama Başvuruları</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            &quot;Akademik Doğrulanmış Rozet&quot; için Doçent / Profesör başvurularını belge bazında inceleyin.
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
        <KpiCard index={0} label="Bekleyen Başvuru" value={counts.pending} icon={Hourglass} accent="amber" sub="İlk incelemeyi bekliyor" />
        <KpiCard index={1} label="İncelemede" value={counts.review} icon={Eye} accent="indigo" sub="Belge doğrulaması sürüyor" />
        <KpiCard index={2} label="Doçent / Prof Adayı" value={counts.docents} icon={Microscope} accent="purple" sub="Üst düzey akademik unvan" />
        <KpiCard index={3} label="Rozet Verilen" value={counts.approved} icon={ShieldCheck} accent="emerald" sub="Telif geliri aktifleştirildi" />
      </div>

      <SectionCard title={`Doğrulama Kuyruğu (${filtered.length})`} icon={BadgeCheck}>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Başvuran adı, üniversite veya ORCID ID ara..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
            />
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

          {/* Applicant cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {filtered.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => openInspector(r)}
                className="text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-600 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={r.applicantAvatar} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{r.applicantName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{r.university}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{r.department}</p>
                    </div>
                  </div>
                  <VerificationBadge status={r.status} />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <Pill tone={titleTone(r.requestedTitle)}>{r.requestedTitle}</Pill>
                  <Pill tone="slate">{r.publicationCount} yayın</Pill>
                  <Pill tone="slate">h-index {r.hIndex}</Pill>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                    ORCID {r.orcidId}
                  </span>
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 shrink-0">
                    {r.documents.filter((d) => d.verified).length}/{r.documents.length} belge doğrulandı
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-14 text-center space-y-2">
              <Inbox className="w-9 h-9 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Bu filtrede başvuru yok</p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ============ DOCUMENT INSPECTION PANEL ============ */}
      <AdminModal open={!!selected && !rejectOpen} onClose={() => setSelected(null)} maxWidth="max-w-3xl">
        {selected && (
          <div className="p-6 space-y-5">
            {/* Applicant header */}
            <div className="flex items-start gap-4 pr-8">
              <img src={selected.applicantAvatar} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 shrink-0" />
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{selected.applicantName}</h2>
                  <Pill tone={titleTone(selected.requestedTitle)}>{selected.requestedTitle}</Pill>
                  <VerificationBadge status={selected.status} />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {selected.university} • {selected.department}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {selected.email}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Başvuru tarihi: {fmtDate(selected.submittedAt)}
                </p>
              </div>
            </div>

            {/* Academic metrics */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'ORCID ID', value: selected.orcidId, icon: Fingerprint, tone: 'text-cyan-600 dark:text-cyan-400' },
                { label: 'Yayın Sayısı', value: selected.publicationCount, icon: BookMarked, tone: 'text-indigo-600 dark:text-indigo-400' },
                { label: 'h-index', value: selected.hIndex, icon: TrendingUp, tone: 'text-purple-600 dark:text-purple-400' },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-slate-400">
                      <Icon className="w-3 h-3" /> {m.label}
                    </span>
                    <p className={`text-xs font-black mt-1 truncate ${m.tone}`}>{m.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Document inspection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Belge İnceleme Paneli
                </label>
                <span className={`text-[10px] font-bold ${allDocsChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {Object.values(docChecks).filter(Boolean).length}/{selected.documents.length} doğrulandı
                </span>
              </div>

              <div className="space-y-2">
                {selected.documents.map((doc, i) => {
                  const checked = !!docChecks[i];
                  return (
                    <div
                      key={doc.label}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition ${
                        checked
                          ? 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          checked ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                          {checked ? <FileCheck2 className="w-4 h-4" /> : <FileX2 className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{doc.label}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{doc.kind}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
                          title="Belgeyi görüntüle"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDocChecks((p) => ({ ...p, [i]: !p[i] }))}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                            checked
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                          }`}
                        >
                          {checked ? 'Doğrulandı' : 'Doğrula'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selected.note && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Yönetici Notu</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{selected.note}</p>
              </div>
            )}

            {!allDocsChecked && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                  Rozet verebilmek için tüm belgelerin doğrulanması gerekir.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => allDocsChecked && decide(selected.id, 'approved')}
                disabled={!allDocsChecked}
                className={`flex-1 min-w-[160px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  allDocsChecked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Rozeti Onayla & Ver
              </button>
              <ActionButton tone="indigo" icon={Eye} variant="soft" onClick={() => decide(selected.id, 'under_review')} className="flex-1 min-w-[140px]">
                İncelemeye Al
              </ActionButton>
              <ActionButton tone="rose" icon={XCircle} variant="soft" onClick={() => setRejectOpen(true)} className="flex-1 min-w-[130px]">
                Reddet
              </ActionButton>
            </div>
          </div>
        )}
      </AdminModal>

      {/* ============ REJECT MODAL ============ */}
      <AdminModal open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="max-w-lg">
        {selected && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 pr-8">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Başvuruyu Reddet</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{selected.applicantName}</p>
              </div>
            </div>

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

            <div className="flex gap-2">
              <ActionButton tone="rose" icon={XCircle} onClick={() => decide(selected.id, 'rejected', `Reddedildi: ${rejectReason}`)} className="flex-1">
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
