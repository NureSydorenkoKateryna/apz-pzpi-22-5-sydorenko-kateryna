'use client';
import ProtectedRoute from '@/lib/protectedRoute';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
