import type { Metadata } from 'next';
import LeaderboardClient from '@/components/leaderboard/LeaderboardClient';
import { MOCK_LEADERBOARD } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Liderlik Sıralaması | Dijinot',
  description:
    'Dijinot topluluğunun en çok katkı sağlayan üyeleri. Liderlik puanı, Dijipuan, yükleme ve indirme sayılarına göre sıralama.',
};

export default function LeaderboardPage() {
  return <LeaderboardClient entries={MOCK_LEADERBOARD} />;
}
