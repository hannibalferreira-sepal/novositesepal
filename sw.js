/* sw.js — service worker da Sepal (protótipo v3). Fica na RAIZ (escopo ./).
   • Shell em cache (HTML, JS, CSS, fontes, ícones) para abrir offline.
   • HTML: rede primeiro; sem rede, devolve o shell ou a página offline.
   • Demais arquivos: devolve o cache e atualiza em segundo plano.
   • push / notificationclick prontos para o push real (VAPID) no produto.
   Para publicar uma nova versão, troque V. */
const V = 'sepal-v3-3';
const SHELL = ['./', 'index.html', 'site.html', 'area-missionaria.html', 'painel-vinculo.html', 'offline.html', 'assets/orig-fonts.css',
  'assets/vendor/embed.js', 'assets/vendor/support.js', 'assets/vendor/react.min.js', 'assets/vendor/react-dom.min.js', 'assets/vendor/sepal-globe.js',
  'assets/vendor/d3.min.js', 'assets/vendor/topojson-client.min.js', 'assets/vendor/land-110m.json',
  'assets/fonts/Montserrat.woff2', 'assets/fonts/figtree.woff2', 'manifest.webmanifest', 'favicon.png',
  'assets/app.js', 'assets/app.css', 'assets/fonts/Archivo-300-900.woff2', 'assets/fonts/InstrumentSans.woff2',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/badge-96.png',
  'assets/img/logo-cor.png', 'assets/img/logo-branco.webp', 'assets/img/mini.png',
  'assets/img/s-1.webp', 'assets/img/s-2.webp', 'assets/img/s-3.webp', 'assets/img/s-4.webp', 'assets/img/s-5.webp', 'assets/img/s-6.webp',
  'assets/img/s-7.webp', 'assets/img/s-8.webp', 'assets/img/s-9.webp', 'assets/img/s-10.webp', 'assets/img/s-11.webp'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
const ALIAS = { '/area-missionaria': '/area-missionaria.html', '/painel-vinculo': '/painel-vinculo.html', '/site': '/site.html' };
/* chave de cache = origem + caminho (sem ?embed=1 etc.), para o iframe funcionar offline */
const chave = (r) => { const u = new URL(r.url || r, self.location.href); const p = ALIAS[u.pathname] || u.pathname; return u.origin + p; };
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.headers.has('range')) return;
  const k = chave(r);
  const guarda = (res) => { if (res && res.ok && res.type === 'basic' && !res.redirected) { const cp = res.clone(); caches.open(V).then((c) => c.put(k, cp)); } return res; };
  if (r.mode === 'navigate') {
    const doc = r.destination === 'document';
    e.respondWith(fetch(r).then(guarda).catch(() => caches.match(k).then((m) => m || (doc ? caches.match('index.html') : null)).then((m) => m || caches.match('offline.html'))));
    return;
  }
  e.respondWith(caches.match(k).then((m) => {
    const rede = fetch(r).then(guarda).catch(() => m);
    return m || rede;
  }));
});
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (er) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Sepal', { body: d.body || 'Você tem uma novidade.', icon: 'assets/icons/icon-192.png', badge: 'assets/icons/badge-96.png', tag: d.tag || 'sepal', data: { url: d.url || './#/atendimento' } }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if ('focus' in c) { c.navigate && c.navigate(url).catch(() => {}); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
