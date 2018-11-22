importScripts("/aurelia_pwa/precache-manifest.11877c6b55351eb7cc607c7f53a5b2b8.js", "/aurelia_pwa/workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/aurelia_pwa/workbox-v3.6.3"});
// disable/enable debug logging
this.workbox.setConfig({ debug: true });


self.addEventListener('message', (messageEvent) => {

    switch (messageEvent.data.id) {
        // handle reload of content
        case 'skipWaiting':
            return skipWaiting();
        // clear all caches and metadata
        case 'clear-cache':
            console.log('all caches emptied')
            expirationPlugin.deleteCacheAndMetadata();
            break;
        // delete specific cache
        case 'delete-cache':
            deleteCache(messageEvent.data);
        // delete specific entry from a specific cache
        case 'remove-entry':
            removeEntry(messageEvent.data);
            break;
        default:
            console.log(messageEvent);
    }
});

function deleteCache(data) {
    caches.delete(data.cacheName).then(() => {
        console.log(`cache:${data.cacheName} deleted`)
    });
}

function removeEntry(data) {
    const cacheUrl = `${data.cacheName}`
    caches.open(cacheUrl).then((cache) => {
        cache.delete(data.entry).then((response) => {
            console.log(`cached response found: ${data.entry} and removed:${response}`);
        });
    })
}


// set precache
this.workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// fallback route in SPA
this.workbox.routing.registerNavigationRoute('/index.html');
