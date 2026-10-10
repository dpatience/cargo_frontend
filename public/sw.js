/* Service Worker for Tembera Cargo
   - Push notifications display
   - Required for Chromium to show the install prompt.
   - Keeps API requests network-only.
   - Caches same-origin GETs for faster repeat loads and basic offline.
*/

const CACHE_NAME = "tembera-app-cache-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache
          .addAll([
            "/",
            "/manifest.json",
            "/favicon.ico",
            "/favicon-16x16.png",
            "/favicon-32x32.png",
            "/android-chrome-192x192.png",
            "/android-chrome-512x512.png",
            "/apple-touch-icon.png",
            "/tembera-logo.jpg",
          ])
          .catch(() => undefined),
      ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => (key === CACHE_NAME ? Promise.resolve() : caches.delete(key))),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GETs.
  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Never cache API calls.
  if (url.pathname.startsWith("/api")) {
    return;
  }

  // Navigation: network-first, fallback to cached app shell.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put("/", fresh.clone()).catch(() => undefined);
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match("/")) || Response.error();
        }
      })(),
    );
    return;
  }

  // Assets: cache-first.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) return cached;

      const fresh = await fetch(req);
      cache.put(req, fresh.clone()).catch(() => undefined);
      return fresh;
    })(),
  );
});

// --- Push Notifications ---
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "Tembera Cargo", body: event.data.text() };
  }

  const options = {
    body: data.body || "",
    icon: "/android-chrome-192x192.png",
    badge: "/favicon-32x32.png",
    tag: data.tag || data.category || "tembera-cargo",
    data: { url: data.url || "/", notification_id: data.notification_id },
    vibrate: data.severity === "urgent" ? [200, 100, 200, 100, 200] : [200, 100, 200],
    requireInteraction: data.severity === "urgent",
  };

  event.waitUntil(self.registration.showNotification(data.title || "Tembera Cargo", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (new URL(client.url).pathname === url && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
