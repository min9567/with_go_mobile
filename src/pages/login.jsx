import { supabase } from "../lib/supabase.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../images/withgo.svg";
import kakao from "../images/kakao.svg";
import bbiyo from "../images/bbiyo.png";
import Swal from "sweetalert2";

import AndroiModal from "../component/AndroidModal.jsx"

const login = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [AndroidModal, setAndroidModal] = useState(false);

  const AndroidModalOpen = () => {
    setAndroidModal(true);
  };

  const AndroidModalClose = () => {
    setAndroidModal(false);
  };

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  useEffect(() => {
    const checkStandalone = () => {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
      ) {
        setIsInstalled(true);
      } else {
        setIsInstalled(false);
      }
    };
    checkStandalone();
    window.addEventListener("visibilitychange", checkStandalone);
    return () =>
      window.removeEventListener("visibilitychange", checkStandalone);
  }, []);

  const KakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: "https://with-go-mobile.vercel.app/login",
      },
    });
  };

  const Appinstall = async () => {
    if (isInstalled) {
      Swal.fire({
        icon: "info",
        title: "이미 설치되어 있습니다.",
        confirmButtonText: "확인",
      });
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="bg-blue-300 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center">
        <img src={logo} alt="" className="w-40" />
        <div className="flex justify-center items-center mt-10 text-[15px] text-center text-white font-semibold">
          <div className="mr-2 h-1 w-10 border-b border-b-white"></div>
          <h3>소셜계정 로그인</h3>
          <div className="ml-2 h-1 w-10 border-b border-b-white"></div>
        </div>
        <div className="mt-3 flex justify-center items-center">
          <button onClick={KakaoLogin}>
            <img src={kakao} alt="kakao" className="w-14 py-2 cursor-pointer" />
          </button>
        </div>
        <div className="flex justify-center items-center mt-10 text-[15px] text-center text-white font-semibold">
          <div className="mr-2 h-1 w-10 border-b border-b-white"></div>
          <h3>앱 설치</h3>
          <div className="ml-2 h-1 w-10 border-b border-b-white"></div>
        </div>
        <div className="mt-3 flex justify-center items-center">
          <button onClick={Appinstall} className="" disabled={!deferredPrompt}>
            <img
              src={bbiyo}
              alt="로고"
              className="w-14 h-14 rounded-full object-cover cursor-pointer"
            />
          </button>
        </div>
        <div>
          <button
          className="mt-5 mb-1 text-[13px] text-white"
          onClick={AndroidModalOpen}>
            [ 안드로이드/Android 설치방법 ]
          </button>
        </div>
        <div>
          <button className="mb-5 text-[13px] text-white">
            [ 애플/iPhone 설치방법 ]
          </button>
        </div>
      </div>
      {AndroidModal && <AndroiModal onClose={AndroidModalClose} />}
    </div>
  );
};

export default login;
