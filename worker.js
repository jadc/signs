self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open("signs")
            .then(function(cache) {
                return cache.addAll(["index.html", "style.css", "script.js", "trash.svg"]);
            })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) return response;
                return fetch(event.request);
            }
        )
    );
});