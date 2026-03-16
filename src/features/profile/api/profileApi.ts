import axiosClient from "../../../shared/api/axiosClient";
import type { UpdateProfilePayload } from "../model/profileType";

export const profileApi = {
    async updateProfile(papload: UpdateProfilePayload) : Promise<string>{
        const {data} = await axiosClient.put<string>(`/profile`, papload);
        return data;
    },
}