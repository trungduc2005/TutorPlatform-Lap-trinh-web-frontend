import axiosClient from "../../../shared/api/axiosClient";

export const notificationApi = {
    async hasNew() {
        const { data } = await axiosClient.get<{ hasNew: boolean }>("/notifications/has-new");
        return data.hasNew;
    },
    async readAll() {
        await axiosClient.put("/notifications/read-all");
    },
};
