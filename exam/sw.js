const CACHE_NAME = 'v4.2.0';
const ASSETS = [
  './home.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force waiting service worker to become active
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Claim clients immediately
});

self.addEventListener('fetch', (event) => {
  // For home.html and other critical assets, try Network-First to ensure updates
  if (event.request.mode === 'navigate' || event.request.url.includes('home.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If network works, update cache and return
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          // If offline, use cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other assets (icons, etc.), use Cache-First
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
