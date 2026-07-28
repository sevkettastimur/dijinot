'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, Activity, TrendingUp, Coins } from 'lucide-react';
import { SectionCard, VerticalBars } from './AdminUI';
import { TierUploadStat, DailyActiveStat, RevenueStat, SubscriptionRole } from '@/lib/types';

const tryFmt = (n: number) => `${n.toLocaleString('tr-TR')} ₺`;

/* --------------------------------------------------------------------------
   Monthly uploads by education tier — switchable between bar & share view
   -------------------------------------------------------------------------- */
export function TierUploadsChart({ data }: { data: TierUploadStat[] }) {
  const [view, setView] = useState<'bar' | 'share'>('bar');
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <SectionCard
      title="Eğitim Kademesine Göre Aylık Yüklemeler"
      icon={Layers}
      action={
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
          {(['bar', 'share'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                view === v ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-sm' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {v === 'bar' ? 'Grafik' : 'Dağılım'}
            </button>
          ))}
        </div>
      }
    >
      {view === 'bar' ? (
        <VerticalBars
          data={data.map((d) => ({ label: d.label, value: d.count, barClass: d.barClass }))}
          height={200}
        />
      ) : (
        <div className="space-y-3">
          {data.map((d, i) => {
            const pct = (d.count / total) * 100;
            return (
              <div key={d.tier} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 dark:text-slate-200">{d.label}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">
                    {d.count.toLocaleString('tr-TR')} • %{pct.toFixed(1)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 120, damping: 20 }}
                    className={`h-full rounded-full ${d.barClass}`}
                  />
                </div>
              </div>
            );
          })}
          <p className="pt-1 text-[10px] text-slate-400 dark:text-slate-500">
            Toplam {total.toLocaleString('tr-TR')} yükleme • 1. Sınıftan Doçentliğe tüm kademeler
          </p>
        </div>
      )}
    </SectionCard>
  );
}

/* --------------------------------------------------------------------------
   Daily active users — hoverable bars with a selected-day readout
   -------------------------------------------------------------------------- */
export function DailyActiveChart({ data }: { data: DailyActiveStat[] }) {
  const [selected, setSelected] = useState<number>(data.length - 3);
  const max = Math.max(...data.map((d) => d.users));
  const avg = Math.round(data.reduce((s, d) => s + d.users, 0) / data.length);
  const current = data[selected];

  return (
    <SectionCard
      title="Günlük Aktif Kullanıcı (Bu Hafta)"
      icon={Activity}
      action={
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
          Ortalama <span className="text-cyan-600 dark:text-cyan-400">{avg.toLocaleString('tr-TR')}</span>
        </span>
      }
    >
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {current.users.toLocaleString('tr-TR')}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {current.day} günü aktif kullanıcı
          </span>
        </div>

        <div className="flex items-end gap-2 h-[160px]">
          {data.map((d, i) => (
            <button
              key={d.day}
              onMouseEnter={() => setSelected(i)}
              onFocus={() => setSelected(i)}
              onClick={() => setSelected(i)}
              className="flex-1 h-full flex flex-col items-center justify-end gap-2 group"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.users / max) * 100}%` }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 120, damping: 18 }}
                className={`w-full rounded-t-lg transition-colors ${
                  selected === i
                    ? 'bg-gradient-to-t from-cyan-600 to-blue-400'
                    : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/60'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors ${
                selected === i ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {d.day}
              </span>
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

/* --------------------------------------------------------------------------
   Revenue vs. Dijipuan payouts — stacked comparison
   -------------------------------------------------------------------------- */
export function RevenueChart({ data }: { data: RevenueStat[] }) {
  const max = Math.max(...data.map((d) => d.revenueTRY));
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const growth = (((latest.revenueTRY - prev.revenueTRY) / prev.revenueTRY) * 100).toFixed(1);

  return (
    <SectionCard
      title="Aylık Gelir & Dijipuan Telif Ödemeleri"
      icon={TrendingUp}
      action={
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="w-3 h-3" /> %{growth} artış
        </span>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-blue-600 to-cyan-400" /> Abonelik Geliri
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Telif / Dijipuan Ödemesi
          </span>
        </div>

        <div className="flex items-end gap-2 sm:gap-4 h-[180px]">
          {data.map((d, i) => (
            <div key={d.month} className="flex-1 h-full flex flex-col items-center justify-end gap-2 group">
              <div className="w-full h-full flex items-end justify-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.revenueTRY / max) * 100}%` }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 120, damping: 18 }}
                  className="w-1/2 rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-400"
                  title={`Gelir: ${tryFmt(d.revenueTRY)}`}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.payoutsTRY / max) * 100}%` }}
                  transition={{ delay: i * 0.05 + 0.05, type: 'spring', stiffness: 120, damping: 18 }}
                  className="w-1/2 rounded-t-md bg-amber-400"
                  title={`Ödeme: ${tryFmt(d.payoutsTRY)}`}
                />
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{d.month}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Bu Ay Gelir</span>
            <p className="text-base font-black text-blue-600 dark:text-blue-400">{tryFmt(latest.revenueTRY)}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Bu Ay Telif Ödemesi</span>
            <p className="text-base font-black text-amber-600 dark:text-amber-400">{tryFmt(latest.payoutsTRY)}</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* --------------------------------------------------------------------------
   Users by membership tier — donut-ish segmented ring
   -------------------------------------------------------------------------- */
const ROLE_META: Record<SubscriptionRole, { label: string; color: string; ring: string }> = {
  FREE_STUDENT: { label: 'Ücretsiz Öğrenci', color: 'text-slate-600 dark:text-slate-300', ring: 'bg-slate-400' },
  PRO_STUDENT: { label: 'Pro Öğrenci & YKS', color: 'text-indigo-600 dark:text-indigo-400', ring: 'bg-indigo-500' },
  RESEARCHER_DOCENT: { label: 'Araştırmacı & Doçent', color: 'text-purple-600 dark:text-purple-400', ring: 'bg-purple-500' },
};

export function MembershipBreakdown({ usersByRole }: { usersByRole: Record<SubscriptionRole, number> }) {
  const entries = useMemo(
    () => (Object.keys(ROLE_META) as SubscriptionRole[]).map((role) => ({ role, count: usersByRole[role] })),
    [usersByRole]
  );
  const total = entries.reduce((s, e) => s + e.count, 0);

  return (
    <SectionCard title="Üyelik Kademesine Göre Kullanıcılar" icon={Coins}>
      <div className="space-y-4">
        {/* Segmented bar */}
        <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {entries.map((e, i) => (
            <motion.div
              key={e.role}
              initial={{ width: 0 }}
              animate={{ width: `${(e.count / total) * 100}%` }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 110, damping: 20 }}
              className={ROLE_META[e.role].ring}
            />
          ))}
        </div>

        <div className="space-y-2.5">
          {entries.map((e) => {
            const m = ROLE_META[e.role];
            const pct = ((e.count / total) * 100).toFixed(1);
            return (
              <div key={e.role} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-200 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.ring}`} />
                  <span className="truncate">{m.label}</span>
                </span>
                <span className="flex items-baseline gap-2 shrink-0">
                  <span className={`text-sm font-black ${m.color}`}>{e.count.toLocaleString('tr-TR')}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">%{pct}</span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Toplam Kayıtlı Kullanıcı</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">{total.toLocaleString('tr-TR')}</span>
        </div>
      </div>
    </SectionCard>
  );
}
