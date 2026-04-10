import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../features/auth/hooks/useLogin";
import rabbitLogin from "../../assets/rabbit-book.png";
import "./Login.css";

function Login() {
    const { formValues, loading, error, handleChange, handleSubmit } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <section className="login-page">
            <div className="login-layout">
                <div className="login-card">
                    <div className="login-card__header">
                        <h1 className="login-card__title">Đăng nhập</h1>
                        <p className="login-card__subtitle">
                            Nhập tên đăng nhập và mật khẩu để tiếp tục.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-field">
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

                        <div className="login-field">
                            <label htmlFor="password">Mật khẩu</label>
                            <div className="login-password">
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
                                    className="login-password__toggle"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? "Ẩn" : "Hiện"}
                                </button>
                            </div>
                        </div>

                        <button className="login-submit" type="submit" disabled={loading}>
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>

                        {error ? <p className="login-message login-message--error">{error}</p> : null}

                        <p className="login-register">
                            Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                        </p>
                    </form>
                </div>

                <aside className="login-illustration" aria-hidden="true">
                    <img src={rabbitLogin} alt="" className="login-illustration__image" />
                </aside>
            </div>
        </section>
    );
}

export default Login;
