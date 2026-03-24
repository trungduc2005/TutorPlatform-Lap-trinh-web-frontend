import axiosClient from"../../../shared/api/axiosClient"
import { ClassItem } from "../../../pages/ClassListing/classTypes"

export interface SearchClassesParams {
    subject?: string;
    gradeLevel?: string;
    minFee?: number;
    maxFee?: number;
    duration?: string;
    location?: string;
    page?:number;
    size?:number;
}

export interface SearchClassResponse {
    items: ClassItem[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
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