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
  Fuel,
  CheckCircle
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
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Holdings Analysis</h3>
                
                {/* Top Performers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Top Performers</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">AAPL</span>
                        <span className="font-medium text-green-600">+24.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">MSFT</span>
                        <span className="font-medium text-green-600">+18.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">NVDA</span>
                        <span className="font-medium text-green-600">+156.8%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Underperformers</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">VZ</span>
                        <span className="font-medium text-red-600">-12.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">T</span>
                        <span className="font-medium text-red-600">-8.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">KO</span>
                        <span className="font-medium text-red-600">-2.1%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Holdings Table */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Detailed Holdings</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Stock</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Shares</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Value</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Weight</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Return</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Yield</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-900 dark:text-white">AAPL</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">50</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(8771.50)}</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">18.0%</td>
                          <td className="py-2 text-sm text-green-600">+24.5%</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">0.5%</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-900 dark:text-white">MSFT</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">30</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(11406.90)}</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">23.4%</td>
                          <td className="py-2 text-sm text-green-600">+18.2%</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">0.8%</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm font-medium text-gray-900 dark:text-white">JNJ</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">75</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(12009.00)}</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">24.6%</td>
                          <td className="py-2 text-sm text-green-600">+12.8%</td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">2.9%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sectors' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sector Allocation</h3>
                
                {/* Sector Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Sector Distribution</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-gray-600 dark:text-gray-300">Technology</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">41.4%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-gray-600 dark:text-gray-300">Healthcare</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">24.6%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-purple-500 rounded"></div>
                          <span className="text-gray-600 dark:text-gray-300">Consumer Staples</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">12.0%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <span className="text-gray-600 dark:text-gray-300">Financials</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">22.0%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Sector Performance</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Technology</span>
                        <span className="font-medium text-green-600">+32.4%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Healthcare</span>
                        <span className="font-medium text-green-600">+8.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Consumer Staples</span>
                        <span className="font-medium text-red-600">-2.1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Financials</span>
                        <span className="font-medium text-green-600">+15.3%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sector Recommendations */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Sector Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Overweight</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Technology, Healthcare</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Neutral</span>
                        <Target className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Financials</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Underweight</span>
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Consumer Staples</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Analysis</h3>
                
                {/* Risk Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Beta</h4>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">0.85</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Less volatile than market</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sharpe Ratio</h4>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">1.18</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Good risk-adjusted returns</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Max Drawdown</h4>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">-8.2%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Last 12 months</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">VaR (95%)</h4>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">-2.1%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Daily value at risk</p>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Risk Factors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Concentration Risk</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Sector Risk</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Currency Risk</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Interest Rate Risk</span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">High</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Risk Recommendations</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Reduce Tech Concentration</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Consider diversifying away from technology sector</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Good Geographic Diversification</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Portfolio is well diversified across regions</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Consider Defensive Stocks</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Add utilities or consumer staples for stability</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Insights</h3>
                
                {/* AI Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Portfolio Insights</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Strong Dividend Growth</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Your portfolio shows consistent dividend growth of 8.2% annually</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Outperforming Benchmark</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Portfolio is beating S&P 500 by 4.3% this year</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Optimal Allocation</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Current sector allocation aligns well with your risk profile</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Market Opportunities</h4>
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Healthcare Sector</span>
                          <span className="text-sm text-green-600">+12.4%</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Consider increasing exposure to healthcare stocks</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">International Exposure</span>
                          <span className="text-sm text-blue-600">+8.7%</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Diversify with international dividend stocks</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Predictions */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">AI Predictions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">$520K</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Portfolio Value (1 Year)</div>
                      <div className="text-sm text-green-600">+6.6% predicted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">$19.8K</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Annual Dividends (1 Year)</div>
                      <div className="text-sm text-green-600">+7.3% predicted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">13.2%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Expected Return (1 Year)</div>
                      <div className="text-sm text-green-600">Above average</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 