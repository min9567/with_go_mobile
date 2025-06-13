import { useState, useRef, useEffect } from "react";

import { ConfigProvider, DatePicker } from "antd";
import koKR from "antd/locale/ko_KR";
import dayjs from "dayjs";

import down from "../images/down.svg"
import over from "../images/over.svg"

function Delivery() {
  const [count, setcount] = useState(0);
  const [twocount, settwocount] = useState(0);
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);

  const datePickerWrapperRef = useRef(null);

  useEffect(() => {
    if (datePickerWrapperRef.current) {
      const input = datePickerWrapperRef.current.querySelector("input");
      if (input) input.readOnly = true;
    }
  }, []);

  const indown = count * 10000 + twocount * 15000

  const Reset = () => {
    setcount(0);
    settwocount(0);
    setDeliveryDate(null);
    setStartValue("");
    setEndValue("");
    setName("");
    setPhone("");
  };

  return (
    <div className="pt-[83px]">
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
                    root: { left: '10px' }
                  }
                }}
                disabledDate={date => date && date < dayjs().startOf('day')}
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
              onChange={e => setStartValue(e.target.value)}
            >
              <option value="" disabled hidden>
                출발지 선택
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div className="mt-3">
            <span>도착지 : </span>
            <select
              name=""
              id=""
              placeholder="출발지 선택"
              className="py-0.5 border border-gray-400 rounded w-40 cursor-pointer"
              value={endValue}
              onChange={e => setEndValue(e.target.value)}
            >
              <option value="" disabled hidden>
                도착지 선택
              </option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="mt-3">
            <span>이</span>
            <span className="ml-3.5">름 : </span>
            <input type="text" className="pl-1 py-0.5 w-40 border border-gray-400 rounded" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="mt-3">
            <span>연락처 : </span>
            <input type="number" className="pl-1 py-0.5 w-40 border border-gray-400 rounded" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 w-60 border border-gray-400 rounded-3xl">
          <div className="my-3">
            <div>
              <img src={down} alt="" className="w-55 mx-auto block" />
            </div>
            <div className="text-center text-2xl text-blue-500 font-medium mt-2">
              <span>26인치이하</span>
            </div>
          </div>
        </div>
        <div className="my-3 flex items-center h-8">
          <button className="w-10 rounded-tl-lg rounded-bl-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={() => setcount(count > 0 ? count - 1 : 0)}>
            <span className="relative -top-[2.5px]">-</span>
          </button>
          <input type="text" name="" id="" value={count} readOnly className="bg-gray-300 w-30 text-center outline-none h-8 cursor-default" />
          <button className="w-10 rounded-tr-lg rounded-br-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={() => setcount(count + 1)}>
            <span className="relative -top-[1px]">+</span>
          </button>
        </div>
        <div className="w-60 border border-gray-400 rounded-3xl">
          <div className="my-3">
            <img src={over} alt="" className="w-55 mx-auto block" />
            <div className="text-center text-2xl text-blue-500 font-medium mt-2">
              <span>26인치초과</span>
            </div>
          </div>
        </div>
        <div className="my-3 flex items-center h-8">
          <button className="w-10 rounded-tl-lg rounded-bl-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={() => settwocount(twocount > 0 ? twocount - 1 : 0)}>
            <span className="relative -top-[2.5px]">-</span>
          </button>
          <input type="text" name="" id="" value={twocount} readOnly className="bg-gray-300 w-30 text-center outline-none h-8 cursor-default" />
          <button className="w-10 rounded-tr-lg rounded-br-lg bg-blue-500 text-white text-2xl cursor-pointer"
            onClick={() => settwocount(twocount + 1)}>
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
          <h2>KRW<span className="ml-1.5">{indown}</span></h2>
        </div>
        <div className="my-3">
          <button onClick={Reset} className="w-25 bg-amber-500 text-white rounded-[10px] h-10 mr-6 cursor-pointer">초기화</button>
          <button className="w-25 bg-amber-500 text-white rounded-[10px] h-10">배송예약</button>
        </div>
      </div>
    </div>
  );
}

export default Delivery;
