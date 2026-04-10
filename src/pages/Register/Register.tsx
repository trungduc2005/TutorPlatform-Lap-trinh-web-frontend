import { useState, type ChangeEvent, type FormEvent } from "react";
import { BsCloudFill } from "react-icons/bs";
import { FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { RegisterFormValues } from "../../features/auth/api/authDTO";
import { useRegister } from "../../features/auth/hooks/useRegister";
import { toRegisterPayload } from "../../features/auth/lib/registerMapper";
import { validateRegisterForm } from "../../features/auth/lib/registerValidation";
import { uploadAvatarToCloudinary } from "../../shared/api/cloudinaryApi";
import rabbitBook from "../../assets/rabbit-book.png";
import registerBookTop from "../../assets/register-book-top.png";
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
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarUploadError, setAvatarUploadError] = useState("");

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
            // Error feedback is handled by useRegister.
        }
    };

    const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        const file = input.files?.[0];
        if (!file) return;

        try {
            setAvatarUploading(true);
            setAvatarUploadError("");
            setValidationError("");
            clearFeedBack();

            const avatarUrl = await uploadAvatarToCloudinary(file);

            setFormValues((prev) => ({
                ...prev,
                avatarUrl,
            }));
        } catch (err) {
            setAvatarUploadError(err instanceof Error ? err.message : "Upload avatar thất bại");
        } finally {
            setAvatarUploading(false);
            input.value = "";
        }
    };

    const displayError = validationError || avatarUploadError || error;
    const hasAvatar = Boolean(formValues.avatarUrl?.trim());

    return (
        <section className="register-page">
            <div className="register-card">
                <div className="register-card__top-bg" aria-hidden="true" />
                <div className="register-hero-icon" aria-hidden="true">
                    <img src={registerBookTop} alt="" className="register-hero-icon__image" />
                </div>

                <h1 className="register-title">Đăng ký tài khoản</h1>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-grid">
                        <div className="register-field">
                            <label htmlFor="fullName">Họ và tên</label>
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

                        <div className="register-field register-field--full">
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

                        <div className="register-field register-field--avatar register-field--full">
                            <label htmlFor="avatarFile">Ảnh đại diện</label>

                            <label
                                htmlFor="avatarFile"
                                className={`register-upload${avatarUploading ? " register-upload--uploading" : ""}${
                                    hasAvatar ? " register-upload--has-image" : ""
                                }`}
                            >
                                <span className="register-upload__text">
                                    {avatarUploading ? "Đang upload ảnh..." : "Click vào ảnh để upload"}
                                </span>

                                {hasAvatar ? (
                                    <img className="register-upload__preview" src={formValues.avatarUrl} alt="Ảnh đại diện" />
                                ) : (
                                    <span className="register-upload__illustration" aria-hidden="true">
                                        <BsCloudFill className="register-upload__cloud" />
                                        <FaArrowUp className="register-upload__arrow" />
                                    </span>
                                )}
                            </label>

                            <input
                                className="register-upload__input"
                                type="file"
                                id="avatarFile"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                disabled={avatarUploading}
                            />

                            {hasAvatar ? (
                                <a className="register-upload__link" href={formValues.avatarUrl} target="_blank" rel="noreferrer">
                                    Xem ảnh đã upload
                                </a>
                            ) : null}
                        </div>
                    </div>

                    <button className="register-submit" type="submit" disabled={loading || avatarUploading}>
                        {avatarUploading ? "Đang upload ảnh..." : loading ? "Đang đăng ký..." : "Đăng ký ngay"}
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
                    Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>

                <img className="register-rabbit" src={rabbitBook} alt="" aria-hidden="true" />
            </div>
        </section>
    );
}

export default Register;

