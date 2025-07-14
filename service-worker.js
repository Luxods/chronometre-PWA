const CACHE_NAME = 'chronosport-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icones/icon-48.png',
  '/icones/icon-72.png',
  '/icones/icon-96.png',
  '/icones/icon-128.png',
  '/icones/icon-144.png',
  '/icones/icon-152.png',
  '/icones/icon-192.png',
  '/icones/icon-256.png',
  '/icones/icon-384.png',
  '/icones/icon-512.png'
];

// Installation : cache tous les fichiers nécessaires à l'app
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // active immédiatement
});

// Activation : supprime les anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // prend le contrôle sans attendre rechargement
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // si on trouve en cache : on retourne la version locale
      if (cachedResponse) return cachedResponse;

      // sinon : on essaie de récupérer depuis le réseau et on met à jour le cache
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // on copie la réponse pour la mettre en cache
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // facultatif : fallback si offline
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
