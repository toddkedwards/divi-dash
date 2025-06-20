"use client";
import React from 'react';
import { useUserSettings } from '@/context/UserSettingsContext';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSetting, loading, syncing, syncError } = useUserSettings();

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
        {/* Notification Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.notificationsEnabled} onChange={e => updateSetting('notificationsEnabled', e.target.checked)} />
              Enable browser notifications for dividends
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled />
              Email notifications (coming soon)
            </label>
          </div>
        </section>
        {/* Default Views */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Default Views</h2>
          <div className="flex items-center gap-4">
            <label>
              Dividend Calendar default:
              <select className="ml-2 rounded border px-2 py-1" value={settings.calendarDefaultView} onChange={e => updateSetting('calendarDefaultView', e.target.value as 'month' | 'day')}>
                <option value="month">Month View</option>
                <option value="day">Day View</option>
              </select>
            </label>
            <label>
              Default landing page:
              <select className="ml-2 rounded border px-2 py-1" value={settings.landingPage} onChange={e => updateSetting('landingPage', e.target.value)}>
                <option value="dashboard">Dashboard</option>
                <option value="positions">Portfolio</option>
                <option value="dividend-calendar">Dividend Calendar</option>
              </select>
            </label>
          </div>
        </section>
        {/* Theme */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Theme</h2>
          <div className="flex items-center gap-4">
            <label>
              <input type="radio" name="theme" value="system" checked={settings.theme === 'system'} onChange={() => updateSetting('theme', 'system')} className="mr-2" /> System
            </label>
            <label>
              <input type="radio" name="theme" value="light" checked={settings.theme === 'light'} onChange={() => updateSetting('theme', 'light')} className="mr-2" /> Light
            </label>
            <label>
              <input type="radio" name="theme" value="dark" checked={settings.theme === 'dark'} onChange={() => updateSetting('theme', 'dark')} className="mr-2" /> Dark
            </label>
          </div>
        </section>
      </div>
    </div>
  );
} 