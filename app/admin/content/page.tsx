import type { Metadata } from 'next';
import ContentModerationClient from '@/components/admin/ContentModerationClient';
import { MOCK_MODERATION_QUEUE } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'İçerik Moderasyonu | Dijinot Admin',
};

export default function AdminContentPage() {
  return <ContentModerationClient items={MOCK_MODERATION_QUEUE} />;
}
