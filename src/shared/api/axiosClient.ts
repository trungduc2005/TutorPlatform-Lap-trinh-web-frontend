import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

type UnauthorizedHandler = () => void;
type AccessTokenProvider = () => string | null;
type AccessTokenUpdater = (token: string) => void;

export class ApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}


type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

interface RefreshTokenResponse {
    accessToken: string;
}

const BASE_URL = "http://localhost:8081";
const AUTH_PREFIX = "/public";
const AUTH_ENDPOINTS = new Set([
    `${AUTH_PREFIX}/login`,
    `${AUTH_PREFIX}/signup`,
    `${AUTH_PREFIX}/refresh`,
    `${AUTH_PREFIX}/logout`,
]);

let unauthorizedHandler: UnauthorizedHandler | null = null;
let accessTokenProvider: AccessTokenProvider | null = null;
let accessTokenUpdater: AccessTokenUpdater | null = null;
let refreshPromise: Promise<string> | null = null;

function normalizeUrl(url?: string): string {
    if (!url) {
        return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
        try {
            return new URL(url).pathname;
        } catch {
            return url;
        }
    }

    return url;
}

function isAuthEndpoint(url?: string): boolean {
    return AUTH_ENDPOINTS.has(normalizeUrl(url));
}

function getErrorMessage(error: AxiosError): string {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
    ) {
        return data.message;
    }

    return error.message || "Request failed";
}

const axiosClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
}); 

const refreshClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export function registerUnauthorizedHandler(handler: UnauthorizedHandler) {
    unauthorizedHandler = handler;

    return () => {
        if (unauthorizedHandler === handler) {
            unauthorizedHandler = null;
        }
    };
}

export function registerAccessTokenProvider(provider: AccessTokenProvider) {
    accessTokenProvider = provider;

    return () => {
        if (accessTokenProvider === provider) {
            accessTokenProvider = null;
        }
    };
}

export function registerAccessTokenUpdater(updater: AccessTokenUpdater) {
    accessTokenUpdater = updater;

    return () => {
        if (accessTokenUpdater === updater) {
            accessTokenUpdater = null;
        }
    };
}

async function refreshAccessToken(): Promise<string> {
    if (!refreshPromise) {
        refreshPromise = refreshClient
            .post<RefreshTokenResponse>(`${AUTH_PREFIX}/refresh`)
            .then(({ data }) => {
                accessTokenUpdater?.(data.accessToken);
                return data.accessToken;
            })
            .catch((error: AxiosError) => {
                unauthorizedHandler?.();
                throw new ApiError(getErrorMessage(error), error.response?.status);
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

axiosClient.interceptors.request.use((config) => {
    if (isAuthEndpoint(config.url)) {
        return config;
    }

    const token = accessTokenProvider?.();

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const requestUrl = originalRequest?.url;
        const status = error.response?.status;

        if (!originalRequest) {
            return Promise.reject(new ApiError(getErrorMessage(error), status));
        }

        if (status === 401 && normalizeUrl(requestUrl) === `${AUTH_PREFIX}/refresh`) {
            unauthorizedHandler?.();
            return Promise.reject(new ApiError(getErrorMessage(error), status));
        }

        if (status === 401 && !originalRequest._retry && !isAuthEndpoint(requestUrl)) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(
                    refreshError instanceof Error
                        ? refreshError
                        : new Error("Session expired")
                );
            }
        }

        return Promise.reject(new ApiError(getErrorMessage(error), status));
    }
);

export default axiosClient;
