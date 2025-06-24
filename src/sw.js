self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || '알림';
    const options = {
        body: data.body || "메세지 도착",
        icon: "/image/bbiyo.png",
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});