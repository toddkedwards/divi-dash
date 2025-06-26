'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Settings, 
  Calendar, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';
import RealAPIManager from '@/components/RealAPIManager';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';

interface AutomationRule {
  id: string;
  name: string;
  type: 'dividend_reinvestment' | 'rebalancing' | 'risk_alert';
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  conditions: string[];
}

interface SyncSchedule {
  id: string;
  brokerage: string;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  enabled: boolean;
  lastSync?: Date;
  nextSync?: Date;
}

const IntegrationAutomationPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'real-api' | 'automation' | 'schedules'>('overview');
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Dividend Reinvestment',
      type: 'dividend_reinvestment',
      enabled: true,
      lastRun: new Date(Date.now() - 86400000),
      nextRun: new Date(Date.now() + 86400000),
      conditions: ['Dividend > $10', 'Same stock purchase']
    },
    {
      id: '2',
      name: 'Portfolio Rebalancing',
      type: 'rebalancing',
      enabled: false,
      conditions: ['Allocation drift > 5%', 'Monthly trigger']
    },
    {
      id: '3',
      name: 'Risk Alerts',
      type: 'risk_alert',
      enabled: true,
      lastRun: new Date(),
      nextRun: new Date(Date.now() + 3600000),
      conditions: ['Portfolio beta > 1.5', 'Concentration > 20%']
    }
  ]);

  const [syncSchedules, setSyncSchedules] = useState<SyncSchedule[]>([
    {
      id: '1',
      brokerage: 'Schwab',
      frequency: 'hourly',
      enabled: true,
      lastSync: new Date(Date.now() - 3600000),
      nextSync: new Date(Date.now() + 1800000)
    },
    {
      id: '2',
      brokerage: 'Fidelity',
      frequency: 'daily',
      enabled: true,
      lastSync: new Date(Date.now() - 7200000),
      nextSync: new Date(Date.now() + 14400000)
    }
  ]);

  const [activityFeed] = useState([
    { id: '1', type: 'sync', message: 'Schwab account synced successfully', time: new Date(Date.now() - 1800000), status: 'success' },
    { id: '2', type: 'automation', message: 'Dividend reinvestment rule executed', time: new Date(Date.now() - 3600000), status: 'success' },
    { id: '3', type: 'alert', message: 'Portfolio concentration alert triggered', time: new Date(Date.now() - 7200000), status: 'warning' },
    { id: '4', type: 'sync', message: 'Fidelity sync completed', time: new Date(Date.now() - 10800000), status: 'success' }
  ]);

  const toggleRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const toggleSchedule = (scheduleId: string) => {
    setSyncSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId ? { ...schedule, enabled: !schedule.enabled } : schedule
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${diffHours}h ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Zap className="h-8 w-8" />
              Integration & Automation
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Connect your brokerage accounts and automate your investment workflows
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'real-api', label: 'Real API Setup', icon: Shield },
              { id: 'automation', label: 'Automation Rules', icon: Settings },
              { id: 'schedules', label: 'Sync Schedules', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 rounded-t-lg
                    ${selectedTab === tab.id
                      ? 'border-green-500 text-green-500 dark:text-green-400 dark:border-green-400 bg-gray-100 dark:bg-gray-900'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-400 bg-transparent'}
                  `}
                  style={{ minWidth: 160 }}
                >
                  <Icon className={`w-5 h-5 ${selectedTab === tab.id ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Connected Accounts</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">2</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Schwab, Fidelity</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Rules</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {automationRules.filter(r => r.enabled).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  of {automationRules.length} rules
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sync Schedules</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {syncSchedules.filter(s => s.enabled).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Active schedules</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Sync</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">30m</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">ago</div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {activityFeed.map(activity => (
                  <div key={activity.id} className="p-6 flex items-center gap-4">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.message}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(activity.time)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {activity.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Real API Setup Tab */}
        {selectedTab === 'real-api' && (
          <RealAPIManager userId="demo-user" />
        )}

        {/* Automation Rules Tab */}
        {selectedTab === 'automation' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Automation Rules
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Configure automated actions for your portfolio
                </p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {automationRules.map(rule => (
                  <div key={rule.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          rule.type === 'dividend_reinvestment' ? 'bg-green-100 dark:bg-green-900/20' :
                          rule.type === 'rebalancing' ? 'bg-blue-100 dark:bg-blue-900/20' :
                          'bg-orange-100 dark:bg-orange-900/20'
                        }`}>
                          {rule.type === 'dividend_reinvestment' && <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />}
                          {rule.type === 'rebalancing' && <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                          {rule.type === 'risk_alert' && <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {rule.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {rule.conditions.join(' • ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className={`p-2 rounded-lg ${
                            rule.enabled 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {rule.enabled ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </button>
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {rule.lastRun && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
                        <span>Last run: {rule.lastRun.toLocaleString()}</span>
                        {rule.nextRun && <span>Next run: {rule.nextRun.toLocaleString()}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sync Schedules Tab */}
        {selectedTab === 'schedules' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sync Schedules
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Manage automatic synchronization frequencies for each brokerage
                </p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {syncSchedules.map(schedule => (
                  <div key={schedule.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {schedule.brokerage.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {schedule.brokerage}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                            Sync {schedule.frequency}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSchedule(schedule.id)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            schedule.enabled 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {schedule.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {schedule.lastSync && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
                        <span>Last sync: {getTimeAgo(schedule.lastSync)}</span>
                        {schedule.nextSync && <span>Next sync: {schedule.nextSync.toLocaleString()}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationAutomationPage;