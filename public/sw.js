const CACHE_NAME = "rolling-net-first";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  // this is a placeholder for the sed command in `deploy.yml`
  // populates based on dist/assets after `dx build --release`
  "__REPLACED_DURING_DEPLOYMENT__",
];
const FETCH_ALWAYS = ["/", "/index.html"];

function rmOldVersions(cache, matched) {
  if (matched) {
    const [url, resource, hashExt, extension] = matched;

    cache.keys().then((keys) => {
      keys.forEach((req) => {
        if (
          req.url.startsWith(resource) &&
          // allowing for e.g. `lyrics.yaml` and `lyrics.something`, too
          req.url.endsWith(extension) &&
          // most performant? way to compare the hash parts
          !req.url.endsWith(hashExt)
        ) {
          console.log(`deleted "${req.url}" in favor of "${url}"`);
          cache.delete(req);
        }
      });
    });
  }
}

const CACHE_BUSTERS =
  /(.*\/assets\/(?:lyrics|recipes|apps(?:_bg)?))-(\S+\.(wasm|js|yaml))$/;

// Install event: Cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedRes = await cache.match(event.request);

      const url = event.request.url;
      console.log(url);
      const woOrigin = url.replace(self.location.pathname, "");
      const matchedBuster = url.match(CACHE_BUSTERS);

      if (cachedRes && !matchedBuster && !FETCH_ALWAYS.includes(woOrigin)) {
        console.log(`responding to "${url}" w/o fetching from network`);
        return cachedRes;
      }

      rmOldVersions(cache, matchedBuster);

      return fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            if (matchedBuster || URLS_TO_CACHE.includes(url)) {
              // Update the cache with the new version
              cache.put(event.request, res.clone());
              console.log(`updated response to "${url}"`);
            }
            return res;
          }
          return cachedRes;
        })
        .catch(() => cachedRes); // Fallback to cache if network fails
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
