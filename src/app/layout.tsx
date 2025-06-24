"use client";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import BottomNavBar from "@/components/BottomNavBar";
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
import Head from 'next/head';

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
          <meta name="apple-mobile-web-app-title" content="Divi Dash" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <link rel="manifest" href="/manifest.json" />
        </head>
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Divi Dash" />
        <meta name="description" content="Professional dividend portfolio tracking and analysis" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-background touch-manipulation">
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
                          {/* Desktop Sidebar - hidden on mobile */}
                          {!isMobile && (
                            <div className="w-64 min-h-screen flex-shrink-0">
                              <Sidebar />
                            </div>
                          )}
                          
                          {/* Mobile Sidebar - overlay when open */}
                          {isMobile && <Sidebar />}
                          
                          {/* Main content */}
                          <div className={`flex-1 flex flex-col items-center justify-start bg-background min-h-screen ${isMobile ? 'w-full pb-20' : ''}`}>
                            <div className={`w-full ${isMobile ? 'px-2 py-4' : 'max-w-6xl px-4 py-8'}`}>
                              <div className={`bg-card text-card-foreground rounded-2xl shadow-lg ${isMobile ? 'p-3 min-h-[90vh]' : 'p-6 min-h-[80vh]'} transition-colors duration-300`}>
                                <div className="flex justify-end mb-4">
                                  <NetworkStatus />
                                </div>
                                {children}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Mobile Bottom Navigation */}
                        {isMobile && <BottomNavBar />}
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
