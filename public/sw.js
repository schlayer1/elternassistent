// HBS Elternassistent – Progressive Web App (PWA) Service Worker
const CACHE_NAME = 'hbs-elternassistent-v2';

const STATIC_ASSETS = [
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

// 1. Installation: Nur statische Icons/Manifest vorladen (kein stale HTML!)
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

// 2. Aktivierung: Alle alten Caches (inkl. v1 mit evtl. veralteter index.html) sofort löschen
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
    }).then(() => self.clients.claim())
  );
});

function isHtmlResponse(res) {
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  return ct.includes('text/html');
}

// 3. Abruf-Strategie:
// - HTML / Navigation: Network-First (verhindert Whitescreen durch veraltete Asset-Hashes nach Deploy)
// - /assets/* (Vite content-hashed): Cache-First, aber NIEMALS HTML-Fallback-Antworten cachen
// - Statische Icons/Manifest: Stale-While-Revalidate
// - Externe APIs, /api/*, /sw.js: komplett umgehen
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Nur eigene Origin behandeln; externe Dienste & APIs immer direkt ans Netzwerk
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname === '/sw.js') return;

  const isNavigation =
    event.request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname === '/index.html';

  if (isNavigation) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok && isHtmlResponse(networkResponse)) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/index.html', copy);
            });
          }
          return networkResponse;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => cached || caches.match('/index.html'))
        )
    );
    return;
  }

  // Vite-gehaste JS/CSS-Bundles unter /assets/: Cache-First mit MIME-Schutz
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse && !isHtmlResponse(cachedResponse)) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok && !isHtmlResponse(networkResponse)) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Sonstige statische App-Ressourcen (Icons, Manifest): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok && !isHtmlResponse(networkResponse)) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
