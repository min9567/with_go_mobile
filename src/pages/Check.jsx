import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import Swal from "sweetalert2";
import axios from "axios";
import Modal from "../component/StorageModal";
import DModal from "../component/DeliveryModal";
import DeliveryPhoto from "../component/DeliveryPhoto";

function Check() {
  const [storageList, setStorageList] = useState([]);
  const [deliveryList, setDeliveryList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dModalOpen, setDModalOpen] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [activeTab, setActiveTab] = useState("delivery");

  const fetchMyData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const myUuid = user.id;

    const { data: storageData } = await supabase
      .from("storage")
      .select("*")
      .eq("user_id", myUuid)
      .order("reservation_time", { ascending: false });

    const { data: deliveryData } = await supabase
      .from("delivery")
      .select("*")
      .eq("user_id", myUuid);

    setStorageList(
      (storageData || []).filter((item) => item.situation !== "취소")
    );
    setDeliveryList(
      (deliveryData || []).filter((item) => item.situation !== "취소")
    );
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  const StorageDelete = async (reservation_number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const user_id = user.id;

    const result = await Swal.fire({
      title: '<span style="font-size:24px;">정말 취소하시겠습니까?</span>',
      text: "취소하면 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네, 취소할래요",
      cancelButtonText: "아니오",
    });

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${API_BASE_URL}/storage-cancel`, {
          reservation_number,
          user_id,
        });
        if (res.data.success) {
          setStorageList((prev) =>
            prev.filter(
              (item) => item.reservation_number !== reservation_number
            )
          );
          Swal.fire("취소 완료", "신청이 취소되었습니다.", "success");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          Swal.fire("오류", "삭제 실패", "error");
        }
      } catch (err) {
        Swal.fire("오류", "삭제 실패", "error");
      }
    }
  };

  const DeliveryDelete = async (re_num) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const user_id = user.id;

    const result = await Swal.fire({
      title: '<span style="font-size:24px;">정말 취소하시겠습니까?</span>',
      text: "취소하면 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네, 취소할래요",
      cancelButtonText: "아니오",
    });

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${API_BASE_URL}/delivery-cancel`, {
          re_num,
          user_id,
        });
        if (res.data.success) {
          setDeliveryList((prev) =>
            prev.filter((item) => item.re_num !== re_num)
          );
          Swal.fire("취소 완료", "신청이 취소되었습니다.", "success");
        } else {
          Swal.fire("오류", "삭제 실패", "error");
        }
      } catch (err) {
        Swal.fire("오류", "삭제 실패", "error");
      }
    }
  };

  const ShowStorageProgress = (item) => {
    setProgressData(item);
    setModalOpen(true);
  };

  const ShowDeliveryProgress = (item) => {
    setProgressData(item);
    setDModalOpen(true);
  };

  const CloseModal = () => {
    setModalOpen(false);
    setProgressData(null);
    fetchMyData();
  };
  const CloseDModal = () => {
    setDModalOpen(false);
    setProgressData(null);
    fetchMyData();
  };

  return (
    <div className="pt-[93px]">
      <div className="m-3.5 text-center text-3xl font-bold">
        <h1>신청내역</h1>
      </div>
      <div>
        <div className="flex justify-around items-center">
          <button onClick={() => setActiveTab("delivery")}>
            <h3
              className={`text-[20px] ${
                activeTab === "delivery" ? "font-bold text-blue-600" : ""
              }`}
            >
              배 송
            </h3>
          </button>
          <button onClick={() => setActiveTab("storage")}>
            <h3
              className={`text-[20px] ${
                activeTab === "storage" ? "font-bold text-blue-600" : ""
              }`}
            >
              보 관
            </h3>
          </button>
        </div>
        {activeTab === "storage" && (
          <div className="py-1 mx-3">
            {storageList.length > 0 ? (
              storageList.map((item, idx) => (
                <div
                  key={idx}
                  className="mb-3 border border-gray-400 rounded-xl p-3"
                >
                  <div className="mb-2">
                    <p>
                      신청일 :{" "}
                      {item.reservation_time.slice(0, 16).replace("T", " ")}
                    </p>
                    <p>
                      보관일 : {item.storage_start_date} ~{" "}
                      {item.storage_end_date}
                    </p>
                    <p>성함 : {item.name}</p>
                    <p>연락처 : {item.phone}</p>
                    <p>보관장소 : {item.location}</p>
                    <p>
                      수량 :{" "}
                      {[
                        item.small > 0 ? `소형 ${item.small}개` : null,
                        item.medium > 0 ? `중형 ${item.medium}개` : null,
                        item.large > 0 ? `대형 ${item.large}개` : null,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p>결제금액 : {item.price.toLocaleString()}원</p>
                  </div>
                  <div className="flex justify-center items-center">
                    <button
                      className="mr-6 w-40 h-8 rounded-lg bg-blue-200 hover:bg-blue-600 text-gray-600 hover:text-white cursor-pointer"
                      onClick={() => ShowStorageProgress(item)}
                    >
                      진행 상태
                    </button>
                    {!["완료", "보관중", "보관완료"].includes(
                      item.situation
                    ) && (
                      <button
                        className="w-40 h-8 rounded-lg bg-red-200 hover:bg-red-600 text-gray-600 hover:text-white cursor-pointer"
                        onClick={() => StorageDelete(item.reservation_number)}
                      >
                        신청 취소
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400  border border-gray-400 rounded-xl">
                신청내역이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
      {activeTab === "delivery" && (
        <div>
          <div className="py-1 mx-3">
            {deliveryList.length > 0 ? (
              deliveryList
                .sort(
                  (a, b) => new Date(b.reserve_time) - new Date(a.reserve_time)
                )
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="mb-3 border border-gray-400 rounded-xl p-3"
                  >
                    <div className="mb-2">
                      <p>
                        신청일 :{" "}
                        {item.reserve_time.slice(0, 16).replace("T", " ")}
                      </p>
                      <p>배송일 : {item.delivery_date}</p>
                      <p>성함 : {item.name}</p>
                      <p>연락처 : {item.phone}</p>
                      <p>출발지 : {item.delivery_start}</p>
                      <p>도착지 : {item.delivery_arrive}</p>
                      <p>
                        수량 :
                        {item.under > 0 && (
                          <span> 26인치이하 {item.under}개</span>
                        )}
                        {item.under > 0 && item.over > 0 && ", "}
                        {item.over > 0 && <span>26인치이상 {item.over}개</span>}
                      </p>
                      <p>결제금액 : {item.price.toLocaleString()}원</p>
                    </div>
                    <div className="mb-3">
                      <DeliveryPhoto
                        re_num={item.re_num}
                        situation={item.situation}
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      <button
                        className="mr-6 w-40 h-8 rounded-lg bg-blue-200 hover:bg-blue-600 text-gray-600 hover:text-white cursor-pointer"
                        onClick={() => ShowDeliveryProgress(item)}
                      >
                        배송 상태
                      </button>
                      {!["배송대기", "배송중", "배송완료", "완료"].includes(
                        item.situation
                      ) && (
                        <button
                          className="w-40 h-8 rounded-lg bg-red-200 hover:bg-red-600 text-gray-600 hover:text-white cursor-pointer"
                          onClick={() => DeliveryDelete(item.re_num)}
                        >
                          신청 취소
                        </button>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-4 text-gray-400  border border-gray-400 rounded-xl">
                신청내역이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
      <Modal
        open={modalOpen}
        onClose={CloseModal}
        progressData={progressData}
      />
      <DModal
        open={dModalOpen}
        onClose={CloseDModal}
        progressData={progressData}
      />
    </div>
  );
}

export default Check;
