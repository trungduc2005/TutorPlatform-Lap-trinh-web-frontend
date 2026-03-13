import type { RegisterFormValues, RegisterPayload } from "../api/authDTO";

export function toRegisterPayload(values: RegisterFormValues): RegisterPayload {
    return {
        password: values.password.trim(),
        fullName: values.fullName.trim(),
        address: values.address.trim(),
        gender: values.gender,
        email: values.email.trim(),
        phone: values.phone.trim(),
        role: values.role,
        username: values.username.trim(),
        avatarUrl: values.avatarUrl?.trim() || undefined,
    };
}
