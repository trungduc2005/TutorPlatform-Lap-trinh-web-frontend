import { useEffect, useState } from "react";
import { getMyClassApplications } from "../../shared/api/classApi";

interface ClassApplication {
  id: number;
  classId: number;
  classApplicationStatus: string;
  tutorName: string;
  message: string;
  updateAt: string;
}
export default function AcceptedClasses() {
  const [data, setData] = useState<ClassApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const statusColor = {
    ACCEPTED: "text-green-600",
    REJECTED: "text-red-600",
    PENDING: "text-yellow-600",
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyClassApplications();
        setData(res.items ?? []);
      } catch (err) {
        console.error(err);
      } finally {
          setLoading(false);
          }
    };
    fetchData();
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto flex gap-6">

        <div className="w-64 bg-white p-5 rounded shadow">
          <ul className="space-y-3 text-sm">
            <li className="font-semibold text-gray-700">Thông tin cơ bản</li>
            <li className="text-blue-500 font-semibold">Đăng ký gia sư</li>
            <li className="text-gray-500">Đăng ký lớp phù hợp</li>
            <li className="text-gray-500">Đồng ý điều khoản</li>
            <li className="text-blue-500 font-semibold">Số dư tài khoản</li>
            <li className="text-gray-500">0 đ</li>
            <li className="text-blue-500 cursor-pointer">Thông báo</li>
            <li className="text-blue-600 font-semibold">Lớp đã nhận</li>
          </ul>
        </div>

        <div className="flex-1 bg-white p-6 rounded shadow">

          <div className="text-sm text-gray-500 mb-2">
            Trang chủ / <span className="text-gray-700">Lớp đã nhận</span>
          </div>

          <h2 className="text-lg font-semibold mb-6">Danh sách lớp đã nhận</h2>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Đang tải...</div>
          ) : data.length === 0 ? (
            <div className="text-gray-400 text-center py-10">Chưa có lớp nào</div>
          ) : (
            <div className="space-y-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-700">Lớp ID: {item.classId}</p>
                    <p className="text-sm text-gray-500">Gia sư: {item.tutorName}</p>
                    <p className={`text-sm font-medium ${statusColor[item.classApplicationStatus] || "text-gray-500"}`}>
                      {item.classApplicationStatus}
                    </p>
                  </div>

                  <button className="border px-4 py-2 rounded hover:bg-gray-100">
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}