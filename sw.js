// Hors connexion : on essaie le réseau (pour avoir toujours la dernière version),
// et si pas de réseau on sert la copie gardée en cache.
const CACHE = 'grand-voyage';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css', 'fonts/andika-bold.woff2',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/main.js', 'js/data.js', 'js/store.js', 'js/audio.js', 'js/ui.js', 'js/avatar.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request)
    .then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
