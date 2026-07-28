import type { Metadata } from 'next';
import PayoutsClient from '@/components/admin/PayoutsClient';
import { MOCK_PAYOUT_REQUESTS } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Dijipuan & Ödemeler | Dijinot Admin',
};

export default function AdminPayoutsPage() {
  return <PayoutsClient payouts={MOCK_PAYOUT_REQUESTS} />;
}
