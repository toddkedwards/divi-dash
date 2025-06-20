'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Clock, 
  Settings, 
  TrendingUp, 
  Database, 
  Bell,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Activity,
  Calendar,
  DollarSign
} from 'lucide-react';
import BrokerageIntegration from '@/components/BrokerageIntegration';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  executionCount: number;
}

interface SyncSchedule {
  id: string;
  name: string;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  lastSync: Date;
  nextSync: Date;
  status: 'active' | 'paused' | 'error';
  accounts: string[];
}

const IntegrationAutomationPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'brokerages' | 'automation' | 'schedules'>('overview');
  const [loading, setLoading] = useState(false);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [syncSchedules, setSyncSchedules] = useState<SyncSchedule[]>([]);

  useEffect(() => {
    loadAutomationData();
  }, []);

  const loadAutomationData = async () => {
    setLoading(true);
    
    // Simulate loading automation rules and schedules
    setTimeout(() => {
      setAutomationRules([
        {
          id: '1',
          name: 'Dividend Reinvestment',
          description: 'Automatically reinvest dividends when received',
          trigger: 'Dividend payment received',
          action: 'Purchase additional shares',
          isActive: true,
          lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
          nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          executionCount: 12
        },
        {
          id: '2',
          name: 'Portfolio Rebalancing',
          description: 'Rebalance portfolio monthly to target allocation',
          trigger: 'Monthly schedule',
          action: 'Adjust position sizes',
          isActive: true,
          lastRun: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          executionCount: 6
        },
        {
          id: '3',
          name: 'Risk Alert',
          description: 'Send alert when portfolio risk exceeds threshold',
          trigger: 'Risk score > 0.8',
          action: 'Send email notification',
          isActive: false,
          lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          executionCount: 3
        }
      ]);

      setSyncSchedules([
        {
          id: '1',
          name: 'All Accounts Sync',
          frequency: 'hourly',
          lastSync: new Date(Date.now() - 30 * 60 * 1000),
          nextSync: new Date(Date.now() + 30 * 60 * 1000),
          status: 'active',
          accounts: ['Robinhood', 'Fidelity']
        },
        {
          id: '2',
          name: 'Market Data Update',
          frequency: 'realtime',
          lastSync: new Date(Date.now() - 2 * 60 * 1000),
          nextSync: new Date(Date.now() + 1 * 60 * 1000),
          status: 'active',
          accounts: ['All']
        },
        {
          id: '3',
          name: 'Portfolio Analysis',
          frequency: 'daily',
          lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000),
          nextSync: new Date(Date.now() + 20 * 60 * 60 * 1000),
          status: 'active',
          accounts: ['All']
        }
      ]);

      setLoading(false);
    }, 1000);
  };

  const getFrequencyDisplay = (frequency: string) => {
    const frequencies = {
      'realtime': 'Real-time',
      'hourly': 'Every hour',
      'daily': 'Daily',
      'weekly': 'Weekly'
    };
    return frequencies[frequency as keyof typeof frequencies] || frequency;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'text-green-600 bg-green-100 dark:bg-green-900/20',
      'paused': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      'error': 'text-red-600 bg-red-100 dark:bg-red-900/20'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
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

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 0) return 'Overdue';
    if (diffMins < 60) return `in ${diffMins}m`;
    return `in ${diffHours}h`;
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, isActive: !rule.isActive }
          : rule
      )
    );
  };

  const toggleSyncSchedule = (scheduleId: string) => {
    setSyncSchedules(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId 
          ? { 
              ...schedule, 
              status: schedule.status === 'active' ? 'paused' : 'active' 
            }
          : schedule
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Zap className="h-8 w-8 text-blue-500" />
            Integration & Automation
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Connect your accounts and automate your investment workflows
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'brokerages', label: 'Brokerage Accounts', icon: Shield },
              { id: 'automation', label: 'Automation Rules', icon: Zap },
              { id: 'schedules', label: 'Sync Schedules', icon: Clock }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Connected Accounts
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">2</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active connections
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Active Rules
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {automationRules.filter(r => r.isActive).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Automation rules
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Sync Schedules
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {syncSchedules.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Running schedules
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Last Sync
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">2m</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Minutes ago
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  {
                    type: 'sync',
                    message: 'Portfolio data synchronized from Robinhood',
                    time: '2 minutes ago',
                    status: 'success'
                  },
                  {
                    type: 'automation',
                    message: 'Dividend reinvestment rule executed for AAPL',
                    time: '1 hour ago',
                    status: 'success'
                  },
                  {
                    type: 'sync',
                    message: 'Market data updated for all holdings',
                    time: '15 minutes ago',
                    status: 'success'
                  },
                  {
                    type: 'error',
                    message: 'Failed to sync Fidelity account - token expired',
                    time: '3 hours ago',
                    status: 'error'
                  }
                ].map((activity, index) => (
                  <div key={index} className="p-4 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                    <div className={`p-1 rounded ${
                      activity.status === 'success' 
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                        : 'text-red-600 bg-red-100 dark:bg-red-900/20'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedTab('brokerages')}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Shield className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Connect Account
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Add a new brokerage account
                  </p>
                </button>

                <button
                  onClick={() => setSelectedTab('automation')}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Zap className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Create Rule
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Set up automation rules
                  </p>
                </button>

                <button
                  onClick={() => setSelectedTab('schedules')}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Clock className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Manage Schedules
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Configure sync schedules
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Brokerage Accounts Tab */}
        {selectedTab === 'brokerages' && (
          <BrokerageIntegration userId="demo-user-123" />
        )}

        {/* Automation Rules Tab */}
        {selectedTab === 'automation' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Automation Rules
              </h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Rule
              </button>
            </div>

            <div className="grid gap-6">
              {automationRules.map(rule => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        rule.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {rule.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => toggleAutomationRule(rule.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                        rule.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {rule.isActive ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                      {rule.isActive ? 'Active' : 'Paused'}
                    </button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {rule.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Trigger</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {rule.trigger}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Action</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {rule.action}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Executions</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {rule.executionCount}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Last Run</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {rule.lastRun ? getTimeAgo(rule.lastRun) : 'Never'}
                      </div>
                    </div>
                  </div>

                  {rule.nextRun && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          Next run scheduled {getTimeUntil(rule.nextRun)}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Sync Schedules Tab */}
        {selectedTab === 'schedules' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sync Schedules
              </h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                New Schedule
              </button>
            </div>

            <div className="grid gap-6">
              {syncSchedules.map(schedule => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {schedule.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                      </span>
                      <button
                        onClick={() => toggleSyncSchedule(schedule.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {schedule.status === 'active' ? (
                          <Pause className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Play className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Frequency</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {getFrequencyDisplay(schedule.frequency)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Last Sync</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {getTimeAgo(schedule.lastSync)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Next Sync</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {getTimeUntil(schedule.nextSync)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Accounts</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {schedule.accounts.join(', ')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationAutomationPage;