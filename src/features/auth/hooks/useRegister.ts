import { useState } from "react";
import { authApi } from "../api/authApi";
import type { RegisterPayload, RegisterResponse } from "../api/authDTO";
import { persistAuthSession, persistAuthUser } from "../model/authStorage";
import { useAppDispatch } from "../../../app/store/hooks";
import { setCredential } from "../model/authSlice";
import { useNavigate } from "react-router-dom";

export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const clearFeedBack = () => {
        setError("");
        setSuccess("");
    };

    function getRedirectPath(role: string): string {
        return role === "TUTOR" ? "/tutor/dashboard" : "/parent/dashboard";
    }

    const submitRegister = async (payload: RegisterPayload): Promise<RegisterResponse> => {
        try {
            setLoading(true);
            clearFeedBack();

            const result = await authApi.register(payload);
            setSuccess("Đăng ký thành công");

            setTimeout(() => {

            }, 2000)

            const payloadLogin = {
                username: payload.username,
                password: payload.password,
            }

            const data = await authApi.login(payloadLogin);

            persistAuthSession(data.accessToken);
            persistAuthUser(data.userResponse);
            dispatch(setCredential({
                user: data.userResponse, 
                token: data.accessToken
            }))
            navigate(getRedirectPath(data.userResponse.role));
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đăng ký thất bại";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        success,
        clearFeedBack,
        submitRegister,
    };
}
