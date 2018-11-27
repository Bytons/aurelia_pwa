importScripts("/aurelia_pwa/precache-manifest.3362ad095d33f59294e32a7a3f80c8e3.js", "/aurelia_pwa/workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/aurelia_pwa/workbox-v3.6.3"});
// disable/enable debug logging
workbox.setConfig({ debug: true });

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



// routes
workbox.routing.registerRoute(
    new RegExp(apiUrl),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'reddit-feed',
        plugins: [
            expirationPlugin,
            bgSyncPlugin,
            cacheOpaques,
            new workbox.broadcastUpdate.Plugin('reddit-feed-updates')
        ]
    }),
);

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

