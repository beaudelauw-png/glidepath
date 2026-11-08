const C='glidepath-v2',F=['./','index.html','manifest.json','icon.svg','icon-192.png','icon-512.png'];
// store clean copies (iOS refuses cached responses that came via a redirect)
const clean=r=>r.redirected?r.blob().then(b=>new Response(b,{headers:r.headers})):r;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(f=>fetch(f,{cache:'reload'}).then(clean).then(r=>c.put(f,r))))));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('index.html')));return}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));
});
