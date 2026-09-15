/* witsahead.org offline layer, version 202609150539. Pages and data: network first, cached copy when offline.
   Assets: cache first. Nothing is cached from other origins except the fonts. The visitor counter is never cached. */
var V='wa-202609150539', PAGES=["/", "/news/", "/projects/", "/fr/", "/fr/news/", "/news.json", "/fr/news.json", "/offline/", "/assets/favicon.svg", "/assets/app-icon-192.png"];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(PAGES.map(function(u){return fetch(u,{cache:'no-store'}).then(function(r){if(r.ok)return c.put(u,r);}).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
 if(u.hostname.indexOf('goatcounter')>-1||u.hostname==='gc.zgo.at'||u.pathname.indexOf('/cdn-cgi/')===0)return;
 var sameOrigin=u.origin===self.location.origin, isFont=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
 if(!sameOrigin&&!isFont)return;
 var isPage=r.mode==='navigate'||/\.(json|xml|ics)$/.test(u.pathname);
 if(isPage){e.respondWith(fetch(r).then(function(res){if(res.ok&&res.type==='basic'){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});}return res;}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('/offline/',{ignoreSearch:true});});}));return;}
 e.respondWith(caches.match(r).then(function(m){if(m){fetch(r).then(function(res){if(res.ok)caches.open(V).then(function(c){c.put(r,res);});}).catch(function(){});return m;}return fetch(r).then(function(res){if(res.ok&&(res.type==='basic'||isFont)){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});}return res;});}));
});
self.addEventListener('message',function(e){if(e.data==='skipWaiting')self.skipWaiting();});
