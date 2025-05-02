'use client';
import ProtectedRoute from '@/lib/protectedRoute';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="p-4">{children}</div>
    </ProtectedRoute>
  );
}
