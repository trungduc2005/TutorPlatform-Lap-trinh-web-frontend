import { useNavigate, useParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { classId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center w-[500px]">

        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl">
            ✓
          </div>
        </div>
        <h2 className="text-green-600 text-xl font-semibold mb-2">
          Thanh toán thành công
        </h2>

        <p className="text-gray-600 mb-6">
          Bạn đã thanh toán thành công cho lớp:
          <br />
          <span className="font-medium">Lớp ID: {classId}</span>
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/chat")}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Nhắn tin với phụ huynh
          </button>

          <button
            onClick={() => navigate(`/class/${classId}`)}
            className="border py-2 rounded hover:bg-gray-100"
          >
            Xem chi tiết lớp
          </button>

          <button
            onClick={() => navigate("/tutor/class-applications")}
            className="border py-2 rounded hover:bg-gray-100"
          >
            Danh sách lớp đã nhận
          </button>
        </div>
      </div>
    </div>
  );
}