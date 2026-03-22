import { Link, NavLink } from "react-router-dom";

import kittyLogo from "../../../assets/hello-kitty-logo.svg";
import { useAppSelector } from "../../../app/store/hooks";
import "./Header.css";

interface NavItem {
    path: string;
    label: string;
}

const NAV_ITEMS_GUEST: NavItem[] = [
    { path: "/", label: "Trang chủ" },
    { path: "/about", label: "Giới thiệu" },
    { path: "/classes", label: "Danh sách lớp mới" },
    { path: "/featured-tutors", label: "Gia sư tiêu biểu" },
    { path: "/chat", label: "Tin nhắn" },
    { path: "/classroom-calling", label: "Phòng học Online"}
];

const NAV_ITEMS_TUTOR: NavItem[] = [];

const NAV_ITEMS_HIRER: NavItem[] = [];

function GuestTopActions() {
    return (
        <>
            <Link to="/register">
                <button className="top-btn top-btn--light">Đăng ký</button>
            </Link>
            <Link to="/login">
                <button className="top-btn top-btn--pale">Đăng nhập</button>
            </Link>
            <Link to="/contact" className="phone">
                <span className="phone-icon">📞</span>
                <span className="phone-number">0123456789</span>
            </Link>
        </>
    );
}

function UserTopActions() {
    const user = useAppSelector((state) => state.auth.user);
    const initial = user?.fullName?.trim().charAt(0).toUpperCase() || "T";

    return (
        <>
            <Link to="/notification" className="top-action-link" aria-label="Thông báo">
                <button type="button" className="notification">
                    <span className="notification__icon" aria-hidden="true">🔔</span>
                </button>
            </Link>

            <Link to="/profile" className="top-action-link">
                <button type="button" className="profile">
                    <span className="profile__avatar" aria-hidden="true">
                        {initial}
                    </span>
                    <span className="profile__name">{user?.fullName ?? "Tài khoản"}</span>
                </button>
            </Link>
        </>
    );
}

function Header() {
    const { status, user } = useAppSelector((state) => state.auth);

    const navItems =
        user?.role === "TUTOR" && NAV_ITEMS_TUTOR.length > 0
            ? NAV_ITEMS_TUTOR
            : user?.role === "HIRER" && NAV_ITEMS_HIRER.length > 0
                ? NAV_ITEMS_HIRER
                : NAV_ITEMS_GUEST;

    return (
        <header className="site-header">
            <div className="topbar">
                <div className="container topbar-inner">
                    <div className="brand">
                        <img className="brand-logo" src={kittyLogo} alt="Logo" />
                        <span className="brand-name">Nhóm 5</span>
                    </div>

                    <div className="top-actions">
                        {status === "AUTHENTICATED" && user ? <UserTopActions /> : <GuestTopActions />}
                    </div>
                </div>
            </div>

            <div className="navbar">
                <div className="container navbar-inner">
                    <nav className="header-nav" aria-label="Điều hướng chính">
                        {navItems.map((item) => (
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
