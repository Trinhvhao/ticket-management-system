'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthDebugPanel } from '@/components/debug/AuthDebugPanel';
import ChatWidget from '@/components/chatbot/ChatWidget';
import '@/lib/utils/debug-auth'; // Load debug utility

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Wait for Zustand to rehydrate from localStorage
  useEffect(() => {
    console.log('[Dashboard Layout] Component mounted, starting hydration');
    setIsHydrated(true);
  }, []);

  // Only check auth after hydration is complete
  useEffect(() => {
    console.log('[Dashboard Layout] Auth check effect', {
      isHydrated,
      isAuthenticated,
      pathname: window.location.pathname
    });
    
    if (isHydrated && !isAuthenticated) {
      console.log('[Dashboard Layout] Not authenticated, redirecting to login');
      router.push('/login');
    } else if (isHydrated && isAuthenticated) {
      console.log('[Dashboard Layout] Authenticated, showing dashboard');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Show nothing while hydrating to prevent flash
  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setShowMobileSidebar(true)} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Chatbot Widget */}
      <ChatWidget />

      {/* Auth Debug Panel (Development only) */}
      <AuthDebugPanel />
    </div>
  );
}
