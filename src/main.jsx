import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
);

if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ 서비스워커 등록 성공:', registration);

            // ✅ 푸시 구독 시도
            const existingSub = await registration.pushManager.getSubscription();
            if (existingSub) {
                console.log('✅ 이미 푸시 구독 상태입니다.');
                return;
            }

            const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            const user_id = localStorage.getItem('user_id');
            if (!user_id) {
                console.warn('❗ user_id 없음. 푸시 구독 저장 생략');
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/alert/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id, subscription }),
            });

            const result = await res.json();
            console.log('✅ 푸시 구독 서버 전송 결과:', result);

        } catch (err) {
            console.error('❌ 서비스워커/푸시 등록 실패:', err);
        }
    });
}

// 🔧 VAPID Key 변환 함수
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}