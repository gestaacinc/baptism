const CACHE_NAME = "baptism-program-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.json",
  // Hymn files
  "/hymns/315.html",
  "/hymns/100.html",
  "/hymns/304.html",
  "/hymns/302.html",
  "/hymns/286.html",
  "/hymns/301.html",
  // Icons
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/offline.html", // Ensure this file exists
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map((url) => {
          return cache.add(url).catch((err) => {
            console.error(`Failed to cache ${url}:`, err);
          });
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request)
          .then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => caches.match("/offline.html")) // Serve offline fallback if network is unavailable
      );
    })
  );
});
