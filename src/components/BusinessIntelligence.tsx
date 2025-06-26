'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  BarChart3, 
  PieChart, 
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Card from './Card';
import Button from './Button';

interface BusinessMetrics {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  monthlyRevenue: number;
  conversionRate: number;
  churnRate: number;
  averageRevenuePerUser: number;
  lifetimeValue: number;
}

interface SubscriptionData {
  free: number;
  pro: number;
  premium: number;
  total: number;
}

interface GrowthMetrics {
  userGrowth: number;
  revenueGrowth: number;
  engagementGrowth: number;
  retentionRate: number;
}

export default function BusinessIntelligence() {
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    totalUsers: 12847,
    activeUsers: 8932,
    newSignups: 342,
    monthlyRevenue: 45680,
    conversionRate: 12.4,
    churnRate: 3.2,
    averageRevenuePerUser: 5.12,
    lifetimeValue: 89.50
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionData>({
    free: 8456,
    pro: 3721,
    premium: 670,
    total: 12847
  });

  const [growth, setGrowth] = useState<GrowthMetrics>({
    userGrowth: 23.5,
    revenueGrowth: 34.2,
    engagementGrowth: 18.7,
    retentionRate: 89.3
  });

  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [loading, setLoading] = useState(false);

  // Simulate data loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeframe]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Intelligence</h1>
          <p className="text-gray-600 dark:text-gray-400">Analytics and insights for business growth</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as 'week' | 'month' | 'quarter')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>
          
          <Button onClick={() => window.print()} variant="outline">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(metrics.totalUsers)}
              </p>
              <div className={`flex items-center mt-1 ${getGrowthColor(growth.userGrowth)}`}>
                {getGrowthIcon(growth.userGrowth)}
                <span className="text-sm font-medium ml-1">
                  {formatPercentage(growth.userGrowth)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        {/* Monthly Revenue */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.monthlyRevenue)}
              </p>
              <div className={`flex items-center mt-1 ${getGrowthColor(growth.revenueGrowth)}`}>
                {getGrowthIcon(growth.revenueGrowth)}
                <span className="text-sm font-medium ml-1">
                  {formatPercentage(growth.revenueGrowth)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        {/* Conversion Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPercentage(metrics.conversionRate)}
              </p>
              <div className={`flex items-center mt-1 ${getGrowthColor(growth.engagementGrowth)}`}>
                {getGrowthIcon(growth.engagementGrowth)}
                <span className="text-sm font-medium ml-1">
                  {formatPercentage(growth.engagementGrowth)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        {/* Active Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(metrics.activeUsers)}
              </p>
              <div className={`flex items-center mt-1 ${getGrowthColor(growth.retentionRate)}`}>
                <Activity className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium ml-1 text-orange-600">
                  {formatPercentage(growth.retentionRate)} retention
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">New Signups</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(metrics.newSignups)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">This {timeframe}</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">ARPU</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(metrics.averageRevenuePerUser)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Average Revenue Per User</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">LTV</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(metrics.lifetimeValue)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Lifetime Value</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Churn Rate</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPercentage(metrics.churnRate)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Monthly churn</p>
          </div>
        </Card>
      </div>

      {/* Subscription Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Subscription Distribution
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                <span className="text-gray-600 dark:text-gray-400">Free</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(subscriptions.free)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPercentage((subscriptions.free / subscriptions.total) * 100)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-600 dark:text-gray-400">Pro</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(subscriptions.pro)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPercentage((subscriptions.pro / subscriptions.total) * 100)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-600 dark:text-gray-400">Premium</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(subscriptions.premium)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPercentage((subscriptions.premium / subscriptions.total) * 100)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Key Performance Indicators
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Monthly Recurring Revenue</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(metrics.monthlyRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Annual Run Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(metrics.monthlyRevenue * 12)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Paid Conversion Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatPercentage(((subscriptions.pro + subscriptions.premium) / subscriptions.total) * 100)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Premium Upgrade Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatPercentage((subscriptions.premium / (subscriptions.pro + subscriptions.premium)) * 100)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Business Development Action Items
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Increase Conversion</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Optimize onboarding flow to improve free-to-paid conversion rate above 15%
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Reduce Churn</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Implement user engagement campaigns to reduce churn below 3%
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Premium Growth</h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Develop premium features to increase premium subscriber base by 25%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 