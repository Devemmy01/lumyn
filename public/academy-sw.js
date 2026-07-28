const CACHE_NAME = "lumyn-academy-v2";
const APP_SHELL = [
  "/academy/dashboard",
  "/academy/dashboard/learning",
  "/academy/dashboard/generate",
  "/academy/dashboard/assignments",
  "/academy/dashboard/certificates",
  "/academy/dashboard/billing",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith("/academy/dashboard")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/academy/dashboard")))
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/academy/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const normalizedTarget = new URL(targetUrl, self.location.origin).href;
      const existingClient = clients.find((client) => client.url === normalizedTarget);
      if (existingClient) {
        return existingClient.focus();
      }
      return self.clients.openWindow(normalizedTarget);
    })
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const payload = event.data.json();
  event.waitUntil(
    self.registration.showNotification(payload.title || "Lumyn Academy", {
      body: payload.body || "You have a new Academy update.",
      icon: payload.icon || "/android-chrome-192x192.png",
      badge: payload.badge || "/android-chrome-192x192.png",
      tag: payload.tag || "lumyn-academy-update",
      data: { url: payload.url || "/academy/dashboard" }
    })
  );
});
