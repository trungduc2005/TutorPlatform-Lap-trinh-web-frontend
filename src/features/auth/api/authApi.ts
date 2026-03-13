import axiosClient from "../../../shared/api/axiosClient";
import type {
    LoginPayload,
    LoginResponse,
    RefreshResponse,
    RegisterPayload,
    RegisterResponse,
} from "./authDTO";

const AUTH_PREFIX = "/public";

export const authApi = {
    async register(payload: RegisterPayload): Promise<RegisterResponse> {
        const { data } = await axiosClient.post<RegisterResponse>(`${AUTH_PREFIX}/signup`, payload);
        return data;
    },

    async login(payload: LoginPayload): Promise<LoginResponse> {
        const { data } = await axiosClient.post<LoginResponse>(`${AUTH_PREFIX}/login`, payload);
        return data;
    },

    async refresh(): Promise<RefreshResponse> {
        const { data } = await axiosClient.post<RefreshResponse>(`${AUTH_PREFIX}/refresh`);
        return data;
    },

    async logout(): Promise<void> {
        await axiosClient.post(`${AUTH_PREFIX}/logout`);
    },

    async me(): Promise<RegisterResponse> {
        const { data } = await axiosClient.get<RegisterResponse>("/me");
        return data;
    },
};
