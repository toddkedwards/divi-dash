/**
 * Intersection Observer based lazy loading utilities
 * Part of Phase 3: Web App Polish
 */

import React from 'react';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  onIntersect?: (entry: IntersectionObserverEntry) => void;
}

class LazyLoader {
  private observer: IntersectionObserver;
  private loadedElements = new Set<Element>();

  constructor(options: LazyLoadOptions = {}) {
    const {
      threshold = 0.1,
      rootMargin = '50px',
      onIntersect
    } = options;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loadedElements.has(entry.target)) {
          this.loadElement(entry.target);
          this.loadedElements.add(entry.target);
          
          if (onIntersect) {
            onIntersect(entry);
          }
        }
      });
    }, {
      threshold,
      rootMargin
    });
  }

  observe(element: Element) {
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    this.observer.unobserve(element);
    this.loadedElements.delete(element);
  }

  disconnect() {
    this.observer.disconnect();
    this.loadedElements.clear();
  }

  private loadElement(element: Element) {
    // Load images
    if (element instanceof HTMLImageElement) {
      const dataSrc = element.getAttribute('data-src');
      if (dataSrc) {
        element.src = dataSrc;
        element.removeAttribute('data-src');
      }
    }

    // Load background images
    const dataBg = element.getAttribute('data-bg');
    if (dataBg) {
      (element as HTMLElement).style.backgroundImage = `url(${dataBg})`;
      element.removeAttribute('data-bg');
    }

    // Trigger custom load events
    const loadEvent = new CustomEvent('lazyload', { detail: { element } });
    element.dispatchEvent(loadEvent);
  }
}

// Singleton instance
let globalLazyLoader: LazyLoader | null = null;

export function getLazyLoader(options?: LazyLoadOptions): LazyLoader {
  if (!globalLazyLoader) {
    globalLazyLoader = new LazyLoader(options);
  }
  return globalLazyLoader;
}

// React hook for lazy loading
export function useLazyLoad(ref: React.RefObject<Element>, options?: LazyLoadOptions) {
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const loader = getLazyLoader(options);
    loader.observe(element);

    return () => {
      loader.unobserve(element);
    };
  }, [ref, options]);
}

// Utility functions for performance optimization
export const performanceUtils = {
  // Debounce function for scroll events
  debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    }) as T;
  },

  // Throttle function for resize events
  throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  // Check if element is in viewport
  isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Preload critical resources
  preloadResource(href: string, as: 'script' | 'style' | 'image' | 'font' = 'script') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  },

  // Measure and log performance
  measurePerformance(name: string, fn: () => void | Promise<void>) {
    const start = performance.now();
    const result = fn();
    
    if (result instanceof Promise) {
      return result.then(() => {
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
      });
    } else {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
    }
  }
};

export default LazyLoader; 