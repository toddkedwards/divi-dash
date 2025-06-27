'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Shield, 
  Bell, 
  PieChart,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Activity,
  RefreshCw,
  DollarSign,
  Percent
} from 'lucide-react';
import AdvancedAnalyticsDashboard from '../../components/AdvancedAnalyticsDashboard';
import AlertsPanel from '../../components/AlertsPanel';
import PortfolioCompositionChart from '../../components/PortfolioCompositionChart';

// Mock data for demonstration
const mockHoldings = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 100,
    currentPrice: 175.50,
    marketValue: 17550,
    sector: 'Technology',
    weight: 25.2,
    dayChange: 2.50,
    dayChangePercent: 1.44,
    dividendYield: 0.44,
    marketCap: '2.7T',
    country: 'United States'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 50,
    currentPrice: 380.00,
    marketValue: 19000,
    sector: 'Technology',
    weight: 27.3,
    dayChange: -1.20,
    dayChangePercent: -0.31,
    dividendYield: 0.72,
    marketCap: '2.8T',
    country: 'United States'
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    shares: 75,
    currentPrice: 165.25,
    marketValue: 12394,
    sector: 'Healthcare',
    weight: 17.8,
    dayChange: 0.75,
    dayChangePercent: 0.46,
    dividendYield: 2.92,
    marketCap: '430B',
    country: 'United States'
  },
  {
    symbol: 'KO',
    name: 'The Coca-Cola Company',
    shares: 200,
    currentPrice: 62.10,
    marketValue: 12420,
    sector: 'Consumer Staples',
    weight: 17.8,
    dayChange: 0.30,
    dayChangePercent: 0.49,
    dividendYield: 3.12,
    marketCap: '268B',
    country: 'United States'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 25,
    currentPrice: 875.20,
    marketValue: 21880,
    sector: 'Technology',
    weight: 31.4,
    dayChange: 15.80,
    dayChangePercent: 1.84,
    dividendYield: 0.08,
    marketCap: '2.1T',
    country: 'United States'
  }
];

const totalPortfolioValue = mockHoldings.reduce((sum, holding) => sum + holding.marketValue, 0);

export default function AdvancedFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<'analytics' | 'alerts' | 'composition'>('analytics');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  const features = [
    {
      id: 'analytics' as const,
      title: 'Advanced Analytics',
      description: 'Deep portfolio analysis with risk metrics, performance attribution, and predictive insights',
      icon: BarChart3,
      color: 'blue'
    },
    {
      id: 'alerts' as const,
      title: 'Smart Alerts',
      description: 'Intelligent notifications for price changes, dividend announcements, and portfolio events',
      icon: Bell,
      color: 'yellow'
    },
    {
      id: 'composition' as const,
      title: 'Portfolio Composition',
      description: 'Interactive visualizations showing asset allocation across sectors, geography, and market cap',
      icon: PieChart,
      color: 'green'
    }
  ];

  const stats = [
    {
      label: 'Portfolio Value',
      value: `$${totalPortfolioValue.toLocaleString()}`,
      change: '+2.3%',
      positive: true,
      icon: TrendingUp
    },
    {
      label: 'Risk Score',
      value: '6.2/10',
      change: 'Moderate',
      positive: null,
      icon: Shield
    },
    {
      label: 'Active Alerts',
      value: '3',
      change: '2 unread',
      positive: false,
      icon: Bell
    },
    {
      label: 'Holdings',
      value: mockHoldings.length.toString(),
      change: '5 sectors',
      positive: null,
      icon: Activity
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Features</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Professional-grade portfolio analysis and management tools
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      {stat.change && (
                        <span className={`text-xs ${
                          stat.positive === true ? 'text-green-600' :
                          stat.positive === false ? 'text-red-600' :
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {stat.change}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2 mb-8">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`flex items-center px-6 py-3 rounded-full font-medium text-base transition-colors focus:outline-none ${
                    activeFeature === feature.id
                      ? 'bg-[#232834] text-green-400 shadow border border-green-400'
                      : 'bg-transparent text-gray-400 hover:text-green-300'
                  }`}
                >
                  <feature.icon className="w-5 h-5 mr-2" />
                  {feature.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Content */}
        <div className="space-y-6">
          {activeFeature === 'analytics' && (
            <AdvancedAnalyticsDashboard
              portfolioId="main"
              holdings={mockHoldings}
              className="w-full"
            />
          )}

          {activeFeature === 'alerts' && (
            <div className="w-full">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Alert Management</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Configure and monitor portfolio alerts to stay informed about important changes.
                </p>
                <button 
                  onClick={() => setShowAlertsModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Alert Center
                </button>
              </div>
              
              <AlertsPanel 
                isOpen={showAlertsModal} 
                onClose={() => setShowAlertsModal(false)} 
              />
            </div>
          )}

          {activeFeature === 'composition' && (
            <PortfolioCompositionChart
              holdings={mockHoldings}
              totalValue={totalPortfolioValue}
              className="w-full"
            />
          )}
        </div>

        {/* Feature Benefits */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-4">Why Advanced Features Matter</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-200">Smart Insights</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  AI-powered analysis identifies opportunities and risks you might miss
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-200">Precision Targeting</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Focus on what matters most with customizable alerts and filters
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-200">Real-time Action</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Stay ahead of market movements with instant notifications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export Analysis
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Schedule Report
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Share Insights
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
} 