"use client";

import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import NewsSection from '../../components/NewsSection';
import Card from '../../components/Card';
import { 
  Newspaper, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  AlertTriangle,
  Clock,
  Filter,
  Bell,
  Settings,
  Brain,
  Shield,
  Activity,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardTab {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const DASHBOARD_TABS: DashboardTab[] = [
  {
    id: 'overview',
    name: 'Market Intelligence',
    icon: Brain,
    description: 'AI-powered market analysis and sentiment intelligence'
  },
  {
    id: 'dividends',
    name: 'Dividend Intelligence',
    icon: Shield,
    description: 'Advanced dividend safety alerts and risk analysis'
  },
  {
    id: 'portfolio',
    name: 'Portfolio Intelligence',
    icon: Activity,
    description: 'Personalized news and impact analysis for your holdings'
  },
  {
    id: 'alerts',
    name: 'Smart Alerts',
    icon: Zap,
    description: 'Configure intelligent news alerts and notifications'
  }
];

interface NewsAlert {
  id: string;
  type: 'keyword' | 'symbol' | 'sentiment';
  value: string;
  enabled: boolean;
  lastTriggered?: Date;
}

export default function NewsDashboardPage() {
  const { holdings } = usePortfolio();
  const [activeTab, setActiveTab] = useState('overview');
  const [newsAlerts, setNewsAlerts] = useState<NewsAlert[]>([]);
  const [newAlert, setNewAlert] = useState({
    type: 'keyword' as const,
    value: ''
  });

  // Load saved alerts from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('newsAlerts');
    if (savedAlerts) {
      setNewsAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('newsAlerts', JSON.stringify(newsAlerts));
  }, [newsAlerts]);

  const addAlert = () => {
    if (!newAlert.value.trim()) return;
    
    const alert: NewsAlert = {
      id: Math.random().toString(36).substr(2, 9),
      type: newAlert.type,
      value: newAlert.value.trim(),
      enabled: true
    };
    
    setNewsAlerts(prev => [...prev, alert]);
    setNewAlert({ type: 'keyword', value: '' });
  };

  const toggleAlert = (id: string) => {
    setNewsAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
      )
    );
  };

  const removeAlert = (id: string) => {
    setNewsAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <NewsSection 
            showDividendOnly={false}
            className="w-full"
            enhancedMode={true}
          />
        );
        
      case 'dividends':
        return (
          <NewsSection 
            showDividendOnly={true}
            selectedSymbols={holdings.map(h => h.symbol)}
            className="w-full"
            enhancedMode={true}
          />
        );
        
      case 'portfolio':
        return holdings.length > 0 ? (
          <NewsSection 
            selectedSymbols={holdings.map(h => h.symbol)}
            showDividendOnly={false}
            className="w-full"
            enhancedMode={true}
          />
        ) : (
          <Card className="p-8 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Holdings Found</h3>
            <p className="text-gray-600 mb-4">
              Add some stocks to your portfolio to see personalized news intelligence.
            </p>
            <a
              href="/positions"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Holdings
            </a>
          </Card>
        );
        
      case 'alerts':
        return (
          <div className="space-y-6">
            {/* Enhanced Alert Configuration for Phase 2 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Smart News Alert Configuration
              </h3>
              
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <Brain className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">AI-Powered Intelligence</span>
                </div>
                <p className="text-sm text-blue-600">
                  Our enhanced alert system uses AI to analyze sentiment, detect dividend risks, 
                  and identify market-moving news before it impacts your portfolio.
                </p>
              </div>
              
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Alert Type</label>
                    <select
                      value={newAlert.type}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="keyword">Keyword</option>
                      <option value="symbol">Stock Symbol</option>
                      <option value="sentiment">Sentiment Change</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {newAlert.type === 'keyword' ? 'Keyword' : 
                       newAlert.type === 'symbol' ? 'Symbol' : 'Sentiment Threshold'}
                    </label>
                    <input
                      type="text"
                      value={newAlert.value}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, value: e.target.value }))}
                      placeholder={
                        newAlert.type === 'keyword' ? 'e.g., dividend increase' :
                        newAlert.type === 'symbol' ? 'e.g., AAPL' : 'e.g., -0.5'
                      }
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={addAlert}
                      disabled={!newAlert.value.trim()}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Smart Alert
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Alerts */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Active Alerts ({newsAlerts.filter(alert => alert.enabled).length})
                </h4>
                
                {newsAlerts.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No alerts configured yet.</p>
                    <p className="text-sm">Add your first smart alert above to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newsAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          alert.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            alert.enabled ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium text-sm">
                              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}: {alert.value}
                            </p>
                            {alert.lastTriggered && (
                              <p className="text-xs text-gray-500">
                                Last triggered: {alert.lastTriggered.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleAlert(alert.id)}
                            className={`px-3 py-1 text-xs rounded transition-colors ${
                              alert.enabled 
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {alert.enabled ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => removeAlert(alert.id)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Enhanced Alert Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4">
                <div className="flex items-center">
                  <Bell className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{newsAlerts.length}</p>
                    <p className="text-sm text-gray-600">Total Alerts</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center">
                  <Zap className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{newsAlerts.filter(a => a.enabled).length}</p>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">
                      {newsAlerts.filter(a => a.lastTriggered).length}
                    </p>
                    <p className="text-sm text-gray-600">Recently Triggered</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Brain className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                News Intelligence Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered news analysis, sentiment intelligence, and dividend safety monitoring
              </p>
            </div>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center">
                <Brain className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">AI Sentiment Analysis</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Dividend Safety Alerts</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Market Impact Analysis</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">Real-time Intelligence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {DASHBOARD_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-2" />
                      {tab.name}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Tab Description */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {DASHBOARD_TABS.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 