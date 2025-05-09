'use client';
import SpinnerContainer from '@/layouts/base/spinnerContainer';
import { useAuth } from '@/lib/providers/authProvider';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, getRole } = useAuth();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!getRole) return;
    const role = getRole();
    if (role && !allowedRoles.includes(role)) {
      router.push('/');
      return;
    }

    setIsReady(true);
  }, [isAuthenticated, isLoading, router, allowedRoles, getRole]);

  if (!isReady) {
    return <SpinnerContainer />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
