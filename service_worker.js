const CACHE_NAME = "PWA-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bike_lock_icon.png",
  "./bike_lock_icon_192.png",
  "./bike_lock_icon_512.png",
  "./bike_lock_icon_header.png",
  "./cr7.png",
  "./dashboard.html",
  "./dashboard_style.css",
  "./global.css",
  "./hero_left.jpg",
  "./hero_right.webp",
  "./home_style.css",
  "./script.js"
];

// Install
self.addEventListener("install", function(installEvent) {
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      cache.addAll(urlsToCache);
    })
  );
});

// Fetch (serve from cache if offline)
self.addEventListener("fetch", function(fetchEvent) {
  fetchEvent.respondWith(
    caches
      .match(fetchEvent.request)
      .then(function(response) {
        return response || fetch(fetchEvent.request);
      })
    );
});











