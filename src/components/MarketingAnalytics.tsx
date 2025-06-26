'use client';

import React, { useState } from 'react';
import { BarChart3, Eye, MousePointer, Share2 } from 'lucide-react';
import Card from './Card';

interface MarketingMetrics {
  websiteVisitors: number;
  conversionRate: number;
  costPerAcquisition: number;
  organicTraffic: number;
  socialEngagement: number;
  emailClickRate: number;
}

export default function MarketingAnalytics() {
  const [metrics] = useState<MarketingMetrics>({
    websiteVisitors: 45238,
    conversionRate: 3.4,
    costPerAcquisition: 12.50,
    organicTraffic: 67.2,
    socialEngagement: 8.9,
    emailClickRate: 24.1
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Track marketing performance and ROI</p>
        </div>
      </div>

      {/* Marketing Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Website Visitors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(metrics.websiteVisitors)}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">+15.3% this month</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPercentage(metrics.conversionRate)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">Above industry avg</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <MousePointer className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cost per Acquisition</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.costPerAcquisition)}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Efficient spend</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Organic Traffic</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPercentage(metrics.organicTraffic)}
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Strong SEO performance</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Share2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Channel Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Channel Performance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Social Media</h4>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatPercentage(metrics.socialEngagement)}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Engagement Rate</p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Email Marketing</h4>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatPercentage(metrics.emailClickRate)}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">Click-through Rate</p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Content Marketing</h4>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatNumber(12450)}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300">Monthly Blog Views</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
