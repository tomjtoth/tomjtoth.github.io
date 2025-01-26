const CACHE_NAME = "rolling-net-first";
const urlsToCache = [
  // bare basics for PWA
  "/",
  "/index.html",
  "/assets/manifest.json",
  "/assets/icon.png",
];

function rmOldVersions(cache, matchedUrl) {
  if (matchedUrl) {
    const [, resource, hashExt, extension] = matchedUrl;

    cache.keys().then((keys) => {
      keys.forEach((req) => {
        if (
          req.url.startsWith(resource) &&
          req.url.endsWith(extension) &&
          // most performant? way to compare hashes
          !req.url.endsWith(hashExt)
        ) {
          cache.delete(req);
        }
      });
    });
  }
}

const staticMP3 = /\/assets\/(?:arx\/(?:runes|spells)\/[a-z-]+|modal)\.mp3$/;
const staticPNG = /\/assets\/arx\/runes\/[a-z]+\.png$/;
const cacheBusters =
  /(.*\/assets\/(?:lyrics|recipes|ttj_apps(?:_bg)?))-(\S+\.(wasm|js|css|yaml))$/;

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

      const isStaticMP3 = staticMP3.test(url);
      const isStaticPNG = staticPNG.test(url);

      if (fromCache && (isStaticMP3 || isStaticPNG)) {
        // these 2 never change
        return fromCache;
      }

      const matchedBuster = url.match(cacheBusters);

      let reqExtra;

      if (isStaticMP3) {
        // 206 OK responses could not be cached
        // requesting without "range" header results in 200 OK
        reqExtra = new Request(url, {
          headers: new Headers(
            [...event.request.headers.entries()].filter(
              ([key]) => key.toLowerCase() !== "range"
            )
          ),
        });
      }

      return fetch(reqExtra || event.request)
        .then((res) => {
          if (res && res.ok) {
            rmOldVersions(cache, matchedBuster);

            if (
              (isStaticMP3 && res.status === 200) ||
              isStaticPNG ||
              matchedBuster ||
              urlsToCache.includes(url)
            ) {
              // Update the cache with the new version
              cache.put(event.request, res.clone());
              console.log(`updated response to ${url}`);
            }
          }

          return res;
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
