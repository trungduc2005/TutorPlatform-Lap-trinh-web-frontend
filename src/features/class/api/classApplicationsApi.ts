import axiosClient from "../../../shared/api/axiosClient";
import type { ClassApplicationDTO } from "../model/classTypes";

export const getMyClassApplications = async (): Promise<ClassApplicationDTO[]> => {
    const res = await axiosClient.get("/tutor/class-applications");
    return res.data.items ?? [];
};
export const startPayment = async (applicationId: number) => {
  const res = await axiosClient.post(
    `/tutor/class-applications/${applicationId}/start-payment`
  );
  return res.data;
};