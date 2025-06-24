const CACHE_NAME = "moodmate-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/public/images/favicon.png",
  "/images/icons/icon-x144.png",
  "/images/icons/maskable-icon-x512.png",
  "/images/icons/add-x512.png",
  "/images/icons/history-x512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});