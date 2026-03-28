import axiosClient from "../../../shared/api/axiosClient";
import type {SearchClassType, StatisticsItemType } from "../model/statisticsType";


export const adminApi = {
    // Statistics APIs
    getSubjectStats: async (year?: number): Promise<StatisticsItemType[]> => {
        const res = await axiosClient.get("/admin/statistics/subject", {
            params: {year},
        });
        return res.data;
    },

    getGradeStats: async (year?: number): Promise<StatisticsItemType[]> => {
        const res = await axiosClient.get("/admin/statistics/grade", {
            params: {year},
        });
        return res.data;
    },

    getLocationStats: async (year?: number): Promise<StatisticsItemType[]> => {
        const res = await axiosClient.get("/admin/statistics/location", {
            params: {year},
        });
        return res.data;
    },

    //Unregistered Classes APIs
    getUnregisteredClasses: async (page?: number, size?: number): Promise<SearchClassType> => {
        const res = await axiosClient.get("/public/search", {
            params:{page, size},
        });
        return res.data;
    }
}