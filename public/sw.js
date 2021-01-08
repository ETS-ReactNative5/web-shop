console.log("Test")
/*let cacheData="v5"
let cacheName=[   
     '/index.html',
     '/static/js/bundle.js',
     '/static/js/1.chunk.js',
     '/static/js/main.chunk.js'
]
this.addEventListener("install",((event)=>{
     console.log("install")
     event.waitUntil(
          caches.open(cacheData).then((cache)=>{
               cache.addAll(cacheName)
          })
     )

}))
this.addEventListener("fetch",((event)=>{
     console.log("fetch")
     event.respondWith(
          fetch(event.request)
               .then(res =>{
                    const resClone = res.clone();
                    caches.open(cacheName).then((cache)=>{
                         cache.put(event.request,resClone);
                    })
                    return res;
               }).catch(err =>caches.match(event.req).then(res => res))
     )

}))*/