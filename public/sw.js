// Service Worker pour CaisseMobile - Version v5 ROBUSTE
const CACHE_NAME = 'caissemobile-v5';
const OFFLINE_URL = '/offline.html';

// Installation
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker v5 : Installation');
    self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker v5 : Activation');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch - Stratégie aggressive de cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-GET et autres domaines
    if (request.method !== 'GET' || url.origin !== location.origin) {
        return;
    }

    event.respondWith(
        // D'abord essayer le réseau
        fetch(request)
            .then((response) => {
                // Si succès, mettre en cache
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Si échec réseau, chercher dans le cache
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('📦 Cache:', url.pathname);
                        return cachedResponse;
                    }

                    // Pour les pages HTML, essayer de retourner la page d'accueil
                    if (request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('/').then(homeResponse => {
                            if (homeResponse) {
                                console.log('📦 Fallback page d\'accueil');
                                return homeResponse;
                            }
                            
                            // Dernière option : page offline basique
                            return new Response(
                                `<!DOCTYPE html>
                                <html lang="fr">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Hors ligne - CaisseMobile</title>
                                    <style>
                                        body { 
                                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                                            display: flex; 
                                            justify-content: center; 
                                            align-items: center; 
                                            height: 100vh; 
                                            margin: 0;
                                            background: #F8F9FA;
                                            color: #2C3E50;
                                            text-align: center;
                                            padding: 20px;
                                        }
                                        .container { max-width: 500px; }
                                        h1 { font-size: 48px; margin: 0 0 20px 0; }
                                        p { font-size: 16px; color: #6C757D; margin: 10px 0; }
                                        a { 
                                            display: inline-block; 
                                            margin-top: 20px; 
                                            padding: 12px 24px; 
                                            background: #343A40; 
                                            color: white; 
                                            text-decoration: none; 
                                            border-radius: 6px;
                                            font-weight: 500;
                                        }
                                        .status { 
                                            display: inline-block; 
                                            padding: 8px 16px; 
                                            background: #FFF5F5; 
                                            color: #C53030; 
                                            border-radius: 6px; 
                                            margin: 20px 0;
                                            font-weight: 500;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <h1>🔴</h1>
                                        <h2>Mode hors ligne</h2>
                                        <div class="status">Aucune connexion internet</div>
                                        <p>Cette page n'a pas encore été visitée en ligne.</p>
                                        <p>Pour utiliser l'application hors ligne, visitez d'abord toutes les pages en ligne.</p>
                                        <a href="/" onclick="window.location.reload(); return false;">Réessayer</a>
                                    </div>
                                </body>
                                </html>`,
                                { 
                                    status: 200,
                                    headers: { 
                                        'Content-Type': 'text/html; charset=utf-8'
                                    } 
                                }
                            );
                        });
                    }

                    // Pour les autres ressources, retourner une erreur propre
                    console.warn('❌ Non disponible hors ligne:', url.pathname);
                    return new Response('Offline', { status: 503 });
                });
            })
    );
});

// Message depuis le client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
