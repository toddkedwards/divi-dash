const CACHE_NAME = 'divi-dash-v2';
const STATIC_CACHE_NAME = 'divi-dash-static-v2';
const DYNAMIC_CACHE_NAME = 'divi-dash-dynamic-v2';
const API_CACHE_NAME = 'divi-dash-api-v2';
const OFFLINE_URL = '/offline.html';

// Enhanced caching strategy with different cache types
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/positions',
  '/dividend-calendar',
  '/portfolio-insights',
  '/settings',
  '/manifest.json',
  '/icon-192x192.png',
  '/offline.html',
  '/globals.css'
];

// Performance optimization: Preload critical routes
const CRITICAL_ROUTES = [
  '/',
  '/dashboard',
  '/positions'
];

// Network timeout for better UX
const NETWORK_TIMEOUT = 3000;

// Install event - enhanced caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // Cache static resources
      const staticCache = await caches.open(STATIC_CACHE_NAME);
      await staticCache.addAll(STATIC_CACHE_URLS);
      
      // Cache critical routes
      const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
      await Promise.all(
        CRITICAL_ROUTES.map(async (route) => {
          try {
            const response = await fetch(route);
            if (response.ok) {
              await dynamicCache.put(route, response);
            }
          } catch (error) {
            console.warn(`Failed to cache critical route: ${route}`, error);
          }
        })
      );
      
      // Force activation
      self.skipWaiting();
    })()
  );
});

// Activate event - cleanup and optimization
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          if (!cacheName.includes('divi-dash-v2')) {
            await caches.delete(cacheName);
          }
        })
      );
      
      // Take control immediately
      await self.clients.claim();
      
      // Preload critical data
      await preloadCriticalData();
    })()
  );
});

// Enhanced fetch event with performance optimizations
self.addEventListener('fetch', (event) => {
  // Skip non-http requests and chrome-extension requests
  if (!event.request.url.startsWith('http') || event.request.url.includes('chrome-extension')) {
    return;
  }

  event.respondWith(handleRequest(event.request));
});

// Optimized request handler
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // API requests - network first with timeout
    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(request);
    }
    
    // Static assets - cache first
    if (isStaticAsset(url.pathname)) {
      return await handleStaticAsset(request);
    }
    
    // Navigation requests - stale while revalidate
    if (request.mode === 'navigate') {
      return await handleNavigation(request);
    }
    
    // Other requests - network first
    return await handleOtherRequests(request);
    
  } catch (error) {
    console.error('Request handling failed:', error);
    return await getFallbackResponse(request);
  }
}

// API request handler with timeout and caching
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
      )
    ]);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Static asset handler
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached version immediately
    fetchAndUpdateCache(request, cache);
    return cachedResponse;
  }
  
  // If not cached, fetch and cache
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Navigation handler with stale-while-revalidate
async function handleNavigation(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    fetchAndUpdateCache(request, cache);
    return cachedResponse;
  }
  
  try {
    // If not cached, try network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    // Return offline page
    const offlineResponse = await cache.match(OFFLINE_URL);
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Other requests handler
async function handleOtherRequests(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Try cache fallback
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background fetch and cache update
async function fetchAndUpdateCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silently fail - user already has cached version
  }
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
  return pathname.includes('/_next/static/') ||
         pathname.includes('/icon-') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.ico');
}

// Fallback response
async function getFallbackResponse(request) {
  if (request.mode === 'navigate') {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const offlineResponse = await cache.match(OFFLINE_URL);
    return offlineResponse || new Response('Service Unavailable', { status: 503 });
  }
  
  return new Response('Network Error', { status: 408 });
}

// Preload critical data on activation
async function preloadCriticalData() {
  try {
    // Preload essential API data
    const criticalApis = [
      '/api/portfolio/summary',
      '/api/dividends/upcoming'
    ];
    
    const cache = await caches.open(API_CACHE_NAME);
    
    await Promise.allSettled(
      criticalApis.map(async (apiUrl) => {
        try {
          const response = await fetch(apiUrl);
          if (response.ok) {
            await cache.put(apiUrl, response);
          }
        } catch (error) {
          console.warn(`Failed to preload API: ${apiUrl}`);
        }
      })
    );
  } catch (error) {
    console.error('Critical data preload failed:', error);
  }
}

// Enhanced background sync
self.addEventListener('sync', (event) => {
  switch (event.tag) {
    case 'portfolio-sync':
      event.waitUntil(syncPortfolioData());
      break;
    case 'performance-metrics':
      event.waitUntil(sendPerformanceMetrics());
      break;
    default:
      break;
  }
});

// Enhanced push notifications with actions
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    image: data.image || '/icon-512x512.png',
    vibrate: [200, 100, 200],
    data: data.data,
    requireInteraction: true,
    actions: [
      {
        action: 'view-portfolio',
        title: 'View Portfolio',
        icon: '/icon-192x192.png'
      },
      {
        action: 'view-alerts',
        title: 'View Alerts',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Divi Dash', options)
  );
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window' });
      
      // Check if app is already open
      const existingClient = clients.find(client => client.url.includes(self.location.origin));
      
      if (existingClient) {
        // Focus existing window and navigate
        await existingClient.focus();
        
        switch (action) {
          case 'view-portfolio':
            existingClient.postMessage({ type: 'NAVIGATE', path: '/dashboard' });
            break;
          case 'view-alerts':
            existingClient.postMessage({ type: 'NAVIGATE', path: '/settings' });
            break;
          default:
            existingClient.postMessage({ type: 'NOTIFICATION_CLICKED', data });
        }
      } else {
        // Open new window
        let url = '/';
        
        switch (action) {
          case 'view-portfolio':
            url = '/dashboard';
            break;
          case 'view-alerts':
            url = '/settings';
            break;
        }
        
        await self.clients.openWindow(url);
      }
    })()
  );
});

// Performance metrics collection
async function sendPerformanceMetrics() {
  try {
    const metrics = await collectPerformanceMetrics();
    
    await fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    });
  } catch (error) {
    console.error('Performance metrics sync failed:', error);
  }
}

// Collect performance metrics
async function collectPerformanceMetrics() {
  return {
    timestamp: Date.now(),
    cacheHitRate: await calculateCacheHitRate(),
    offlineUsage: await getOfflineUsageStats(),
    serviceWorkerVersion: CACHE_NAME
  };
}

// Calculate cache hit rate
async function calculateCacheHitRate() {
  // Implementation would track hits/misses
  return 0.85; // Placeholder
}

// Get offline usage statistics
async function getOfflineUsageStats() {
  // Implementation would track offline usage
  return {
    offlineTime: 0,
    offlineRequests: 0
  };
}

// Portfolio sync implementation
async function syncPortfolioData() {
  try {
    const portfolioData = await getStoredPortfolioData();
    
    if (portfolioData?.needsSync) {
      const response = await fetch('/api/portfolio/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData)
      });
      
      if (response.ok) {
        await markDataAsSynced();
      }
    }
  } catch (error) {
    console.error('Portfolio sync failed:', error);
  }
}

// Helper functions
async function getStoredPortfolioData() {
  // Implementation depends on storage strategy
  return null;
}

async function markDataAsSynced() {
  // Implementation to mark data as synced
} 