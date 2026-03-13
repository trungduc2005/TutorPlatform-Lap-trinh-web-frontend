import type { RegisterFormValues } from "../api/authDTO";

export function validateRegisterForm(values: RegisterFormValues): string {
    if (!values.fullName.trim()) return "Vui lòng nhập họ và tên";
    if (!values.phone.trim()) return "Vui lòng nhập số điện thoại";
    if (!values.email.trim()) return "Vui lòng nhập email";
    if (!values.username.trim()) return "Vui lòng nhập tên đăng nhập";
    if (!values.password.trim()) return "Vui lòng nhập mật khẩu";
    if (values.password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    if (values.password !== values.confirmPassword) {
        return "Mật khẩu xác nhận không khớp";
    }

    return "";
}
