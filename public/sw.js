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
    console.log('📩 푸시 이벤트 발생:', event);

    let data = {
        title: 'WITHGO 알림',
        body: '새로운 알림이 도착했습니다.',
        url: '/',
    };

<<<<<<< HEAD
    const title = data.title || '알림';
    const options = {
        body: data.body || '새로운 알림이 도착했습니다.',
        icon: '/favicon.ico', // 알림에 표시될 아이콘 (필요시 교체)
        badge: '/favicon.ico', // 상태 표시줄 작은 아이콘
        data: data.url || '/', // 클릭 시 열릴 경로 (예: 상세 페이지)
=======
    try {
        if (event.data) {
            data = event.data.json();
            console.log('✅ 푸시 데이터 파싱 성공:', data);
        }
    } catch (err) {
        console.error('❌ 푸시 데이터 파싱 오류:', err);
    }

    const options = {
        body: data.body,
        icon: '/image/bbiyo.png',
        badge: '/image/bbiyo.png',
        data: { url: data.url },
>>>>>>> Home
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    console.log('🔔 알림 클릭:', event.notification);
    event.notification.close();

    const targetUrl = event.notification.data || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
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
