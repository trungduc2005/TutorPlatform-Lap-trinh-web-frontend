import type { AuthUser, Gender, UserRole } from "../model/authTypes";

interface RegisterFields {
    fullName: string;
    address: string;
    gender: Gender;
    email: string;
    phone: string;
    role: UserRole;
    username: string;
    avatarUrl?: string;
}

export interface RegisterPayload extends RegisterFields {
    password: string;
}

export interface RegisterFormValues extends RegisterPayload {
    confirmPassword: string;
}

export type RegisterResponse = AuthUser;

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    userResponse: RegisterResponse;
}

export interface RefreshResponse {
    accessToken: string;
}
