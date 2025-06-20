import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import React, { memo } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Portfolio', href: '/positions', icon: '📊' },
  { label: 'Calendar', href: '/dividend-calendar', icon: '📅' },
  { label: 'Goals', href: '/portfolio-goals', icon: '🎯' },
  { label: 'Finder', href: '/stock-ticker-finder', icon: '🔍' },
];

function vibrate(ms = 10) {
  if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
    window.navigator.vibrate(ms);
  }
}

const BottomNavBar = () => {
  const pathname = usePathname();
  const touchTimeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 shadow-lg z-50 flex justify-around items-center py-2">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.label} className="flex-1">
            <Link
              href={item.href}
              aria-label={item.label}
              className={`flex flex-col items-center text-xs font-medium px-2 py-2 rounded-lg transition-all duration-150 select-none ${active ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-zinc-800 scale-105 shadow' : 'text-gray-500 dark:text-gray-300'} active:scale-95`}
              style={{ minWidth: 64, touchAction: 'manipulation' }}
              onTouchStart={() => {
                vibrate(12);
              }}
              onMouseDown={() => {
                vibrate(8);
              }}
            >
              <span style={{ fontSize: 24, lineHeight: 1 }}>{item.icon}</span>
              <span className="mt-0.5" style={{ fontSize: 13 }}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </nav>
  );
};

export default memo(BottomNavBar); 