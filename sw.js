/* witsahead.org offline layer, version 202609181541. Pages and data: network first, cached copy when offline.
   Assets: cache first. Nothing is cached from other origins except the fonts. The visitor counter is never cached. */
var V='wa-202609181541', PAGES=["/", "/news/", "/projects/", "/news.json", "/offline/", "/assets/favicon.svg", "/assets/app-icon-192.png", "/fr/", "/fr/news/", "/fr/news.json", "/es/", "/es/news/", "/es/news.json", "/pt/", "/pt/news/", "/pt/news.json", "/zh/", "/zh/news/", "/zh/news.json", "/zu/", "/zu/news/", "/zu/news.json"];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(PAGES.map(function(u){return fetch(u,{cache:'no-store'}).then(function(r){if(r.ok)return c.put(u,r);}).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
 if(u.hostname.indexOf('goatcounter')>-1||u.hostname==='gc.zgo.at'||u.pathname.indexOf('/cdn-cgi/')===0||u.pathname.indexOf('/audio/')===0)return;
 var sameOrigin=u.origin===self.location.origin, isFont=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
 if(!sameOrigin&&!isFont)return;
 var isPage=r.mode==='navigate'||/\.(json|xml|ics)$/.test(u.pathname);
 if(isPage){e.respondWith(fetch(r).then(function(res){if(res.ok&&res.type==='basic'){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});}return res;}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('/offline/',{ignoreSearch:true});});}));return;}
 e.respondWith(caches.match(r).then(function(m){if(m){fetch(r).then(function(res){if(res.ok)caches.open(V).then(function(c){c.put(r,res);});}).catch(function(){});return m;}return fetch(r).then(function(res){if(res.ok&&(res.type==='basic'||isFont)){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});}return res;});}));
});
self.addEventListener('message',function(e){if(e.data==='skipWaiting')self.skipWaiting();if(e.data&&e.data.type==='prefs')e.waitUntil(setPrefs(e.data.prefs));});
/* Notifications: pushes carry no payload; on arrival the newest event for the visitor's chosen topics is fetched and shown. */
function getPrefs(){return caches.open('wa-prefs').then(function(c){return c.match('/__prefs');}).then(function(r){return r?r.json():{};}).catch(function(){return {};});}
function setPrefs(p){return caches.open('wa-prefs').then(function(c){return c.put('/__prefs',new Response(JSON.stringify(p),{headers:{'content-type':'application/json'}}));});}
self.addEventListener('push',function(e){e.waitUntil(getPrefs().then(function(prefs){return fetch('https://notify.witsahead.org/latest',{cache:'no-store'}).then(function(r){return r.json();}).then(function(d){
 var topics=prefs.topics||[],fresh=prefs.subscribedAt&&(Date.now()-prefs.subscribedAt<180000);
 var evs=(d.events||[]).filter(function(ev){return topics.indexOf(ev.topic)>-1||(ev.topic==='test'&&fresh);});
 var ev=evs[0];if(!ev||ev.id===prefs.lastId)return;prefs.lastId=ev.id;var lg=prefs.lang||'en',fr=lg==='fr';var tt=ev['title_'+lg]||ev.title,bb=ev['body_'+lg]||ev.body||'';
 return setPrefs(prefs).then(function(){return self.registration.showNotification(tt,{body:bb,icon:'/assets/app-icon-192.png',badge:'/assets/app-icon-192.png',tag:'wa-'+ev.topic,renotify:true,lang:lg,data:{url:ev.url||'https://witsahead.org/'}});});
});}));});
self.addEventListener('notificationclick',function(e){e.notification.close();var u=(e.notification.data&&e.notification.data.url)||'https://witsahead.org/';e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(ws){for(var i=0;i<ws.length;i++){if(ws[i].url===u&&'focus' in ws[i])return ws[i].focus();}return clients.openWindow(u);}));});
self.addEventListener('pushsubscriptionchange',function(e){e.waitUntil(getPrefs().then(function(prefs){return self.registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:prefs.key}).then(function(sub){return fetch('https://notify.witsahead.org/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({subscription:sub.toJSON(),topics:prefs.topics||['briefing'],lang:prefs.lang||'en'})});});}));});
