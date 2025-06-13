import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

function Storage() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="bg-amber-200">
      <div className="text-center mt-3.5 text-3xl font-bold mb-3.5">
        <h1>배송예약</h1>
      </div>
      <span>배송일자 : </span>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        isClearable={true}
        className="border px-3 py-1 rounded"
        dateFormat="yyyy/MM/dd"
        placeholderText='2025/06/13 - 2025/06/20'
      />
      <div className="mt-4">
        {startDate && endDate ? (
          <span>
            선택된 기간: {startDate.toLocaleDateString()} ~ {endDate.toLocaleDateString()}
          </span>
        ) : (
          <span>기간을 선택하세요.</span>
        )}
      </div>
    </div>
  )
}

export default Storage