// Just Dice Show: funciona sin conexión
const CACHE='jds-v3';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    if(r.ok&&(e.request.url.startsWith(self.location.origin)||/fonts\.(googleapis|gstatic)\.com/.test(e.request.url))){
      const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
    }
    return r;
  }).catch(()=>caches.match('index.html'))));
});
