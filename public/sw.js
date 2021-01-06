const version = '1.0.0'

self.addEventListener('install', (event) => {
    console.log(`Version ${version} of the serviceWorker was installed.`)
    // Caching resources should be done here. 
})

self.addEventListener('activate', (event) => {
    console.log(`Version ${version} of the serviceWorker was activated.`)
    // Here we can clean up older cache.

    const clearPreviousCaches = async () => {
        const currentCaches = await caches.keys()

        return Promise.all(
            currentCaches.map((cc) => {
                if (cc !== version) {
                    console.info(`ServiceWorker clearing cache: ${cc}`)
                    return caches.delete(cc)
                }
                
                return undefined
            })
        )
    }

    // We make sure to wait until previous caches are removed before continuing. 
    event.waitUntil(clearPreviousCaches())
})

self.addEventListener('fetch', (event) => {
    const cachedFetch = async request => {
        try {
            const response = await fetch(request)
            // Saving the result in the cache
            const cache = await self.caches.open(version)
            cache.put(request, response.clone())

            return response
        } catch (err) {
            // Runs when the client cannot access the server.
            console.info('Service worker caching resuslt')
            return caches.match(request)
        }
    }

    console.log('ServiceWorker fetching...')
    event.respondWith(cachedFetch(event.request))
})

self.addEventListener('message', (event) => {
    console.log('ServiceWorker: Got a message')
    // Handle events from the main application.
})

self.addEventListener('push', (event) => {
    console.log('ServiceWorker: got apushmessage from the server')
    // Here we show pushnotifications for the user. 
})


