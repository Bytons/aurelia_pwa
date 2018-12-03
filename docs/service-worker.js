importScripts("/aurelia_pwa/precache-manifest.bebbc79a02bcec89d24c20a856ffa6b3.js", "/aurelia_pwa/workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/aurelia_pwa/workbox-v3.6.3"});
// disable/enable debug logging
workbox.setConfig({ debug: false });

const bgSyncPlugin = new workbox.backgroundSync.Plugin('test-queue', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

// plugin for cache expiry and clear
const expirationPlugin = new workbox.expiration.Plugin({
    maxEntries: 20
});

// cache opaque responses
const cacheOpaques = new workbox.cacheableResponse.Plugin({
    statuses: [0, 200]
});

const apiUrl = 'https://newsapi.org/v2/'
const redditExternalImgpreview = 'https://external-preview.redd.it/'
const redditInternalPreview = 'https://preview.redd.it/'
const redditMedia = 'https://i.redditmedia.com/'
const imgurSource = 'https://i.imgur.com/'



// custom "stale" returner for feed.
self.addEventListener('fetch', (event) => {
    const requestUrl = event.request.url;
    if (requestUrl.includes(apiUrl)) {
        console.log('Caught request for ' + requestUrl);
        // Prevent the default, and handle the request ourselves.
        event.respondWith(async function () {
            // Try to get the response from a cache.
            const cache = await caches.open('reddit-feed');
            const cachedResponse = await cache.match(event.request);

            if (cachedResponse) {
                // If we found a match in the cache, return it, but also
                // update the entry in the cache in the background.
                event.waitUntil(cache.add(event.request));
                console.log(`Stored new response:${requestUrl} in cache`)
                // post message to clients notifying of network response
                const clients = await self.clients.matchAll();
                for (const client of clients) {
                    client.postMessage({ cacheName: 'reddit-feed', updateUrl: requestUrl });
                }
                return cachedResponse;
            }
            // add fresh request to cache
            cache.add(event.request)
            // If we didn't find a match in the cache, use the network.
            return fetch(event.request)
        }());
    }
});

// routes

workbox.routing.registerRoute(
    new RegExp(redditMedia),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'media-reddit-images',
        plugins: [
            expirationPlugin
        ]
    }),
);

workbox.routing.registerRoute(
    new RegExp(redditExternalImgpreview),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'external-reddit-image-preview-feed',
        plugins: [
            expirationPlugin
        ]
    }),
);

workbox.routing.registerRoute(
    new RegExp(redditInternalPreview),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'internal-reddit-image-preview-feed',
        plugins: [
            expirationPlugin
        ]
    }),
);

workbox.routing.registerRoute(
    new RegExp(imgurSource),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'imgur-image-preview-feed',
        plugins: [
            expirationPlugin
        ]
    }),
);



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

// additional assets to precache
const additionalCacheAssets = ['https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2']

for (let i = 0; i < additionalCacheAssets.length; i++) {
    self.__precacheManifest.push({ url: additionalCacheAssets[i] });
}

// set precache
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// fallback route in SPA
workbox.routing.registerNavigationRoute('index.html');

