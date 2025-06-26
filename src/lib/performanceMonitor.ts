// Performance monitoring for PWA optimization
// import type { Metric } from 'web-vitals';

interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  appLoadTime?: number;
  routeChangeTime?: number;
  apiResponseTime?: number;
  cacheHitRate?: number;
  offlineUsage?: number;
  
  // Device info
  connection?: string;
  deviceMemory?: number;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
}

interface PerformanceSummary extends PerformanceMetrics {
  timestamp: number;
  url: string;
  userAgent: string;
  performanceScore: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private isInitialized = false;
  private observer: PerformanceObserver | null = null;

  async initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.isInitialized = true;
    
    // Temporarily disable web-vitals to prevent chunk loading errors
    console.log('Performance monitoring initialized (web-vitals disabled temporarily)');

    // Track custom metrics
    this.trackAppLoadTime();
    this.trackDeviceInfo();
    this.setupPerformanceObserver();
    this.trackNetworkInfo();
    
    // Report metrics periodically
    setInterval(() => this.reportMetrics(), 30000); // Every 30 seconds
  }

  private handleMetric(metricName: keyof PerformanceMetrics, metric: any) {
    if (metricName === 'fcp') this.metrics.fcp = metric.value;
    else if (metricName === 'lcp') this.metrics.lcp = metric.value;
    else if (metricName === 'fid') this.metrics.fid = metric.value;
    else if (metricName === 'cls') this.metrics.cls = metric.value;
    else if (metricName === 'ttfb') this.metrics.ttfb = metric.value;
    
    // Immediate reporting for poor metrics
    if (this.isMetricPoor(metricName, metric.value)) {
      this.reportCriticalMetric(metricName, metric.value);
    }
  }

  private isMetricPoor(metricName: string, value: number): boolean {
    const thresholds: Record<string, number> = {
      fcp: 3000,   // Poor if > 3s
      lcp: 4000,   // Poor if > 4s
      fid: 300,    // Poor if > 300ms
      cls: 0.25,   // Poor if > 0.25
      ttfb: 1800,  // Poor if > 1.8s
    };

    const threshold = thresholds[metricName];
    return threshold !== undefined && value > threshold;
  }

  private trackAppLoadTime() {
    if (typeof window === 'undefined') return;

    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.appLoadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
    }
  }

  private trackDeviceInfo() {
    if (typeof window === 'undefined') return;

    // Device memory
    if ('deviceMemory' in navigator) {
      this.metrics.deviceMemory = (navigator as any).deviceMemory;
    }

    // Device type based on screen size
    const width = window.screen.width;
    if (width < 768) {
      this.metrics.deviceType = 'mobile';
    } else if (width < 1024) {
      this.metrics.deviceType = 'tablet';
    } else {
      this.metrics.deviceType = 'desktop';
    }
  }

  private setupPerformanceObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.appLoadTime = navEntry.loadEventEnd - navEntry.fetchStart;
          }
        });
      });

      this.observer.observe({ entryTypes: ['navigation', 'resource'] });
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error);
    }
  }

  private trackNetworkInfo() {
    if (typeof window === 'undefined') return;

    // Network connection info
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.connection = connection.effectiveType || 'unknown';
    }
  }

  // Track route changes for SPA performance
  trackRouteChange(startTime: number) {
    const endTime = performance.now();
    this.metrics.routeChangeTime = endTime - startTime;
  }

  // Track API response times
  trackApiCall(url: string, duration: number) {
    // Store in a rolling average
    if (!this.metrics.apiResponseTime) {
      this.metrics.apiResponseTime = duration;
    } else {
      this.metrics.apiResponseTime = (this.metrics.apiResponseTime + duration) / 2;
    }
  }

  // Track cache performance
  updateCacheMetrics(hitRate: number) {
    this.metrics.cacheHitRate = hitRate;
  }

  // Track offline usage
  trackOfflineUsage(duration: number) {
    this.metrics.offlineUsage = (this.metrics.offlineUsage || 0) + duration;
  }

  // Get current performance summary
  getPerformanceSummary(): PerformanceSummary {
    const summary: PerformanceSummary = {
      ...this.metrics,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      performanceScore: this.calculatePerformanceScore(),
    };
    
    return summary;
  }

  private calculatePerformanceScore(): number {
    let score = 100;
    
    // Deduct points for poor metrics
    if (this.metrics.fcp && this.metrics.fcp > 3000) score -= 20;
    if (this.metrics.lcp && this.metrics.lcp > 4000) score -= 25;
    if (this.metrics.fid && this.metrics.fid > 300) score -= 20;
    if (this.metrics.cls && this.metrics.cls > 0.25) score -= 25;
    if (this.metrics.ttfb && this.metrics.ttfb > 1800) score -= 10;
    
    return Math.max(0, score);
  }

  private async reportMetrics() {
    if (Object.keys(this.metrics).length === 0) return;

    try {
      const summary = this.getPerformanceSummary();
      
      // Send to analytics endpoint
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
      }).catch(() => {
        // Store locally if network fails
        this.storeMetricsLocally(summary);
      });
      
    } catch (error) {
      console.error('Failed to report performance metrics:', error);
    }
  }

  private async reportCriticalMetric(metricName: string, value: number) {
    try {
      await fetch('/api/analytics/critical-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metricName,
          value,
          timestamp: Date.now(),
          url: window.location.pathname,
          critical: true,
        }),
      });
    } catch (error) {
      console.error('Failed to report critical metric:', error);
    }
  }

  private storeMetricsLocally(metrics: PerformanceSummary) {
    try {
      const stored = localStorage.getItem('performance-metrics') || '[]';
      const storedMetrics = JSON.parse(stored);
      storedMetrics.push(metrics);
      
      // Keep only last 10 entries
      if (storedMetrics.length > 10) {
        storedMetrics.splice(0, storedMetrics.length - 10);
      }
      
      localStorage.setItem('performance-metrics', JSON.stringify(storedMetrics));
    } catch (error) {
      console.error('Failed to store metrics locally:', error);
    }
  }

  // Get stored metrics for later upload
  getStoredMetrics(): PerformanceSummary[] {
    try {
      const stored = localStorage.getItem('performance-metrics') || '[]';
      return JSON.parse(stored);
    } catch (error) {
      return [];
    }
  }

  // Clear stored metrics after successful upload
  clearStoredMetrics() {
    try {
      localStorage.removeItem('performance-metrics');
    } catch (error) {
      console.error('Failed to clear stored metrics:', error);
    }
  }

  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isInitialized = false;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for React components
export function usePerformanceMonitor() {
  return {
    trackRouteChange: (startTime: number) => performanceMonitor.trackRouteChange(startTime),
    trackApiCall: (url: string, duration: number) => performanceMonitor.trackApiCall(url, duration),
    updateCacheMetrics: (hitRate: number) => performanceMonitor.updateCacheMetrics(hitRate),
    trackOfflineUsage: (duration: number) => performanceMonitor.trackOfflineUsage(duration),
    getPerformanceSummary: () => performanceMonitor.getPerformanceSummary(),
  };
}

// Initialize automatically in browser
if (typeof window !== 'undefined') {
  performanceMonitor.initialize();
}

export default performanceMonitor; 