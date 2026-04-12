export type PaymentHistoryType = {
    id: number;
    classId: number;
    classApplicationId: number;
    tutorId: number;
    amount: number;
    provider: string;
    txnRef: string;
    status: string;
    paymentUrl: string;
    expiresAt: number[];
    paidAt: number[] | null;
    vnpTransactionNo: string | null;
    rawResponse: string;
    createdAt: number[];
    updatedAt: number[];
}