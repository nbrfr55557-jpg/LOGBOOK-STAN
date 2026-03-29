const CACHE = 'fitness-tracker-v1.2.0';
const FILES = [
  '/FITNESS-TRACKER/index.html',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (e.request.url.includes('fonts.googleapis.com') || e.request.url.includes('fonts.gstatic.com')) {
        return caches.open(CACHE).then(c => {
          c.put(e.request, res.clone());
          return res;
        });
      }
      return res;
    }))
  );
});

self.addEventListener('message', e => {
  if (e.data?.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
