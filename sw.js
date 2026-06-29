const CACHE = 'sigea-v2';
const ASSETS = ['.', 'index.html', 'style.css', 'app.js', 'database.json', 'manifest.json', 'icons/icon-192.svg', 'icons/icon-512.svg'];
const CDN_CACHE = 'sigea-cdn-v2';
const CDN = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/lucide@0.469.0/dist/umd/lucide.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(Promise.all([
    caches.open(CACHE).then((c) => c.addAll(ASSETS)),
    caches.open(CDN_CACHE).then((c) => Promise.allSettled(CDN.map((u) => c.add(u).catch(() => {}))))
  ]));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== CDN_CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request: r } = e;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);

  if (u.origin === self.location.origin) {
    e.respondWith(
      caches.match(r).then((c) => c || fetch(r).then((res) => { caches.open(CACHE).then((cache) => cache.put(r, res.clone())); return res; }))
      .catch(() => caches.match('index.html'))
    );
  } else if (CDN.some((cdn) => r.url.startsWith(cdn) || r.url.includes(cdn))) {
    e.respondWith(
      caches.match(r).then((c) => c || fetch(r).then((res) => { caches.open(CDN_CACHE).then((cache) => cache.put(r, res.clone())); return res; }))
      .catch(() => new Response('', { status: 408 }))
    );
  }
});
