'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, FileText, Bot, Coins, Layers, Activity, Server,
  ShieldAlert, BadgeCheck, Scale, Wallet, Download, Percent, Cpu, Gauge,
} from 'lucide-react';
import { KpiCard, SectionCard, Pill, VerticalBars } from './AdminUI';
import { TierUploadsChart, DailyActiveChart, RevenueChart, MembershipBreakdown } from './OverviewCharts';
import {
  TierUploadStat, DailyActiveStat, RevenueStat, AdminOverviewStats, AdminNotification,
} from '@/lib/types';

type Range = '7g' | '30g' | '90g';

const RANGE_LABEL: Record<Range, string> = { '7g': 'Son 7 Gün', '30g': 'Son 30 Gün', '90g': 'Son 90 Gün' };
const RANGE_MULT: Record<Range, number> = { '7g': 1, '30g': 4.2, '90g': 12.6 };

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : Math.round(n).toLocaleString('tr-TR'));

const NOTIF_ICON = {
  moderation: ShieldAlert, verification: BadgeCheck, dmca: Scale, payout: Wallet, system: Server,
} as const;

interface Props {
  stats: AdminOverviewStats;
  tierStats: TierUploadStat[];
  dailyActive: DailyActiveStat[];
  revenue: RevenueStat[];
  notifications: AdminNotification[];
}

export default function AnalyticsClient({ stats, tierStats, dailyActive, revenue, notifications }: Props) {
  const [range, setRange] = useState<Range>('7g');
  const mult = RANGE_MULT[range];

  // Derived per-range metrics (mock scaling)
  const scaled = useMemo(
    () => ({
      downloads: 184000 * mult,
      uploads: tierStats.reduce((s, t) => s + t.count, 0) * (mult / 4.2),
      ocrJobs: 9400 * mult,
      newUsers: 6200 * mult,
    }),
    [mult, tierStats]
  );

  const engagement = [
    { label: 'Not Görüntüleme', value: 92, tone: 'bg-cyan-500' },
    { label: 'İndirme Dönüşümü', value: 64, tone: 'bg-blue-500' },
    { label: 'AI Özet Kullanımı', value: 48, tone: 'bg-indigo-500' },
    { label: 'Pro Üyeliğe Geçiş', value: 23, tone: 'bg-purple-500' },
    { label: 'Not Yükleme Oranı', value: 12, tone: 'bg-emerald-500' },
  ];

  const systemHealth = [
    { label: 'AI OCR Kuyruğu', value: `${stats.pendingModeration} belge`, status: 'Yoğun', tone: 'amber' as const, icon: Bot },
    { label: 'İntihal Motoru', value: '312 ms ort.', status: 'Sağlıklı', tone: 'emerald' as const, icon: Cpu },
    { label: 'CDN / PDF Dağıtım', value: '%99,98 uptime', status: 'Sağlıklı', tone: 'emerald' as const, icon: Gauge },
    { label: 'Ödeme Sağlayıcı', value: 'iyzico + Stripe', status: 'Aktif', tone: 'cyan' as const, icon: Wallet },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Sistem Analitiği</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Platform genelinde yükleme, aktiflik, AI işleme ve gelir metriklerinin derinlemesine dökümü.
          </p>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800">
          {(Object.keys(RANGE_LABEL) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                range === r ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-sm' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {RANGE_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Range-scoped KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard index={0} label={`Toplam İndirme (${RANGE_LABEL[range]})`} value={compact(scaled.downloads)} icon={Download} accent="cyan" delta={{ value: '%14,2', positive: true }} sub="Tüm kademeler" />
        <KpiCard index={1} label="Yeni Yükleme" value={compact(scaled.uploads)} icon={FileText} accent="blue" delta={{ value: '%6,8', positive: true }} sub="Onaylanan notlar" />
        <KpiCard index={2} label="AI OCR İşlemi" value={compact(scaled.ocrJobs)} icon={Bot} accent="indigo" delta={{ value: '%21,5', positive: true }} sub="Özet + intihal taraması" />
        <KpiCard index={3} label="Yeni Kayıt" value={compact(scaled.newUsers)} icon={Users} accent="emerald" delta={{ value: '%2,1', positive: false }} sub="Tüm üyelik kademeleri" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TierUploadsChart data={tierStats} />
        <DailyActiveChart data={dailyActive} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart data={revenue} />
        </div>
        <MembershipBreakdown usersByRole={stats.usersByRole} />
      </div>

      {/* Engagement funnel + system health */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SectionCard title="Kullanıcı Etkileşim Hunisi" icon={Percent}>
          <div className="space-y-3.5">
            {engagement.map((e, i) => (
              <div key={e.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{e.label}</span>
                  <span className="font-black text-slate-900 dark:text-white">%{e.value}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${e.value}%` }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 110, damping: 20 }}
                    className={`h-full rounded-full ${e.tone}`}
                  />
                </div>
              </div>
            ))}
            <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
              Ücretsiz üyelerde aylık 5 indirme limiti dönüşüm oranını doğrudan etkiler.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Sistem Sağlığı & Servisler" icon={Server}>
          <div className="space-y-2.5">
            {systemHealth.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.label} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{h.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{h.value}</p>
                    </div>
                  </div>
                  <Pill tone={h.tone}>{h.status}</Pill>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Uploads by tier (raw bars) + activity log */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SectionCard title="Kademe Bazlı Kümülatif Yükleme" icon={Layers}>
          <VerticalBars
            data={tierStats.map((t) => ({ label: t.label, value: t.count, barClass: t.barClass }))}
            height={190}
          />
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Toplam Arşiv</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {tierStats.reduce((s, t) => s + t.count, 0).toLocaleString('tr-TR')} not
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Sistem Günlüğü & Yönetici Olayları" icon={Activity}>
          <div className="space-y-2.5">
            {notifications.map((n) => {
              const Icon = NOTIF_ICON[n.type];
              return (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">{n.detail}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">{n.time}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Economy summary */}
      <SectionCard title="Dijipuan Ekonomisi" icon={Coins}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { label: 'Dolaşımdaki Dijipuan', value: compact(stats.dijipuanCirculating), tone: 'text-amber-600 dark:text-amber-400', sub: 'Kullanıcı bakiyeleri' },
            { label: 'Aylık Gelir', value: `${compact(stats.monthlyRevenueTRY)} ₺`, tone: 'text-emerald-600 dark:text-emerald-400', sub: 'Abonelik + satış' },
            { label: 'Aylık Telif Ödemesi', value: `${compact(stats.monthlyPayoutsTRY)} ₺`, tone: 'text-blue-600 dark:text-blue-400', sub: 'Akademisyenlere aktarılan' },
            {
              label: 'Net Marj',
              value: `%${(((stats.monthlyRevenueTRY - stats.monthlyPayoutsTRY) / stats.monthlyRevenueTRY) * 100).toFixed(1)}`,
              tone: 'text-purple-600 dark:text-purple-400',
              sub: 'Ödemeler sonrası',
            },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.label}</p>
              <p className={`text-xl font-black mt-1 ${m.tone}`}>{m.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
