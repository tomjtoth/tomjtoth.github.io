const CACHE_NAME = "dev-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "/recipes.yaml",
  "/lyrics.yaml",
];

Cache.prototype.deleteAll = function (these, except) {
  this.keys().then((keys) => {
    keys.forEach((req) => {
      if (req.url !== except && these.test(req.url)) {
        this.delete(req);
      }
    });
  });
};

const arxMP3 = /\/arx\/(?:runes|spells)\/[a-z]+\.mp3$/;
const arxPNG = /\/arx\/runes\/[a-z]+\.png$/;

const indexCSS = /\/assets\/index-[\w-]+\.css$/;
const indexJS = /\/assets\/index-[\w-]+\.js$/;

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

      const isArxMP3 = arxMP3.test(url);
      const isArxPNG = arxPNG.test(url);

      if (fromCache && (isArxMP3 || isArxPNG)) {
        // these 2 never change
        return fromCache;
      }

      const isIndexJS = indexJS.test(url);
      const isIndexCSS = indexCSS.test(url);

      let reqExtra;

      if (isArxMP3) {
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

      const fromNet = fetch(reqExtra || event.request)
        .then((res) => {
          if (res && res.ok) {
            if (isIndexCSS) cache.deleteAll(indexCSS, url);
            if (isIndexJS) cache.deleteAll(indexJS, url);

            if (
              (isArxMP3 && res.status === 200) ||
              isArxPNG ||
              isIndexCSS ||
              isIndexJS ||
              urlsToCache.includes(url)
            ) {
              // Update the cache with the new version
              cache.put(event.request, res.clone());
              console.log(`updated response to ${url}`);
            }
          } else if (isIndexJS) {
            // either GitHub is down (not likely)
            // or webpack changed resource names in index.html
            // during last deploy (most likely)

            const reqIndex = new Request("/index.html");
            fetch(reqIndex).then((res) => {
              if (res && res.ok) {
                cache.put(reqIndex, res.clone());
                cache.put(new Request("/"), res);
              }
            });
          }

          return res;
        })
        .catch(() => fromCache); // Fallback to cache if network fails

      // Return the cached response ASAP, but update the cache in the background
      return fromCache || fromNet;
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
