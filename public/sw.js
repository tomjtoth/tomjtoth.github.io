const CACHE_NAME = "rolling-net-first";
const urlsToCache = [
  "/",
  "/index.html",
  // this is a placeholder for the sed command in `deploy.yml`
  "__REPLACED_DURING_DEPLOYMENT__",
];

function rmOldVersions(cache, matchedUrl) {
  if (matchedUrl) {
    const [whole, resource, hashExt, extension] = matchedUrl;

    cache.keys().then((keys) => {
      keys.forEach((req) => {
        if (
          req.url.startsWith(resource) &&
          req.url.endsWith(extension) &&
          // most performant? way to compare hashes
          !req.url.endsWith(hashExt)
        ) {
          console.log(`deleted "${req.url}" in favor of "${whole}"`);
          cache.delete(req);
        }
      });
    });
  }
}

const staticOGG = /\/assets\/(?:arx\/(?:runes|spells)\/[a-z-]+|modal)\.ogg$/;
const staticPNG = /\/assets\/arx\/runes\/[a-z]+\.png$/;
const cacheBusters =
  /(.*\/assets\/(?:lyrics|recipes|apps(?:_bg)?))-(\S+\.(wasm|js|yaml))$/;

// Install event: Cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const fromCache = await cache.match(event.request);
      const url = event.request.url;

      if (fromCache && (staticOGG.test(url) || staticPNG.test(url))) {
        console.log(`responding to "${url}" w/o fetching from network`);
        return fromCache;
      }

      const matchedBuster = url.match(cacheBusters);

      return fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            rmOldVersions(cache, matchedBuster);

            if (matchedBuster || urlsToCache.includes(url)) {
              // Update the cache with the new version
              cache.put(event.request, res.clone());
              console.log(`updated response to "${url}"`);
            }
            return res;
          }
          return fromCache;
        })
        .catch(() => fromCache); // Fallback to cache if network fails
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
