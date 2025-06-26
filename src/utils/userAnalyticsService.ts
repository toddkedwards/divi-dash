// User Analytics Service for tracking user behavior and application performance
import { Holding } from '@/types/holding';

interface UserEvent {
  eventName: string;
  userId?: string;
  timestamp: Date;
  properties: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
}

class UserAnalyticsService {
  private static instance: UserAnalyticsService;
  private events: UserEvent[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private isEnabled: boolean = true;
  private userId?: string;

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): UserAnalyticsService {
    if (!UserAnalyticsService.instance) {
      UserAnalyticsService.instance = new UserAnalyticsService();
    }
    return UserAnalyticsService.instance;
  }

  setUserId(userId: string): void {
    this.userId = userId;
    this.trackEvent('user_identified', { userId });
  }

  trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    const event: UserEvent = {
      eventName,
      userId: this.userId,
      timestamp: new Date(),
      properties
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  trackPageView(page: string): void {
    this.trackEvent('page_view', { page });
  }

  trackFeatureUsage(feature: string, context: Record<string, any> = {}): void {
    this.trackEvent('feature_used', { feature, ...context });
  }

  trackConversion(type: string, value?: number): void {
    this.trackEvent('conversion', { type, value });
  }

  trackError(error: Error, context: Record<string, any> = {}): void {
    this.trackEvent('error', {
      message: error.message,
      name: error.name,
      ...context
    });
  }

  trackPerformance(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date()
    };

    this.performanceMetrics.push(metric);
    this.trackEvent('performance_metric', { name, value });
  }

  getAnalyticsSummary(): Record<string, any> {
    return {
      eventCount: this.events.length,
      topEvents: this.getTopEvents(),
      userId: this.userId,
      isEnabled: this.isEnabled
    };
  }

  private getTopEvents(): Array<{ event: string; count: number }> {
    const eventCounts = this.events.reduce((acc, event) => {
      acc[event.eventName] = (acc[event.eventName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([event, count]) => ({ event, count }));
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Track clicks on buttons and links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        this.trackEvent('click', {
          element: target.tagName,
          text: target.textContent?.slice(0, 50)
        });
      }
    });
  }

  private sendToAnalytics(event: UserEvent): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics:', event);
    }

    // Store in localStorage (replace with actual analytics service)
    try {
      const stored = localStorage.getItem('divi_dash_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      if (events.length > 50) {
        events.splice(0, events.length - 50);
      }
      
      localStorage.setItem('divi_dash_analytics', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics:', error);
    }
  }

  // Portfolio-specific methods
  trackHoldingAdded(symbol: string): void {
    this.trackEvent('holding_added', { symbol });
  }

  trackDividendCalculation(): void {
    this.trackFeatureUsage('dividend_calculator');
  }

  // Privacy controls
  enableAnalytics(): void {
    this.isEnabled = true;
  }

  disableAnalytics(): void {
    this.isEnabled = false;
  }

  clearData(): void {
    this.events = [];
    this.performanceMetrics = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('divi_dash_analytics');
    }
  }
}

export default UserAnalyticsService.getInstance();