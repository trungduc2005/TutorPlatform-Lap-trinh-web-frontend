import { useEffect, type ReactNode } from "react";
import { authApi } from "../../features/auth/api/authApi";
import type { AuthUser } from "../../features/auth/model/authTypes";
import { setHasTutorProfile } from "../../features/auth/model/authSlice";
import { tutorProfileApi } from "../../features/profile/api/tutorProfileApi";
import { store } from "../store/store";

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
                const token = refreshResponse.accessToken;
                store.dispatch(setAccessToken(token));
                persistAuthSession(token);
                await new Promise(r => setTimeout(r, 0));
                const user = await authApi.me();
                return {
                    token,
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
    const { status, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const unregisterTokenProvider = registerAccessTokenProvider(() => {
                                            const token = store.getState().auth.token;

                                                return token;
                                        });
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

                dispatch(setAccessToken(token));
                persistAuthSession(token);
                persistAuthUser(user);
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

    useEffect(() => {
        if (status !== "AUTHENTICATED") {
            dispatch(setHasTutorProfile(null));
            return;
        }

        if (user?.role !== "TUTOR") {
            dispatch(setHasTutorProfile(null));
            return;
        }

        let ignore = false;

        const checkTutorProfile = async () => {
            try {
                await tutorProfileApi.getMyTutorProfile();

                if (!ignore) {
                    dispatch(setHasTutorProfile(true));
                }
            } catch (error) {
                if (ignore) {
                    return;
                }

                if (error instanceof ApiError && error.status === 404) {
                    dispatch(setHasTutorProfile(false));
                    return;
                }

                dispatch(setHasTutorProfile(null));
            }
        };

        checkTutorProfile();

        return () => {
            ignore = true;
        };
    }, [dispatch, status, user?.id, user?.role]);


    return <>{children}</>;
}

export default AuthBootstrap;
