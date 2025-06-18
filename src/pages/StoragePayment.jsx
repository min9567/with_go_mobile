import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import axios from "axios";

function StoragePayment() {
  const navigate = useNavigate();

  useEffect(() => {
    // 결제 정보 localStorage에서 읽기
    const reservation = JSON.parse(localStorage.getItem("storage_reservation"));
    if (!reservation) {
      Swal.fire("예약 정보가 없습니다.");
      navigate("/");
      return;
    }

    // supabase 저장 함수
    const save = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          await Swal.fire("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        const user_id = user.id;
        const API_BASE_URL = import.meta.env.VITE_API_URL;

        const res = await axios.post(`${API_BASE_URL}/storage`, {
          name: reservation.name,
          phone: reservation.phone,
          email: reservation.email,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          selectValue: reservation.selectValue,
          count: reservation.count,
          twocount: reservation.twocount,
          threecount: reservation.threecount,
          indown: reservation.indown,
          reservation_country: "Mobile",
          user_id,
        });

        if (res.data.success) {
          await Swal.fire("결제 완료되었습니다.", "", "success");
          localStorage.removeItem("storage_reservation");
          navigate("/");
        }
      } catch (err) {
        await Swal.fire("저장 실패", err.message, "error");
      }
    };

    save();
  }, []);

  return null;
}

export default StoragePayment;
