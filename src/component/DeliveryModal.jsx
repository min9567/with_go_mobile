import { useEffect, useState } from "react";
import axios from "axios";

function Modal({ open, onClose, progressData }) {
    const [statusLogs, setStatusLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState("");

    useEffect(() => {
        if (!open || !progressData) return;
        const API_BASE_URL = import.meta.env.VITE_API_URL;

        const fetchStatusLogs = async () => {
            setLoading(true);
            try {
                const res = await axios.post(`${API_BASE_URL}/status-logs`, {
                    re_num: progressData.re_num,  // 배송은 이걸로 보내야 함
                });
                const { logs, location } = res.data;
                setStatusLogs(logs || []);
                setLocation(location || "");
            } catch (e) {
                setStatusLogs([]);
                setLocation("");
                console.log("에러:", e);
            }
            setLoading(false);
        };

        fetchStatusLogs();
    }, [open, progressData]);

    if (!open) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
            <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
            <div className="relative bg-white p-4 rounded-xl w-[300px] z-10">
                <h2 className="text-xl font-bold mb-4 text-center">진행 이력</h2>
                <div className="w-full">
                    <table className="mx-auto">
                        <colgroup>
                            <col style={{ width: "46%" }} />
                            <col style={{ width: "17%" }} />
                            <col style={{ width: "35%" }} />
                        </colgroup>
                        <thead className="border-b border-b-gray-500">
                            <tr>
                                <th>진행시간</th>
                                <th>상태</th>
                                <th>처리자</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-400">로딩 중...</td>
                                </tr>
                            ) : Array.isArray(statusLogs) && statusLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-400">진행이력이 없습니다.</td>
                                </tr>
                            ) : (
                                statusLogs.map((log, idx) => (
                                    <tr key={idx}>
                                        <td>{log.updated_at?.slice(0, 16).replace('T', ' ')}</td>
                                        <td>{log.new_status}</td>
                                        <td>{log.operator}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
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
