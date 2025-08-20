/**
 * Service Worker - Estoca.AI
 * Funcionalidades: Cache, Offline Mode, Push Notifications
 */

const CACHE_NAME = 'estoca-ai-v1.2';
const STATIC_CACHE = 'estoca-ai-static-v1.2';
const DYNAMIC_CACHE = 'estoca-ai-dynamic-v1.2';

// Arquivos para cache estático
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/css/enhanced-styles.css',
    '/script.js',
    '/js/chat-ai.js',
    '/js/dashboard.js',
    '/js/advanced-features.js',
    '/ce871213-1168-48f7-b65f-4681ac5f7386.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Dados para cache offline
const OFFLINE_DATA = {
    sales: [
        { date: '2024-01-31', value: 45230, products: 1247 },
        { date: '2024-01-30', value: 38900, products: 1156 },
        { date: '2024-01-29', value: 42100, products: 1203 }
    ],
    inventory: [
        { id: 1, name: 'Produto A', stock: 150, category: 'Eletrônicos' },
        { id: 2, name: 'Produto B', stock: 89, category: 'Roupas' },
        { id: 3, name: 'Produto C', stock: 234, category: 'Casa' }
    ],
    customers: [
        { id: 1, name: 'João Silva', email: 'joao@email.com', status: 'ativo' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', status: 'ativo' },
        { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', status: 'inativo' }
    ]
};

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache estático
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('📦 Caching static files...');
                return cache.addAll(STATIC_FILES);
            }),
            
            // Cache de dados offline
            caches.open(DYNAMIC_CACHE).then((cache) => {
                console.log('💾 Caching offline data...');
                return cache.put('/api/offline-data', new Response(JSON.stringify(OFFLINE_DATA)));
            })
        ])
    );
    
    // Forçar ativação imediata
    self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker: Activated');
    
    event.waitUntil(
        // Limpar caches antigos
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Assumir controle imediatamente
    self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Estratégia Cache First para arquivos estáticos
    if (STATIC_FILES.some(file => request.url.includes(file))) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Estratégia Network First para APIs
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Estratégia Stale While Revalidate para outros recursos
    event.respondWith(staleWhileRevalidate(request));
});

// Estratégia Cache First
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
        
        return networkResponse;
    } catch (error) {
        console.error('Cache First failed:', error);
        return new Response('Offline - Recurso não disponível', { status: 503 });
    }
}

// Estratégia Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache apenas respostas bem-sucedidas
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', request.url);
        
        // Tentar cache como fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Retornar dados offline se disponíveis
        if (request.url.includes('/api/')) {
            return getOfflineData(request);
        }
        
        return new Response('Offline - Dados não disponíveis', { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Estratégia Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Buscar nova versão em background
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    });
    
    // Retornar cache imediatamente se disponível, senão aguardar network
    return cachedResponse || fetchPromise;
}

// Retornar dados offline
async function getOfflineData(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    if (path.includes('sales')) {
        return new Response(JSON.stringify(OFFLINE_DATA.sales), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    if (path.includes('inventory')) {
        return new Response(JSON.stringify(OFFLINE_DATA.inventory), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    if (path.includes('customers')) {
        return new Response(JSON.stringify(OFFLINE_DATA.customers), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    return new Response(JSON.stringify({ error: 'Dados não disponíveis offline' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
    });
}

// Push Notifications
self.addEventListener('push', (event) => {
    console.log('📱 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Nova notificação do Estoca.AI',
        icon: '/ce871213-1168-48f7-b65f-4681ac5f7386.jpg',
        badge: '/ce871213-1168-48f7-b65f-4681ac5f7386.jpg',
        vibrate: [200, 100, 200],
        data: {
            url: '/',
            timestamp: Date.now()
        },
        actions: [
            {
                action: 'open',
                title: 'Abrir App',
                icon: '/ce871213-1168-48f7-b65f-4681ac5f7386.jpg'
            },
            {
                action: 'close',
                title: 'Fechar'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Estoca.AI', options)
    );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Sincronização em background
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered');
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncOfflineData());
    }
});

// Sincronizar dados offline
async function syncOfflineData() {
    try {
        const offlineData = await getStoredOfflineData();
        
        if (offlineData.length > 0) {
            console.log('📤 Syncing offline data...');
            
            // Simular envio de dados para servidor
            for (const data of offlineData) {
                await fetch('/api/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            // Limpar dados offline após sincronização
            await clearOfflineData();
            console.log('✅ Offline data synced successfully');
        }
    } catch (error) {
        console.error('❌ Sync failed:', error);
    }
}

// Obter dados offline armazenados
async function getStoredOfflineData() {
    // Implementar lógica para recuperar dados offline do IndexedDB
    return [];
}

// Limpar dados offline
async function clearOfflineData() {
    // Implementar lógica para limpar dados offline do IndexedDB
    console.log('🧹 Offline data cleared');
}

// Mensagens do cliente
self.addEventListener('message', (event) => {
    console.log('💬 Message from client:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Tratamento de erros
self.addEventListener('error', (event) => {
    console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

console.log('🚀 Service Worker loaded successfully!');
