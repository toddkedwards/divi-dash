'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import Card from './Card';

interface RevenueMetrics {
  monthlyRevenue: number;
  annualRevenue: number;
  conversionRate: number;
  averageRevenuePerUser: number;
  subscriptionBreakdown: {
    free: number;
    pro: number;
    premium: number;
  };
}

export default function RevenueAnalytics() {
  const [metrics] = useState<RevenueMetrics>({
    monthlyRevenue: 45680,
    annualRevenue: 548160,
    conversionRate: 12.4,
    averageRevenuePerUser: 5.12,
    subscriptionBreakdown: {
      free: 8456,
      pro: 3721,
      premium: 670
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const totalUsers = metrics.subscriptionBreakdown.free + 
                     metrics.subscriptionBreakdown.pro + 
                     metrics.subscriptionBreakdown.premium;

  const paidUsers = metrics.subscriptionBreakdown.pro + metrics.subscriptionBreakdown.premium;
  const paidConversionRate = (paidUsers / totalUsers) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Track subscription performance and growth</p>
        </div>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.monthlyRevenue)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">+34.2% vs last month</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Run Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.annualRevenue)}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Projected annual revenue</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPercentage(paidConversionRate)}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Free to paid conversion</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ARPU</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.averageRevenuePerUser)}
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Average Revenue Per User</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
