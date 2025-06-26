import { NextApiRequest, NextApiResponse } from 'next';

interface PerformanceMetric {
  timestamp: number;
  url: string;
  userAgent: string;
  performanceScore: number;
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  appLoadTime?: number;
  routeChangeTime?: number;
  apiResponseTime?: number;
  cacheHitRate?: number;
  offlineUsage?: number;
  connection?: string;
  deviceMemory?: number;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
}

// In-memory storage for demo (use database in production)
let performanceMetrics: PerformanceMetric[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const metric: PerformanceMetric = req.body;
      
      // Validate required fields
      if (!metric.timestamp || !metric.performanceScore) {
        return res.status(400).json({ error: 'Invalid metric data' });
      }

      // Store metric (limit to last 1000 entries for demo)
      performanceMetrics.push(metric);
      if (performanceMetrics.length > 1000) {
        performanceMetrics = performanceMetrics.slice(-1000);
      }

      // Log performance alerts for critical issues
      if (metric.performanceScore < 50) {
        console.warn('Poor performance detected:', {
          score: metric.performanceScore,
          url: metric.url,
          deviceType: metric.deviceType,
          timestamp: new Date(metric.timestamp).toISOString(),
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Performance metric recorded',
        metricsCount: performanceMetrics.length 
      });

    } catch (error) {
      console.error('Performance metric processing error:', error);
      res.status(500).json({ error: 'Failed to process performance metric' });
    }
  } else if (req.method === 'GET') {
    try {
      // Return aggregated performance data
      const { period = '24h', deviceType, url } = req.query;
      
      // Filter metrics based on query parameters
      let filteredMetrics = performanceMetrics;
      
      // Time filter
      const now = Date.now();
      const periodMs = period === '1h' ? 3600000 : 
                      period === '24h' ? 86400000 : 
                      period === '7d' ? 604800000 : 86400000;
      
      filteredMetrics = filteredMetrics.filter(m => 
        now - m.timestamp <= periodMs
      );

      // Device type filter
      if (deviceType && typeof deviceType === 'string') {
        filteredMetrics = filteredMetrics.filter(m => 
          m.deviceType === deviceType
        );
      }

      // URL filter
      if (url && typeof url === 'string') {
        filteredMetrics = filteredMetrics.filter(m => 
          m.url === url
        );
      }

      // Calculate aggregated metrics
      const aggregated = calculateAggregatedMetrics(filteredMetrics);
      
      res.status(200).json({
        success: true,
        period,
        filters: { deviceType, url },
        totalSamples: filteredMetrics.length,
        aggregated,
        recent: filteredMetrics.slice(-10) // Last 10 samples
      });

    } catch (error) {
      console.error('Performance data retrieval error:', error);
      res.status(500).json({ error: 'Failed to retrieve performance data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function calculateAggregatedMetrics(metrics: PerformanceMetric[]) {
  if (metrics.length === 0) {
    return {
      averageScore: 0,
      scoreDistribution: { excellent: 0, good: 0, poor: 0 },
      coreWebVitals: {},
      deviceBreakdown: {},
      connectionBreakdown: {},
    };
  }

  // Average performance score
  const averageScore = metrics.reduce((sum, m) => sum + m.performanceScore, 0) / metrics.length;

  // Score distribution
  const scoreDistribution = metrics.reduce((dist, m) => {
    if (m.performanceScore >= 90) dist.excellent++;
    else if (m.performanceScore >= 70) dist.good++;
    else dist.poor++;
    return dist;
  }, { excellent: 0, good: 0, poor: 0 });

  // Core Web Vitals averages
  const coreWebVitals = {
    fcp: calculateAverage(metrics, 'fcp'),
    lcp: calculateAverage(metrics, 'lcp'),
    fid: calculateAverage(metrics, 'fid'),
    cls: calculateAverage(metrics, 'cls'),
    ttfb: calculateAverage(metrics, 'ttfb'),
  };

  // Device type breakdown
  const deviceBreakdown = metrics.reduce((breakdown, m) => {
    if (m.deviceType) {
      breakdown[m.deviceType] = (breakdown[m.deviceType] || 0) + 1;
    }
    return breakdown;
  }, {} as Record<string, number>);

  // Connection quality breakdown
  const connectionBreakdown = metrics.reduce((breakdown, m) => {
    if (m.connection) {
      breakdown[m.connection] = (breakdown[m.connection] || 0) + 1;
    }
    return breakdown;
  }, {} as Record<string, number>);

  // Performance trends (last 10 samples)
  const recentMetrics = metrics.slice(-10);
  const trend = recentMetrics.length >= 2 ? 
    (recentMetrics[recentMetrics.length - 1].performanceScore - recentMetrics[0].performanceScore) / recentMetrics.length :
    0;

  return {
    averageScore: Math.round(averageScore),
    scoreDistribution,
    coreWebVitals,
    deviceBreakdown,
    connectionBreakdown,
    trend: Math.round(trend * 100) / 100,
    customMetrics: {
      averageLoadTime: calculateAverage(metrics, 'appLoadTime'),
      averageRouteChange: calculateAverage(metrics, 'routeChangeTime'),
      averageApiResponse: calculateAverage(metrics, 'apiResponseTime'),
      averageCacheHitRate: calculateAverage(metrics, 'cacheHitRate'),
    }
  };
}

function calculateAverage(metrics: PerformanceMetric[], field: keyof PerformanceMetric): number | null {
  const values = metrics
    .map(m => m[field])
    .filter((val): val is number => typeof val === 'number');
  
  if (values.length === 0) return null;
  
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.round(average * 100) / 100;
} 