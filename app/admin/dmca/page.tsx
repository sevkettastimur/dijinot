import type { Metadata } from 'next';
import DmcaClient from '@/components/admin/DmcaClient';
import { MOCK_COPYRIGHT_CLAIMS } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Telif & DMCA Talepleri | Dijinot Admin',
};

export default function AdminDmcaPage() {
  return <DmcaClient claims={MOCK_COPYRIGHT_CLAIMS} />;
}
