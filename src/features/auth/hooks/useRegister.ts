import { useState } from "react";
import { authApi } from "../api/authApi";
import type { RegisterPayload, RegisterResponse } from "../api/authDTO";

export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const clearFeedBack = () => {
        setError("");
        setSuccess("");
    };

    const submitRegister = async (payload: RegisterPayload): Promise<RegisterResponse> => {
        try {
            setLoading(true);
            clearFeedBack();

            const result = await authApi.register(payload);
            setSuccess("Đăng ký thành công");
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
