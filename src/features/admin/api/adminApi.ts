import axiosClient from "../../../shared/api/axiosClient";
import type { AccountType } from "../model/accountType";
import type {FilterOptionType, SearchClassType, StatisticsItemType } from "../model/statisticsType";


export const adminApi = {
    //Account APIs
    getAllAccounts: async (): Promise<AccountType[]> => {
        const res = await axiosClient.get("/admin/accounts");
        return res.data;
    },

    updateAccountStatus: async (accountId: number, newStatus: string): Promise<void> => {
        const res = await axiosClient.put(`/admin/accounts/${accountId}`, { status: newStatus });
        return res.data;
    },

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
    getUnregisteredClasses: async (page?: number, size?: number, subjectId?: number, gradeId?: number, locationId?: number): Promise<SearchClassType> => {
        const res = await axiosClient.get("/public/search", {
            params:{page, size, subjectId, gradeId, locationId},
        });
        return res.data;
    },
    deleteUnregisteredClass: async (classId: number): Promise<void> => {
        const res = await axiosClient.delete(`/admin/classes/${classId}`);
        return res.data;
    },

    //FilterOption APIs
    getSubjectOption: async (): Promise<FilterOptionType[]> => {
        const res = await axiosClient.get("/public/subject-option");
        return res.data;
    },
    getGradeOption: async (): Promise<FilterOptionType[]> => {
        const res = await axiosClient.get("/public/grade-option");
        return res.data;
    },
    getLocationOption: async (): Promise<FilterOptionType[]> => {
        const res = await axiosClient.get("/public/location-option");
        return res.data;
    },
}