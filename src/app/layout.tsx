"use client";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { DividendsProvider } from '@/context/DividendsContext';
import { ThemeProvider } from 'next-themes';
import ToastProvider from '@/components/ToastProvider';
import { Inter } from 'next/font/google';
import { UserPreferencesProvider } from '../context/UserPreferencesContext';
import { WatchlistProvider } from '../context/WatchlistContext';
import { UserSettingsProvider } from '@/context/UserSettingsContext';
import React from 'react';
import NetworkStatus from '@/components/NetworkStatus';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <html lang="en" className={inter.className} suppressHydrationWarning>
        <body className="min-h-screen bg-background">
          <div className="flex min-h-screen items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <UserSettingsProvider>
          <UserPreferencesProvider>
            <ToastProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <GeistProvider>
                  <CssBaseline />
                  <PortfolioProvider>
                    <DividendsProvider>
                      <WatchlistProvider>
                        <div className="flex min-h-screen">
                          {/* Sidebar always visible on the left */}
                          <div className="w-64 min-h-screen flex-shrink-0">
                            <Sidebar />
                          </div>
                          {/* Main content fills the rest */}
                          <div className="flex-1 flex flex-col items-center justify-start bg-background min-h-screen">
                            <div className="w-full max-w-6xl px-4 py-8">
                              <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-6 min-h-[80vh] transition-colors duration-300">
                                <div className="flex justify-end mb-4">
                                  <NetworkStatus />
                                </div>
                                {children}
                              </div>
                            </div>
                          </div>
                        </div>
                      </WatchlistProvider>
                    </DividendsProvider>
                  </PortfolioProvider>
                </GeistProvider>
              </ThemeProvider>
            </ToastProvider>
          </UserPreferencesProvider>
        </UserSettingsProvider>
      </body>
    </html>
  );
}
