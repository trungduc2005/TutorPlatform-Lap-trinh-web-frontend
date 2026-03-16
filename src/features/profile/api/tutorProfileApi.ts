import axiosClient from "../../../shared/api/axiosClient";
import type { TutorProfilePayload } from "../model/tutorProfileType";

export const tutorProfileApi = {
    async getMyTutorProfile() {
        const { data } = await axiosClient.get("/tutor/profile");
        return data;
    },

    async createTutorProfile(payload: TutorProfilePayload) {
        const { data } = await axiosClient.post(`/tutor/profile`, payload);
        return data;
    },

    async updateTutorProfile(payload: TutorProfilePayload) {
        const { data } = await axiosClient.put(`/tutor/profile`, payload);
        return data;
    }
};
