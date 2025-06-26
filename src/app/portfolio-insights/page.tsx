"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Shield,
  Cpu,
  Heart,
  ShoppingCart,
  Banknote,
  Home,
  Filter,
  RefreshCw,
  Download,
  Share2,
  Eye,
  Settings,
  Briefcase,
  Zap,
  Fuel
} from "lucide-react";

export default function PortfolioInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1Y');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading portfolio insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Portfolio Insights</h1>
            <p className="text-gray-600 dark:text-gray-300">Advanced analytics and insights for your dividend portfolio</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
              <option value="1Y">1 Year</option>
              <option value="3Y">3 Years</option>
              <option value="ALL">All Time</option>
            </select>
            
            <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Value</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(487650)}</div>
            <div className="flex items-center text-sm mt-1">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">{formatPercent(16.05)}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">({formatCurrency(67420)})</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Annual Dividend Income</h3>
              <Percent className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(18450)}</div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-purple-600 font-medium">3.78% yield</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Annualized Return</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatPercent(12.34)}</div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-blue-600 font-medium">Sharpe: 1.18</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Diversification Score</h3>
              <Shield className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">85/100</div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-indigo-600 font-medium">Well Diversified</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'holdings', label: 'Holdings Analysis', icon: Briefcase },
                { id: 'sectors', label: 'Sector Allocation', icon: PieChart },
                { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
                { id: 'insights', label: 'AI Insights', icon: Lightbulb }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 rounded-t-lg
                    ${activeTab === tab.id
                      ? 'border-green-500 text-green-500 dark:text-green-400 dark:border-green-400 bg-gray-100 dark:bg-gray-900'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-400 bg-transparent'}
                  `}
                  style={{ minWidth: 160 }}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Total Return</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatPercent(16.05)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Annualized Return</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatPercent(12.34)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Volatility</span>
                        <span className="font-medium text-gray-900 dark:text-white">14.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Sharpe Ratio</span>
                        <span className="font-medium text-gray-900 dark:text-white">1.18</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dividend Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Current Yield</span>
                        <span className="font-medium text-gray-900 dark:text-white">3.78%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Annual Income</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(18450)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Monthly Income</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(1537)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Dividend Growth (1Y)</span>
                        <span className="font-medium text-green-600">+8.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'holdings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Holdings Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">Detailed analysis of your portfolio holdings will be displayed here.</p>
              </div>
            )}

            {activeTab === 'sectors' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sector Allocation</h3>
                <p className="text-gray-600 dark:text-gray-300">Sector allocation analysis will be displayed here.</p>
              </div>
            )}

            {activeTab === 'risk' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">Risk analysis metrics will be displayed here.</p>
              </div>
            )}

            {activeTab === 'insights' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Insights</h3>
                <p className="text-gray-600 dark:text-gray-300">AI-powered insights will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 