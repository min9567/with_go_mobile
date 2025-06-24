import { useState, useEffect } from "react";
import axios from "axios";

function DeliveryPhoto({ re_num, situation }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fTime, setFTime] = useState(null);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    if (!["접수", "취소"].includes(situation)) {
      axios.post(`${API_BASE_URL}/delivery-info`, { re_num }).then((res) => {
        setPhotoUrl(res.data.photo_url);
        setFTime(res.data.f_time ? res.data.f_time.slice(0,16).replace("T", " ") : "");
        setLoading(false);
      });
    }
  }, [re_num, situation]);

  if (["접수", "취소"].includes(situation)) return null;

  return (
    <div>
      <div className="my-2 border-b border-b-gray-500"></div>
      {photoUrl ? (
        <div className="flex items-center gap-2">
          <img
            src={photoUrl}
            alt="배송 이미지"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          {situation === "배송완료" && (
            <div className="ml-3 flex flex-col">
              {fTime && (
                <span className="text-[14px] text-blue-600 font-semibold mb-1">{fTime}</span>
              )}
              <span className="text-[14px] text-blue-600 font-semibold mb-1">
                배송완료되었습니다.
              </span>
            </div>
          )}
        </div>
      ) : loading ? (
        <span className="text-gray-400">로딩중...</span>
      ) : situation === "배송완료" ? (
        <span className="text-gray-400">등록된 사진이 없습니다.</span>
      ) : ["배송대기", "배송중"].includes(situation) ? (
        <span className="text-gray-400">배송중입니다.</span>
      ) : null}
    </div>
  );
}

export default DeliveryPhoto;
