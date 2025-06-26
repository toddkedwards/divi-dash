"use client";

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, BarChart3, PieChart, Target, Lightbulb, Settings, Download, Share2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';
import Link from 'next/link';

export default function DashboardPage() {
  const { holdings } = usePortfolio();
  const { 
    priceUpdates, 
    getPortfolioValue, 
    getTotalGainLoss, 
    refreshPrices, 
    isLoading, 
    error,
    lastUpdated 
  } = useRealTimePrices(holdings, 30000); // Refresh every 30 seconds

  // Calculate portfolio totals with real-time data
  const totalValue = getPortfolioValue();
  const { amount: totalGainLoss, percent: gainLossPercent } = getTotalGainLoss();

  // Calculate annual dividend income
  const totalDividends = holdings.reduce((sum, holding) => {
    const priceUpdate = priceUpdates.find(p => p.symbol === holding.symbol);
    const currentPrice = priceUpdate?.currentPrice || holding.currentPrice;
    const annualDividend = (currentPrice * holding.shares * (holding.dividendYield / 100));
    return sum + annualDividend;
  }, 0);

  // Calculate monthly income
  const monthlyIncome = totalDividends / 12;

  // Get next dividend payment
  const nextDividend = holdings
    .filter(h => h.nextPaymentDate)
    .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())[0];

  // Sector breakdown
  const sectorBreakdown = holdings.reduce((acc, holding) => {
    const sector = holding.sector || 'Unknown';
    const priceUpdate = priceUpdates.find(p => p.symbol === holding.symbol);
    const currentPrice = priceUpdate?.currentPrice || holding.currentPrice;
    const value = holding.shares * currentPrice;
    
    acc[sector] = (acc[sector] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
            </p>
          </div>
          <button
            onClick={refreshPrices}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gain/Loss</p>
                <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalGainLoss)}
                </p>
                <p className={`text-sm ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(gainLossPercent)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                {totalGainLoss >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Dividends</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalDividends)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {totalValue > 0 ? `${((totalDividends / totalValue) * 100).toFixed(2)}% yield` : '0% yield'}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(monthlyIncome)}</p>
                {nextDividend && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Next: {new Date(nextDividend.nextPaymentDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/portfolio-insights" className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <BarChart3 className="w-5 h-5 text-emerald-600 mr-3" />
            <span className="font-medium text-gray-900 dark:text-white">Portfolio Analytics</span>
          </Link>
          
          <Link href="/dividend-calendar" className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Calendar className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium text-gray-900 dark:text-white">Dividend Calendar</span>
          </Link>
          
          <Link href="/portfolio-goals" className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Target className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium text-gray-900 dark:text-white">Goal Planning</span>
          </Link>
          
          <Link href="/ai-recommendations" className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Lightbulb className="w-5 h-5 text-yellow-600 mr-3" />
            <span className="font-medium text-gray-900 dark:text-white">AI Recommendations</span>
          </Link>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Holdings Table */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Holdings</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {holdings.length} positions • Real-time updates
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shares</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gain/Loss</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Yield</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {holdings.map((holding) => {
                      const priceUpdate = priceUpdates.find(p => p.symbol === holding.symbol);
                      const currentPrice = priceUpdate?.currentPrice || holding.currentPrice;
                      const value = holding.shares * currentPrice;
                      const gainLoss = (currentPrice - holding.avgPrice) * holding.shares;
                      const gainLossPercent = ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                      const annualIncome = value * (holding.dividendYield / 100);

                      return (
                        <tr key={holding.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{holding.symbol}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{holding.sector}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {holding.shares.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(gainLoss)}
                            </div>
                            <div className={`text-xs ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPercent(gainLossPercent)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{holding.dividendYield.toFixed(2)}%</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(annualIncome)}/yr</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sector Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sector Allocation</h3>
              <div className="space-y-3">
                {Object.entries(sectorBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .map(([sector, value]) => {
                    const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
                    return (
                      <div key={sector}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{sector}</span>
                          <span className="text-gray-900 dark:text-white font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
