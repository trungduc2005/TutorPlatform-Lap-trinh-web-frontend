import { Link, NavLink } from "react-router-dom";
import { useBellNotification } from "../../../features/notification/hooks/useBellNotification";
import kittyLogo from "../../../assets/hello-kitty-logo.svg";
import { useAppSelector } from "../../../app/store/hooks";
import { message } from "antd";
import { FiBell } from "react-icons/fi";
import "./Header.css";

interface NavItem {
    path: string;
    label: string;
}

const NAV_ITEMS_COMMON: NavItem[] = [
    { path: "/", label: "Trang chủ" },
    { path: "/contract", label: "Hợp đồng"},
];

const NAV_ITEMS_GUEST: NavItem[] = [
    ...NAV_ITEMS_COMMON,
    { path: "/classes", label: "Danh sách lớp mới" },
    { path: "/featured-tutors", label: "Gia sư tiêu biểu" },
];

const NAV_ITEMS_TUTOR: NavItem[] = [
    ...NAV_ITEMS_COMMON,
    { path: "/classes", label: "Danh sách lớp mới" },
    { path: "/chat", label: "Tin nhắn" },
    { path: "/classroom-calling", label: "Phòng học Online"},
    { path: "/tutor/class-applications", label: "Lớp đã nhận"}
];

const NAV_ITEMS_HIRER: NavItem[] = [
    { path: "/", label: "Trang chủ" },
    { path: "/hire-tutor", label: "Thuê gia sư" },
    { path: "/featured-tutors", label: "Gia sư tiêu biểu" },
    { path: "/hirer/class-management", label: "Quản lý lớp học" },
    { path: "/hirer/application-management", label: "Quản lý ứng tuyển" },
    { path: "/contract", label: "Hợp đồng" },
    { path: "/chat", label: "Tin nhắn" },
    { path: "/classroom-calling", label: "Phòng học Online" },
];

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
    const { hasNew, markAllAsRead } = useBellNotification();
    const initial = user?.avatarUrl?.trim() || "T";

    const handleNotificationClick = async () => {
        if (!hasNew) {
            message.info("Bạn không có thông báo mới");
            return;
        }

        try {
            await markAllAsRead();
            message.success("Đã đánh dấu tất cả thông báo là đã đọc");
        } catch {
            message.error("Không thể cập nhật thông báo");
        }
    };

    return (
        <>
            <button
                type="button"
                className="notification"
                aria-label="Thông báo"
                onClick={() => { void handleNotificationClick(); }}
            >
                <span className="notification__icon" aria-hidden="true">
                    <FiBell />
                </span>
                {hasNew ? <span className="notification__dot" aria-hidden="true" /> : null}
            </button>

            <Link to="/profile" className="top-action-link">
                <button type="button" className="profile">
                    <img src={initial} alt="" className="profile__avatar" />
                    <span className="profile__name">{user?.fullName ?? "Tài khoản"}</span>
                </button>
            </Link>
        </>
    );
}


function Header() {
    const { status, user } = useAppSelector((state) => state.auth);

    const navItems =
        user?.role === "TUTOR"
            ? NAV_ITEMS_TUTOR
            : user?.role === "HIRER"
                ? NAV_ITEMS_HIRER
                : NAV_ITEMS_GUEST;

    return (
        <header className="site-header select-none">
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
