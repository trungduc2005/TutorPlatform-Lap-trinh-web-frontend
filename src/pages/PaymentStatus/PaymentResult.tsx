import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const validSignature = params.get("validSignature");
    const responseCode = params.get("vnp_ResponseCode");
    const transactionStatus = params.get("vnp_TransactionStatus");
    const classId = params.get("classId");
    const applicationId = params.get("applicationId");

    const success =
      validSignature === "true" &&
      responseCode === "00" &&
      transactionStatus === "00" &&
      !!classId;

    if (success) {
      navigate(`/payment/success/${classId}`, { replace: true });
      return;
    }

    navigate(`/payment/fail/${applicationId ?? 0}`, { replace: true });
  }, [navigate, params]);

  return <div className="text-center mt-10">Dang xu ly ket qua thanh toan...</div>;
}
