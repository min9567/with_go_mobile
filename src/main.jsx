import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {supabase} from "./lib/supabase";
const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
);

// ✅ 푸시 구독 코드 추가
if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', async () => {
        try {
            const {
                data: { user }
            } = await supabase.auth.getUser();

            if (!user) {
                console.warn('❌ 로그인된 유저가 없습니다.');
                return;
            }

            const userId = user.id;

            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker 등록 완료');

            const VAPID_PUBLIC_KEY = 'BKxNZesYTPwz4Kx2mqWiBmeyamZw1MVLY6KFIDxLPNKkrtoM3lu5qgdxIyk6uKzNL7cnFjHEXo6XzM0raiROJNs';
            const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            });

            await fetch('/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    subscription
                })
            });

            console.log('✅ 푸시 구독 서버 전송 완료');

        } catch (err) {
            console.error('❌ 푸시 구독 실패:', err);
        }
    });
}

// 🔧 헬퍼 함수
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = window.atob(base64);
    return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}
