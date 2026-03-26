import axiosClient from "../../../shared/api/axiosClient";
import type {StatisticsItem } from "../model/statisticsType";


export const adminApi = {
    getSubjectStats: async (year?: number): Promise<StatisticsItem[]> => {
        const res = await axiosClient.get("/admin/statistics/subject", {
            params: {year},
        });
        return res.data;
    },

    getGradeStats: async (year?: number): Promise<StatisticsItem[]> => {
        const res = await axiosClient.get("/admin/statistics/grade", {
            params: {year},
        });
        return res.data;
    },

    getLocationStats: async (year?: number): Promise<StatisticsItem[]> => {
        const res = await axiosClient.get("/admin/statistics/location", {
            params: {year},
        });
        return res.data;
    }
}