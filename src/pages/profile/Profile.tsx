import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/store/hooks";
import { useLogin } from "../../features/auth/hooks/useLogin";
import "./Profile.css";

const MENU_ITEMS_TUTOR = [
    { to: "", label: "Thông tin cá nhân" },
    { to: "tutor", label: "Hồ sơ gia sư" },
];

const MENU_ITEMS_GUEST = [
    { to: "", label: "Thông tin cá nhân" },
    { to: "tutor", label: "Lịch sử" },
];

function Profile() {
    const user = useAppSelector((state) => state.auth.user);
    const location = useLocation();
    const MENU_ITEMS = (user?.role === "TUTOR" ? MENU_ITEMS_TUTOR : MENU_ITEMS_GUEST);

    const {
        handleLogout
    } = useLogin();

    if (!user) {
        return <div className="profile-empty">Không có thông tin người dùng</div>;
    }

    const currentItem =
        MENU_ITEMS.find((item) => location.pathname.endsWith(`/profile/${item.to}`)) ??
        MENU_ITEMS[0];

    return (
        <section className="profile-page">
            <div className="profile-layout">
                <aside className="profile-sidebar">
                    <div className="profile-sidebar__header">
                        <h2>{currentItem.label}</h2>
                    </div>

                    <div className="profile-menu">
                        {MENU_ITEMS.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to === "" ? "/profile" : item.to}
                                end={item.to === ""}
                                className={({ isActive }) =>
                                    `profile-menu__item${isActive ? " profile-menu__item--active" : ""}`
                                }
                            >
                                {item.label}
                            </NavLink>

                        ))}
                    </div>

                    <div className="profile-logout">
                        <button type="button" className="profile-logout__button" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </div>
                </aside>

                <main className="profile-content">
                    <Outlet />
                </main>
            </div>
        </section>
    );
}

export default Profile;
