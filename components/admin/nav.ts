import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  BadgeCheck,
  Scale,
  Wallet,
  BarChart3,
  LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** short description shown in tooltips / collapsed state */
  hint: string;
  /** optional live badge count key from AdminOverviewStats */
  badgeKey?: 'pendingModeration' | 'pendingVerifications' | 'openClaims' | 'pendingPayouts';
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Genel Bakış', href: '/admin', icon: LayoutDashboard, hint: 'Analitik özeti & KPI' },
  { label: 'İçerik Moderasyonu', href: '/admin/content', icon: ShieldCheck, hint: 'Not onay & AI denetim kuyruğu', badgeKey: 'pendingModeration' },
  { label: 'Kullanıcı Yönetimi', href: '/admin/users', icon: Users, hint: 'Üyelik, Dijipuan & hesap durumu' },
  { label: 'Akademik Doğrulama', href: '/admin/verifications', icon: BadgeCheck, hint: 'Doçent / Prof rozet başvuruları', badgeKey: 'pendingVerifications' },
  { label: 'Telif / DMCA', href: '/admin/dmca', icon: Scale, hint: 'Telif ihlali & kaldırma talepleri', badgeKey: 'openClaims' },
  { label: 'Dijipuan & Ödemeler', href: '/admin/payouts', icon: Wallet, hint: 'Telif geliri ödeme onayları', badgeKey: 'pendingPayouts' },
  { label: 'Sistem Analitiği', href: '/admin/analytics', icon: BarChart3, hint: 'Yükleme & aktiflik metrikleri' },
];
