// Service Worker for Smart Choices Guide PWA
const CACHE_NAME = 'smart-choices-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/index-custom.css',
    '/niche-base.css',
    '/bot/ai-chat-simple.css',
    '/bot/ai-chat-simple.js',
    '/bot/combo-database.js',
    '/manifest.json',
    '/images/logo.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
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
