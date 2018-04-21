const staticAssets = [
	'./',
	'./styles.css',
	'./app.js',
	'./fallback.json',
	'./images/test.jpg'
];

self.addEventListener('install', async event => {
	const cache = await caches.open('news-static');
	cache.addAll(staticAssets);
})

self.addEventListener('fetch', event => {
	const request = event.request;
	const url = new URL(request.url);

	if (url.origin === location.origin){
		event.respondWith(cacheFirst(request));
	} 
	else{
		event.respondWith(networkFirst(request));
	}
	event.respondWith(cacheFirst(request));
})

async function cacheFirst(req) {
	const cachedResponse = await caches.match(req)
	return cachedResponse || fetch(req);
}

async function networkFirst(req) {
	const cache = await caches.open('news-dynamic');
	try{
		const res = await fetch(req);
		cache.put(req, res.clone());
		return res;
	}
	catch(err){
		const cachedResponse = await cache.match(req);
		return cachedResponse || await caches.match('./fallback.json')
		// return await cache.match(req);
	}
}