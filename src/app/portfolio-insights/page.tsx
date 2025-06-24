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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Insights</h1>
            <p className="text-gray-600">Advanced analytics and insights for your dividend portfolio</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
              <option value="1Y">1 Year</option>
              <option value="3Y">3 Years</option>
              <option value="ALL">All Time</option>
            </select>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(487650)}</div>
            <div className="flex items-center text-sm mt-1">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">{formatPercent(16.05)}</span>
              <span className="text-gray-500 ml-1">({formatCurrency(67420)})</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Annual Dividend Income</h3>
              <Percent className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(18450)}</div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-purple-600 font-medium">3.78% yield</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Annualized Return</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatPercent(12.34)}</div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-blue-600 font-medium">Sharpe: 1.18</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Diversification Score</h3>
              <Shield className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">85/100</div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-indigo-600 font-medium">Well Diversified</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
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
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-green-600' : ''}`} />
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Return</span>
                        <span className="font-medium">{formatPercent(16.05)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Annualized Return</span>
                        <span className="font-medium">{formatPercent(12.34)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Volatility</span>
                        <span className="font-medium">14.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Sharpe Ratio</span>
                        <span className="font-medium">1.18</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Maximum Drawdown</span>
                        <span className="font-medium text-red-600">-8.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Beta</span>
                        <span className="font-medium">0.92</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Alpha</span>
                        <span className="font-medium text-green-600">+2.1%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dividend Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Yield</span>
                        <span className="font-medium">3.78%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Annual Income</span>
                        <span className="font-medium">{formatCurrency(18450)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Income</span>
                        <span className="font-medium">{formatCurrency(1537)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Dividend Growth (1Y)</span>
                        <span className="font-medium text-green-600">+8.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg Payout Ratio</span>
                        <span className="font-medium">45.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Dividend Aristocrats</span>
                        <span className="font-medium">12 holdings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'holdings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Holdings Analysis</h3>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>All Holdings</option>
                      <option>Top Performers</option>
                      <option>Underperformers</option>
                      <option>High Yield</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Symbol</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Shares</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Value</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Weight</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Gain/Loss</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Yield</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">P/E</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          symbol: 'AAPL',
                          name: 'Apple Inc.',
                          shares: 150,
                          value: 27780,
                          weight: 5.7,
                          gain: 2955,
                          gainPercent: 11.9,
                          yield: 0.52,
                          pe: 24.8
                        },
                        {
                          symbol: 'JNJ',
                          name: 'Johnson & Johnson',
                          shares: 200,
                          value: 33280,
                          weight: 6.8,
                          gain: 1530,
                          gainPercent: 4.8,
                          yield: 2.95,
                          pe: 15.2
                        },
                        {
                          symbol: 'KO',
                          name: 'The Coca-Cola Company',
                          shares: 400,
                          value: 23920,
                          weight: 4.9,
                          gain: 3000,
                          gainPercent: 14.3,
                          yield: 3.12,
                          pe: 23.5
                        },
                        {
                          symbol: 'MSFT',
                          name: 'Microsoft Corporation',
                          shares: 100,
                          value: 36520,
                          weight: 7.5,
                          gain: 4475,
                          gainPercent: 14.0,
                          yield: 0.75,
                          pe: 28.1
                        },
                        {
                          symbol: 'PG',
                          name: 'Procter & Gamble Co.',
                          shares: 180,
                          value: 28044,
                          weight: 5.8,
                          gain: 2448,
                          gainPercent: 9.6,
                          yield: 2.42,
                          pe: 24.6
                        }
                      ].map((holding) => (
                        <tr key={holding.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{holding.symbol}</div>
                              <div className="text-sm text-gray-500">{holding.name}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{holding.shares.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(holding.value)}</td>
                          <td className="py-3 px-4 text-right text-gray-900">{holding.weight.toFixed(1)}%</td>
                          <td className="py-3 px-4 text-right">
                            <div className={holding.gain >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(holding.gain)}
                            </div>
                            <div className={`text-sm ${holding.gainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPercent(holding.gainPercent)}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900">{holding.yield.toFixed(2)}%</td>
                          <td className="py-3 px-4 text-right text-gray-900">{holding.pe.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'sectors' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Sector Allocation</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-4">Allocation by Sector</h4>
                    <div className="space-y-3">
                      {[
                        { sector: 'Technology', value: 64300, weight: 13.2, holdings: 2, avgYield: 0.64, icon: Cpu },
                        { sector: 'Healthcare', value: 55680, weight: 11.4, holdings: 3, avgYield: 2.85, icon: Heart },
                        { sector: 'Consumer Staples', value: 51964, weight: 10.7, holdings: 2, avgYield: 2.77, icon: ShoppingCart },
                        { sector: 'Financials', value: 48920, weight: 10.0, holdings: 4, avgYield: 3.42, icon: Banknote },
                        { sector: 'Real Estate', value: 42150, weight: 8.6, holdings: 3, avgYield: 4.65, icon: Home }
                      ].map((sector) => (
                        <div key={sector.sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <sector.icon className="w-5 h-5 text-blue-500" />
                            <div>
                              <div className="font-medium text-gray-900">{sector.sector}</div>
                              <div className="text-sm text-gray-500">{sector.holdings} holdings</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{formatCurrency(sector.value)}</div>
                            <div className="text-sm text-gray-500">{sector.weight.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-4">Sector Yield Analysis</h4>
                    <div className="space-y-3">
                      {[
                        { sector: 'Real Estate', avgYield: 4.65, icon: Home },
                        { sector: 'Utilities', avgYield: 4.12, icon: Zap },
                        { sector: 'Energy', avgYield: 3.85, icon: Fuel },
                        { sector: 'Financials', avgYield: 3.42, icon: Banknote },
                        { sector: 'Healthcare', avgYield: 2.85, icon: Heart }
                      ].map((sector) => (
                        <div key={sector.sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <sector.icon className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-900">{sector.sector}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{sector.avgYield.toFixed(2)}%</span>
                            <div className="w-16 h-2 bg-purple-200 rounded">
                              <div 
                                className="h-2 bg-green-600 rounded"
                                style={{ width: `${(sector.avgYield / 6) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Analysis</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    {
                      name: 'Portfolio Volatility',
                      value: 14.2,
                      score: 'Medium',
                      description: 'Measures price fluctuation over time',
                      recommendation: 'Consider adding more defensive stocks to reduce volatility'
                    },
                    {
                      name: 'Concentration Risk',
                      value: 25.8,
                      score: 'Medium',
                      description: 'Risk from over-concentration in specific holdings',
                      recommendation: 'Top 5 holdings represent 30% of portfolio - consider diversifying'
                    },
                    {
                      name: 'Sector Concentration',
                      value: 18.3,
                      score: 'Low',
                      description: 'Risk from sector over-concentration',
                      recommendation: 'Good sector diversification across 11 sectors'
                    },
                    {
                      name: 'Dividend Sustainability',
                      value: 8.7,
                      score: 'Low',
                      description: 'Risk of dividend cuts across holdings',
                      recommendation: 'Strong dividend coverage with average payout ratio of 45%'
                    }
                  ].map((metric, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{metric.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          metric.score === 'Low' ? 'text-green-600 bg-green-100' :
                          metric.score === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
                          'text-red-600 bg-red-100'
                        }`}>
                          {metric.score} Risk
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {metric.value.toFixed(1)}%
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{metric.description}</p>
                      <div className="bg-white rounded p-3 border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700">{metric.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>All Insights</option>
                      <option>Opportunities</option>
                      <option>Warnings</option>
                      <option>Recommendations</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      type: 'opportunity',
                      title: 'Underweight International Exposure',
                      description: 'Your portfolio has only 12% international exposure. Consider increasing to 20-30% for better diversification.',
                      impact: 'Medium',
                      actionable: true,
                      category: 'diversification'
                    },
                    {
                      type: 'achievement',
                      title: 'Strong Dividend Growth',
                      description: 'Your portfolio has achieved 8.2% dividend growth over the past year, outperforming the S&P 500.',
                      impact: 'High',
                      actionable: false,
                      category: 'income'
                    },
                    {
                      type: 'warning',
                      title: 'High Correlation in Tech Holdings',
                      description: 'AAPL and MSFT show 0.78 correlation. Consider diversifying within technology sector.',
                      impact: 'Medium',
                      actionable: true,
                      category: 'risk'
                    },
                    {
                      type: 'recommendation',
                      title: 'Consider Rebalancing',
                      description: 'Technology sector has grown to 13.2% (target: 10%). Consider taking profits and rebalancing.',
                      impact: 'Medium',
                      actionable: true,
                      category: 'performance'
                    }
                  ].map((insight, index) => (
                    <div key={index} className={`border rounded-lg p-6 ${
                      insight.type === 'opportunity' ? 'bg-yellow-50 border-yellow-200' :
                      insight.type === 'warning' ? 'bg-red-50 border-red-200' :
                      insight.type === 'achievement' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {insight.type === 'opportunity' && <Lightbulb className="w-5 h-5 text-yellow-500" />}
                          {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                          {insight.type === 'achievement' && <Award className="w-5 h-5 text-green-500" />}
                          {insight.type === 'recommendation' && <Target className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{insight.title}</h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                insight.impact === 'High' ? 'bg-red-100 text-red-800' :
                                insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {insight.impact} Impact
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium capitalize">
                                {insight.category}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{insight.description}</p>
                          {insight.actionable && (
                            <button className="text-sm bg-white px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors">
                              Take Action
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 