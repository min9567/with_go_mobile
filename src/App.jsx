import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import "./App.css";

import Header from "./layout/header";
import ScrollTop from "./component/ScrollTop";
import PrivateRoute from "./component/PrivateRoute"

import Delivery from "./pages/Delivery";
import DeliveryDetail from "./pages/DeliveryDetail";
import DeliveryPayment from "./pages/DeliveryPayment";

import Storage from "./pages/Storage";
import StorageDetail from "./pages/StorageDetail";
import StoragePayment from "./pages/StoragePayment";

import Check from "./pages/Check";
import Login from "./pages/login";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
);

const API_URL = import.meta.env.VITE_API_URL;


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                localStorage.setItem("user_id", user.id);
                console.log("✅ 로그인된 사용자 ID 저장됨:", user.id);
            } else {
                console.warn("❌ 로그인된 사용자 없음");
            }
        };

        fetchUser();
    }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.pushManager.getSubscription().then((existingSub) => {
                if (existingSub) {
                    console.log("✅ 이미 구독된 상태입니다.");
                    return;
                }

                registration.pushManager
                    .subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
                    })
                    .then((subscription) => {
                        const user_id = localStorage.getItem("user_id");
                        if (!user_id) {
                            console.warn("❗ user_id가 없습니다. 구독 생략");
                            return;
                        }
                        return fetch(`${import.meta.env.VITE_API_URL}/alert/subscribe`, {
                            method: "POST",
                            body: JSON.stringify({ user_id, subscription }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                    })
                    .then((res) => res?.json?.())
                    .then((data) => {
                        if (data) console.log("✅ 알림 구독 완료:", data);
                    })
                    .catch((err) => {
                        console.error("❌ 알림 구독 실패:", err);
                    });
            });
        });
    }
  }, []);

  return (
    <>
      <ScrollTop />
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<PrivateRoute><Check /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/delivery" element={<PrivateRoute><Delivery /></PrivateRoute>} />
        <Route path="/delivery/detail" element={<PrivateRoute><DeliveryDetail /></PrivateRoute>} />
        <Route path="/delivery-payment-success" element={<PrivateRoute><DeliveryPayment /></PrivateRoute>} />
        <Route path="/storage" element={<PrivateRoute><Storage /></PrivateRoute>} />
        <Route path="/storage/detail" element={<PrivateRoute><StorageDetail /></PrivateRoute>} />
        <Route path="/storage-payment-success" element={<PrivateRoute><StoragePayment /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
