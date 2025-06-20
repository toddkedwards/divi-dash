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
  Settings
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
    name: 'Market Overview',
    icon: BarChart3,
    description: 'General market news and sentiment analysis'
  },
  {
    id: 'dividends',
    name: 'Dividend Focus',
    icon: DollarSign,
    description: 'Dividend announcements, cuts, and increases'
  },
  {
    id: 'portfolio',
    name: 'My Portfolio',
    icon: TrendingUp,
    description: 'News specific to your holdings'
  },
  {
    id: 'alerts',
    name: 'Alert Setup',
    icon: Bell,
    description: 'Configure news alerts and notifications'
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
          />
        );
        
      case 'dividends':
        return (
          <NewsSection 
            showDividendOnly={true}
            selectedSymbols={holdings.map(h => h.symbol)}
            className="w-full"
          />
        );
        
      case 'portfolio':
        return holdings.length > 0 ? (
          <NewsSection 
            selectedSymbols={holdings.map(h => h.symbol)}
            showDividendOnly={false}
            className="w-full"
          />
        ) : (
          <Card className="p-8 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Holdings Found</h3>
            <p className="text-gray-600 mb-4">
              Add some stocks to your portfolio to see personalized news.
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
            {/* Alert Configuration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configure News Alerts
              </h3>
              
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
                      Add Alert
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Keyword alerts:</strong> Get notified when news contains specific terms</p>
                  <p><strong>Symbol alerts:</strong> Track news for specific stocks</p>
                  <p><strong>Sentiment alerts:</strong> Alert when sentiment drops below threshold (-1 to 1)</p>
                </div>
              </div>
              
              {/* Active Alerts */}
              <div>
                <h4 className="font-medium mb-3">Active Alerts ({newsAlerts.filter(a => a.enabled).length})</h4>
                {newsAlerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No alerts configured yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newsAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 border rounded-lg flex items-center justify-between ${
                          alert.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            alert.enabled ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <div>
                            <div className="font-medium">
                              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}: {alert.value}
                            </div>
                            {alert.lastTriggered && (
                              <div className="text-xs text-gray-500">
                                Last triggered: {alert.lastTriggered.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAlert(alert.id)}
                            className={`px-3 py-1 text-sm rounded ${
                              alert.enabled 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'bg-gray-600 text-white hover:bg-gray-700'
                            }`}
                          >
                            {alert.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                          <button
                            onClick={() => removeAlert(alert.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
            
            {/* Alert Tips */}
            <Card className="p-6">
              <h4 className="font-medium mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Alert Tips
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Use keyword alerts for terms like "dividend increase", "earnings beat", or "acquisition"</p>
                <p>• Set symbol alerts for stocks you don't own but want to monitor</p>
                <p>• Sentiment alerts help catch sudden negative news about your holdings</p>
                <p>• Alerts are checked every 15 minutes during market hours</p>
              </div>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Newspaper className="w-8 h-8 mr-3 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              News & Sentiment Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Stay informed with AI-powered news analysis and sentiment tracking for dividend investing.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {DASHBOARD_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{tab.name}</div>
                    <div className="text-xs opacity-75 hidden lg:block">
                      {tab.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Portfolio Holdings</div>
                <div className="text-2xl font-bold">{holdings.length}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</div>
                <div className="text-2xl font-bold">{newsAlerts.filter(a => a.enabled).length}</div>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Last Updated</div>
                <div className="text-sm font-medium">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">News Sources</div>
                <div className="text-2xl font-bold">12+</div>
              </div>
              <Newspaper className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
} 