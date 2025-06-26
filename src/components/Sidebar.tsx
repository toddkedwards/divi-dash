"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useAuth } from '../context/AuthContext';
import AuthButton from './AuthButton';
import { 
  User, 
  LogOut, 
  LogIn, 
  Settings, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Target, 
  Search, 
  BarChart, 
  Gem, 
  DollarSign, 
  X, 
  Newspaper, 
  Filter, 
  Zap, 
  Brain, 
  Users 
} from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Image from 'next/image';

// Simplified navigation with logical groupings
const navigationItems = [
  // Core Portfolio Management
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} />, group: 'core' },
  { name: 'Portfolio', href: '/positions', icon: <Briefcase size={20} />, group: 'core' },
  { name: 'Portfolio Insights', href: '/portfolio-insights', icon: <BarChart size={20} />, group: 'core' },
  { name: 'Portfolio Goals', href: '/portfolio-goals', icon: <Target size={20} />, group: 'core' },
  
  // Investment Tools (Combined dividend + research tools)
  { name: 'Dividend Calendar', href: '/dividend-calendar', icon: <Calendar size={20} />, group: 'tools' },
  { name: 'Dividend Calculator', href: '/dividend-calculator', icon: <DollarSign size={20} />, group: 'tools' },
  { name: 'Stock Screener', href: '/stock-screener', icon: <Filter size={20} />, group: 'tools' },
  { name: 'Stock Finder', href: '/stock-ticker-finder', icon: <Search size={20} />, group: 'tools' },
  { name: 'News & Sentiment', href: '/news-dashboard', icon: <Newspaper size={20} />, group: 'tools' },
  
  // AI & Community
  { name: 'Advanced Features', href: '/advanced-features', icon: <Zap size={20} />, group: 'smart' },
  { name: 'AI Recommendations', href: '/ai-recommendations', icon: <Brain size={20} />, group: 'smart' },
  { name: 'Community Hub', href: '/community', icon: <Users size={20} />, group: 'smart' },
  { name: 'Business Dev', href: '/business-development', icon: <BarChart size={20} />, group: 'smart' },
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

  const renderNavItems = () => {
    // Group items by category
    const coreItems = navigationItems.filter(item => item.group === 'core');
    const toolsItems = navigationItems.filter(item => item.group === 'tools');
    const smartItems = navigationItems.filter(item => item.group === 'smart');

    const renderGroup = (items: typeof navigationItems, title?: string) => (
      <div className="space-y-1">
        {title && (
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-green-200 uppercase tracking-wider">
              {title}
            </h3>
          </div>
        )}
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium
                hover:bg-green-800 hover:text-white
                dark:hover:bg-green-600 dark:hover:text-white
                ${isActive ? 'bg-white text-green-700 shadow font-bold' : 'text-white'}`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>
    );

    return (
      <nav className="flex-1 space-y-6">
        {/* Core Portfolio Management */}
        {renderGroup(coreItems)}
        
        {/* Investment Tools */}
        {renderGroup(toolsItems, 'Investment Tools')}
        
        {/* Smart Features */}
        {renderGroup(smartItems, 'Smart Features')}
      </nav>
    );
  };

  const GoogleG = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M44.5 20H24V28.5H36.9C35.5 33.1 31.2 36.5 24 36.5C16.3 36.5 10 30.2 10 22.5C10 14.8 16.3 8.5 24 8.5C27.3 8.5 30.2 9.7 32.4 11.7L38.1 6C34.3 2.6 29.5 0.5 24 0.5C11.8 0.5 2 10.3 2 22.5C2 34.7 11.8 44.5 24 44.5C36.2 44.5 46 34.7 46 22.5C46 21.1 45.8 20.5 45.6 19.7L44.5 20Z" fill="white"/>
        <path d="M6.3 14.1L13.1 19.1C15 15.1 19.1 12.5 24 12.5C26.7 12.5 29.1 13.4 31 14.9L37.2 9.1C33.7 6.1 29.1 4.5 24 4.5C16.3 4.5 10 10.8 10 18.5C10 20.1 10.3 21.6 10.8 23L6.3 14.1Z" fill="white"/>
        <path d="M24 44.5C31.2 44.5 36.5 40.1 38.9 35.5L31.7 30.1C29.9 31.3 27.6 32.1 24 32.1C19.1 32.1 15 29.5 13.1 25.5L6.3 30.9C10.3 37.1 16.3 44.5 24 44.5Z" fill="white"/>
        <path d="M44.5 20H24V28.5H36.9C36.2 31.1 34.3 33.1 31.7 34.5L38.9 40.9C42.7 37.3 46 32.1 46 22.5C46 21.1 45.8 20.5 45.6 19.7L44.5 20Z" fill="white"/>
      </g>
    </svg>
  );

  const renderThemeToggle = () => (
    mounted && (
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30"
        aria-label="Toggle theme"
      >
        {theme === 'light'
          ? <Sun size={18} strokeWidth={2} className="text-white flex-shrink-0" />
          : <Moon size={18} strokeWidth={2} className="text-white flex-shrink-0" />}
        <span className="font-medium text-sm">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    )
  );

  const renderUserSection = () => (
    <div className="mt-auto w-full flex flex-col">
      {/* Border above this entire section */}
      <div className="border-t border-white/20 pt-4 w-full">
        {/* User avatar and info */}
        {user ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 mb-3">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="User avatar"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.displayName || 'User'}
              </p>
              <p className="text-xs text-white/70 truncate">
                {user.email}
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30"
          >
            <GoogleG />
            <span className="font-medium text-sm">Sign in with Google</span>
          </button>
        )}

        {/* Settings */}
        <div className="flex flex-col gap-3">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 border border-white/20 hover:border-white/30">
            <Settings size={18} className="flex-shrink-0" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </div>
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
      <aside className="flex flex-col w-64 h-screen bg-gradient-to-b from-green-600 to-green-700 dark:from-green-700 dark:to-green-800">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10 pl-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Divly</h1>
          </div>
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
            <div className="w-64 h-full text-soft-white shadow-lg flex flex-col p-6 bg-gradient-to-b from-green-600 to-green-700 dark:from-green-700 dark:to-green-800">
              <div className="flex items-center gap-3 mb-10 pl-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Divly</h1>
              </div>
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