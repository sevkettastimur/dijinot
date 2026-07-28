'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Wallet, Hourglass, Banknote, CheckCircle2, XCircle, Inbox,
  Coins, CreditCard, Landmark, ShieldCheck, ShieldAlert, TrendingUp,
  Calendar, ShoppingCart, ChevronDown, Info,
} from 'lucide-react';
import { AdminModal, ActionButton, SectionCard, KpiCard, Pill } from './AdminUI';
import { PayoutBadge, MembershipBadge } from './StatusBadges';
import { PayoutRequest, PayoutStatus, PayoutMethod } from '@/lib/types';

const STATUS_FILTERS: { key: PayoutStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Onay Bekliyor' },
  { key: 'approved', label: 'Onaylandı' },
  { key: 'paid', label: 'Ödendi' },
  { key: 'rejected', label: 'Reddedildi' },
];

const METHOD_META: Record<PayoutMethod, { icon: typeof Landmark; tone: string; label: string }> = {
  IBAN: { icon: Landmark, tone: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40', label: 'Banka / IBAN' },
  Stripe: { icon: CreditCard, tone: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40', label: 'Stripe' },
  iyzico: { icon: Wallet, tone: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40', label: 'iyzico' },
};

const REJECT_REASONS = [
  'Akademik doğrulama (Doçent rozeti) tamamlanmamış',
  'Ödeme hesabı bilgileri kullanıcı adıyla eşleşmiyor',
  'Minimum ödeme eşiği (500 ₺) karşılanmıyor',
  'İlgili notlar hakkında açık telif talebi bulunuyor',
];

const tryFmt = (n: number) => `${n.toLocaleString('tr-TR')} ₺`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function PayoutsClient({ payouts }: { payouts: PayoutRequest[] }) {
  const [rows, setRows] = useState<PayoutRequest[]>(payouts);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<PayoutStatus | 'all'>('all');
  const [method, setMethod] = useState<PayoutMethod | 'all'>('all');
  const [selected, setSelected] = useState<PayoutRequest | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return rows.filter((p) => {
      const matchesQuery = !q || p.userName.toLocaleLowerCase('tr').includes(q) || p.accountRef.toLocaleLowerCase('tr').includes(q);
      return (status === 'all' || p.status === status) && (method === 'all' || p.method === method) && matchesQuery;
    });
  }, [rows, query, status, method]);

  const totals = useMemo(
    () => ({
      pendingCount: rows.filter((p) => p.status === 'pending').length,
      pendingAmount: rows.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amountTRY, 0),
      paidAmount: rows.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amountTRY, 0),
      dijipuan: rows.reduce((s, p) => s + p.dijipuanRedeemed, 0),
    }),
    [rows]
  );

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const decide = (id: string, next: PayoutStatus) => {
    setRows((prev) => prev.map((p) => (p.id === id ? { ...p, status: next } : p)));
    setSelected(null);
    setRejectOpen(false);
    const label = { approved: 'Ödeme onaylandı, transfer kuyruğuna alındı.', rejected: 'Ödeme talebi reddedildi.', paid: 'Ödeme tamamlandı olarak işaretlendi.', processing: 'Ödeme işleniyor.', pending: 'Talep beklemeye alındı.' }[next];
    notify(label);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Dijipuan & Telif Ödemeleri</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            &quot;Araştırmacı &amp; Doçent&quot; üyelerinin sattıkları not ve fasiküllerden doğan ödeme taleplerini onaylayın.
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
        <KpiCard index={0} label="Bekleyen Talep" value={totals.pendingCount} icon={Hourglass} accent="amber" sub="Yönetici onayı gerekiyor" />
        <KpiCard index={1} label="Bekleyen Tutar" value={tryFmt(totals.pendingAmount)} icon={Wallet} accent="rose" sub="Onay sonrası transfer edilecek" />
        <KpiCard index={2} label="Ödenen Toplam" value={tryFmt(totals.paidAmount)} icon={Banknote} accent="emerald" sub="Bu dönem tamamlanan" />
        <KpiCard index={3} label="Bozdurulan Dijipuan" value={totals.dijipuan.toLocaleString('tr-TR')} icon={Coins} accent="amber" sub="10 DP = 1 ₺ dönüşüm" />
      </div>

      <SectionCard title={`Ödeme Talepleri (${filtered.length})`} icon={Wallet}>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Kullanıcı adı veya hesap referansı ara..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
              />
            </div>
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PayoutMethod | 'all')}
                className="appearance-none w-full lg:w-48 pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 cursor-pointer"
              >
                <option value="all">Tüm Ödeme Yöntemleri</option>
                <option value="IBAN">Banka / IBAN</option>
                <option value="Stripe">Stripe</option>
                <option value="iyzico">iyzico</option>
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

          {/* Payout table */}
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Talep Sahibi</th>
                  <th className="py-3 px-3">Tutar</th>
                  <th className="py-3 px-3">Dijipuan</th>
                  <th className="py-3 px-3">Yöntem</th>
                  <th className="py-3 px-3">Satış</th>
                  <th className="py-3 px-3">Durum</th>
                  <th className="py-3 px-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((p) => {
                  const M = METHOD_META[p.method];
                  const MIcon = M.icon;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative shrink-0">
                            <img src={p.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                            {p.isVerifiedEducator && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-purple-600 flex items-center justify-center border border-white dark:border-slate-900">
                                <ShieldCheck className="w-2 h-2 text-white" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{p.userName}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-mono">{p.accountRef}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {tryFmt(p.amountTRY)}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {p.dijipuanRedeemed.toLocaleString('tr-TR')} DP
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold ${M.tone}`}>
                          <MIcon className="w-3 h-3" /> {M.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.salesCount} adet</td>
                      <td className="py-3.5 px-3"><PayoutBadge status={p.status} /></td>
                      <td className="py-3.5 px-3 text-right">
                        {p.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); decide(p.id, 'approved'); }}
                              className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition"
                              title="Onayla"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelected(p); setRejectOpen(true); }}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:text-rose-600 dark:hover:text-rose-400 transition"
                              title="Reddet"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold hover:text-cyan-600 dark:hover:text-cyan-400 transition"
                          >
                            Detay
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-14 text-center space-y-2">
                <Inbox className="w-9 h-9 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Bu filtrede ödeme talebi yok</p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ============ PAYOUT DETAIL MODAL ============ */}
      <AdminModal open={!!selected && !rejectOpen} onClose={() => setSelected(null)} maxWidth="max-w-lg">
        {selected && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 pr-8">
              <div className="relative shrink-0">
                <img src={selected.userAvatar} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/30" />
                {selected.isVerifiedEducator && (
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center border-2 border-white dark:border-slate-900">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>
              <div className="min-w-0 space-y-1.5">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{selected.userName}</h2>
                <div className="flex flex-wrap items-center gap-1.5">
                  <MembershipBadge role={selected.role} />
                  <PayoutBadge status={selected.status} />
                </div>
              </div>
            </div>

            {/* Amount summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/40 dark:to-cyan-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
              <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Talep Edilen Tutar</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{tryFmt(selected.amountTRY)}</p>
              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {selected.dijipuanRedeemed.toLocaleString('tr-TR')} Dijipuan bozdurulacak
              </p>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Ödeme Yöntemi', value: METHOD_META[selected.method].label, icon: METHOD_META[selected.method].icon },
                { label: 'Hesap Referansı', value: selected.accountRef, icon: CreditCard },
                { label: 'Satış Adedi', value: `${selected.salesCount} not/fasikül`, icon: ShoppingCart },
                { label: 'Talep Tarihi', value: fmtDate(selected.requestedAt), icon: Calendar },
              ].map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 min-w-0">
                    <span className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-slate-400">
                      <Icon className="w-3 h-3 shrink-0" /> {d.label}
                    </span>
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-1 truncate font-mono">{d.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Verification gate warning */}
            {!selected.isVerifiedEducator ? (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-snug">
                  <strong>Akademik doğrulama tamamlanmamış.</strong> Telif geliri ödemesi yapılabilmesi için kullanıcının
                  &quot;Akademik Doğrulanmış Rozet&quot; alması gerekir.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-snug">
                  Doğrulanmış akademisyen. Ödeme onaylandığında tutar 3 iş günü içinde transfer edilir.
                </p>
              </div>
            )}

            {/* Actions */}
            {selected.status === 'pending' ? (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <ActionButton tone="emerald" icon={CheckCircle2} onClick={() => decide(selected.id, 'approved')} className="flex-1 min-w-[150px]">
                  Ödemeyi Onayla
                </ActionButton>
                <ActionButton tone="rose" icon={XCircle} variant="soft" onClick={() => setRejectOpen(true)} className="flex-1 min-w-[130px]">
                  Reddet
                </ActionButton>
              </div>
            ) : selected.status === 'approved' ? (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <ActionButton tone="emerald" icon={Banknote} onClick={() => decide(selected.id, 'paid')} className="w-full">
                  Ödendi Olarak İşaretle
                </ActionButton>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <Pill tone="slate" icon={TrendingUp}>Bu talep için işlem tamamlandı</Pill>
              </div>
            )}
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
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Ödeme Talebini Reddet</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {selected.userName} • {tryFmt(selected.amountTRY)}
                </p>
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
              <ActionButton tone="rose" icon={XCircle} onClick={() => decide(selected.id, 'rejected')} className="flex-1">
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
