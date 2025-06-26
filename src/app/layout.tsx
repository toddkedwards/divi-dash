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
import ErrorBoundary from '@/components/ErrorBoundary';
import OnboardingFlow from '@/components/OnboardingFlow';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check if user needs onboarding
    const hasSeenOnboarding = localStorage.getItem('divly-onboarding-completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Divly" />
        <meta name="description" content="Professional dividend portfolio tracking and analysis with AI-powered insights" />
        <link rel="icon" href="/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-gray-900 touch-manipulation">
        <AuthProvider>
          <UserPreferencesProvider>
            <UserSettingsProvider>
              <ToastProvider>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
                  <DividendsProvider>
                    <PortfolioProvider>
                      <WatchlistProvider>
                        <ErrorBoundary>
                          {/* Modern Top Navigation */}
                          <TopNavBar />
                          {/* Main Content Area - Full Width */}
                          <main className="min-h-screen bg-gray-900 pt-16">
                            {children}
                          </main>
                          {/* Mobile Bottom Navigation - Only render after hydration */}
                          {mounted && isMobile && <BottomNavBar />}
                          {/* Status Components */}
                          <NetworkStatus />
                          {/* Onboarding Flow */}
                          <OnboardingFlow 
                            isOpen={showOnboarding}
                            onClose={() => setShowOnboarding(false)}
                            onComplete={handleOnboardingComplete}
                          />
                        </ErrorBoundary>
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
