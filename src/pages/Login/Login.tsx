import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../features/auth/hooks/useLogin";
import "../Register/Register.css";

function Login() {
    const { formValues, loading, error, handleChange, handleSubmit } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <section className="register-page">
                <div className="register-card">
                    <h1 className="register-title">Đăng nhập</h1>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="register-field">
                            <label htmlFor="username">Tên đăng nhập</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Nhập tên đăng nhập"
                                value={formValues.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="password">Mật khẩu</label>
                            <div className="password-input-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
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

                            <button className="register-submit" type="submit" disabled={loading}>
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>

                            {error ? (
                                <p className="register-message register-message--error">{error}</p>
                            ) : null}

                            <p className="register-login">
                                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Login;
