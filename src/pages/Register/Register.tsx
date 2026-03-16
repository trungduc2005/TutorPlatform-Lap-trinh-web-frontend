import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { RegisterFormValues } from "../../features/auth/api/authDTO";
import { useRegister } from "../../features/auth/hooks/useRegister";
import { toRegisterPayload } from "../../features/auth/lib/registerMapper";
import { validateRegisterForm } from "../../features/auth/lib/registerValidation";
import "./Register.css";

const initFormValues: RegisterFormValues = {
    fullName: "",
    confirmPassword: "",
    address: "",
    gender: "MALE",
    email: "",
    phone: "",
    role: "TUTOR",
    username: "",
    password: "",
    avatarUrl: "",
};

function Register() {
    const [formValues, setFormValues] = useState<RegisterFormValues>(initFormValues);
    const [validationError, setValidationError] = useState("");
    const { loading, error, success, clearFeedBack, submitRegister } = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        setValidationError("");
        clearFeedBack();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formError = validateRegisterForm(formValues);
        if (formError) {
            setValidationError(formError);
            return;
        }

        try {
            await submitRegister(toRegisterPayload(formValues));
        } catch {
        }
    };

    const displayError = validationError || error;

    return (
        <>
            <section className="register-page">
                <div className="register-card">
                    <h1 className="register-title">Đăng ký tài khoản</h1>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="register-field">
                            <label htmlFor="fullNane">Họ và tên</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="Nhập họ và tên"
                                value={formValues.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={formValues.phone}
                                placeholder="Nhập số điện thoại"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="email">Địa chỉ email</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="Nhập email"
                                value={formValues.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="username">Tên đăng nhập</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={formValues.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="address">Địa chỉ</label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                placeholder="Nhập địa chỉ"
                                value={formValues.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="gender">Giới tính</label>
                            <select name="gender" id="gender" value={formValues.gender} onChange={handleChange}>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>

                        <div className="register-field">
                            <label htmlFor="role">Vai trò</label>
                            <select name="role" id="role" value={formValues.role} onChange={handleChange}>
                                <option value="TUTOR">Gia sư</option>
                                <option value="HIRER">Người thuê gia sư</option>
                            </select>
                        </div>

                        <div className="register-field">
                            <label htmlFor="avatarUrl">Avatar URL</label>
                            <input
                                type="text"
                                id="avatarUrl"
                                name="avatarUrl"
                                value={formValues.avatarUrl}
                                placeholder="https://example.com/avatar.png"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="password">Mật khẩu</label>
                            <div className="password-input-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="Nhập mật khẩu"
                                    value={formValues.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? "Ẩn" : "Hiện"}
                                </button>
                            </div>
                        </div>

                        <div className="register-field">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <div className="password-input-wrap">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formValues.confirmPassword}
                                    placeholder="Xác nhận mật khẩu"
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? "Ẩn" : "Hiện"}
                                </button>
                            </div>
                        </div>

                        <button className="register-submit" type="submit" disabled={loading}>
                            {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
                        </button>
                    </form>

                    {displayError ? (
                        <p className="register-message register-message--error">{displayError}</p>
                    ) : null}

                    {success ? (
                        <p className="register-message register-message--success">{success}</p>
                    ) : null}

                    <p className="register-note">
                        Bằng cách tạo tài khoản, bạn đồng ý với điều khoản sử dụng.
                    </p>

                    <p className="register-login">
                        Bạn đã có tài khoản? <Link to="/login">Đăng Nhập</Link>
                    </p>
                </div>
            </section>
        </>
    );
}

export default Register;
