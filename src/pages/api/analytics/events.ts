import { NextApiRequest, NextApiResponse } from 'next';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

// In-memory storage for demo (use database in production)
let analyticsEvents: AnalyticsEvent[] = [];

// Rate limiting storage
const rateLimits = new Map<string, { count: number; resetTime: number }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const event: AnalyticsEvent = req.body;
      const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      
      // Rate limiting (100 events per minute per IP)
      if (!checkRateLimit(clientIP as string)) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }

      // Validate required fields
      if (!event.event || typeof event.event !== 'string') {
        return res.status(400).json({ error: 'Invalid event data: missing event name' });
      }

      // Sanitize and enrich event data
      const sanitizedEvent: AnalyticsEvent = {
        event: sanitizeString(event.event),
        properties: sanitizeProperties(event.properties || {}),
        userId: event.userId ? sanitizeString(event.userId) : undefined,
        timestamp: event.timestamp || Date.now()
      };

      // Add server-side properties
      sanitizedEvent.properties = {
        ...sanitizedEvent.properties,
        server_timestamp: Date.now(),
        ip_address: hashIP(clientIP as string), // Hash IP for privacy
        user_agent: req.headers['user-agent'],
        referer: req.headers.referer,
      };

      // Store event (limit to last 10,000 events for demo)
      analyticsEvents.push(sanitizedEvent);
      if (analyticsEvents.length > 10000) {
        analyticsEvents = analyticsEvents.slice(-10000);
      }

      // Log important events
      if (isImportantEvent(sanitizedEvent.event)) {
        console.log('Important Analytics Event:', {
          event: sanitizedEvent.event,
          userId: sanitizedEvent.userId,
          timestamp: new Date(sanitizedEvent.timestamp || Date.now()).toISOString(),
          properties: sanitizedEvent.properties
        });
      }

      // Process special events
      await processSpecialEvents(sanitizedEvent);

      res.status(200).json({ 
        success: true, 
        message: 'Event recorded',
        eventId: `${sanitizedEvent.timestamp}-${Math.random().toString(36).substr(2, 9)}`
      });

    } catch (error) {
      console.error('Analytics event processing error:', error);
      res.status(500).json({ error: 'Failed to process analytics event' });
    }
  } else if (req.method === 'GET') {
    try {
      const { 
        event_type, 
        user_id, 
        start_date, 
        end_date, 
        limit = '100' 
      } = req.query;

      let filteredEvents = analyticsEvents;

      // Filter by event type
      if (event_type && typeof event_type === 'string') {
        filteredEvents = filteredEvents.filter(e => 
          e.event.includes(event_type)
        );
      }

      // Filter by user ID
      if (user_id && typeof user_id === 'string') {
        filteredEvents = filteredEvents.filter(e => 
          e.userId === user_id
        );
      }

      // Filter by date range
      if (start_date && typeof start_date === 'string') {
        const startTime = new Date(start_date).getTime();
        filteredEvents = filteredEvents.filter(e => 
          e.timestamp && e.timestamp >= startTime
        );
      }

      if (end_date && typeof end_date === 'string') {
        const endTime = new Date(end_date).getTime();
        filteredEvents = filteredEvents.filter(e => 
          e.timestamp && e.timestamp <= endTime
        );
      }

      // Sort by timestamp (most recent first)
      filteredEvents.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      // Limit results
      const limitNum = parseInt(limit as string, 10) || 100;
      filteredEvents = filteredEvents.slice(0, limitNum);

      // Calculate summary statistics
      const summary = calculateEventSummary(filteredEvents);

      res.status(200).json({
        success: true,
        events: filteredEvents,
        summary,
        totalEvents: analyticsEvents.length,
        filters: { event_type, user_id, start_date, end_date, limit }
      });

    } catch (error) {
      console.error('Analytics data retrieval error:', error);
      res.status(500).json({ error: 'Failed to retrieve analytics data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowSize = 60000; // 1 minute
  const maxRequests = 100;

  const clientLimit = rateLimits.get(ip);
  
  if (!clientLimit || now > clientLimit.resetTime) {
    rateLimits.set(ip, { count: 1, resetTime: now + windowSize });
    return true;
  }

  if (clientLimit.count >= maxRequests) {
    return false;
  }

  clientLimit.count++;
  return true;
}

function sanitizeString(str: string): string {
  return str.replace(/[<>\"'&]/g, '').substring(0, 100);
}

function sanitizeProperties(properties: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(properties)) {
    if (key.length > 50) continue; // Skip very long keys
    
    const sanitizedKey = sanitizeString(key);
    
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value);
    } else if (typeof value === 'number' && isFinite(value)) {
      sanitized[sanitizedKey] = value;
    } else if (typeof value === 'boolean') {
      sanitized[sanitizedKey] = value;
    } else if (value === null || value === undefined) {
      sanitized[sanitizedKey] = value;
    } else {
      // Convert complex objects to strings
      sanitized[sanitizedKey] = sanitizeString(JSON.stringify(value));
    }
  }
  
  return sanitized;
}

function hashIP(ip: string): string {
  // Simple hash for privacy (use proper hashing in production)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

function isImportantEvent(eventName: string): boolean {
  const importantEvents = [
    'user_signup',
    'user_login',
    'conversion',
    'error_occurred',
    'feature_used',
    'portfolio_created',
    'dividend_added',
    'upgrade_purchased'
  ];
  
  return importantEvents.some(important => eventName.includes(important));
}

async function processSpecialEvents(event: AnalyticsEvent) {
  try {
    // Handle conversion events
    if (event.event.includes('conversion')) {
      console.log('Conversion Event:', {
        event: event.event,
        value: event.properties?.value,
        userId: event.userId
      });
      
      // In production, you might:
      // - Send to marketing platforms
      // - Update user metrics
      // - Trigger email sequences
    }

    // Handle error events
    if (event.event.includes('error')) {
      console.error('User Error Event:', {
        error: event.properties?.error_message,
        userId: event.userId,
        url: event.properties?.url
      });
      
      // In production, you might:
      // - Send to error tracking service
      // - Create support tickets
      // - Alert development team
    }

    // Handle engagement events
    if (event.event.includes('engagement')) {
      // Track user engagement metrics
      // Update user activity scores
    }

  } catch (error) {
    console.error('Special event processing failed:', error);
  }
}

function calculateEventSummary(events: AnalyticsEvent[]) {
  if (events.length === 0) {
    return {
      totalEvents: 0,
      uniqueUsers: 0,
      topEvents: [],
      eventsByHour: {},
      userEngagement: {}
    };
  }

  // Count events by type
  const eventCounts = events.reduce((counts, event) => {
    counts[event.event] = (counts[event.event] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Top events
  const topEvents = Object.entries(eventCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([event, count]) => ({ event, count }));

  // Unique users
  const uniqueUsers = new Set(
    events.filter(e => e.userId).map(e => e.userId)
  ).size;

  // Events by hour (last 24 hours)
  const eventsByHour = events.reduce((hourly, event) => {
    if (!event.timestamp) return hourly;
    
    const hour = new Date(event.timestamp).getHours();
    hourly[hour] = (hourly[hour] || 0) + 1;
    return hourly;
  }, {} as Record<number, number>);

  // User engagement metrics
  const userEngagement = events.reduce((engagement, event) => {
    if (!event.userId) return engagement;
    
    if (!engagement[event.userId]) {
      engagement[event.userId] = { events: 0, lastSeen: 0 };
    }
    
    engagement[event.userId].events++;
    if (event.timestamp && event.timestamp > engagement[event.userId].lastSeen) {
      engagement[event.userId].lastSeen = event.timestamp;
    }
    
    return engagement;
  }, {} as Record<string, { events: number; lastSeen: number }>);

  return {
    totalEvents: events.length,
    uniqueUsers,
    topEvents,
    eventsByHour,
    userEngagement: Object.keys(userEngagement).length
  };
} 