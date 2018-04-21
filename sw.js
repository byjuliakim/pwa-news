importScripts('./node_modules/workbox-sw/build/workbox-sw.js')

const staticAssets = [
	'./',
	'./styles.css',
	'./app.js',
	'./fallback.json',
	'./images/test.jpg'
];

workbox.precaching.precacheAndRoute(staticAssets);

workbox.routing.registerRoute( new RegExp('^https://newsapi.org/'), workbox.strategies.networkFirst());
workbox.routing.registerRoute( new RegExp('.*\.(png|jpg|jpeg|gif)'), workbox.strategies.cacheFirst({
	cacheName: 'news-image',
	plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 12 * 60 * 60,
      }),
       new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      })
    ],
}))