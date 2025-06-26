"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, ChevronDown, BarChart3, DollarSign, Calendar, 
  Target, TrendingUp, Settings, Bell, User, Search,
  Smartphone, Monitor, Building, Users,
  Brain, Shield, Zap, Calculator, BookOpen, Crown, Activity, Eye
} from 'lucide-react';
import PWAStatus from './PWAStatus';
import NetworkStatus from './NetworkStatus';

const TopNavBar = () => {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const portfolioItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/positions', label: 'Positions', icon: TrendingUp },
    { href: '/portfolio-insights', label: 'Portfolio Insights', icon: Eye },
    { href: '/portfolio-goals', label: 'Portfolio Goals', icon: Target },
  ];

  const dividendItems = [
    { href: '/dividend-calendar', label: 'Dividend Calendar', icon: Calendar },
    { href: '/news-dashboard', label: 'News & Analysis', icon: BookOpen },
  ];

  const toolItems = [
    { href: '/dividend-calculator', label: 'Dividend Calculator', icon: Calculator },
    { href: '/stock-screener', label: 'Stock Screener', icon: Search },
    { href: '/stock-ticker-finder', label: 'Stock Ticker Finder', icon: Search },
  ];

  const smartItems = [
    { href: '/ai-recommendations', label: 'AI Recommendations', icon: Brain },
    { href: '/advanced-features', label: 'Advanced Analytics', icon: BarChart3 },
    { href: '/integration-automation', label: 'Integrations', icon: Zap },
    { href: '/community', label: 'Community Hub', icon: Users },
  ];

  const isActivePath = (path: string) => pathname === path;
  
  const isActiveSection = (items: any[]) => 
    items.some(item => isActivePath(item.href));

  const NavSection = ({ 
    title, 
    items, 
    icon: Icon 
  }: { 
    title: string; 
    items: any[]; 
    icon: any;
  }) => {
    const isActive = isActiveSection(items);
    const dropdownId = title.toLowerCase().replace(' ', '-');
    const isOpen = openDropdown === dropdownId;

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
            isActive 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Icon className="w-4 h-4" />
          {title}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-2">
              {items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenDropdown(null)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                      isActivePath(item.href)
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <ItemIcon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Divly
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavSection title="Portfolio" items={portfolioItems} icon={BarChart3} />
              <NavSection title="Dividends" items={dividendItems} icon={DollarSign} />
              <NavSection title="Tools" items={toolItems} icon={Search} />
              <NavSection title="Smart Features" items={smartItems} icon={Brain} />
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Status Indicators */}
              <div className="hidden md:flex items-center space-x-3">
                <NetworkStatus />
                <PWAStatus />
              </div>

              {/* Settings */}
              <Link
                href="/settings"
                className={`p-2 rounded-lg transition-colors ${
                  isActivePath('/settings')
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Pricing */}
              <Link
                href="/pricing"
                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isActivePath('/pricing')
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Pricing
              </Link>

              {/* Upgrade */}
              <Link
                href="/upgrade"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Upgrade</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="px-4 py-3 space-y-3">
              {/* Status for mobile */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <NetworkStatus />
                <PWAStatus />
              </div>

              {/* Portfolio Section */}
              <div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Portfolio
                </div>
                {portfolioItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActivePath(item.href)
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Dividends Section */}
              <div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Dividends
                </div>
                {dividendItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActivePath(item.href)
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Tools Section */}
              <div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Tools
                </div>
                {toolItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActivePath(item.href)
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Smart Features Section */}
              <div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Smart Features
                </div>
                {smartItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActivePath(item.href)
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default TopNavBar; 