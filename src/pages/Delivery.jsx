import React from "react";

import { useState } from "react";

import { ConfigProvider, DatePicker } from "antd";
import koKR from "antd/locale/ko_KR";
import dayjs from "dayjs";

import down from "../images/down.svg"

function Delivery() {
  return (
    <div className="bg-amber-200">
      <div className="m-3.5 text-center text-3xl font-bold">
        <h1>배송예약</h1>
      </div>
      <div>
        <ConfigProvider locale={koKR}>
          배송일자 :{" "}
          <DatePicker
            showTime={{
              format: "HH",
              minuteStep: 60,
              defaultValue: dayjs("00:00", "HH:mm"),
            }}
            format="YYYY-MM-DD HH시"
            placeholder="날짜 선택"
            style={{ width: 200 }}
          />
        </ConfigProvider>
      </div>
      <div>
        <span>출발지 : </span>
        <select
          name=""
          id=""
          placeholder="출발지 선택"
          className="border border-gray-400 rounded"
        >
          <option value="" disabled selected>
            출발지를 선택하세요.
          </option>
          <option value="">1</option>
          <option value="">2</option>
        </select>
      </div>
      <div>
        <span>도착지 : </span>
        <select
          name=""
          id=""
          placeholder="출발지 선택"
          className="border border-gray-400 rounded"
        >
          <option value="" disabled selected>
            도착지를 선택하세요.
          </option>
          <option value="">1</option>
          <option value="">2</option>
        </select>
      </div>
      <div>
        <span>이름 : </span>
        <input type="text" className="w-30 border border-gray-400 rounded" />
      </div>
      <div>
        <span>연락처 : </span>
        <input type="number" className="w-50 border border-gray-400 rounded" />
      </div>
      <div>
        <img src={down} alt="" className="w-70" />
      </div>
    </div>
  );
}

export default Delivery;
