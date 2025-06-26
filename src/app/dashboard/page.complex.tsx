"use client";

import React from 'react';
import PortfolioSelector from '@/components/PortfolioSelector';
import MonthlyIncomeChart from '../../components/MonthlyIncomeChart';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';

export default function DashboardPage() {
  const { holdings } = usePortfolio();
  const { priceUpdates } = useRealTimePrices(holdings);

  // Calculate portfolio totals
  const totalValue = holdings.reduce((sum, holding) => {
    const currentPrice = priceUpdates.find(p => p.symbol === holding.symbol)?.currentPrice || holding.currentPrice;
    return sum + (holding.shares * currentPrice);
  }, 0);

  // Calculate annual dividend income
  const totalDividends = holdings.reduce((sum, holding) => {
    const currentPrice = priceUpdates.find(p => p.symbol === holding.symbol)?.currentPrice || holding.currentPrice;
    const annualDividend = (currentPrice * holding.shares * (holding.dividendYield / 100));
    return sum + annualDividend;
  }, 0);

  const totalGainLoss = holdings.reduce((sum, holding) => {
    const currentPrice = priceUpdates.find(p => p.symbol === holding.symbol)?.currentPrice || holding.currentPrice;
    const currentValue = holding.shares * currentPrice;
    const costBasis = holding.costBasis;
    return sum + (currentValue - costBasis);
  }, 0);

  const totalGainLossPercentage = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Portfolio Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your dividend investments and portfolio performance
            </p>
          </div>
          <PortfolioSelector />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Dividends</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalDividends.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gain/Loss</p>
                <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalGainLoss.toLocaleString()}
                </p>
              </div>
              {totalGainLoss >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gain/Loss %</p>
                <p className={`text-2xl font-bold ${totalGainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalGainLossPercentage.toFixed(2)}%
                </p>
              </div>
              {totalGainLossPercentage >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <MonthlyIncomeChart holdings={holdings} />
        </div>
      </div>
    </div>
  );
}
