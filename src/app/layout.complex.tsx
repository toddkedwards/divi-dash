"use client";
import "./globals.css";
import TopNavBar from "@/components/TopNavBar";
import BottomNavBar from "@/components/BottomNavBar";
import { PortfolioProvider } from '@/context/PortfolioContext';
import { DividendsProvider } from '@/context/DividendsContext';
import { ThemeProvider } from 'next-themes';
import ToastProvider from '@/components/ToastProvider';
import { Inter } from 'next/font/google';
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

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
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
      <html lang="en" className={inter.className} suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta name="theme-color" content="#059669" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Divly" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="flex min-h-screen items-center justify-center">
            <div className="animate-pulse text-emerald-600">Loading Divly...</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Divly" />
        <meta name="description" content="Professional dividend portfolio tracking and analysis with AI-powered insights" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 touch-manipulation">
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
      </body>
    </html>
  );
}
