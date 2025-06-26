// Analytics system for Divly - Phase 2 Production Optimizations
import { performanceMonitor } from './performanceMonitor';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

interface UserProperties {
  userId: string;
  email?: string;
  plan?: 'free' | 'pro' | 'premium';
  signupDate?: string;
  lastActive?: string;
  portfolioValue?: number;
  dividendIncome?: number;
  holdingsCount?: number;
  deviceType?: string;
  country?: string;
}

class AnalyticsService {
  private isInitialized = false;
  private userId: string | null = null;
  private sessionId: string;
  private eventQueue: AnalyticsEvent[] = [];
  private isOnline = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    
    if (typeof window !== 'undefined') {
      this.initializeBrowserFeatures();
    }
  }

  async initialize(config?: { userId?: string; enableDebug?: boolean }) {
    if (this.isInitialized) return;

    this.userId = config?.userId || null;
    this.isInitialized = true;

    // Initialize third-party analytics
    await this.initializeGoogleAnalytics();
    await this.initializeMixpanel();
    
    // Process any queued events
    this.processEventQueue();
    
    // Track initial page view
    this.trackPageView();
    
    // Set up automatic tracking
    this.setupAutoTracking();

    console.log('Divly Analytics initialized');
  }

  private async initializeGoogleAnalytics() {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!GA_MEASUREMENT_ID) return;

    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      (window as any).gtag = gtag;

      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: 'user_plan',
          custom_parameter_2: 'portfolio_value'
        }
      });

      console.log('Google Analytics initialized');
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  private async initializeMixpanel() {
    if (typeof window === 'undefined') return;

    const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    if (!MIXPANEL_TOKEN) return;

    try {
      // Mixpanel would be initialized here in production
      console.log('Mixpanel ready for initialization');
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error);
    }
  }

  private initializeBrowserFeatures() {
    // Online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processEventQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', {
          timeOnPage: performance.now(),
          sessionId: this.sessionId
        });
      } else {
        this.track('page_visible', {
          sessionId: this.sessionId
        });
      }
    });

    // Unload tracking
    window.addEventListener('beforeunload', () => {
      this.track('page_unload', {
        timeOnPage: performance.now(),
        sessionId: this.sessionId
      });
      this.flush();
    });
  }

  private setupAutoTracking() {
    // Track route changes in Next.js
    if (typeof window !== 'undefined') {
      // Track browser navigation for SPAs
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      const self = this;

      history.pushState = function(...args: [data: any, unused: string, url?: string | URL | null]) {
        originalPushState.apply(history, args);
        setTimeout(() => self.trackPageView(), 100);
      };

      history.replaceState = function(...args: [data: any, unused: string, url?: string | URL | null]) {
        originalReplaceState.apply(history, args);
        setTimeout(() => self.trackPageView(), 100);
      };

      // Track clicks on external links
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const link = target.closest('a');
        
        if (link && link.href && !link.href.startsWith(window.location.origin)) {
          this.track('external_link_click', {
            url: link.href,
            text: link.textContent,
            sessionId: this.sessionId
          });
        }
      });
    }
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Core tracking methods
  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        userId: this.userId
      },
      userId: this.userId || undefined,
      timestamp: Date.now()
    };

    if (this.isOnline && this.isInitialized) {
      this.sendEvent(analyticsEvent);
    } else {
      this.eventQueue.push(analyticsEvent);
    }

    // Also send to performance monitor if relevant
    if (event.includes('performance') || event.includes('error')) {
      this.sendToPerformanceMonitor(analyticsEvent);
    }
  }

  trackPageView(path?: string) {
    const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '');
    
    this.track('page_view', {
      path: currentPath,
      title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      sessionId: this.sessionId
    });

    // Track performance metrics for this page
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const perf = performanceMonitor.getPerformanceSummary();
        this.track('page_performance', {
          path: currentPath,
          performanceScore: perf.performanceScore,
          loadTime: perf.appLoadTime,
          sessionId: this.sessionId
        });
      }, 1000);
    }
  }

  identify(userId: string, properties?: UserProperties) {
    this.userId = userId;
    
    this.track('user_identified', {
      userId,
      ...properties,
      sessionId: this.sessionId
    });

    // Send to third-party services
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        user_id: userId,
        custom_parameters: {
          user_plan: properties?.plan,
          portfolio_value: properties?.portfolioValue
        }
      });
    }
  }

  // Business-specific tracking methods
  trackPortfolioAction(action: string, data?: Record<string, any>) {
    this.track(`portfolio_${action}`, {
      category: 'portfolio',
      ...data,
      sessionId: this.sessionId
    });
  }

  trackDividendAction(action: string, data?: Record<string, any>) {
    this.track(`dividend_${action}`, {
      category: 'dividend',
      ...data,
      sessionId: this.sessionId
    });
  }

  trackUserEngagement(action: string, data?: Record<string, any>) {
    this.track(`engagement_${action}`, {
      category: 'engagement',
      ...data,
      sessionId: this.sessionId
    });
  }

  trackConversion(event: string, value?: number, currency = 'USD') {
    this.track('conversion', {
      event,
      value,
      currency,
      sessionId: this.sessionId
    });

    // Send to Google Analytics as conversion
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: this.generateSessionId(),
        value: value,
        currency: currency,
        event_category: 'conversion'
      });
    }
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.track('error_occurred', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      context,
      sessionId: this.sessionId
    });
  }

  trackFeatureUsage(feature: string, data?: Record<string, any>) {
    this.track('feature_used', {
      feature,
      ...data,
      sessionId: this.sessionId
    });
  }

  // Utility methods
  private async sendEvent(event: AnalyticsEvent) {
    try {
      // Send to our internal analytics API
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      // Send to Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.event, {
          event_category: event.properties?.category || 'general',
          event_label: event.properties?.label,
          value: event.properties?.value,
          user_id: this.userId
        });
      }

    } catch (error) {
      console.error('Failed to send analytics event:', error);
      // Add back to queue for retry
      this.eventQueue.push(event);
    }
  }

  private sendToPerformanceMonitor(event: AnalyticsEvent) {
    if (event.properties?.performanceScore) {
      performanceMonitor.updateCacheMetrics(event.properties.performanceScore);
    }
  }

  private processEventQueue() {
    if (!this.isOnline || !this.isInitialized) return;

    const queue = [...this.eventQueue];
    this.eventQueue = [];

    queue.forEach(event => {
      this.sendEvent(event);
    });
  }

  private flush() {
    // Send any remaining events immediately
    this.processEventQueue();
  }

  // Helper methods for common tracking patterns
  trackButtonClick(buttonName: string, location?: string) {
    this.track('button_click', {
      button_name: buttonName,
      location,
      sessionId: this.sessionId
    });
  }

  trackFormSubmission(formName: string, success: boolean, errors?: string[]) {
    this.track('form_submission', {
      form_name: formName,
      success,
      errors,
      sessionId: this.sessionId
    });
  }

  trackSearchQuery(query: string, results?: number) {
    this.track('search_performed', {
      query,
      results_count: results,
      sessionId: this.sessionId
    });
  }

  trackDownload(fileName: string, fileType: string) {
    this.track('file_download', {
      file_name: fileName,
      file_type: fileType,
      sessionId: this.sessionId
    });
  }

  // Get analytics data (for dashboards)
  async getAnalyticsData(timeframe = '7d') {
    try {
      const response = await fetch(`/api/analytics/data?timeframe=${timeframe}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      return null;
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// React hook for easy component usage
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    identify: analytics.identify.bind(analytics),
    trackPortfolioAction: analytics.trackPortfolioAction.bind(analytics),
    trackDividendAction: analytics.trackDividendAction.bind(analytics),
    trackUserEngagement: analytics.trackUserEngagement.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackButtonClick: analytics.trackButtonClick.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackSearchQuery: analytics.trackSearchQuery.bind(analytics),
    trackDownload: analytics.trackDownload.bind(analytics),
  };
}

// Initialize analytics on import (browser only)
if (typeof window !== 'undefined') {
  analytics.initialize({
    enableDebug: process.env.NODE_ENV === 'development'
  });
}

export default analytics; 