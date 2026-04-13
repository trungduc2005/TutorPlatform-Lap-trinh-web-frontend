export type ClassApplicationStatus = "ACCEPTED" | "REJECTED" | "PENDING" | "CANCELLED" | "SELECTED_AWAITING_PAYMENT" | "PAYMENT_EXPIRED";

export interface ClassApplicationDTO {
  id: number;
  classId: number;
  classApplicationStatus: ClassApplicationStatus;
  tutorName: string;
  message: string;
  updateAt: string;
  selectionExpiresAt?: string;
}

export type ClassApplication = {
  id: number;
  classId: number;
  status: ClassApplicationStatus;
  tutorName: string;
  message: string;
  updatedAt: string;
  selectionExpiresAt?: string;
};

export const mapClassApplication = (c: ClassApplicationDTO): ClassApplication => ({
  id: c.id,
  classId: c.classId,
  status: c.classApplicationStatus,
  tutorName: c.tutorName,
  message: c.message,
  updatedAt: c.updateAt,
  selectionExpiresAt: c.selectionExpiresAt,
});