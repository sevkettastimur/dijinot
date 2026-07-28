import type { Metadata } from 'next';
import VerificationsClient from '@/components/admin/VerificationsClient';
import { MOCK_VERIFICATION_REQUESTS } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Akademik Doğrulama | Dijinot Admin',
};

export default function AdminVerificationsPage() {
  return <VerificationsClient requests={MOCK_VERIFICATION_REQUESTS} />;
}
