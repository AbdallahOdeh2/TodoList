const CACHE_NAME = "todo-app-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/index.css",
  "/assets/ui-HmTWRswT.js",
  "/assets/index-BpDF4nSt.js",
  "/checklist.png",
  "/checklist1.png",
  "/to-do-list.png",
  "/_redirects",
];

// Install event: Cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return Promise.allSettled(
        urlsToCache.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`Failed to cache ${url}:`, err);
            return null;
          })
        )
      );
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event: Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              console.log("Deleting old cache:", name);
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim()) // Start controlling all clients
  );
});

// Fetch event: Cache-first for static assets, network-first for APIs
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestURL = new URL(event.request.url);

  // Network-first for API calls
  if (
    requestURL.pathname.startsWith("/api/") ||
    event.request.url.includes("notification")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const clone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((cachedResponse) => {
            return (
              cachedResponse || new Response("API unavailable", { status: 503 })
            );
          })
        )
    );
    return;
  }

  // Cache-first strategy for static assets (CSS, JS, images, etc.)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request)
          .then((response) => {
            if (response.ok) {
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(event.request, response));
            }
          })
          .catch(() => {
            // Silent fail
          });
        return cachedResponse;
      }

      // No cache found, fetch from network
      return fetch(event.request).catch((error) => {
        console.error("Fetch failed:", event.request.url, error);

        // If navigation request, fallback to index.html (SPA fallback)
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }

        // Fallback response for other requests
        return new Response("Not available offline", {
          status: 503,
          statusText: "Offline",
        });
      });
    })
  );
});

// The rest of your SW code for notifications, push, sync, message handlers...
// You can keep it as is.
