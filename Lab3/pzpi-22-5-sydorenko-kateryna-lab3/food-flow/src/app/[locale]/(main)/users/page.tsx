'use client';
import UserTableView from '@/layouts/tables/users/usersTable';
import ProtectedRoute from '@/lib/protectedRoute';

export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <UserTableView />
    </ProtectedRoute>
  );
}
