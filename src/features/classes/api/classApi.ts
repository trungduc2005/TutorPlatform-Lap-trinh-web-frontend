import axiosClient from"../../../shared/api/axiosClient"
import type { ClassItem } from "../model/classTypes"

export interface FilterOption {
    id: number;
    name: string;
}

export interface SearchClassesParams {
    subjectId?: number;
    gradeId?: number;
    minFee?: number;
    maxFee?: number;
    durationId?: number;
    locationId?: number;
    page?:number;
    size?:number;
}

export interface SearchClassResponse {
    items: ClassItem[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

export interface ClassApplicationPayload {
    classId: number;
    message: string;
}

export interface CreateHirerClassPayload {
    subjectId: number;
    gradeId: number;
    locationId: number;
    durationId: number;
    fee: number;
    requirements: string;
    note: string;
    studentGender: "MALE" | "FEMALE" | "OTHER";
    studentDescription: string;
}

export interface HirerClassDTO {
    id: number;
    subjectId: number;
    gradeId: number;
    locationId: number;
    durationId: number;
    fee: number;
    requirements: string;
    note: string;
    studentGender: "MALE" | "FEMALE" | "OTHER";
    studentDescription: string;
}

export type UpdateHirerClassPayload = Partial<Omit<HirerClassDTO, "id">>;

export interface HirerClassApplicationResponse {
    id: number;
    classId?: number;
    tutorId?: number;
    tutorName?: string;
    message?: string;
    classApplicationStatus?: "ACCEPTED" | "REJECTED" | "PENDING";
    status?: "ACCEPTED" | "REJECTED" | "PENDING";
    updateAt?: string;
    updatedAt?: string;
}

export interface ClassSelectionResponse {
    classId?: number;
    applicationId?: number;
    tutorId?: number;
    tutorName?: string;
    status?: string;
    message?: string;
}

export const searchClass = async (
    params?: SearchClassesParams
): Promise<SearchClassResponse> => {
    const response = await axiosClient.get<SearchClassResponse>(
        '/public/search',
        {params}
    );
    return response.data;
}

export const getSubjectOptions = async (): Promise<FilterOption[]> => {
    const response = await axiosClient.get<FilterOption[]>('/public/subject-option');
    return response.data;
}

export const getGradeOptions = async (): Promise<FilterOption[]> => {
    const response = await axiosClient.get<FilterOption[]>('/public/grade-option');
    return response.data;
}

export const getLocationOptions = async (): Promise<FilterOption[]> => {
    const response = await axiosClient.get<FilterOption[]>('/public/location-option');
    return response.data;
}

export const getDurationOptions = async (): Promise<FilterOption[]> => {
    const response = await axiosClient.get<FilterOption[]>('/public/duration-option');
    return response.data;
}

export const applyClass = async (payload: ClassApplicationPayload): Promise<void> => {
    await axiosClient.post('/tutor/class-applications', payload);
}

export const createHirerClass = async (payload: CreateHirerClassPayload): Promise<void> => {
    await axiosClient.post('/hirer/classes', payload);
}

export const getHirerClasses = async (): Promise<HirerClassDTO[]> => {
    const response = await axiosClient.get<HirerClassDTO[]>('/hirer/classes');
    return response.data;
}

export const getHirerClassById = async (id: number): Promise<HirerClassDTO> => {
    const response = await axiosClient.get<HirerClassDTO>(`/hirer/classes/${id}`);
    return response.data;
}

export const updateHirerClass = async (id: number, payload: UpdateHirerClassPayload): Promise<void> => {
    await axiosClient.put(`/hirer/classes/${id}`, payload);
}

export const deleteHirerClass = async (id: number): Promise<void> => {
    await axiosClient.delete(`/hirer/classes/${id}`);
}

export const getHirerClassApplications = async (classId: number): Promise<HirerClassApplicationResponse[]> => {
    const response = await axiosClient.get<HirerClassApplicationResponse[]>(`/hirer/classes/${classId}/applications`);
    return response.data;
}

export const selectClassApplication = async (
    classId: number,
    applicationId: number
): Promise<ClassSelectionResponse> => {
    const response = await axiosClient.post<ClassSelectionResponse>(
        `/hirer/classes/${classId}/select-application/${applicationId}`
    );
    return response.data;
}

export const cancelClassSelection = async (classId: number): Promise<ClassSelectionResponse> => {
    const response = await axiosClient.post<ClassSelectionResponse>(`/hirer/classes/${classId}/cancel-selection`);
    return response.data;
}