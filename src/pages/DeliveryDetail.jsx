import { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function DeliveryDetail() {
  const { state } = useLocation();
  const [essentialChecked, setEssentialChecked] = useState(false);

  const Payment = () => {
    if (!essentialChecked) {
      Swal.fire(
        '<span style="font-size:25px;">안내사항에 동의해야<br/>결제할 수 있습니다.</span>'
      );
      return;
    }
    if (!window.TossPayments) {
      Swal.fire("결제 모듈이 로드되지 않았습니다.");
      return;
    }

    localStorage.setItem("delivery_reservation", JSON.stringify(state));

    const tossPayments = window.TossPayments(
      "test_ck_24xLea5zVAEGe4ONABL7VQAMYNwW"
    );

    tossPayments.requestPayment("카드", {
      amount: state.indown,
      orderId: "order_" + new Date().getTime(),
      orderName: "배송 예약 결제",
      customerName: state.name,
      successUrl:
        window.location.origin +
        "/delivery-payment-success?amount=" +
        state.indown,
      failUrl: window.location.origin + "/payment-fail",
    });
  };

  return (
    <div className="mt-[93px] p-6">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4 text-center">배송 예약 상세</h1>
      </div>
      <div>
        <div>
          <div className="bg-blue-100 h-8 flex items-center justify-center">
            <h3 className="text-[18px] text-blue-500 font-bold">예약 정보</h3>
          </div>
          <div className="text-[15px]">
            <li className="grid grid-cols-2 gap-2 py-1 pl-3">
              <p>배송일자</p>
              <span>{state.deliveryDate}</span>
            </li>
            <li className="grid grid-cols-2 gap-2 py-1 pl-3">
              <p>출발지</p>
              <span>{state.startValue}</span>
            </li>
            <li className="grid grid-cols-2 gap-2 py-1 pl-3">
              <p>도착지</p>
              <span>{state.endValue}</span>
            </li>
          </div>
        </div>
        <div className="mt-7">
          <div className="bg-blue-100 h-8 flex items-center justify-center">
            <h3 className="text-[18px] text-blue-500 font-bold">고객정보</h3>
          </div>
          <div>
            <li className="grid grid-cols-2 gap-2 py-1 pl-3">
              <p>이름</p>
              <span>{state.name}</span>
            </li>
            <li className="grid grid-cols-2 gap-2 py-1 pl-3">
              <p>연락처</p>
              <span>{state.phone}</span>
            </li>
          </div>
        </div>
        <div className="mt-7">
          <div className="bg-blue-100 h-8 flex items-center justify-center">
            <h3 className="text-[18px] text-blue-500 font-bold">물품정보</h3>
          </div>
          <div>
            <li className="grid grid-cols-2 gap-2 py-1 pl-3">
              <p>26인치이하</p>
              <span>{state.count}</span>
            </li>
            <li className="grid grid-cols-2 gap-2 py-1 pl-3">
              <p>26인치초과</p>
              <span>{state.twocount}</span>
            </li>
          </div>
        </div>
        <div className="mt-7">
          <div className="bg-blue-100 h-8 flex items-center justify-center">
            <h3 className="text-[18px] text-blue-500 font-bold">결제정보</h3>
          </div>
          <div>
            <li className="grid grid-cols-2 gap-2 py-1 pl-3">
              <p>결제 금액</p>
              <span>{state.indown.toLocaleString()}원</span>
            </li>
          </div>
        </div>
        <div className="mt-4 text-center">
          <input
            type="checkbox"
            name="essential"
            id="essential"
            checked={essentialChecked}
            onChange={(e) => setEssentialChecked(e.target.checked)}
            className="cursor-pointer"
          />
          <label
            htmlFor="essential"
            className="ml-2 text-red-500 font-bold cursor-pointer"
          >
            배송이 시작되면 예약취소/환불 불가합니다.
          </label>
        </div>
        <div className="my-5 flex justify-center">
          <button
            className="w-24 bg-amber-500 text-white rounded-[10px] h-10 cursor-pointer"
            onClick={Payment}
          >
            결제진행
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryDetail;
