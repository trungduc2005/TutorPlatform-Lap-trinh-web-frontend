import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/store/hooks";
import { authApi } from "../api/authApi";
import type { LoginPayload } from "../api/authDTO";
import { logout, setCredential } from "../model/authSlice";
import { clearAuthStorage, persistAuthSession, persistAuthUser } from "../model/authStorage";

const initialLoginValues: LoginPayload = {
    username: "",
    password: "",
};

function validateLoginForm(values: LoginPayload): string {
    if (!values.username.trim()) {
        return "Please enter your username";
    }

    if (!values.password.trim()) {
        return "Please enter your password";
    }

    return "";
}

function getRedirectPath(role: string): string {
    return role === "TUTOR" ? "/tutor/dashboard" : "/parent/dashboard";
}

export function useLogin() {
    const [formValues, setFormValues] = useState<LoginPayload>(initialLoginValues);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationMessage = validateLoginForm(formValues);
        if (validationMessage) {
            setError(validationMessage);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const payload = {
                username: formValues.username.trim(),
                password: formValues.password.trim(),
            };

            const data = await authApi.login(payload);

            persistAuthSession(data.accessToken);
            persistAuthUser(data.userResponse);
            dispatch(
                setCredential({
                    token: data.accessToken,
                    user: data.userResponse,
                })
            );

            navigate(getRedirectPath(data.userResponse.role));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }


    };
    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch {

        }

        clearAuthStorage();
        dispatch(logout());
        navigate("/login", { replace: true })
    };

    return {
        formValues,
        loading,
        error,
        handleChange,
        handleSubmit,
        handleLogout
    };
}
