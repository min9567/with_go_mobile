import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { ConfigProvider, DatePicker } from "antd";
import koKR from "antd/locale/ko_KR";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import axios from "axios";

import small from "../images/small.svg";
import medium from "../images/medium.svg";
import large from "../images/large.svg";

import TosModal from "../component/TosModal";
import { useNavigate } from "react-router-dom";

function Storage() {
  const [count, setcount] = useState(0);
  const [twocount, settwocount] = useState(0);
  const [threecount, setthreecount] = useState(0);
  const [selectValue, setSelectValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [placeOptions, setPlaceOptions] = useState([]);
  const [agreeToTos, setAgreeToTos] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [modal, setModal] = useState(false);

  const datePickerWrapperRef = useRef(null);
  const dateStartRef = useRef(null);
  const dateEndRef = useRef(null);
  const placeRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (datePickerWrapperRef.current) {
      const input = datePickerWrapperRef.current.querySelector("input");
      if (input) input.readOnly = true;
    }
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPlaces = async () => {
      const [res1, res2] = await Promise.all([
        axios.get(`${API_BASE_URL}/place-options`),
        axios.get(`${API_BASE_URL}/arrival-options`),
      ]);
      const data1 = res1.data.data || [];
      const data2 = res2.data.data || [];
  
      const allOptions = [
        ...new Set([...data1.map((x) => x.name), ...data2.map((x) => x.name)]),
      ];
      setPlaceOptions(allOptions);
    };
    fetchPlaces();
  }, []);

  const openModal = () => {
    setModal(true);
  };

  const CloseModal = () => {
    setModal(false);
  };

  const NameChange = (e) => {
    const v = e.target.value;
    if (isComposing) {
      setName(v);
    } else {
      setName(v.replace(/[^가-힣ㄱ-ㅎA-Za-z\s]/g, ""));
    }
  };

  const indown = count * 1000 + twocount * 3000 + threecount * 5000;

  const Reset = () => {
    setcount(0);
    settwocount(0);
    setthreecount(0);
    setSelectValue("");
    setStartDate(null);
    setEndDate(null);
    setName("");
    setPhone("");
  };

  const Submit = async () => {
    if (!startDate) {
      await Swal.fire({
        icon: "warning",
        title:
          '<span style="font-size:20px;">보관 시작일을 선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      dateStartRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!endDate) {
      await Swal.fire({
        icon: "warning",
        title:
          '<span style="font-size:20px;">보관 종료일을 선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      dateEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!selectValue) {
      await Swal.fire({
        icon: "warning",
        title: '<span style="font-size:20px;">보관장소를 선택해주세요.</span>',
        confirmButtonText: "확인",
      });
      placeRef.current?.focus();
      return;
    }
    if (!name) {
      await Swal.fire({
        icon: "warning",
        title: '<span style="font-size:20px;">이름을 입력해주세요.</span>',
        confirmButtonText: "확인",
      });
      nameRef.current?.focus();
      return;
    }
    if (!phone) {
      await Swal.fire({
        icon: "warning",
        title: '<span style="font-size:20px;">연락처를 입력해주세요.</span>',
        confirmButtonText: "확인",
      });
      phoneRef.current?.focus();
      return;
    }

    if (count + twocount + threecount === 0) {
      await Swal.fire({
        icon: "warning",
        title:
          '<span style="font-size:20px;">수량 최소 1개이상<br>선택해주세요.</span>',
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

    const reservationData = {
      name,
      phone,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : "",
      endDate: endDate ? endDate.format("YYYY-MM-DD") : "",
      selectValue,
      count,
      twocount,
      threecount,
      indown,
    };

    // StorageDetail로 이동 (예약 데이터 같이 넘김)
    navigate("/storage/detail", { state: reservationData });

    // try {
    //   const {
    //     data: { user },
    //   } = await supabase.auth.getUser();
    //   if (!user) {
    //     await Swal.fire({
    //       icon: "warning",
    //       title: '<span style="font-size:24px;">로그인이 필요합니다.</span>',
    //       confirmButtonText: "확인",
    //     });
    //     return;
    //   }
    //   const user_id = user.id;
    //   const API_BASE_URL = import.meta.env.VITE_API_URL;

    //   const res = await axios.post(`${API_BASE_URL}/storage`, {
    //     name,
    //     phone,
    //     email,
    //     startDate: startDate ? startDate.format("YYYY-MM-DD") : "",
    //     endDate: endDate ? endDate.format("YYYY-MM-DD") : "",
    //     selectValue,
    //     count,
    //     twocount,
    //     threecount,
    //     indown,
    //     reservation_country: "Mobile",
    //     user_id,
    //   });
    //   if (res.data.success) {
    //     await Swal.fire({
    //       icon: "success",
    //       title: "저장 성공",
    //       confirmButtonText: "확인",
    //     });
    //     Reset();
    //     setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
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

  const formatPhoneNumber = (value) => {
    value = value.replace(/[^0-9]/g, "");
    if (value.length < 4) return value;
    if (value.length < 7) return value.replace(/(\d{3})(\d+)/, "$1-$2");
    if (value.length < 11)
      return value.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
    return value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  const PhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = formatPhoneNumber(raw);
    setPhone(formatted);
  };

  return (
    <div className="pt-[93px]">
      <div className="text-center mt-3.5 text-3xl font-bold mb-3.5">
        <h1>보관예약</h1>
      </div>
      <div className="flex flex-col items-center">
        <div>
          <div ref={datePickerWrapperRef}>
            <ConfigProvider locale={koKR}>
              <span>보관시작 : </span>
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="시작일자"
                value={startDate}
                onChange={setStartDate}
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
          <div ref={datePickerWrapperRef} className="mt-3">
            <ConfigProvider locale={koKR}>
              <span>보관종료 : </span>
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="종료일자"
                value={endDate}
                onChange={setEndDate}
                className="py-0.5 w-40"
                styles={{
                  popup: {
                    root: { left: "10px" },
                  },
                }}
                disabledDate={(date) => {
                  if (!startDate) return date && date < dayjs().startOf("day");
                  return (
                    date && (date < dayjs().startOf("day") || date < startDate)
                  );
                }}
              />
            </ConfigProvider>
          </div>
          <div className="mt-3">
            <span>보관장소 : </span>
            <select
              name=""
              id=""
              placeholder="출발지 선택"
              className="py-0.5 border border-gray-400 rounded w-40  cursor-pointer"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            >
              <option value="" disabled hidden>
                보관장소 선택
              </option>
              {placeOptions
                .slice()
                .sort((a, b) => a.localeCompare(b, "ko"))
                .map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-3">
            <span>이</span>
            <span className="ml-[29.5px]">름 : </span>
            <input
              type="text"
              className="pl-1 py-0.5 w-40 border border-gray-400 rounded"
              value={name}
              onChange={NameChange}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                setIsComposing(false);
                setName(e.target.value.replace(/[^가-힣ㄱ-ㅎA-Za-z\s]/g, ""));
              }}
            />
          </div>
          <div className="mt-3">
            <span>연</span>
            <span className="ml-[7.5px]">락</span>
            <span className="ml-[7.5px]">처 : </span>
            <input
              type="text"
              className="pl-1 py-0.5 w-40 border border-gray-400 rounded"
              value={phone}
              onChange={PhoneChange}
              inputMode="numeric"
              maxLength={13}
            />
          </div>
        </div>
        <div className="mt-3 w-60 border border-gray-400 rounded-3xl">
          <div className="my-3">
            <div>
              <img src={small} alt="small" className="w-20 mx-auto block" />
            </div>
            <div className="text-center text-[20px] text-blue-500 font-medium mt-2">
              <span>소형</span>
            </div>
          </div>
        </div>
        <div className="my-3 flex items-center h-8">
          <button
            className="w-10 rounded-tl-lg rounded-bl-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={() => setcount(count > 0 ? count - 1 : 0)}
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
            onClick={() => setcount(count + 1)}
          >
            <span className="relative -top-[1px]">+</span>
          </button>
        </div>
        <div className="w-60 border border-gray-400 rounded-3xl">
          <div className="my-3">
            <img src={medium} alt="" className="w-32 mx-auto block" />
            <div className="text-center text-[20px] text-blue-500 font-medium mt-2">
              <span>중형</span>
            </div>
          </div>
        </div>
        <div className="my-3 flex items-center h-8">
          <button
            className="w-10 rounded-tl-lg rounded-bl-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={() => settwocount(twocount > 0 ? twocount - 1 : 0)}
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
            onClick={() => settwocount(twocount + 1)}
          >
            <span className="relative -top-[1px]">+</span>
          </button>
        </div>
        <div className="w-60 border border-gray-400 rounded-3xl">
          <div className="my-3">
            <img src={large} alt="" className="w-16 mx-auto block" />
            <div className="text-center text-[20px] text-blue-500 font-medium mt-2">
              <span>대형</span>
            </div>
          </div>
        </div>
        <div className="my-3 flex items-center h-8">
          <button
            className="w-10 rounded-tl-lg rounded-bl-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={() => setthreecount(threecount > 0 ? threecount - 1 : 0)}
          >
            <span className="relative -top-[2.5px]">-</span>
          </button>
          <input
            type="text"
            name=""
            id=""
            value={threecount}
            readOnly
            className="bg-gray-300 w-32 text-center outline-none h-8 cursor-default"
          />
          <button
            className="w-10 rounded-tr-lg rounded-br-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={() => setthreecount(threecount + 1)}
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
            KRW<span className="ml-1.5">{indown}</span>
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
            보관예약
          </button>
        </div>
      </div>
      {modal && <TosModal onClose={CloseModal} />}
    </div>
  );
}

export default Storage;
