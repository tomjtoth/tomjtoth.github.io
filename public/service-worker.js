const CACHE_NAME = "mindenes-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "/lyrics.yaml",
  "/recipies.md",
];

// Install event: Cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Serve cached resources or fetch from network
self.addEventListener("fetch", (event) => {
  console.log("SW fetching");
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached resource or fetch from the network
      console.log(response);
      return response || fetch(event.request);
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
