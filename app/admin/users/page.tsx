import type { Metadata } from 'next';
import UserManagementClient from '@/components/admin/UserManagementClient';
import { MOCK_ADMIN_USERS } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Kullanıcı Yönetimi | Dijinot Admin',
};

export default function AdminUsersPage() {
  return <UserManagementClient users={MOCK_ADMIN_USERS} />;
}
