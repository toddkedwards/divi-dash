"use client";
import React from 'react';
import Link from 'next/link';
import { useUserSettings } from '@/context/UserSettingsContext';
import { Loader2, CheckCircle, AlertCircle, Zap, BarChart3, Bell, Shield, Crown, LogOut, LogIn } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { settings, updateSetting, loading, syncing, syncError } = useUserSettings();
  const { user } = useAuth();

  if (loading) return <div className="max-w-2xl mx-auto py-10 px-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Settings</h1>
        {/* Sync status indicator */}
        <div className="flex items-center gap-1">
          {syncing ? (
            <>
              <Loader2 className="animate-spin text-blue-500" size={24} />
              <span className="text-xs text-blue-600 font-medium" title="Syncing...">Syncing</span>
            </>
          ) : syncError ? (
            <>
              <AlertCircle className="text-red-500" size={24} />
              <span className="text-xs text-red-600 font-medium" title={syncError}>Error</span>
            </>
          ) : (
            <>
              <CheckCircle className="text-green-500" size={24} />
              <span className="text-xs text-green-600 font-medium" title="Synced">Synced</span>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Advanced Features */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="text-blue-600" size={24} />
            Advanced Features
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Access powerful analytics, automation, and advanced portfolio management tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/advanced-features" className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
              <BarChart3 className="text-blue-600" size={20} />
              <div>
                <h3 className="font-medium">Advanced Analytics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Real-time alerts & portfolio insights</p>
              </div>
            </Link>
            <Link href="/integration-automation" className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
              <Zap className="text-purple-600" size={20} />
              <div>
                <h3 className="font-medium">Integration & Automation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Brokerage sync & automated workflows</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Notification Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Notifications</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={settings.notificationsEnabled} onChange={e => updateSetting('notificationsEnabled', e.target.checked)} />
              Enable browser notifications for dividends
            </label>
            <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <input type="checkbox" disabled />
              Email notifications (coming soon)
            </label>
          </div>
        </section>
        {/* Default Views */}
        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Default Views</h2>
          <div className="flex items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">
              Dividend Calendar default:
              <select className="ml-2 rounded border px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" value={settings.calendarDefaultView} onChange={e => updateSetting('calendarDefaultView', e.target.value as 'month' | 'day')}>
                <option value="month">Month View</option>
                <option value="day">Day View</option>
              </select>
            </label>
            <label className="text-gray-700 dark:text-gray-300">
              Default landing page:
              <select className="ml-2 rounded border px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" value={settings.landingPage} onChange={e => updateSetting('landingPage', e.target.value)}>
                <option value="dashboard">Dashboard</option>
                <option value="positions">Portfolio</option>
                <option value="dividend-calendar">Dividend Calendar</option>
              </select>
            </label>
          </div>
        </section>

        {/* Authentication & Subscription Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Account & Subscription Status
          </h3>
          
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Signed In
                </span>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Subscription Plan</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Free Plan
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Upgrade to Pro for advanced analytics, AI recommendations, and priority support.
              </p>
              <div className="flex space-x-3">
                <Link href="/upgrade">
                  <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade to Pro
                  </span>
                </Link>
                <Link href="/pricing">
                  <span className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                    View Plans
                  </span>
                </Link>
              </div>
            </div>

            {/* Account Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => signOut(auth)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
              <Link href="/login">
                <span className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                  <LogIn className="w-4 h-4 mr-2" />
                  Switch Account
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 