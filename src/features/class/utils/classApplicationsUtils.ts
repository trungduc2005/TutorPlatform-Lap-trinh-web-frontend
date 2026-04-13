import type { ClassApplicationStatus } from "../model/classTypes";

export const parseTime = (expiresAt?: any): number | null => {
  if (!expiresAt) return null;

  if (Array.isArray(expiresAt)) {
    const [y, m, d, h, mi, s] = expiresAt;
    return new Date(y, m - 1, d, h, mi, s).getTime();
  }

  if (typeof expiresAt === "string") {
    return new Date(expiresAt.replace(" ", "T")).getTime();
  }

  if (expiresAt instanceof Date) {
    return expiresAt.getTime();
  }

  return null;
};

export const isExpired = (expiresAt?: any): boolean => {
  const time = parseTime(expiresAt);
  if (!time) return false;
  return Date.now() > time;
};

export const getRemainingTime = (expiresAt?: any): string => {
  const expireTime = parseTime(expiresAt);
  if (!expireTime) return "";

  const diff = expireTime - Date.now();

  if (diff <= 0) return "";

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  return `${h}h ${m}p ${s}s`;
};

export const getDisplayStatus = (
  item: any
): ClassApplicationStatus => {
  if (
    item.status === "SELECTED_AWAITING_PAYMENT" &&
    isExpired(item.selectionExpiresAt)
  ) {
    return "PENDING";
  }

  return item.status;
};

export const statusLabel: Record<ClassApplicationStatus, string> = {
  ACCEPTED: "Đã nhận",
  REJECTED: "Bị từ chối",
  PENDING: "Đang chờ",
  CANCELLED: "Đã hủy",
  SELECTED_AWAITING_PAYMENT: "Chờ thanh toán",
  PAYMENT_EXPIRED: "Hết hạn thanh toán",
};

export const statusColor: Record<ClassApplicationStatus, string> = {
  ACCEPTED: "text-green-600",
  REJECTED: "text-red-600",
  PENDING: "text-yellow-600",
  CANCELLED: "text-red-600",
  SELECTED_AWAITING_PAYMENT: "text-yellow-500",
  PAYMENT_EXPIRED: "text-red-500",
};