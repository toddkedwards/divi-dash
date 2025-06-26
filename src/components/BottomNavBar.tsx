"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PieChart, 
  Calendar, 
  Settings, 
  TrendingUp,
  Users,
  Sparkles,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'positions',
    label: 'Portfolio',
    path: '/positions',
    icon: PieChart,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: '/dividend-calendar',
    icon: Calendar,
  },
  {
    id: 'insights',
    label: 'Insights',
    path: '/portfolio-insights',
    icon: BarChart3,
  },
  {
    id: 'more',
    label: 'More',
    path: '/settings',
    icon: Settings,
  },
];

const moreMenuItems = [
  { label: 'AI Recommendations', path: '/ai-recommendations', icon: Sparkles },
  { label: 'Community', path: '/community', icon: Users },
  { label: 'Stock Screener', path: '/stock-screener', icon: TrendingUp },
  { label: 'Portfolio Goals', path: '/portfolio-goals', icon: DollarSign },
  { label: 'Advanced Features', path: '/advanced-features', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    // Set active tab based on current path
    const currentItem = navigationItems.find(item => 
      pathname === item.path || (item.id === 'more' && 
      moreMenuItems.some(moreItem => pathname === moreItem.path))
    );
    setActiveTab(currentItem?.id || '');
  }, [pathname]);

  const handleNavigation = (item: NavItem) => {
    if (item.id === 'more') {
      setShowMoreMenu(!showMoreMenu);
    } else {
      setShowMoreMenu(false);
      router.push(item.path);
    }
  };

  const handleMoreMenuNavigation = (path: string) => {
    setShowMoreMenu(false);
    router.push(path);
  };

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMoreMenu(false)}
        >
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">More Options</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Access all features</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {moreMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <motion.button
                    key={item.path}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoreMenuNavigation(item.path)}
                    className={`
                      flex flex-col items-center justify-center p-4 rounded-xl
                      transition-all duration-200 min-h-[80px] touch-feedback
                      ${isActive 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-700' 
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                      }
                    `}
                  >
                    <Icon size={24} className="mb-2" />
                    <span className="text-xs font-medium text-center leading-tight">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            
            <button
              onClick={() => setShowMoreMenu(false)}
              className="w-full mt-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium touch-feedback"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden z-30 safe-area-inset">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigation(item)}
                className={`
                  flex flex-col items-center justify-center p-2 rounded-xl
                  transition-all duration-200 min-w-[60px] min-h-[60px] relative touch-feedback
                  ${isActive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-xl"
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  />
                )}
                
                {/* Icon and label */}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon size={20} className="mb-1" />
                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                  
                  {/* Badge for notifications */}
                  {item.badge && item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
} 