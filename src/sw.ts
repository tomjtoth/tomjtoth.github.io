/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;

const CACHE_NAME: string = "rolling-net-first";
const URLS_TO_CACHE: string[] = [
  "/",
  // this is a placeholder for the sed command in `deploy.yml`
  // gets populated based on `dist/*` minus a few exceptions
  "__REPLACED_DURING_DEPLOYMENT__",
];

// TODO: maybe "/" is enough
const FETCH_ALWAYS: string[] = ["/"].map((url: string) =>
  new URL(url, self.location.origin).toString()
);

function rmOldVersions(cache: Cache, matched: RegExpMatchArray | null): void {
  if (matched) {
    const [url, resource, hashExt, extension] = matched;

    cache.keys().then((keys: readonly Request[]) => {
      keys.forEach((req: Request) => {
        if (
          req.url.startsWith(resource) &&
          // allowing for both `index.css` and `index.js`
          req.url.endsWith(extension) &&
          // cheapest? way to compare the hash parts
          !req.url.endsWith(hashExt)
        ) {
          console.log(`deleted "${req.url}" in favor of "${url}"`);
          cache.delete(req);
        }
      });
    });
  }
}

const CACHE_BUSTERS = RegExp(
  String.raw`(.*\/(?:${[
    // the app and its dependencies
    "app|luxon|js-yaml",

    // resources
    "lyrics|recipes|cv|visitors",
  ].join("|")}))-(.+\.(css|js|yaml))$`
);

// Install event: Cache resources
sw.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache: Cache) => {
      console.info("Opened cache");
      return cache
        .addAll(URLS_TO_CACHE)
        .catch((err: Error) =>
          console.error("Caching failed during install:", err)
        );
    })
  );
});

sw.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache: Cache) => {
      const cachedRes: Response | undefined = await cache.match(event.request);

      const url: string = event.request.url;
      const matchedBuster: RegExpMatchArray | null = url.match(CACHE_BUSTERS);

      if (cachedRes && !matchedBuster && !FETCH_ALWAYS.includes(url)) {
        console.info(`responding to "${url}" w/o fetching from network`);
        return cachedRes;
      }

      rmOldVersions(cache, matchedBuster);

      return fetch(event.request)
        .then((res: Response) => {
          if (res && res.ok) {
            if (matchedBuster || URLS_TO_CACHE.includes(url)) {
              // Update the cache with the new version
              cache.put(event.request, res.clone());
              console.log(`updated response to "${url}"`);
            }
          }
          return res;
        })
        .catch(
          // Fallback to cache if network fails
          () =>
            cachedRes ||
            // return something explicitly for TypeScript
            new Response("Network error", { status: 408 })
        );
    })
  );
});

// Activate event: Clean up old caches
sw.addEventListener("activate", (event: ExtendableEvent) => {
  const cacheWhitelist: string[] = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames: string[]) => {
      return Promise.all(
        cacheNames.map((cacheName: string) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
