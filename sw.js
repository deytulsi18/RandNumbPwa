const OFFLINE_VERSION = 1;
const CACHE_OFFLINE = "offline";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const offlineCache = await caches.open(CACHE_OFFLINE);
      await offlineCache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log("Fetch failed; returning offline page instead.", error);

          const offlineCache = await caches.open(CACHE_OFFLINE);
          const offlineCachedResponse = await offlineCache.match(OFFLINE_URL);

          return offlineCachedResponse;
        }
      })()
    );
  }
});
