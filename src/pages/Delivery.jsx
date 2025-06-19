import { useState, useRef, useEffect, useMemo } from "react";
import { ConfigProvider, DatePicker } from "antd";
import { supabase } from "../lib/supabase";

import koKR from "antd/locale/ko_KR";
import dayjs from "dayjs";
import axios from "axios";
import Swal from "sweetalert2";

import down from "../images/down.svg";
import over from "../images/over.svg";
import swap from "../images/swap.svg";

import TosModal from "../component/TosModal";
import { useNavigate } from "react-router-dom";

function extractRegion(addr) {
  if (!addr) return "";
  const 광역시 = addr.match(/(서울|대구|부산|인천|광주|대전|울산|세종)/);
  if (광역시) return 광역시[1];
  const 시군 = addr.match(/([가-힣]+시|[가-힣]+군|[가-힣]+구)/);
  if (시군) return 시군[1].replace(/시|군|구/, "");
  return "";
}

function Delivery() {
  const [count, setcount] = useState(0);
  const [twocount, settwocount] = useState(0);
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [name, setName] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [phone, setPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [placeOptions, setPlaceOptions] = useState([]);
  const [arrivalOptions, setArrivalOptions] = useState([]);
  const [modal, setModal] = useState(false);
  const [agreeToTos, setAgreeToTos] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);
  const dateRef = useRef(null);

  const datePickerWrapperRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (datePickerWrapperRef.current) {
      const input = datePickerWrapperRef.current.querySelector("input");
      if (input) input.readOnly = true;
    }
  }, []);

  const openModal = () => {
    setModal(true);
  };

  const CloseModal = () => {
    setModal(false);
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/place-options`)
      .then((res) => setPlaceOptions(res.data.data));
    axios
      .get(`${API_BASE_URL}/arrival-options`)
      .then((res) => setArrivalOptions(res.data.data));
  }, []);

  const startObj = placeOptions.find((item) => item.name === startValue);
  const endObj = arrivalOptions.find((item) => item.name === endValue);

  const indown = useMemo(() => {
    const startRegion = extractRegion(startObj?.address);
    const endRegion = extractRegion(endObj?.address);

    let sum = 0;
    if (count > 0) {
      sum +=
        count *
        (startRegion && endRegion && startRegion === endRegion ? 10000 : 15000);
    }
    if (twocount > 0) {
      sum +=
        twocount *
        (startRegion && endRegion && startRegion === endRegion ? 20000 : 25000);
    }
    return sum;
  }, [count, twocount, startObj, endObj]);

  const Reset = () => {
    setcount(0);
    settwocount(0);
    setDeliveryDate(null);
    setStartValue("");
    setEndValue("");
    setName("");
    setPhone("");
  };

  const Submit = async () => {
    if (!deliveryDate) {
      await Swal.fire({
        icon: "warning",
        title: '<span style="font-size:24px;">배송일을 선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      dateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!startValue) {
      await Swal.fire({
        icon: "warning",
        title: '<span style="font-size:24px;">출발지를 선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      startRef.current?.focus();
      return;
    }
    if (!endValue) {
      await Swal.fire({
        icon: "warning",
        title: '<span style="font-size:24px;">도착지를 선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      endRef.current?.focus();
      return;
    }
    if (!name) {
      await Swal.fire({
        icon: "warning",
        title: '<span style="font-size:27px;">이름을 입력해주세요.</span>',
        confirmButtonText: "확인",
      });
      nameRef.current?.focus();
      return;
    }
    if (!phone) {
      await Swal.fire({
        icon: "warning",
        title: '<span style="font-size:24px;">연락처를 입력해주세요.</span>',
        confirmButtonText: "확인",
      });
      phoneRef.current?.focus();
      return;
    }
    if (count === 0 && twocount === 0) {
      await Swal.fire({
        icon: "warning",
        title:
          '<span style="font-size:24px;">수량은 1개 이상<br> 가능합니다.</span>',
        confirmButtonText: "확인",
      });
      return;
    }
    if (!agreeToTos) {
      await Swal.fire({
        icon: "warning",
        title: '<span style="font-size:20px;">이용약관에 동의해주세요.</span>',
        confirmButtonText: "확인",
      });
      return;
    }

    navigate("/delivery/detail", {
      state: {
        count,
        twocount,
        startValue,
        endValue,
        name,
        phone,
        deliveryDate: deliveryDate ? deliveryDate.format("YYYY-MM-DD") : null,
        indown,
      },
    });

    // try {
    //   const {
    //     data: { user },
    //   } = await supabase.auth.getUser();
    //   if (!user) {
    //     await Swal.fire({
    //       icon: "warning",
    //       title: "로그인이 필요합니다.",
    //       confirmButtonText: "확인",
    //     });
    //     return;
    //   }
    //   const user_id = user.id;

    //   const res = await axios.post(`${API_BASE_URL}/delivery`, {
    //     name,
    //     phone,
    //     startValue,
    //     endValue,
    //     deliveryDate: deliveryDate.format("YYYY-MM-DD"),
    //     count,
    //     twocount,
    //     indown,
    //     user_id,
    //   });
    //   if (res.data.success) {
    //     await Swal.fire({
    //       icon: "success",
    //       title: "저장 성공",
    //       confirmButtonText: "확인",
    //     });
    //     Reset();
    //     setTimeout(() => {
    //       window.scrollTo({ top: 0, behavior: "smooth" });
    //     }, 300);
    //   }
    // } catch (err) {
    //   await Swal.fire({
    //     icon: "error",
    //     title: "저장 실패",
    //     text: err.response?.data?.error || err.message,
    //     confirmButtonText: "확인",
    //   });
    // }
  };

  const Swap = () => {
    setStartValue(endValue);
    setEndValue(startValue);
    setPlaceOptions(arrivalOptions);
    setArrivalOptions(placeOptions);
  };

  const formatPhoneNumber = (value) => {
    value = value.replace(/[^0-9]/g, "");
    if (value.length < 4) return value;
    if (value.length < 7) return value.replace(/(\d{3})(\d+)/, "$1-$2");
    if (value.length < 11)
      return value.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
    return value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  // 수량(26인치 이하) 감소
  const DecreaseCount = () => {
    if (!startValue || !endValue) {
      Swal.fire({
        icon: "warning",
        title:
          '<span style="font-size:24px;">출발지와 도착지를</br>선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      return;
    }
    setcount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // 수량(26인치 이하) 증가
  const IncreaseCount = () => {
    if (!startValue || !endValue) {
      Swal.fire({
        icon: "warning",
        title:
          '<span style="font-size:24px;">출발지와 도착지를</br>선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      return;
    }
    setcount((prev) => prev + 1);
  };

  // 수량(26인치 초과) 감소
  const DecreaseTwocount = () => {
    if (!startValue || !endValue) {
      Swal.fire({
        icon: "warning",
        title:
          '<span style="font-size:24px;">출발지와 도착지를</br>선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      return;
    }
    settwocount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // 수량(26인치 초과) 증가
  const IncreaseTwocount = () => {
    if (!startValue || !endValue) {
      Swal.fire({
        icon: "warning",
        title:
          '<span style="font-size:24px;">출발지와 도착지를</br>선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      return;
    }
    settwocount((prev) => prev + 1);
  };

  return (
    <div className="pt-[93px]">
      <div className="m-3.5 text-center text-3xl font-bold">
        <h1>배송예약</h1>
      </div>
      <div className="flex flex-col items-center">
        <div>
          <div ref={datePickerWrapperRef}>
            <ConfigProvider locale={koKR}>
              <span>배송일 : </span>
              <DatePicker
                value={deliveryDate}
                onChange={setDeliveryDate}
                format="YYYY-MM-DD"
                placeholder="배송일 선택"
                className="py-0.5 w-40"
                styles={{
                  popup: {
                    root: { left: "10px" },
                  },
                }}
                disabledDate={(date) => date && date < dayjs().startOf("day")}
              />
            </ConfigProvider>
          </div>
          <div className="mt-3">
            <span>출발지 : </span>
            <select
              name=""
              id=""
              placeholder="출발지 선택"
              className="py-0.5 border border-gray-400 rounded w-40  cursor-pointer"
              value={startValue}
              onChange={(e) => setStartValue(e.target.value)}
              ref={startRef}
            >
              <option value="" disabled hidden>
                출발지 선택
              </option>
              {placeOptions
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name, "ko"))
                .map((item, idx) => (
                  <option key={idx} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="h-9 mt-1 flex justify-center items-center">
            <button
              className="w-20 rounded-md flex justify-center items-center cursor-pointer"
              onClick={Swap}
            >
              <img src={swap} alt="swap" className="w-7" />
            </button>
          </div>
          <div className="mt-1">
            <span>도착지 : </span>
            <select
              name=""
              id=""
              placeholder="출발지 선택"
              className="py-0.5 border border-gray-400 rounded w-40 cursor-pointer"
              value={endValue}
              onChange={(e) => setEndValue(e.target.value)}
              ref={endRef}
            >
              <option value="" disabled hidden>
                도착지 선택
              </option>
              {arrivalOptions
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name, "ko"))
                .map((item, idx) => (
                  <option key={idx} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-3">
            <span>이</span>
            <span className="ml-3.5">름 : </span>
            <input
              type="text"
              className="pl-1 py-0.5 w-40 border border-gray-400 rounded"
              value={name}
              ref={nameRef}
              onChange={e => {
                // 숫자만 제거, 한글 영어 공백 모두 허용
                const val = e.target.value.replace(/[0-9]/g, "");
                setName(val);
              }}
            />
          </div>
          <div className="mt-3">
            <span>연락처 : </span>
            <input
              type="text"
              className="pl-1 py-0.5 w-40 border border-gray-400 rounded"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
              inputMode="numeric"
              maxLength={13}
              ref={phoneRef}
            />
          </div>
        </div>
        <div className="mt-3 w-60 border border-gray-400 rounded-3xl">
          <div className="my-3">
            <div>
              <img src={down} alt="" className="w-55 px-3 mx-auto block" />
            </div>
            <div className="text-center text-2xl text-blue-500 font-medium mt-2">
              <span>26인치이하</span>
            </div>
          </div>
        </div>
        <div className="my-3 flex items-center h-8">
          <button
            className="w-10 rounded-tl-lg rounded-bl-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={DecreaseCount}
          >
            <span className="relative -top-[2.5px]">-</span>
          </button>
          <input
            type="text"
            name=""
            id=""
            value={count}
            readOnly
            className="bg-gray-300 w-32 text-center outline-none h-8 cursor-default"
          />
          <button
            className="w-10 rounded-tr-lg rounded-br-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={IncreaseCount}
          >
            <span className="relative -top-[1px]">+</span>
          </button>
        </div>
        <div className="w-60 border border-gray-400 rounded-3xl">
          <div className="my-3">
            <img src={over} alt="" className="w-55 px-3 mx-auto block" />
            <div className="text-center text-2xl text-blue-500 font-medium mt-2">
              <span>26인치초과</span>
            </div>
          </div>
        </div>
        <div className="my-3 flex items-center h-8">
          <button
            className="w-10 rounded-tl-lg rounded-bl-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={DecreaseTwocount}
          >
            <span className="relative -top-[2.5px]">-</span>
          </button>
          <input
            type="text"
            name=""
            id=""
            value={twocount}
            readOnly
            className="bg-gray-300 w-32 text-center outline-none h-8 cursor-default"
          />
          <button
            className="w-10 rounded-tr-lg rounded-br-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={IncreaseTwocount}
          >
            <span className="relative -top-[1px]">+</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-blue-600 font-medium">
            <h1 className="text-2xl">예상금액</h1>
            <h3>(VAT포함)</h3>
          </div>
        </div>
        <div>
          <h2>
            KRW<span className="ml-1.5">{indown.toLocaleString()}</span>
          </h2>
        </div>
        <div className="mt-5">
          <input
            type="checkbox"
            name="ToS"
            id="ToS"
            className="cursor-pointer"
            checked={agreeToTos}
            onChange={(e) => setAgreeToTos(e.target.checked)}
          />
          <label htmlFor="ToS" className="ml-1 cursor-pointer">
            이용약관에 동의합니다.
          </label>
        </div>
        <div>
          <button
            className="mb-5 text-[13px] bg-black text-white"
            onClick={openModal}
          >
            [ 이용약관 보기 ]
          </button>
        </div>
        <div className="my-3">
          <button
            onClick={Reset}
            className="w-24 bg-amber-500 text-white rounded-[10px] h-10 mr-6 cursor-pointer"
          >
            초기화
          </button>
          <button
            className="w-24 bg-amber-500 text-white rounded-[10px] h-10 cursor-pointer"
            onClick={Submit}
          >
            배송예약
          </button>
        </div>
      </div>
      {modal && <TosModal onClose={CloseModal} />}
    </div>
  );
}

export default Delivery;
