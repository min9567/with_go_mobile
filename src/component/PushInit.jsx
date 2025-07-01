import { useEffect } from "react";
import {supabase} from "../lib/supabase";

const PUBLIC_VAPID_KEY = "BKxNZesYTPwz4Kx2mqWiBmeyamZw1MVLY6KFIDxLPNKkrtoM3lu5qgdxIyk6uKzNL7cnFjHEXo6XzM0raiROJNs";

export default function PushInit() {
    useEffect(() => {
        const initPush = async () => {
            try {
                // 알림 권한 요청
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    alert("알림 권한이 거부되었습니다.");
                    return;
                }

                // 서비스 워커 준비되면 푸시 구독 생성
                const reg = await navigator.serviceWorker.ready;

                const subscription = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
                });

                console.log("🔔 구독 정보:", subscription);

                // 현재 로그인된 사용자 가져오기
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error("사용자 정보를 가져올 수 없습니다.");
                    return;
                }

                // Supabase에 구독 정보 저장
                const { error } = await supabase.from("subscription").upsert({
                    user_id: user.id,
                    subscription: subscription,
                });

                if (error) {
                    console.error("📡 Supabase 저장 실패:", error.message);
                } else {
                    console.log("✅ 구독 정보 저장 완료");
                }
            } catch (err) {
                console.error("PushInit 오류:", err);
            }
        };

        function urlBase64ToUint8Array(base64String) {
            const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
            const base64 = (base64String + padding)
                .replace(/-/g, "+")
                .replace(/_/g, "/");
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

        initPush();
    }, []);

    return null;
}