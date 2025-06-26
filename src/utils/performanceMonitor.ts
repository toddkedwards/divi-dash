// Performance Monitoring Service

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean = true;

  private constructor() {
    this.setupTracking();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackMetric(name: string, value: number): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date()
    };

    this.metrics.push(metric);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance:', metric);
    }
  }

  trackFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    this.trackMetric(name, end - start);
    return result;
  }

  async trackAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    this.trackMetric(name, end - start);
    return result;
  }

  getMetrics(): PerformanceMetric[] {
    return this.metrics.slice(-50); // Last 50 metrics
  }

  getSummary(): Record<string, any> {
    const recent = this.metrics.filter(m => 
      Date.now() - m.timestamp.getTime() < 5 * 60 * 1000
    );

    const byName = recent.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = [];
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(byName).map(([name, values]) => ({
      name,
      count: values.length,
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      max: Math.max(...values)
    }));
  }

  private setupTracking(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      if (navigation) {
        this.trackMetric('page_load', navigation.loadEventEnd - navigation.fetchStart);
        this.trackMetric('dom_ready', navigation.domContentLoadedEventEnd - navigation.fetchStart);
      }
    });
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  clear(): void {
    this.metrics = [];
  }
}

export default PerformanceMonitor.getInstance(); 