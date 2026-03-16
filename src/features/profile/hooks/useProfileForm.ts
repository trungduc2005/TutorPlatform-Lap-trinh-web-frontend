import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../app/store/hooks";
import { setAuthenticatedUser } from "../../auth/model/authSlice";
import { profileApi } from "../api/profileApi";
import type { AuthUser } from "../../auth/model/authTypes";
import type { UpdateProfilePayload } from "../model/profileType";
import { authApi } from "../../auth/api/authApi";

export function useProfileForm(user: AuthUser) {
    const dispatch = useAppDispatch();

    const [formValues, setFormValues] = useState<UpdateProfilePayload>({
        fullName: user.fullName, 
        address: user.address,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl ?? "",
    })
 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        const {name, value} = event.target;
        setFormValues((prev) => ({
            ...prev, 
            [name]: value,
        }))
        setError("");
        setSuccess("");
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const result = await profileApi.updateProfile(formValues);
            const freshUser = await authApi.me();
            dispatch(setAuthenticatedUser(freshUser));
            setSuccess(result || "Cập nhật thông tin thành công")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    }
    

    return {
        formValues, 
        loading, 
        error, 
        success, 
        handleChange,
        handleSubmit,
    }
}

