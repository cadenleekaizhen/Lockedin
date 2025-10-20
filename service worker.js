const CACHE_NAME = "vehicle-dashboard-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bike lock icon.png",
  "./bike lock icon app.png",
  "./Bike Lock Icon - Header.png",
  "./CR7.png",
  "./dashboard.html",
  "./dashboard styles.css",
  "./global.css",
  "./Hero Left.jpg",
  "./Hero Right.webp",
  "./home styles.css",
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


