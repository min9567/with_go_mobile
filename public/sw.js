self.addEventListener('push', function (event) {
    console.log('📩 푸시 수신:', event);

    let data = {};
    if (event.data) {
        try {
            data = event.data.json(); // 서버에서 JSON 형태로 보냈다고 가정
        } catch (e) {
            console.error('❌ JSON 파싱 오류:', e);
        }
    }

    const title = data.title || '알림';
    const options = {
        body: data.body || '새로운 알림이 도착했습니다.',
        icon: '/favicon.ico', // 알림에 표시될 아이콘 (필요시 교체)
        badge: '/favicon.ico', // 상태 표시줄 작은 아이콘
        data: data.url || '/', // 클릭 시 열릴 경로 (예: 상세 페이지)
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
