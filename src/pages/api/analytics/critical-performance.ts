import { NextApiRequest, NextApiResponse } from 'next';

interface CriticalPerformanceEvent {
  metric: string;
  value: number;
  timestamp: number;
  url: string;
  critical: boolean;
  userAgent?: string;
  deviceType?: string;
  connection?: string;
}

// In-memory storage for critical events (use database in production)
let criticalEvents: CriticalPerformanceEvent[] = [];

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
      const event: CriticalPerformanceEvent = req.body;
      
      // Validate required fields
      if (!event.metric || !event.value || !event.timestamp) {
        return res.status(400).json({ error: 'Invalid critical event data' });
      }

      // Store critical event
      criticalEvents.push(event);
      
      // Keep only last 100 critical events
      if (criticalEvents.length > 100) {
        criticalEvents = criticalEvents.slice(-100);
      }

      // Determine severity level
      const severity = getSeverityLevel(event.metric, event.value);
      
      // Log based on severity
      const logData = {
        metric: event.metric,
        value: event.value,
        severity,
        url: event.url,
        timestamp: new Date(event.timestamp).toISOString(),
        deviceType: event.deviceType,
        connection: event.connection,
      };

      if (severity === 'critical') {
        console.error('CRITICAL Performance Issue:', logData);
        
        // In production, you might want to:
        // - Send to monitoring service (DataDog, NewRelic, etc.)
        // - Trigger alerts
        // - Send notifications to dev team
        
      } else if (severity === 'warning') {
        console.warn('Performance Warning:', logData);
      } else {
        console.info('Performance Alert:', logData);
      }

      res.status(200).json({ 
        success: true, 
        severity,
        message: `Critical ${event.metric} event recorded`,
        eventsCount: criticalEvents.length 
      });

    } catch (error) {
      console.error('Critical performance event processing error:', error);
      res.status(500).json({ error: 'Failed to process critical performance event' });
    }
  } else if (req.method === 'GET') {
    try {
      const { limit = '20', severity, metric } = req.query;
      
      let filteredEvents = criticalEvents;
      
      // Filter by metric if specified
      if (metric && typeof metric === 'string') {
        filteredEvents = filteredEvents.filter(e => e.metric === metric);
      }
      
      // Filter by severity if specified
      if (severity && typeof severity === 'string') {
        filteredEvents = filteredEvents.filter(e => 
          getSeverityLevel(e.metric, e.value) === severity
        );
      }
      
      // Sort by timestamp (most recent first)
      filteredEvents.sort((a, b) => b.timestamp - a.timestamp);
      
      // Limit results
      const limitNum = parseInt(limit as string, 10) || 20;
      filteredEvents = filteredEvents.slice(0, limitNum);
      
      // Add severity to each event
      const eventsWithSeverity = filteredEvents.map(event => ({
        ...event,
        severity: getSeverityLevel(event.metric, event.value),
        timeAgo: getTimeAgo(event.timestamp),
      }));

      // Calculate summary statistics
      const summary = calculateCriticalEventsSummary(criticalEvents);

      res.status(200).json({
        success: true,
        events: eventsWithSeverity,
        summary,
        totalEvents: criticalEvents.length,
        filters: { limit, severity, metric },
      });

    } catch (error) {
      console.error('Critical events retrieval error:', error);
      res.status(500).json({ error: 'Failed to retrieve critical events' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function getSeverityLevel(metric: string, value: number): 'info' | 'warning' | 'critical' {
  const thresholds = {
    fcp: { warning: 3000, critical: 4500 },      // First Contentful Paint
    lcp: { warning: 4000, critical: 6000 },      // Largest Contentful Paint
    fid: { warning: 300, critical: 500 },        // First Input Delay
    cls: { warning: 0.25, critical: 0.5 },       // Cumulative Layout Shift
    ttfb: { warning: 1800, critical: 3000 },     // Time to First Byte
  };

  const threshold = thresholds[metric as keyof typeof thresholds];
  if (!threshold) return 'info';

  if (value >= threshold.critical) return 'critical';
  if (value >= threshold.warning) return 'warning';
  return 'info';
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

function calculateCriticalEventsSummary(events: CriticalPerformanceEvent[]) {
  if (events.length === 0) {
    return {
      total: 0,
      last24h: 0,
      bySeverity: { critical: 0, warning: 0, info: 0 },
      byMetric: {},
      topProblematicUrls: [],
    };
  }

  const now = Date.now();
  const last24h = events.filter(e => now - e.timestamp <= 86400000);

  // Count by severity
  const bySeverity = events.reduce((counts, event) => {
    const severity = getSeverityLevel(event.metric, event.value);
    counts[severity]++;
    return counts;
  }, { critical: 0, warning: 0, info: 0 });

  // Count by metric
  const byMetric = events.reduce((counts, event) => {
    counts[event.metric] = (counts[event.metric] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Find most problematic URLs
  const urlCounts = events.reduce((counts, event) => {
    counts[event.url] = (counts[event.url] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const topProblematicUrls = Object.entries(urlCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([url, count]) => ({ url, count }));

  return {
    total: events.length,
    last24h: last24h.length,
    bySeverity,
    byMetric,
    topProblematicUrls,
  };
} 