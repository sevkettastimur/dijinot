import Link from 'next/link';
import { ShieldAlert, Wallet, BadgeCheck, Scale, ArrowRight } from 'lucide-react';
import { KpiCard, SectionCard, Pill } from '@/components/admin/AdminUI';
import {
  TierUploadsChart, DailyActiveChart, RevenueChart, MembershipBreakdown,
} from '@/components/admin/OverviewCharts';
import {
  MOCK_ADMIN_OVERVIEW, MOCK_TIER_UPLOAD_STATS, MOCK_DAILY_ACTIVE,
  MOCK_REVENUE_STATS, MOCK_MODERATION_QUEUE, MOCK_VERIFICATION_REQUESTS,
  MOCK_COPYRIGHT_CLAIMS, MOCK_PAYOUT_REQUESTS,
} from '@/lib/mock-data';

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : n.toLocaleString('tr-TR');

export default function AdminOverviewPage() {
  const s = MOCK_ADMIN_OVERVIEW;

  const queues = [
    {
      label: 'İçerik Moderasyonu',
      count: s.pendingModeration,
      href: '/admin/content',
      icon: ShieldAlert,
      tone: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40',
      detail: `${MOCK_MODERATION_QUEUE.filter((m) => m.status === 'flagged').length} adet AI tarafından işaretlendi`,
    },
    {
      label: 'Akademik Doğrulama',
      count: s.pendingVerifications,
      href: '/admin/verifications',
      icon: BadgeCheck,
      tone: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40',
      detail: `${MOCK_VERIFICATION_REQUESTS.filter((v) => v.status === 'pending').length} yeni Doçent/Prof başvurusu`,
    },
    {
      label: 'Telif / DMCA Talepleri',
      count: s.openClaims,
      href: '/admin/dmca',
      icon: Scale,
      tone: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40',
      detail: `${MOCK_COPYRIGHT_CLAIMS.filter((c) => c.severity === 'high').length} yüksek öncelikli talep`,
    },
    {
      label: 'Ödeme Onayları',
      count: s.pendingPayouts,
      href: '/admin/payouts',
      icon: Wallet,
      tone: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40',
      detail: `${MOCK_PAYOUT_REQUESTS.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amountTRY, 0).toLocaleString('tr-TR')} ₺ onay bekliyor`,
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Page intro */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Sistem Genel Bakış
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            İlkokuldan doçentliğe tüm kademelerdeki içerik, kullanıcı ve gelir metrikleri.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="emerald">Tüm sistemler çalışıyor</Pill>
          <Pill tone="cyan">Son güncelleme: az önce</Pill>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          index={0}
          label="Toplam Aktif Kullanıcı"
          value={compact(s.totalUsers)}
          icon="Users"
          accent="cyan"
          delta={{ value: '%12,4', positive: true }}
          sub={`${compact(s.usersByRole.PRO_STUDENT)} Pro • ${compact(s.usersByRole.RESEARCHER_DOCENT)} Akademisyen`}
        />
        <KpiCard
          index={1}
          label="Toplam Yüklenen Not"
          value={compact(s.totalNotes)}
          icon="FileText"
          accent="blue"
          delta={{ value: '%8,1', positive: true }}
          sub="5 eğitim kademesi genelinde"
        />
        <KpiCard
          index={2}
          label="Onay Bekleyen Kuyruk"
          value={s.pendingModeration}
          icon="ShieldAlert"
          accent="amber"
          delta={{ value: '%3,2', positive: false }}
          sub="AI OCR + intihal denetimi sürüyor"
        />
        <KpiCard
          index={3}
          label="Aylık Gelir"
          value={`${compact(s.monthlyRevenueTRY)} ₺`}
          icon="Wallet"
          accent="emerald"
          delta={{ value: '%9,2', positive: true }}
          sub={`${compact(s.monthlyPayoutsTRY)} ₺ telif ödemesi yapıldı`}
        />
      </div>

      {/* Secondary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard index={0} label="Dolaşımdaki Dijipuan" value={compact(s.dijipuanCirculating)} icon="Coins" accent="amber" sub="Kullanıcı bakiyeleri toplamı" />
        <KpiCard index={1} label="Ücretsiz Öğrenci" value={compact(s.usersByRole.FREE_STUDENT)} icon="GraduationCap" accent="slate" sub="Aylık 5 indirme limitli" />
        <KpiCard index={2} label="Pro Öğrenci & YKS" value={compact(s.usersByRole.PRO_STUDENT)} icon="Sparkles" accent="indigo" sub="Sınırsız indirme + AI OCR" />
        <KpiCard index={3} label="Araştırmacı & Doçent" value={compact(s.usersByRole.RESEARCHER_DOCENT)} icon="Microscope" accent="purple" sub="Telif geliri kazanan hesaplar" />
      </div>

      {/* Action queues */}
      <SectionCard title="Bekleyen İşlem Kuyrukları" icon="ShieldAlert">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {queues.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.href}
                href={q.href}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-cyan-400 dark:hover:border-cyan-600 transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${q.tone}`}>
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{q.count}</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{q.label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{q.detail}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                  Kuyruğa git
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </SectionCard>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TierUploadsChart data={MOCK_TIER_UPLOAD_STATS} />
        <DailyActiveChart data={MOCK_DAILY_ACTIVE} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart data={MOCK_REVENUE_STATS} />
        </div>
        <MembershipBreakdown usersByRole={s.usersByRole} />
      </div>
    </div>
  );
}
