// Umrah Aamani service worker — main tanpa internet
const VERSION = 'umrah-aamani-v3';
const CORE = [
  './', './index.html', './manifest.webmanifest', './css/style.css',
  './js/main.js', './js/content.js', './js/audio.js', './js/three-common.js', './js/scene-tawaf.js', './js/scene-sai.js',
  './vendor/three.module.min.js', './vendor/OrbitControls.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png',
  './assets/icons/avatar-lelaki.webp',
  './assets/icons/avatar-perempuan.webp',
  './assets/icons/badge-doa.webp',
  './assets/icons/badge-hijau.webp',
  './assets/icons/badge-ihram.webp',
  './assets/icons/badge-istilam.webp',
  './assets/icons/badge-juara.webp',
  './assets/icons/badge-kenali.webp',
  './assets/icons/badge-larangan.webp',
  './assets/icons/badge-mula.webp',
  './assets/icons/badge-sai.webp',
  './assets/icons/badge-tahallul.webp',
  './assets/icons/badge-tawaf.webp',
  './assets/icons/badge-umrah.webp',
  './assets/icons/haji-akan-datang.webp',
  './assets/icons/hud-auto.webp',
  './assets/icons/hud-jalan.webp',
  './assets/icons/hud-lari.webp',
  './assets/icons/ikon-kaki-kanan.webp',
  './assets/icons/ikon-masa.webp',
  './assets/icons/jawapan-boleh.webp',
  './assets/icons/jawapan-larangan.webp',
  './assets/icons/kad-apa-umrah.webp',
  './assets/icons/kad-miqat.webp',
  './assets/icons/kad-rukun.webp',
  './assets/icons/kad-wajib.webp',
  './assets/icons/langkah-mandi.webp',
  './assets/icons/langkah-niat.webp',
  './assets/icons/langkah-pakai-ihram.webp',
  './assets/icons/langkah-solat.webp',
  './assets/icons/langkah-talbiah.webp',
  './assets/icons/larangan-baju-jahit.webp',
  './assets/icons/larangan-bertengkar.webp',
  './assets/icons/larangan-buru.webp',
  './assets/icons/larangan-cermin-mata.webp',
  './assets/icons/larangan-cukur.webp',
  './assets/icons/larangan-jam.webp',
  './assets/icons/larangan-kopiah.webp',
  './assets/icons/larangan-kuku.webp',
  './assets/icons/larangan-payung.webp',
  './assets/icons/larangan-purdah.webp',
  './assets/icons/larangan-sabun.webp',
  './assets/icons/larangan-sarung-tangan.webp',
  './assets/icons/larangan-wangian.webp',
  './assets/icons/larangan-zikir.webp',
  './assets/icons/mascot-jamal-ceria.webp',
  './assets/icons/mascot-jamal.webp',
  './assets/icons/mata-bintang.webp',
  './assets/icons/naik-tahap.webp',
  './assets/icons/pasang-app.webp',
  './assets/icons/selepas-doa.webp',
  './assets/icons/selepas-solat-tawaf.webp',
  './assets/icons/selepas-zamzam.webp',
  './assets/icons/stage-ihram.webp',
  './assets/icons/stage-kenali.webp',
  './assets/icons/stage-kuiz.webp',
  './assets/icons/stage-sai.webp',
  './assets/icons/stage-tahallul.webp',
  './assets/icons/stage-tawaf.webp',
  './assets/icons/stage-terkunci.webp',
  './assets/icons/tab-doa.webp',
  './assets/icons/tab-lencana.webp',
  './assets/icons/tab-peta.webp',
  './assets/icons/tab-tetapan.webp',
  './assets/icons/tahallul-cukur.webp',
  './assets/icons/tahallul-gunting.webp',
  './assets/icons/tetapan-bunyi.webp',
  './assets/icons/tetapan-getar.webp',
  './assets/icons/tetapan-reset.webp',
  './assets/tex/langit.jpg',
  './assets/tex/tex-batu-bukit.jpg',
  './assets/tex/tex-jalur-emas.jpg',
  './assets/tex/tex-kiswah.jpg',
  './assets/tex/tex-lantai-masa.jpg',
  './assets/tex/tex-marmar.jpg',
  './assets/tex/tex-pintu-kaabah.jpg'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Fon Google: stale-while-revalidate
  if (url.host.includes('fonts.googleapis.com') || url.host.includes('fonts.gstatic.com')) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // Navigasi: rangkaian dulu, jatuh balik ke cache
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const cl = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', cl)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  // Aset: cache dulu
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const cl = r.clone(); caches.open(VERSION).then(c => c.put(req, cl)); }
    return r;
  })));
});
