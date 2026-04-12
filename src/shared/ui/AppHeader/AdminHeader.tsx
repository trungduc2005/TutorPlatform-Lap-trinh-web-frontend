import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";
import kittyLogo from "../../../assets/hello-kitty-logo.svg";
import "./AdminHeader.css";
import { useEffect, useRef, useState } from "react";

interface NavItem {
    path: string;
    label: string;
}

const NAV_ITEMS_ADMIN: NavItem[] = [
    { path: "/admin/admin-dashboard", label: "Trang chủ"},
    { path: "/admin/unregister-class-management", label: "Quản lý bài đăng"},
    { path: "/admin/featured-tutor-management", label: "Quản lý gia sư nổi bật"},
    { path: "/admin/payment-management", label: "Quản lý thanh toán"},
    { path: "/admin/notification-management", label: "Quản lý thông báo"},
    { path: "/admin/contract-management", label: "Quản lý hợp đồng"},
    { path: "/admin/account-management", label: "Quản lý tài khoản"},
    //{ path: "/admin/filteroption-class-management", label: "Quản lý bộ lọc"},
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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const navItems = NAV_ITEMS_ADMIN;
    const [visibleItems, setVisibleItems] = useState<NavItem[]>(navItems);
    const [hiddenItems, setHiddenItems] = useState<NavItem[]>([]);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            let totalWidth = 0;

            const visible: NavItem[] = [];
            const hidden: NavItem[] = [];

            const temp = document.createElement("div");
            temp.style.visibility = "hidden";
            temp.style.position = "absolute";
            temp.style.display = "flex";
            temp.style.gap = "10px";
            document.body.appendChild(temp);

            navItems.forEach((item) => {
                const el = document.createElement("span");
                el.className = "header-nav__link";
                el.innerText = item.label; // ✅ QUAN TRỌNG
                temp.appendChild(el);

                const width = el.offsetWidth + 10; // cộng gap

                const MORE_WIDTH = hidden.length > 0 ? 100 : 0;

                if (totalWidth + width < containerWidth - MORE_WIDTH) {
                    visible.push(item);
                    totalWidth += width;
                } else {
                    hidden.push(item);
                }
            });

            document.body.removeChild(temp);

            setVisibleItems(visible);
            setHiddenItems(hidden);
        };

        handleResize();

        const observer = new ResizeObserver(handleResize);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);



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
                        ref={containerRef}
                        className="header-nav" aria-label="Điều hướng chính"
                        style={{
                            display: "flex",
                            gap: 15,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {visibleItems.map((item) => (
                            <NavLink 
                            key={item.path} 
                            to={item.path}
                            className={({isActive}) => 
                                `header-nav__link ${isActive ? "header-nav__link--active" : ""}`
                            }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        {hiddenItems.length > 0 && (
                            <button 
                                className="more-menu"
                                onClick={() => setOpen(prev => !prev)}
                            >
                                ☰
                                {open && (
                                    <div className="dropdown">
                                        {hiddenItems.map((item) => (
                                            <NavLink 
                                                key={item.path} 
                                                to={item.path}
                                                className={({isActive}) => 
                                                    `dropdown-item ${isActive ? "active" : ""}`
                                                }
                                                onClick={() => setOpen(false)} // 👈 click item thì đóng
                                            >
                                                {item.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;