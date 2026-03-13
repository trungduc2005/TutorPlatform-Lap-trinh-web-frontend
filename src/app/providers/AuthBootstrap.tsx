import { useEffect, type ReactNode } from "react";
import { authApi } from "../../features/auth/api/authApi";
import type { AuthUser } from "../../features/auth/model/authTypes";
import {
    logout,
    setAccessToken,
    setAuthenticatedUser,
} from "../../features/auth/model/authSlice";
import {
    clearAuthStorage,
    getStoredAccessToken,
    persistAuthSession,
    persistAuthUser,
} from "../../features/auth/model/authStorage";
import {
    registerAccessTokenProvider,
    registerAccessTokenUpdater,
    registerUnauthorizedHandler,
} from "../../shared/api/axiosClient";
import { useAppDispatch, useAppSelector } from "../store/hooks";

let bootstrapPromise: Promise<{ token: string; user: AuthUser }> | null = null;

async function bootstrapSession() {
    if (!bootstrapPromise) {
        bootstrapPromise = authApi
            .refresh()
            .then(async (refreshResponse) => {
                persistAuthSession(refreshResponse.accessToken);
                const user = await authApi.me();
                return {
                    token: refreshResponse.accessToken,
                    user,
                };
            })
            .finally(() => {
                bootstrapPromise = null;
            });
    }

    return bootstrapPromise;
}

function AuthBootstrap({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const { status } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const unregisterTokenProvider = registerAccessTokenProvider(() => getStoredAccessToken());
        const unregisterTokenUpdater = registerAccessTokenUpdater((token) => {
            persistAuthSession(token);
            dispatch(setAccessToken(token));
        });
        const unregisterUnauthorizedHandler = registerUnauthorizedHandler(() => {
            clearAuthStorage();
            dispatch(logout());
        });

        return () => {
            unregisterUnauthorizedHandler();
            unregisterTokenUpdater();
            unregisterTokenProvider();
        };
    }, [dispatch]);

    useEffect(() => {
        if (status !== "CHECKING") {
            return;
        }

        let ignore = false;

        const runBootstrap = async () => {
            try {
                const { token, user } = await bootstrapSession();

                if (ignore) {
                    return;
                }

                persistAuthSession(token);
                persistAuthUser(user);
                dispatch(setAccessToken(token));
                dispatch(setAuthenticatedUser(user));
            } catch {
                if (ignore) {
                    return;
                }

                clearAuthStorage();
                dispatch(logout());
            }
        };

        runBootstrap();

        return () => {
            ignore = true;
        };
    }, [dispatch, status]);

    return <>{children}</>;
}

export default AuthBootstrap;
