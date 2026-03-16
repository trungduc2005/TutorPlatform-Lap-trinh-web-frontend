import type { Gender, UserRole, UserStatus, AuthStatus } from "../../../shared/model/enums";

export interface AuthUser {
    id: number;
    fullName: string;
    address: string;
    gender: Gender;
    email: string;
    phone: string;
    role: UserRole;
    username: string;
    avatarUrl?: string;
    status: UserStatus;
}

export interface AuthState {
    token: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    status: AuthStatus;
}