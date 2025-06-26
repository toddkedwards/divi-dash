"use client";

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function DashboardPage() {
  const { holdings, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Portfolio Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your dividend investments and portfolio performance
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Holdings Summary
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Number of holdings: {holdings.length}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Total value: ${holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
