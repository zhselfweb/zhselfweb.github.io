self.addEventListener('fetch', (event) => {
  // 保持簡單的快取或直接放行
});
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
