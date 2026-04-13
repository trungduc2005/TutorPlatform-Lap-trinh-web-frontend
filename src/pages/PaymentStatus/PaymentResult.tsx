import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const responseCode = params.get("vnp_ResponseCode");
    const classId = params.get("classId");
    const applicationId = params.get("applicationId");

    console.log("VNPay response:", responseCode);

    if (responseCode === "00") {
      navigate(`/payment-success/${classId}`);
    } else {
      navigate(`/payment-fail/${applicationId}`);
    }
  }, []);

  return (
    <div className="text-center mt-10">
      Đang xử lý kết quả thanh toán...
    </div>
  );
}