// HBS Elternassistent – Progressive Web App (PWA) Service Worker
const CACHE_NAME = 'hbs-elternassistent-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/siegel_bunt.png'
];

// 1. Installation: Statische App-Shell vorladen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA Precache Teilfehler (unkritisch):', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Aktivierung: Veraltete Caches bereinigen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Abruf-Strategie: Stale-While-Revalidate für App-Assets, Bypass für Live-APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Nur GET-Anfragen behandeln
  if (event.request.method !== 'GET') return;

  // Externe Live-APIs NIEMALS cachen (immer tagesaktuell & unbeeinflusst)
  const isExternalApi =
    url.hostname.includes('generativelanguage.googleapis.com') ||
    url.hostname.includes('docs.google.com') ||
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('api.allorigins.win') ||
    url.pathname.includes('/api/');

  if (isExternalApi) {
    return; // Direkt über das Netzwerk ausführen
  }

  // Stale-While-Revalidate für App-Assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
