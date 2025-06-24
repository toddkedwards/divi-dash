const CACHE_NAME = 'divi-dash-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/positions',
  '/dividend-calendar',
  '/portfolio-insights',
  '/settings',
  '/manifest.json',
  '/icon-192x192.png',
  '/offline.html'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Cache static resources
      await cache.addAll(STATIC_CACHE_URLS);
      // Force activation of new service worker
      self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          if (cacheName !== CACHE_NAME) {
            await caches.delete(cacheName);
          }
        })
      );
      // Take control of all open tabs
      self.clients.claim();
    })()
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  // Skip non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try network first for API calls
        if (event.request.url.includes('/api/')) {
          const networkResponse = await fetch(event.request);
          
          // Cache successful API responses
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          
          return networkResponse;
        }

        // For navigation requests, try network first, then cache
        if (event.request.mode === 'navigate') {
          try {
            const networkResponse = await fetch(event.request);
            return networkResponse;
          } catch (error) {
            // Return offline page if navigation fails
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(OFFLINE_URL);
            return cachedResponse || new Response('Offline');
          }
        }

        // For other requests, try cache first, then network
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }

        // If not in cache, fetch from network
        const networkResponse = await fetch(event.request);
        
        // Cache successful responses
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
        
      } catch (error) {
        // If both cache and network fail, return offline page
        if (event.request.mode === 'navigate') {
          const cache = await caches.open(CACHE_NAME);
          const offlineResponse = await cache.match(OFFLINE_URL);
          return offlineResponse || new Response('Offline');
        }
        
        return new Response('Network error', { status: 408 });
      }
    })()
  );
});

// Background sync for data synchronization
self.addEventListener('sync', (event) => {
  if (event.tag === 'portfolio-sync') {
    event.waitUntil(syncPortfolioData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Portfolio data sync function
async function syncPortfolioData() {
  try {
    // Get portfolio data from IndexedDB or localStorage
    const portfolioData = await getStoredPortfolioData();
    
    if (portfolioData && portfolioData.needsSync) {
      // Sync with server
      const response = await fetch('/api/portfolio/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData)
      });
      
      if (response.ok) {
        // Mark as synced
        await markDataAsSynced();
      }
    }
  } catch (error) {
    console.error('Portfolio sync failed:', error);
  }
}

// Helper function to get stored portfolio data
async function getStoredPortfolioData() {
  // Implementation depends on your storage strategy
  // This is a placeholder
  return null;
}

// Helper function to mark data as synced
async function markDataAsSynced() {
  // Implementation depends on your storage strategy
  // This is a placeholder
} 