const CACHE_NAME = 'sut-weather-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'css/style.css',
  'js/app.js',
  'images/icon.png',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// تثبيت الـ Service Worker وحفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// التعامل مع الطلبات (Fetch)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // لو الملف موجود في الكاش رجعه، لو مش موجود هاته من النت
      return response || fetch(event.request);
    }).catch(() => {
      // لو فشل الاتصال خالص (Offline)
      if (event.request.mode === 'navigate') {
        return caches.match('index.html');
      }
    })
  );
});