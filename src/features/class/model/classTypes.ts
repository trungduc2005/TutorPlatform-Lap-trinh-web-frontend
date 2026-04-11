export type ClassApplicationStatus = "ACCEPTED" | "REJECTED" | "PENDING";

export interface ClassApplicationDTO {
  id: number;
  classId: number;
  classApplicationStatus: ClassApplicationStatus;
  tutorName: string;
  message: string;
  updateAt: string;
}

export type ClassApplication = {
  id: number;
  classId: number;
  status: ClassApplicationStatus;
  tutorName: string;
  message: string;
  updatedAt: string;
};

export const mapClassApplication = (c: ClassApplicationDTO): ClassApplication => ({
  id: c.id,
  classId: c.classId,
  status: c.classApplicationStatus,
  tutorName: c.tutorName,
  message: c.message,
  updatedAt: c.updateAt,
});
