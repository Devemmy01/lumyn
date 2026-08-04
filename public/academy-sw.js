var CACHE_NAME = "lumyn-academy-v3";
var APP_SHELL = [
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

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/academy/dashboard") !== 0) return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (response.ok) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            return cache.put(event.request, copy);
          });
        }
        return response;
      })
      .catch(function () {
        return caches.match(event.request).then(function (cached) {
          return cached || caches.match("/academy/dashboard");
        });
      })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var notificationData = event.notification.data || {};
  var targetUrl = notificationData.url || "/academy/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clients) {
      var normalizedTarget = new URL(targetUrl, self.location.origin).href;
      var existingClient = null;
      for (var index = 0; index < clients.length; index += 1) {
        if (clients[index].url === normalizedTarget) {
          existingClient = clients[index];
          break;
        }
      }
      if (existingClient) return existingClient.focus();
      return self.clients.openWindow(normalizedTarget);
    })
  );
});

self.addEventListener("push", function (event) {
  if (!event.data) return;
  var payload = event.data.json();
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
