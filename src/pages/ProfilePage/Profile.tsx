import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/store/hooks";
import "./Profile.css";

const MENU_ITEMS_TUTOR = [
  { to: "", label: "Thông tin cá nhân" },
  { to: "tutor", label: "Hồ sơ gia sư" },
];

const MENU_ITEMS_DEFAULT = [{ to: "", label: "Thông tin cá nhân" }];

function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <div className="profile-empty">Không có thông tin người dùng</div>;
  }

  const isAdmin = user.role === "ADMIN";
  const basePath = isAdmin ? "/admin/profile" : "/profile";
  const menuItems = user.role === "TUTOR" ? MENU_ITEMS_TUTOR : MENU_ITEMS_DEFAULT;
  const currentItem =
    menuItems.find((item) =>
      item.to === ""
        ? location.pathname === basePath
        : location.pathname.endsWith(`${basePath}/${item.to}`)
    ) ?? menuItems[0];

  const pageTitle = currentItem.label;
  const pageDescription =
    currentItem.to === "tutor"
      ? "Quản lý hồ sơ gia sư và cập nhật thông tin chuyên môn của bạn."
      : "Quản lý thông tin tài khoản và cập nhật hồ sơ của bạn.";

  const backHref = isAdmin ? "/admin/admin-dashboard" : "/";
  const backLabel = isAdmin ? "Quay lại trang quản trị" : "Quay lại Trang chủ";

  return (
    <section className="profile-page">
      <div className="profile-shell">
        <div className="profile-page__header">
          <div>
            <h1 className="profile-page__title">{pageTitle}</h1>
            <p className="profile-page__description">{pageDescription}</p>
          </div>

          <NavLink to={backHref} className="profile-page__backlink">
            {backLabel}
          </NavLink>
        </div>

        {menuItems.length > 1 ? (
          <nav className="profile-page__tabs" aria-label="Profile navigation">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to === "" ? basePath : `${basePath}/${item.to}`}
                end={item.to === ""}
                className={({ isActive }) =>
                  `profile-page__tab${isActive ? " profile-page__tab--active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}

        <main className="profile-content">
          <Outlet />
        </main>
      </div>
    </section>
  );
}

export default Profile;
