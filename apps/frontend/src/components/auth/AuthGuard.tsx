'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Public routes that don't need authentication
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (requireAuth && !isAuthenticated && !isPublicRoute) {
      // Redirect to login if trying to access protected route
      router.push('/login');
    } else if (!requireAuth && isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      // Redirect to dashboard if already logged in and trying to access login/register
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router, requireAuth]);

  return <>{children}</>;
}
