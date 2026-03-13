import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getInitialAuthState } from "./authStorage";
import type { AuthState, AuthUser } from "./authTypes";

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        startChecking(state) {
            state.status = "CHECKING";
        },
        setCredential(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.status = "AUTHENTICATED";
        },
        setAccessToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
        setAuthenticatedUser(state, action: PayloadAction<AuthUser>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.status = "AUTHENTICATED";
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.status = "UNAUTHENTICATED";
        },
    },
});

export const {
    startChecking,
    setCredential,
    setAccessToken,
    setAuthenticatedUser,
    logout,
} = authSlice.actions;

export default authSlice.reducer;
