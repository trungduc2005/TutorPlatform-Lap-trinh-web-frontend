import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";
import kittyLogo from "../../../assets/hello-kitty-logo.svg";
import "./Header.css";

interface NavItem {
    path: string;
    label: string;
}

const NAV_ITEMS_ADMIN: NavItem[] = [
    { path: "/admin/admin-dashboard", label: "Trang chủ"},
    //{ path: "/admin/register-class-management", label: "Quản lý lớp học"},
    { path: "/admin/unregister-class-management", label: "Quản lý bài đăng"},
    { path: "/admin/featured-tutor-management", label: "Quản lý gia sư nổi bật"},
    { path: "/admin/payment-management", label: "Quản lý thanh toán"},
    { path: "/admin/notification-management", label: "Quản lý thông báo"},
    { path: "/admin/contract-management", label: "Quản lý hợp đồng"}
]

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
                <button type="button" className="notification">
                    <span className="notification__icon" aria-hidden="true">🔔</span>
                </button>

            <Link to="/admin/profile" className="top-action-link">
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

function AdminHeader() {
    const { status, user } = useAppSelector((state) => state.auth);

    const navItems = NAV_ITEMS_ADMIN;

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
                    <nav 
                        className="header-nav" aria-label="Điều hướng chính"
                        style={{
                            display: "flex",
                            gap: 20,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}
                    >
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

export default AdminHeader;