import { useEffect, useState } from "react";
import axios from "axios";

function formatPhoneNumber(phone) {
  if (!phone) return "";

  const cleaned = ("" + phone).replace(/\D/g, "");

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  return phone;
}

function Modal({ open, onClose, progressData }) {
  const [statusLogs, setStatusLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [driverInfo, setDriverInfo] = useState({
    driver_name: "",
    driver_phone: "",
  });

  useEffect(() => {
    if (!open || !progressData) return;
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const fetchStatusLogs = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/status-logs`, {
          re_num: progressData.re_num,
        });
        setStatusLogs(res.data.logs || []);
      } catch (e) {
        setStatusLogs([]);
      }
      setLoading(false);
    };

    const fetchDriverInfo = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/delivery-info`, {
          re_num: progressData.re_num,
        });
        setDriverInfo({
          driver_name: res.data.driver_name || "",
          driver_phone: res.data.driver_phone || "",
        });
      } catch {
        setDriverInfo({ driver_name: "", driver_phone: "" });
      }
    };

    fetchStatusLogs();
    fetchDriverInfo();
  }, [open, progressData]);

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
      <div className="relative bg-white p-4 rounded-xl min-w-[300px] w-[80%] z-10">
        <h2 className="text-xl font-bold mb-4 text-center">진행 이력</h2>
        <div className="w-full">
          <table className="mx-auto min-w-[270px] w-full ">
            <colgroup>
              <col style={{ width: "48%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "35%" }} />
            </colgroup>
            <thead className="border-b border-b-gray-500">
              <tr>
                <th className="py-1">진행시간</th>
                <th className="py-1">상태</th>
                <th className="py-1">처리자</th>
              </tr>
            </thead>
            <tbody className="text-center border-b border-b-gray-500">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400">
                    로딩 중...
                  </td>
                </tr>
              ) : Array.isArray(statusLogs) && statusLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400">
                    진행이력이 없습니다.
                  </td>
                </tr>
              ) : (
                statusLogs.map((log, idx) => (
                  <tr key={idx}>
                    <td className="py-1">
                      {log.updated_at?.slice(0, 16).replace("T", " ")}
                    </td>
                    <td className="py-1">{log.new_status}</td>
                    <td className="py-1">{log.operator}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-center text-gray-600">
                  {driverInfo.driver_name && driverInfo.driver_phone ? (
                    <div className="pt-1">
                      <div className="pl-2 flex items-center">
                        <p>배송기사 : </p>
                        <span>&nbsp;{driverInfo.driver_name}</span>
                      </div>
                      <div className="pl-2 pt-1 flex items-center">
                        <p>연락처 : </p>
                        {driverInfo.driver_phone ? (
                          <a
                            href={`tel:${driverInfo.driver_phone}`}
                            className="ml-1"
                          >
                            {formatPhoneNumber(driverInfo.driver_phone)}
                          </a>
                        ) : (
                          <span className="ml-1">-</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">
                      배정된 기사가 없습니다
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <button
          className="mt-5 w-full rounded-lg bg-blue-500 hover:bg-blue-700 text-white py-2 cursor-pointer"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default Modal;
