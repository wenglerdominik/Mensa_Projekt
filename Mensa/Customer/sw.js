const SW_NAME = 'service-worker-full_v4.7';

const CACHE_NAME = `${SW_NAME}-v4`;

const FILES_TO_CACHE = [
  './',
  'index.html',
  'month.html',
  'day.html',
  'offline.html',
  'register.html',
  // './order.html',
  'monthReport.html',
  'message.html',
  'js/day.js',
  'js/message.js',
  'js/month.js',
  'js/monthReport.js',
  'js/register.js',
  // 'js/order.js',
  'js/wifiRequest.js',
  'js/app.js',
  'js/user.js',
  // './script.js'
  '../css/app.css',
  './mobile/bootstrap-table-mobile.js',
  './manifest/manifest.json'
];
const DATA_CACHE_NAME = 'data-cache-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Pre-caching offline files');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
  console.log(`SW '${SW_NAME}' installed`);
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
  console.log(`SW '${SW_NAME}' activated`);
});

self.addEventListener('fetch', evt => {
  if (evt.request.url.includes('database.mensa')) {
    console.log('SW: Fetch  (data)', evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(evt.request)
          .then((response) => {
            // If the response was good, clone it and store it in the cache.
            if (response.ok) {
              console.log('fetch from network');
              cache.put(evt.request.url, response.clone());
            }
            return response;
          }).catch((err) => {
            // Network request failed, try to get it from the cache.
            console.log('fetch from cache');
            return cache.match(evt.request);
          });
      }));
    return;
  }

  evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request)
        .then((response) => {
          return response || fetch(evt.request);
        }).catch((err) => {
          console.log('offline');
          return cache.match('offline.html');
        })
    })
  );
});