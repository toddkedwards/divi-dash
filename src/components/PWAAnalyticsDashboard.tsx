"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, Shield, Smartphone, Wifi, AlertTriangle, TrendingUp, 
  Clock, Zap, Target, Users, Globe, Download 
} from 'lucide-react';
import { usePerformanceMonitor } from '../lib/performanceMonitor';

interface PerformanceData {
  averageScore: number;
  scoreDistribution: { excellent: number; good: number; poor: number };
  coreWebVitals: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  };
  deviceBreakdown: Record<string, number>;
  connectionBreakdown: Record<string, number>;
  trend: number;
  customMetrics: {
    averageLoadTime?: number;
    averageRouteChange?: number;
    averageApiResponse?: number;
    averageCacheHitRate?: number;
  };
}

interface CriticalEvent {
  metric: string;
  value: number;
  timestamp: number;
  url: string;
  severity: 'info' | 'warning' | 'critical';
  timeAgo: string;
}

export default function PWAAnalyticsDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [criticalEvents, setCriticalEvents] = useState<CriticalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { getPerformanceSummary } = usePerformanceMonitor();

  useEffect(() => {
    fetchAnalyticsData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAnalyticsData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [selectedPeriod, autoRefresh]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch performance analytics
      const [performanceResponse, criticalResponse] = await Promise.all([
        fetch(`/api/analytics/performance?period=${selectedPeriod}`),
        fetch('/api/analytics/critical-performance?limit=10')
      ]);

      if (performanceResponse.ok) {
        const perfData = await performanceResponse.json();
        setPerformanceData(perfData.aggregated);
      }

      if (criticalResponse.ok) {
        const criticalData = await criticalResponse.json();
        setCriticalEvents(criticalData.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-50';
      case 'warning': return 'text-yellow-500 bg-yellow-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };

  const formatMetric = (value: number | null | undefined, unit: string = 'ms') => {
    if (value === null || value === undefined) return 'N/A';
    return `${Math.round(value)}${unit}`;
  };

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (isLoading && !performanceData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Activity className="w-6 h-6 mr-2" />
          PWA Performance Analytics
        </h2>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Auto Refresh
          </button>
          
          <button
            onClick={fetchAnalyticsData}
            disabled={isLoading}
            className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Performance Score Overview */}
      {performanceData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border-2 ${getScoreBackground(performanceData.averageScore)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(performanceData.averageScore)}`}>
                  {performanceData.averageScore}/100
                </p>
              </div>
              <Target className={`w-8 h-8 ${getScoreColor(performanceData.averageScore)}`} />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className={performanceData.trend >= 0 ? 'text-green-600' : 'text-red-600'}>
                {performanceData.trend >= 0 ? '+' : ''}{performanceData.trend} trend
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Load Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatMetric(performanceData.customMetrics.averageLoadTime)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatMetric(performanceData.customMetrics.averageCacheHitRate, '%')}
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Response</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatMetric(performanceData.customMetrics.averageApiResponse)}
                </p>
              </div>
              <Globe className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      )}

      {/* Core Web Vitals */}
      {performanceData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Core Web Vitals
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">FCP</p>
              <p className="text-xl font-bold">{formatMetric(performanceData.coreWebVitals.fcp)}</p>
              <p className="text-xs text-gray-500">First Contentful Paint</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">LCP</p>
              <p className="text-xl font-bold">{formatMetric(performanceData.coreWebVitals.lcp)}</p>
              <p className="text-xs text-gray-500">Largest Contentful Paint</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">FID</p>
              <p className="text-xl font-bold">{formatMetric(performanceData.coreWebVitals.fid)}</p>
              <p className="text-xs text-gray-500">First Input Delay</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">CLS</p>
              <p className="text-xl font-bold">{formatMetric(performanceData.coreWebVitals.cls, '')}</p>
              <p className="text-xs text-gray-500">Cumulative Layout Shift</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">TTFB</p>
              <p className="text-xl font-bold">{formatMetric(performanceData.coreWebVitals.ttfb)}</p>
              <p className="text-xs text-gray-500">Time to First Byte</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Distribution & Device Breakdown */}
      {performanceData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Distribution
            </h3>
            
            <div className="space-y-3">
              {Object.entries(performanceData.scoreDistribution).map(([level, count]) => {
                const total = Object.values(performanceData.scoreDistribution).reduce((a, b) => a + b, 0);
                const percentage = calculatePercentage(count, total);
                const color = level === 'excellent' ? 'green' : level === 'good' ? 'yellow' : 'red';
                
                return (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
                      <span className="capitalize font-medium">{level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count} samples</span>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Device Breakdown
            </h3>
            
            <div className="space-y-3">
              {Object.entries(performanceData.deviceBreakdown).map(([device, count]) => {
                const total = Object.values(performanceData.deviceBreakdown).reduce((a, b) => a + b, 0);
                const percentage = calculatePercentage(count, total);
                
                return (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <span className="capitalize font-medium">{device}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count} users</span>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Critical Events */}
      {criticalEvents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Recent Critical Events
          </h3>
          
          <div className="space-y-3">
            {criticalEvents.slice(0, 5).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(event.severity)}`}>
                    {event.severity.toUpperCase()}
                  </span>
                  <div>
                    <p className="font-medium">{event.metric.toUpperCase()}: {event.value}ms</p>
                    <p className="text-sm text-gray-600">{event.url}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{event.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Optimization Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Cache Optimization</h4>
            <p className="text-sm text-blue-700">
              Implement aggressive caching strategies for static assets and API responses to improve load times.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Image Optimization</h4>
            <p className="text-sm text-green-700">
              Use next-gen image formats (WebP, AVIF) and implement lazy loading for better LCP scores.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Code Splitting</h4>
            <p className="text-sm text-purple-700">
              Implement route-based code splitting to reduce initial bundle size and improve FCP.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Preload Critical Resources</h4>
            <p className="text-sm text-yellow-700">
              Preload critical fonts, CSS, and above-the-fold images to improve perceived performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 