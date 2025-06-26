'use client';

import React, { useState } from 'react';
import { Users, Heart, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import Card from './Card';

interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  customerSatisfaction: number;
  retentionRate: number;
  churnRate: number;
  supportTickets: {
    open: number;
    resolved: number;
    avgResponseTime: number;
  };
}

export default function CustomerSuccessDashboard() {
  const [metrics] = useState<CustomerMetrics>({
    totalCustomers: 12847,
    activeCustomers: 8932,
    customerSatisfaction: 4.7,
    retentionRate: 89.3,
    churnRate: 3.2,
    supportTickets: {
      open: 23,
      resolved: 156,
      avgResponseTime: 2.4
    }
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Success</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor customer health and satisfaction</p>
        </div>
      </div>

      {/* Customer Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(metrics.totalCustomers)}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">+5.2% this month</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.customerSatisfaction}/5.0
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">Excellent rating</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Retention Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPercentage(metrics.retentionRate)}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Strong retention</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPercentage(metrics.churnRate)}
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Below industry avg</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Support Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Support Performance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.supportTickets.open}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Open Tickets</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.supportTickets.resolved}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Resolved This Month</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.supportTickets.avgResponseTime}h
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
