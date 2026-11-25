// Just Dice Show: funciona sin conexión.
// Páginas: primero internet (siempre la última versión); si no hay conexión, la copia guardada.
// Iconos y fuentes: primero la copia guardada (no cambian).
const CACHE='jds-v6';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))));self.clients.claim()});
const keep=(req,r)=>{if(r.ok&&(req.url.startsWith(self.location.origin)||/fonts\.(googleapis|gstatic)\.com/.test(req.url))){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return r};
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const isPage=req.mode==='navigate'||/\.html?$|\/$/.test(new URL(req.url).pathname);
  if(isPage){
    e.respondWith(fetch(req,{cache:'no-store'}).then(r=>keep(req,r)).catch(()=>caches.match(req).then(hit=>hit||caches.match('index.html'))));
  }else{
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>keep(req,r))));
  }
});
