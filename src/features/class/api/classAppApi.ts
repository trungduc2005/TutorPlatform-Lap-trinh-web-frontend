import axiosClient from "../../../shared/api/axiosClient";
import { ClassApplicationDTO } from "../model/classTypes";

export const getMyClassApplications = async (): Promise<ClassApplicationDTO[]> => {
    const res = await axiosClient.get("/tutor/class-applications");
    return res.data.items ?? [];
};