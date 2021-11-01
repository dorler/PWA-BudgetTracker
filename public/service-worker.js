const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './icons'
];

self.addEventListener('fetch', function(event) {
    event.respondWith(CACHES.MATCH(event.request).then(function(request){
        if (request) {
            console.log('responding with cache: ' + event.request.url)
            return request
          } else {
            console.log('file is not cached, fetching: ' + event.request.url)
            return fetch(event.request)
          }
        }))
    });
    