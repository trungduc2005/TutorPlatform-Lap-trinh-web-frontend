import axiosClient from "../../../shared/api/axiosClient";
import type { NotificationType } from "../model/notificationType";

export const notificationApi = {
    async getMine() {
        const { data } = await axiosClient.get<NotificationType[]>("/notifications/me");
        return data;
    },
    async hasNew() {
        const { data } = await axiosClient.get<{ hasNew: boolean }>("/notifications/has-new");
        return data.hasNew;
    },
    async readAll() {
        await axiosClient.put("/notifications/read-all");
    },
};
