export type Gender = "MALE" | "FEMALE" | "OTHER";
export type UserRole = "ADMIN" | "TUTOR" | "HIRER";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type AuthStatus = "CHECKING" | "AUTHENTICATED" | "UNAUTHENTICATED";

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