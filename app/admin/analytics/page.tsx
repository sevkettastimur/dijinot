import type { Metadata } from 'next';
import AnalyticsClient from '@/components/admin/AnalyticsClient';
import {
  MOCK_ADMIN_OVERVIEW, MOCK_TIER_UPLOAD_STATS, MOCK_DAILY_ACTIVE,
  MOCK_REVENUE_STATS, MOCK_ADMIN_NOTIFICATIONS,
} from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Sistem Analitiği | Dijinot Admin',
};

export default function AdminAnalyticsPage() {
  return (
    <AnalyticsClient
      stats={MOCK_ADMIN_OVERVIEW}
      tierStats={MOCK_TIER_UPLOAD_STATS}
      dailyActive={MOCK_DAILY_ACTIVE}
      revenue={MOCK_REVENUE_STATS}
      notifications={MOCK_ADMIN_NOTIFICATIONS}
    />
  );
}
