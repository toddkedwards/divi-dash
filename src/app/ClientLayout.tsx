"use client";
import TopNavBar from "@/components/TopNavBar";
import BottomNavBar from "@/components/BottomNavBar";
import { PortfolioProvider } from '@/context/PortfolioContext';
import { DividendsProvider } from '@/context/DividendsContext';
import { ThemeProvider } from 'next-themes';
import ToastProvider from '@/components/ToastProvider';
import { UserPreferencesProvider } from '../context/UserPreferencesContext';
import { WatchlistProvider } from '../context/WatchlistContext';
import { UserSettingsProvider } from '@/context/UserSettingsContext';
import { AuthProvider } from '@/context/AuthContext';
import React from 'react';
import NetworkStatus from '@/components/NetworkStatus';
import WebAppEnhancements from '@/components/WebAppEnhancements';
import dynamic from 'next/dynamic';

// Phase 3: Web App Polish Components (lazy loaded for performance) - TEMPORARILY DISABLED
/*
const KeyboardShortcuts = dynamic(() => import('@/components/KeyboardShortcuts'), {
  ssr: false
});

const DesktopOptimizations = dynamic(() => import('@/components/DesktopOptimizations'), {
  ssr: false
});
*/

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-emerald-600">Loading Divly...</div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <UserSettingsProvider>
          <ToastProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <DividendsProvider>
                <PortfolioProvider>
                  <WatchlistProvider>
                    {/* Modern Top Navigation */}
                    <TopNavBar />
                    
                    {/* Main Content Area - Full Width */}
                    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
                      {children}
                    </main>
                    
                    {/* Mobile Bottom Navigation */}
                    {isMobile && <BottomNavBar />}
                    
                    {/* Status Components */}
                    <NetworkStatus />
                    
                    {/* Phase 3: Web App Polish Features - TEMPORARILY DISABLED */}
                    {/* <KeyboardShortcuts /> */}
                    {/* <DesktopOptimizations /> */}
                    
                    {/* PWA Installation */}
                    {/* <WebAppEnhancements /> */}
                  </WatchlistProvider>
                </PortfolioProvider>
              </DividendsProvider>
            </ThemeProvider>
          </ToastProvider>
        </UserSettingsProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  );
}
