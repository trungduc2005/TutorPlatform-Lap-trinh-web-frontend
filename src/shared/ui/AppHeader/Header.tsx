import { Link, NavLink } from "react-router-dom";

import kittyLogo from "../../../assets/hello-kitty-logo.svg";
import "./Header.css";
import { useAppSelector } from "../../../app/store/hooks";

const NAV_ITEMS_GUEST = [
    { path: "/", label: "Trang chủ" },
    { path: "/about", label: "Giới thiệu" },
    { path: "/classes", label: "Danh sách lớp mới" },
    { path: "/profile", label: "Gia sư tiêu biểu" },
];

const NAV_ITEMS_TUTOR = [
    
]

const NAV_ITEMS_HIRER = [

]


function GuestTopActions(){
    return (
        <>
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
        </>
    )
};

function UserTopActions(){
    const user = useAppSelector((state) => state.auth.user);

    return (
        <>
            <Link to={"/notification"} aria-label="Thông báo">
                <button type="button" className="notification">
                    <span aria-hidden="true">🔔</span>
                </button>
            </Link>

            <Link to={"/profile"}>
                <button type="button" className="profile">
                    {user?.fullName ?? "Tài khoản"}
                </button>
            </Link>
        </>
    )
}

function Header() {
    const {status, user} = useAppSelector((state) => state.auth);
    return (
        <header className="site-header">
            <div className="topbar">
                <div className="container topbar-inner">
                    <div className="brand">
                        <img className="brand-logo" src={kittyLogo} alt="Logo" />
                        <span className="brand-name">Nhóm 5</span>
                    </div>
                    <div className="top-actions">
                        {status === "AUTHENTICATED" && user ? (
                            <UserTopActions/>
                        ) : (
                            <GuestTopActions/>
                        )}
                    </div>
                </div>
            </div>

            <div className="navbar">
                <div className="container navbar-inner">
                    <nav className="header-nav" aria-label="Điều hướng chính">
                        {NAV_ITEMS_GUEST.map((item) => (
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
