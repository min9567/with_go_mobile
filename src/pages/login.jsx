import { supabase } from "../lib/supabase.js";

import logo from '../images/withgo.svg'
import kakao from '../images/kakao.svg'

const login = () => {
  
  const KakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "kakao"
    });
  };

  return (
    <div className="bg-blue-300 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center">
        <img src={logo} alt="" className="w-40" />
        <div className="flex justify-center items-center mt-10 text-[15px] text-center text-white font-semibold">
          <div className='mr-2 h-1 w-10 border-b border-b-white'></div>
          <h3>소셜계정 로그인</h3>
          <div className='ml-2 h-1 w-10 border-b border-b-white'></div>
        </div>
        <div className="mt-3 flex justify-center items-center">
          <button onClick={KakaoLogin}>
            <img src={kakao} alt="kakao" className='w-14 py-2 cursor-pointer' />
          </button>
        </div>
      </div>
    </div>

  );
};

export default login;
