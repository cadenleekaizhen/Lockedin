const CACHE_NAME = "vehicle-dashboard-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bike_lock_icon.png",
  "./bike_lock_icon_192.png",
  "./bike_lock_icon_header.png",
  "./cr7.png",
  "./dashboard.html",
  "./dashboard_style.css",
  "./global.css",
  "./hero_left.jpg",
  "./hero_right.webp",
  "./home_style.css",
  "./script.js",
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch (serve from cache if offline)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});



