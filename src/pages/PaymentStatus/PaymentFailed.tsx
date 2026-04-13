import { useNavigate, useParams } from "react-router-dom";

export default function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center w-[500px]">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-4xl">
            ✕
          </div>
        </div>
        <h2 className="text-red-600 text-xl font-semibold mb-2">
          Thanh toán thất bại
        </h2>

        <p className="text-gray-600 mb-6">
          Thanh toán không thành công <br />
          Vui lòng thử lại sau
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/tutor/class-applications")}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Thanh toán lại
          </button>

          <button
            onClick={() => navigate("/classes")}
            className="border py-2 rounded hover:bg-gray-100"
          >
            Quay về danh sách lớp
          </button>
        </div>
      </div>
    </div>
  );
}