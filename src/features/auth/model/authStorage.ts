import type { AuthState, AuthUser } from "./authTypes";

let accessToken: string | null = null;
let authUser: AuthUser | null = null;

export function getStoredAccessToken(): string | null {
    return accessToken;
}

export function getStoredAuthUser(): AuthUser | null {
    return authUser;
}

export function getInitialAuthState(): AuthState {
    return {
        token: accessToken,
        user: authUser,
        isAuthenticated: false,
        status: "CHECKING",
    };
}

export function persistAuthSession(token: string) {
    accessToken = token;
}

export function persistAuthUser(user: AuthUser) {
    authUser = user;
}

export function clearAuthStorage() {
    accessToken = null;
    authUser = null;
}
