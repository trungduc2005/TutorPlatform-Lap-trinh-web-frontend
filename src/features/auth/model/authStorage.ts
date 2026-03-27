import type { AuthState, AuthUser } from "./authTypes";

const ACCESS_TOKEN_KEY = "access_token";

let accessToken: string | null =
    localStorage.getItem(ACCESS_TOKEN_KEY);

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
        hasTutorProfile: null,
    };
}


export function persistAuthSession(token: string) {
    accessToken = token;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function persistAuthUser(user: AuthUser) {
    authUser = user;
}

export function clearAuthStorage() {
    accessToken = null;
    authUser = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}
