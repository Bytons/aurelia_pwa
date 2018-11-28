# Showcasing aurelia framework alongside Google's workbox to create a PWA

The application uses TypeScript for js compiler + Webpack for bundling and Aurelia as the UI-renderer.


**How it works:**


Using google's Workbox webpack plugin the application injects a Service Worker file into the browser that is then executed. The service worker runs in the background and works as a kind of "proxy" for pre-defined traffic.

The application's content is powered by newsAPI.org where it fetches the top-10 trending reddit articles of the day, updating daily. 

These requests to the api are cached with the service worker and then served stale, from the cache and updating only when the cache has gotten an updated request. This is done via Workbox's StaleWhileRevalidate routing plugin.


**Aurelia:**

The application via aurelia dynamically composes a view that serves the feed of articles, from the fetched data. The app monitors the navigator's online status and then with the Aurelia's eventAggregator publishes the state of connection to the internet to other parts of the application. With this the application can let the user know if and when the application is offline.


