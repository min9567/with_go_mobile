// Workbox 라이브러리 CDN으로 불러오기
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
    console.log('✅ Workbox 로딩 성공');

    // 정적 리소스 캐싱
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
    workbox.precaching.cleanupOutdatedCaches();

// SPA의 페이지 네비게이션 처리
workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst()
);
} else {
    console.log('❌ Workbox 로딩 실패');
}

// 푸시 알림 수신 처리
self.addEventListener('push', (event) => {
    console.log('📩 푸시 알림 수신됨:', event);
    const data = event.data?.json() || {
        title: 'WITHGO 알림',
        body: '새로운 알림이 도착했습니다.',
        url: '/',
    };

    const options = {
        body: data.body,
        icon: '/image/bbiyo.png',
        badge: '/image/bbiyo.png',
        data: {
            url: data.url,
        },
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 알림 클릭 시 해당 URL로 이동
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
