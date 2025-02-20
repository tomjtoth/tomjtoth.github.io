/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;

const CACHE_NAME = "rolling";
const URLS_TO_CACHE = [
  "/",
  // this is a placeholder for the sed command in `deploy.yml`
  // gets populated based on `dist/*` minus a few exceptions
  "__REPLACED_DURING_DEPLOYMENT__",
].map((url) => new URL(url, self.location.origin).toString());

// Install event: Cache resources
sw.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.info("Opened cache");
      return cache
        .addAll(URLS_TO_CACHE)
        .catch((err) => console.error("Caching failed during install:", err));
    })
  );
});

sw.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((response) => {
        if (response) {
          console.info(
            `responding to "${event.request.url}" w/o fetching from network`
          );
        }
        return response ?? fetch(event.request);
      })
    )
  );
});

// Activate event: Clean up old caches
sw.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          } else {
            return caches.open(cacheName).then((cache) =>
              cache.keys().then((requests) =>
                requests.map((req) => {
                  if (!URLS_TO_CACHE.includes(req.url)) {
                    console.info(`deleting ${req.url} from cache`);
                    return cache.delete(req);
                  }
                })
              )
            );
          }
        })
      )
    )
  );
});
