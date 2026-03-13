import { Link, NavLink } from "react-router-dom";

import kittyLogo from "../../../assets/hello-kitty-logo.svg";
import "./Header.css";

const NAV_ITEMS = [
    { path: "/", label: "Trang chủ" },
    { path: "/about", label: "Giới thiệu" },
    { path: "/classes", label: "Danh sách lớp mới" },
];

function Header() {
    return (
        <header className="site-header">
            <div className="topbar">
                <div className="container topbar-inner">
                    <div className="brand">
                        <img className="brand-logo" src={kittyLogo} alt="Logo" />
                        <span className="brand-name">Nhóm 5</span>
                    </div>
                    <div className="top-actions">
                        <Link to={"/register"}>
                            <button className="top-btn top-btn--light">Đăng ký</button>
                        </Link>
                        <Link to={"/login"}>
                            <button className="top-btn top-btn--pale">Đăng nhập</button>
                        </Link>
                        <Link to="/contact" className="phone">
                            <span className="phone-icon">📞</span>
                            <span className="phone-number">0123456789</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="navbar">
                <div className="container navbar-inner">
                    <nav className="header-nav" aria-label="Điều hướng chính">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    `header-nav__link${isActive ? " header-nav__link--active" : ""}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
