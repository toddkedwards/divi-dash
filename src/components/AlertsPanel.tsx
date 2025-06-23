'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  AlertTriangle,
  Info,
  XCircle,
  Target,
  Activity,
  BarChart3,
  DollarSign,
  TrendingUp,
  X,
  RefreshCw,
  Settings
} from 'lucide-react';
import alertsService, { Alert, AlertRule } from '../utils/alertsService';

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertsPanel({ isOpen, onClose }: AlertsPanelProps) {
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('alerts');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, showUnreadOnly]);

  const loadData = () => {
    const alertData = alertsService.getAlerts({ unreadOnly: showUnreadOnly, limit: 50 });
    const ruleData = alertsService.getRules();
    setAlerts(alertData);
    setRules(ruleData);
  };

  const handleMarkAsRead = (alertId: string) => {
    alertsService.markAsRead(alertId);
    loadData();
  };

  const handleMarkAllAsRead = () => {
    alertsService.markAllAsRead();
    loadData();
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'dividend': return <DollarSign className="h-4 w-4" />;
      case 'price': return <Target className="h-4 w-4" />;
      case 'news': return <Activity className="h-4 w-4" />;
      case 'rebalance': return <BarChart3 className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellRing className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Alert Center</h2>
                <p className="text-blue-100">Portfolio monitoring & notifications</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadData}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-lg transition-colors \${
                activeTab === 'alerts' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Alerts ({alerts.filter(a => !a.isRead).length})
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-lg transition-colors \${
                activeTab === 'rules' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Rules ({rules.filter(r => r.isActive).length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'alerts' && (
            <div className="h-full flex flex-col">
              {/* Controls */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showUnreadOnly}
                      onChange={(e) => setShowUnreadOnly(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Unread only</span>
                  </label>
                </div>
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              </div>

              {/* Alerts List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No alerts to display</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border \${getSeverityColor(alert.severity)} \${
                        !alert.isRead ? 'border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex items-center space-x-2">
                            {getSeverityIcon(alert.severity)}
                            {getTypeIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{alert.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{alert.timestamp.toLocaleString()}</span>
                              {alert.symbol && <span>Symbol: {alert.symbol}</span>}
                              <span className="capitalize">{alert.severity}</span>
                            </div>
                          </div>
                        </div>
                        {!alert.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(alert.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Alert Rules</h3>
                <p className="text-sm text-gray-600">Manage your automated alert conditions</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {rules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No alert rules configured</p>
                  </div>
                ) : (
                  rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{rule.name}</h4>
                          <p className="text-sm text-gray-600 mt-1 capitalize">{rule.type} alert</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Created: {rule.createdAt.toLocaleDateString()}</span>
                            <span>Triggered: {rule.triggeredCount} times</span>
                            {rule.lastTriggered && (
                              <span>Last: {rule.lastTriggered.toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full \${
                            rule.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
