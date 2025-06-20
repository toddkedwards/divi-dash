"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useAuth } from '../context/AuthContext';
import AuthButton from './AuthButton';
import { User, LogOut, LogIn, Settings, Sun, Moon, LayoutDashboard, Briefcase, Calendar, Target, Search, BarChart, Gem, DollarSign, X, Newspaper, Filter, Zap } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Image from 'next/image';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Portfolio', href: '/positions', icon: <Briefcase size={20} /> },
  { name: 'Dividend Calendar', href: '/dividend-calendar', icon: <Calendar size={20} /> },
  { name: 'Dividend Calculator', href: '/dividend-calculator', icon: <DollarSign size={20} /> },
  { name: 'Stock Screener', href: '/stock-screener', icon: <Filter size={20} /> },
  { name: 'News & Sentiment', href: '/news-dashboard', icon: <Newspaper size={20} /> },
  { name: 'Integration & Automation', href: '/integration-automation', icon: <Zap size={20} /> },
  { name: 'Portfolio Goals', href: '/portfolio-goals', icon: <Target size={20} /> },
  { name: 'Stock Ticker Finder', href: '/stock-ticker-finder', icon: <Search size={20} /> },
  { name: 'Portfolio Insights', href: '/portfolio-insights', icon: <BarChart size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderNavItems = () => (
    <nav className="flex-1 space-y-2">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-lg font-medium
              hover:bg-primary-dark hover:text-soft-white
              dark:hover:bg-primary dark:hover:text-soft-white
              ${isActive ? 'bg-white text-green-700 shadow font-bold' : 'text-white dark:text-green-100'}`}
          >
            {item.icon}
            {item.name}
          </Link>
        );
      })}
      <Link href="/upgrade" className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg text-yellow-400 bg-yellow-50/10 cursor-pointer hover:bg-yellow-100/20 transition-colors duration-200">
        <Gem size={20} className="text-yellow-400" />
        <span className="font-medium">Upgrade to Pro</span>
      </Link>
    </nav>
  );

  const GoogleG = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M44.5 20H24V28.5H36.9C35.5 33.1 31.2 36.5 24 36.5C16.3 36.5 10 30.2 10 22.5C10 14.8 16.3 8.5 24 8.5C27.3 8.5 30.2 9.7 32.4 11.7L38.1 6C34.3 2.6 29.5 0.5 24 0.5C11.8 0.5 2 10.3 2 22.5C2 34.7 11.8 44.5 24 44.5C36.2 44.5 46 34.7 46 22.5C46 21.1 45.8 20.5 45.6 19.7L44.5 20Z" fill="#FFC107"/>
        <path d="M6.3 14.1L13.1 19.1C15 15.1 19.1 12.5 24 12.5C26.7 12.5 29.1 13.4 31 14.9L37.2 9.1C33.7 6.1 29.1 4.5 24 4.5C16.3 4.5 10 10.8 10 18.5C10 20.1 10.3 21.6 10.8 23L6.3 14.1Z" fill="#FF3D00"/>
        <path d="M24 44.5C31.2 44.5 36.5 40.1 38.9 35.5L31.7 30.1C29.9 31.3 27.6 32.1 24 32.1C19.1 32.1 15 29.5 13.1 25.5L6.3 30.9C10.3 37.1 16.3 44.5 24 44.5Z" fill="#4CAF50"/>
        <path d="M44.5 20H24V28.5H36.9C36.2 31.1 34.3 33.1 31.7 34.5L38.9 40.9C42.7 37.3 46 32.1 46 22.5C46 21.1 45.8 20.5 45.6 19.7L44.5 20Z" fill="#1976D2"/>
      </g>
    </svg>
  );

  const renderThemeToggle = () => (
    mounted && (
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-800 dark:text-green-100"
        aria-label="Toggle theme"
        style={{ width: 'fit-content', alignSelf: 'flex-start' }}
      >
        {theme === 'light'
          ? <Sun size={20} strokeWidth={2} className="text-white dark:text-green-100" />
          : <Moon size={20} strokeWidth={2} className="text-white dark:text-green-100" />}
        <span className="font-medium">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    )
  );

  const renderUserSection = () => (
    <div className="mt-auto w-full flex flex-col items-start">
      <div className="pt-8 border-t border-primary-light dark:border-primary w-full flex flex-col gap-2">
        {user ? (
          <>
            <div className="flex items-center gap-3 mb-1">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => auth.signOut()}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="flex items-center gap-3 px-2 py-2 rounded-md border border-green-600 bg-white text-green-700 font-semibold shadow-sm hover:bg-green-50 hover:border-green-700 transition-colors text-base w-full justify-start"
            style={{ boxShadow: '0 1px 2px rgba(16, 185, 129, 0.08)' }}
          >
            <GoogleG />
            <span>Sign in with Google</span>
          </button>
        )}
        <Link href="/settings" className="flex items-center gap-2 mt-2 px-2 py-2 rounded hover:bg-green-700 dark:hover:bg-green-800 text-white dark:text-green-100 text-sm font-medium transition-colors">
          <Settings size={18} /> Settings
        </Link>
        {renderThemeToggle()}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger menu */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-green-600 text-soft-white lg:hidden hover:bg-green-700 transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-800 dark:text-green-100"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar always visible on desktop/tablet */}
      <aside className="flex flex-col w-64 h-screen" style={{ backgroundColor: '#18b64a' }}>
        <div className="p-6 flex flex-col h-full">
          <h1 className="text-3xl font-extrabold mb-10 tracking-tight text-white dark:text-green-100 pl-4">Divly</h1>
          {renderNavItems()}
          {renderUserSection()}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex"
          >
            <div className="w-64 h-full text-soft-white shadow-lg flex flex-col p-6" style={{ backgroundColor: '#18b64a' }}>
              <h1 className="text-3xl font-extrabold mb-10 tracking-tight text-white dark:text-green-100 pl-4">Divly</h1>
              {renderNavItems()}
              {renderUserSection()}
            </div>
            <div className="flex-1 bg-black bg-opacity-40" onClick={() => setIsMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 