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
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// fallback route in SPA
workbox.routing.registerNavigationRoute('/index.html');
