import type { Payload } from "recharts/types/component/DefaultTooltipContent";
import axiosClient from "../../../shared/api/axiosClient";
import type { AccountType } from "../model/accountType";
import type { FeaturedTutorType, UpdateFeaturedTutorPayload } from "../model/featuredTutorType";
import type {FilterOptionType, GradeOptionRequestType, LocationOptionRequestType, SearchClassType, StatisticsItemType, SubjectOptionRequestType } from "../model/statisticsType";
import type { NotificationPayload } from "../model/notificationType";
import type { PaymentHistoryType } from "../model/PaymentHistoryType";

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
        const res = await axiosClient.delete(`/hirer/classes/${classId}`);
        return res.data;
    },

    //FilterOption APIs
    getSubjectOption: async (): Promise<FilterOptionType[]> => {
        const res = await axiosClient.get("/public/subject-option");
        return res.data;
    },
    creatSubjectOption: async (payload: SubjectOptionRequestType): Promise<SubjectOptionRequestType> => {
        const res = await axiosClient.post("/admin/subject-option", payload);
        return res.data;
    },
    updateSubjectOption: async (subjectId: number, payload: SubjectOptionRequestType): Promise<SubjectOptionRequestType> => {
        const res = await axiosClient.put(`/admin/subject-option/${subjectId}`, 
            {payload});
        return res.data;
    },
    deleteSubjectOption: async (subjectId: number): Promise<void> => {
        const res = await axiosClient.delete(`/admin/subject-option/${subjectId}`);
        return res.data;
    },

    getGradeOption: async (): Promise<FilterOptionType[]> => {
        const res = await axiosClient.get("/public/grade-option");
        return res.data;
    },
    creatGradeOption: async (payload: GradeOptionRequestType): Promise<GradeOptionRequestType> => {
        const res = await axiosClient.post("/admin/grade-option", payload);
        return res.data;
    },
    updateGradeOption: async (gradeId: number, payload: GradeOptionRequestType): Promise<GradeOptionRequestType> => {
        const res = await axiosClient.put(`/admin/grade-option/${gradeId}`, 
            {payload});
        return res.data;
    },
    deleteGradeOption: async (gradeId: number): Promise<void> => {
        const res = await axiosClient.delete(`/admin/grade-option/${gradeId}`);
        return res.data;
    },
    
    getLocationOption: async (): Promise<FilterOptionType[]> => {
        const res = await axiosClient.get("/public/location-option");
        return res.data;
    },
    creatLocationOption: async (payload: LocationOptionRequestType): Promise<LocationOptionRequestType> => {
        const res = await axiosClient.post("/admin/location-option", payload);
        return res.data;
    },
    updateLocationOption: async (locationId: number, payload: LocationOptionRequestType): Promise<LocationOptionRequestType> => {
        const res = await axiosClient.put(`/admin/location-option/${locationId}`, 
            {payload});
        return res.data;
    },
    deleteLocationOption: async (locationId: number): Promise<void> => {
        const res = await axiosClient.delete(`/admin/location-option/${locationId}`);
        return res.data;
    },

    //Featured Tutor APIs
    getFeaturedTutors: async (): Promise<FeaturedTutorType[]> => {
        const res = await axiosClient.get("/public/featured_tutors");
        console.log(res.data);
        return res.data;
    },
    createFeaturedTutor: async (tutorData: Payload): Promise<void> => {
        const res = await axiosClient.post("/admin/featured_tutors", tutorData);
        return res.data;
    },
    deleteFeaturedTutor: async (tutorId: number): Promise<void> => {
        const res = await axiosClient.delete(`/admin/featured_tutors/${tutorId}`);
        return res.data;
    },
    updateFeaturedTutor: async (tutorId: number, tutorData: UpdateFeaturedTutorPayload): Promise<void> => {
        const res = await axiosClient.put(`/admin/featured_tutors/${tutorId}`, tutorData);
        return res.data;
    },

    //notifications
    sendNotification: async (payload: NotificationPayload): Promise<void>  => {
        const res = await axiosClient.post(`/admin/notifications/send`, payload);
        return res.data;
    },

    //paymentHistory
    getAllPaymentHistory: async (): Promise<PaymentHistoryType[]> => {
        const res = await axiosClient.get(`/admin/payment/history`);
        return res.data;
    }
}