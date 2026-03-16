import axiosClient from "../../../shared/api/axiosClient";
import type { TutorProfilePayload } from "../model/tutorProfileType";

export const tutorProfileApi = {
    async getMyTutorProfile() {
        const { data } = await axiosClient.get("/tutorprofile");
        return data;
    },

    async createTutorProfile(payload: TutorProfilePayload) {
        const { data } = await axiosClient.post(`/tutorprofile`, payload);
        return data;
    },

    async updateTutorProfile(payload: TutorProfilePayload) {
        const { data } = await axiosClient.put(`tutorprofile`, payload);
        return data;
    }
};
