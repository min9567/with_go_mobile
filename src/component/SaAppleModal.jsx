import React from 'react'

import saapplekakao1 from "../images/saapplekakao1.png"
import saapplekakao2 from "../images/saapplekakao2.png"
import saapplekakao3 from "../images/saapplekakao3.png"


function SaAppleModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="my-auto bg-white p-3 rounded-xl w-[90%] max-w-[700px] shadow-lg relative overflow-hidden">
        <h2 className="text-[16px] font-bold mb-4 text-center">애플/iPhone 앱 설치방법</h2>
        <button
          onClick={onClose}
          className="pt-1 absolute top-2 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <div className="text-sm whitespace-pre-line text-gray-800"></div>
        <div className="max-h-[60vh] overflow-y-auto px-1 text-sm whitespace-pre-line text-gray-800">
          <div className='mt-5'>
            <p className='text-[15px]'>1. 하단 메뉴바 가운데 "공유버튼"을 누릅니다.</p>
            <img src={saapplekakao1} alt="kakao3" className='mt-2 ml-4 w-56' />
          </div>
                    <div className='mt-5'>
            <p className='text-[15px]'>2. 목록창이 뜨면 "홈 화면에 추가"를 누릅니다.</p>
            <img src={saapplekakao2} alt="kakao3" className='mt-2 ml-4 w-56' />
          </div>
                    <div className='mt-5'>
            <p className='text-[15px]'>3. 다음 원하는 "앱 이름"을 적어주고, "추가"버튼을 누르면 홈 화면에 추가되며, 웹 앱으로 이용가능합니다. </p>
            <img src={saapplekakao3} alt="kakao3" className='mt-2 ml-4 w-56' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaAppleModal