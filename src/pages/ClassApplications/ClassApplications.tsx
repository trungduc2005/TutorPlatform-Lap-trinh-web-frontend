import { useClassApplications } from "../../features/class/hooks/useClassApplications";
import type { ClassApplicationStatus } from "../../features/class/model/classTypes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getDisplayStatus,
  isExpired,
  getRemainingTime,
  statusLabel,
  statusColor,
} from "../../features/class/utils/classApplicationsUtils";

export default function AcceptedClasses() {
  const { data, loading, error, startPayment } = useClassApplications();
  const navigate = useNavigate();
  const [, setNow] = useState(Date.now());

const formatClassId = (id: number) => {
  return `E${id.toString().padStart(4, "0")}`;
};

const handlePayment = async (applicationId: number) => {
  try {
    const res = await startPayment(applicationId);

    console.log("payment response:", res);

    if (res?.payment?.paymentUrl) {
      window.location.href = res.payment.paymentUrl;
    } else {
      alert("Không có paymentUrl");
    }
  } catch (err) {
    console.error("Payment error:", err);
    alert("Thanh toán thất bại");
  }
};

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto flex gap-6">
        <div className="w-64 bg-white p-5 rounded shadow">
          <ul className="space-y-3 text-sm">
            <li
              onClick={() => navigate("/profile")}
              className="text-blue-500 cursor-pointer"
            >
              Thông tin cơ bản
            </li>

            <li className="font-semibold">Đăng ký gia sư</li>

            <li
              onClick={() => navigate("/classes")}
              className="text-blue-500 cursor-pointer"
            >
              Đăng ký lớp phù hợp
            </li>
          </ul>
        </div>

        <div className="flex-1 bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-6">
            Danh sách lớp đã nhận
          </h2>

          {loading ? (
            <div className="text-center py-10 text-gray-400">
              Đang tải...
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-10">
              {error}
            </div>
          ) : data.length === 0 ? (
            <div className="text-gray-400 text-center py-10">
              Chưa có lớp nào
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item) => {
                const expired = isExpired(item.selectionExpiresAt);
                const status: ClassApplicationStatus =
                  getDisplayStatus(item);
                const remaining = getRemainingTime(item.selectionExpiresAt);

                return (
                  <div
                    key={item.id}
                    className="border rounded p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-700">
                        Lớp ID: {formatClassId(item.classId)}
                      </p>

                      <p className="text-sm text-gray-500">
                        Gia sư: {item.tutorName}
                      </p>

                      <p
                        className={`text-sm font-medium ${statusColor[status]}`}
                      >
                        {statusLabel[status]}
                      </p>
                      {status === "SELECTED_AWAITING_PAYMENT" && !expired && (
                        <p className="text-sm text-red-500">
                          Còn lại: {remaining}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {status === "ACCEPTED" && (
                        <button
                          onClick={() =>
                            navigate(`/class/${item.classId}`)
                          }
                          className="border px-4 py-2 rounded hover:bg-gray-100"
                        >
                          Xem chi tiết
                        </button>
                      )}
                      {status === "SELECTED_AWAITING_PAYMENT" && !expired && (
                        <button
                        onClick={() => handlePayment(item.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                          Thanh toán ngay
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}