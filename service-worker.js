const CACHE_NAME = 'game-designer-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/components.css',
    '/css/themes.css',
    '/js/main.js',
    '/js/database.js',
    '/js/ui-handlers.js',
    '/js/asset-manager.js',
    '/js/exporters.js',
    '/js/asset-definitions.js',
    '/data/initial-scenes.json',
    '/data/dialogue-trees.json',
    '/data/character-profiles.json',
    '/sprites/wario/default.png',
    '/sprites/luigi/default.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline changes
self.addEventListener('sync', event => {
    if (event.tag === 'sync-changes') {
        event.waitUntil(syncChanges());
    }
});

async function syncChanges() {
    const db = await idb.open('GameDesignerDB');
    const changes = await db.getAll('offlineChanges');
    
    for (const change of changes) {
        await processChange(change);
    }
}
