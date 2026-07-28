import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Dijinot Admin Konsolu | Sistem Yönetimi',
  description: 'İçerik moderasyonu, kullanıcı yönetimi, akademik doğrulama, telif talepleri ve Dijipuan ödeme onayları.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
