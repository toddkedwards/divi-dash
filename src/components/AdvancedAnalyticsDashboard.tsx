'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Zap,
  Eye,
  Activity
} from 'lucide-react';
import AdvancedAnalyticsService, { 
  AdvancedAnalytics, 
  RiskMetrics, 
  DiversificationMetrics,
  PerformanceMetrics,
  SectorAllocation,
  PortfolioInsight
} from '../utils/advancedAnalyticsService';

interface AdvancedAnalyticsDashboardProps {
  portfolioId: string;
  holdings: any[];
  className?: string;
}

export default function AdvancedAnalyticsDashboard({ 
  portfolioId, 
  holdings, 
  className = '' 
}: AdvancedAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'performance' | 'sectors' | 'insights'>('overview');
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('3M');
  const [analyticsService] = useState(() => AdvancedAnalyticsService.getInstance());

  useEffect(() => {
    loadAnalytics();
  }, [portfolioId, holdings]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.calculatePortfolioAnalytics(portfolioId, holdings);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInsightIcon = (type: PortfolioInsight['type']) => {
    switch (type) {
      case 'opportunity': return <Target className="w-4 h-4 text-blue-600" />;
      case 'risk': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'rebalance': return <BarChart3 className="w-4 h-4 text-yellow-600" />;
      case 'dividend': return <TrendingUp className="w-4 h-4 text-green-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatPercentage = (value: number, decimals = 2) => {
    return `${(value * 100).toFixed(decimals)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-lg text-gray-600">Analyzing portfolio...</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-8 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Unavailable</h3>
          <p className="text-gray-600">Unable to load portfolio analytics. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Advanced Analytics</h2>
            <p className="text-sm text-gray-600">
              Last updated: {analytics.lastUpdated.toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
              <option value="1Y">1 Year</option>
              <option value="ALL">All Time</option>
            </select>
            
            <button
              onClick={loadAnalytics}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh analytics"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'risk', label: 'Risk Analysis', icon: Shield },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'sectors', label: 'Sectors', icon: PieChart },
              { id: 'insights', label: 'Insights', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Expected Return</p>
                    <p className="text-xl font-bold text-blue-900">
                      {formatPercentage(analytics.riskMetrics.expectedReturn)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Sharpe Ratio</p>
                    <p className="text-xl font-bold text-green-900">
                      {analytics.riskMetrics.sharpeRatio.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700">Diversification</p>
                    <p className="text-xl font-bold text-purple-900">
                      {formatPercentage(analytics.diversificationMetrics.sectorConcentration)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-700">Volatility</p>
                    <p className="text-xl font-bold text-orange-900">
                      {formatPercentage(analytics.riskMetrics.volatility)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Portfolio Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Risk Profile</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Beta</span>
                      <span className="text-sm font-medium">{analytics.riskMetrics.beta.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Drawdown</span>
                      <span className="text-sm font-medium text-red-600">
                        {formatPercentage(analytics.riskMetrics.maxDrawdown)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Value at Risk</span>
                      <span className="text-sm font-medium text-red-600">
                        {formatPercentage(analytics.riskMetrics.valueAtRisk)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Income Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dividend Yield</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatPercentage(analytics.performanceMetrics.dividendYield)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Growth Rate</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatPercentage(analytics.performanceMetrics.dividendGrowthRate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Return</span>
                      <span className={`text-sm font-medium ${
                        analytics.performanceMetrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(analytics.performanceMetrics.totalReturn)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Metrics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Metrics</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Portfolio Beta', value: analytics.riskMetrics.beta, format: 'number', desc: 'Market sensitivity' },
                    { label: 'Sharpe Ratio', value: analytics.riskMetrics.sharpeRatio, format: 'number', desc: 'Risk-adjusted return' },
                    { label: 'Volatility', value: analytics.riskMetrics.volatility, format: 'percentage', desc: 'Price volatility' },
                    { label: 'Max Drawdown', value: analytics.riskMetrics.maxDrawdown, format: 'percentage', desc: 'Largest peak-to-trough decline' },
                    { label: 'Value at Risk (95%)', value: analytics.riskMetrics.valueAtRisk, format: 'percentage', desc: 'Potential 1-day loss' }
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium text-gray-900">{metric.label}</p>
                        <p className="text-xs text-gray-600">{metric.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {metric.format === 'percentage' 
                            ? formatPercentage(metric.value)
                            : metric.value.toFixed(2)
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diversification Metrics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Diversification Analysis</h3>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Sector Concentration', 
                      value: analytics.diversificationMetrics.sectorConcentration, 
                      desc: 'Sector diversification score'
                    },
                    { 
                      label: 'Geographic Diversification', 
                      value: analytics.diversificationMetrics.geographicDiversification, 
                      desc: 'Geographic spread'
                    },
                    { 
                      label: 'Market Cap Diversification', 
                      value: analytics.diversificationMetrics.marketCapDiversification, 
                      desc: 'Size diversification'
                    },
                    { 
                      label: 'Correlation Score', 
                      value: analytics.diversificationMetrics.correlationScore, 
                      desc: 'Average correlation between holdings'
                    }
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium text-gray-900">{metric.label}</p>
                        <p className="text-xs text-gray-600">{metric.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPercentage(metric.value)}
                        </p>
                        {/* Progress bar */}
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(metric.value * 100, 100)}%` }}
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

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Total Return</h4>
                <p className={`text-2xl font-bold ${
                  analytics.performanceMetrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(analytics.performanceMetrics.totalReturn)}
                </p>
                <p className="text-sm text-gray-600">Period return</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Annualized Return</h4>
                <p className={`text-2xl font-bold ${
                  analytics.performanceMetrics.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(analytics.performanceMetrics.annualizedReturn)}
                </p>
                <p className="text-sm text-gray-600">Yearly equivalent</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">vs Benchmark</h4>
                <p className={`text-2xl font-bold ${
                  analytics.performanceMetrics.benchmarkComparison >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analytics.performanceMetrics.benchmarkComparison >= 0 ? '+' : ''}
                  {formatPercentage(analytics.performanceMetrics.benchmarkComparison)}
                </p>
                <p className="text-sm text-gray-600">vs S&P 500</p>
              </div>
            </div>

            {/* Quarterly Performance */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quarterly Performance</h3>
              <div className="grid grid-cols-4 gap-4">
                {analytics.performanceMetrics.quarterlyReturns.map((return_, index) => (
                  <div key={index} className="text-center">
                    <p className="text-sm text-gray-600">Q{index + 1}</p>
                    <p className={`text-lg font-bold ${return_ >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(return_)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sectors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sector Allocation */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sector Allocation</h3>
                <div className="space-y-3">
                  {analytics.sectorAllocations.map((sector) => (
                    <div key={sector.sector} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{sector.sector}</p>
                          <p className="text-sm font-medium">{formatPercentage(sector.allocation)}</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${sector.allocation * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-600">
                            {sector.companies.length} companies
                          </p>
                          <p className={`text-xs font-medium ${
                            sector.performance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {sector.performance >= 0 ? '+' : ''}{formatPercentage(sector.performance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sector Performance */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sector Risk Analysis</h3>
                <div className="space-y-3">
                  {analytics.sectorAllocations.map((sector) => (
                    <div key={`risk-${sector.sector}`} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium text-gray-900">{sector.sector}</p>
                        <p className="text-xs text-gray-600">Risk Score: {sector.riskScore.toFixed(1)}/10</p>
                      </div>
                      <div className="text-right">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              sector.riskScore <= 3 ? 'bg-green-500' :
                              sector.riskScore <= 6 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(sector.riskScore / 10) * 100}%` }}
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

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Portfolio Insights</h3>
              <span className="text-sm text-gray-600">{analytics.insights.length} insights</span>
            </div>

            <div className="space-y-3">
              {analytics.insights.map((insight) => (
                <div 
                  key={insight.id}
                  className={`border rounded-lg p-4 ${
                    insight.impact === 'high' ? 'border-red-200 bg-red-50' :
                    insight.impact === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 rounded-lg bg-white border">
                        {getInsightIcon(insight.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {insight.impact} impact
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{insight.description}</p>
                        
                        {insight.recommendation && (
                          <div className="bg-white rounded p-3 border border-gray-200">
                            <p className="text-sm text-gray-700">
                              <strong>Recommendation:</strong> {insight.recommendation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      <div className={`w-2 h-2 rounded-full ${
                        insight.impact === 'high' ? 'bg-red-500' :
                        insight.impact === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <span className="text-xs text-gray-500">Priority: {insight.priority}</span>
                    </div>
                  </div>
                </div>
              ))}

              {analytics.insights.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio Looking Good!</h3>
                  <p className="text-gray-600">No major insights or recommendations at this time.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 