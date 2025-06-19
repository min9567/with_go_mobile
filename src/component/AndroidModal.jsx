import React from 'react'

import kakao1 from "../images/kakao1.jpg"
import kakao2 from "../images/kakao2.jpg"
import kakao3 from "../images/kakao3.jpg"



function AndroidModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="my-auto bg-white p-3 rounded-xl w-[90%] max-w-[700px] shadow-lg relative overflow-hidden">
        <h2 className="text-[16px] font-bold mb-4 text-center">안드로이드/Android 앱 설치방법</h2>
        <button
          onClick={onClose}
          className="pt-1 absolute top-2 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <div className="text-sm whitespace-pre-line text-gray-800"></div>
        <div className="max-h-[60vh] overflow-y-auto px-1 text-sm whitespace-pre-line text-gray-800">
          <div>
            <p className='text-[15px]'>1. 하단메뉴바 제일 오른쪽에 있는 " ⋮ "을 누릅니다.</p>
            <img src={kakao1} alt="kakao1" className='mt-2 ml-4 w-56' />
          </div>
          <div className='mt-5'>
            <p className='text-[15px]'>2. 다른 브라우저로 열고 난 후 다시 설치 이미지를 터치합니다.</p>
            <img src={kakao2} alt="kakao2" className='mt-2 ml-4 w-56' />
          </div>
          <div className='mt-5'>
            <p className='text-[15px]'>3. 설치이미지를 누르고 난 후 아래쪽에 "추가"를 터치하면 설치완료됩니다.</p>
            <img src={kakao3} alt="kakao3" className='mt-2 ml-4 w-56' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AndroidModal