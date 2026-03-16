import { Outlet, Link } from "react-router-dom";
import Header from "../../shared/ui/AppHeader/Header";
import Footer from "../../shared/ui/AppFooter/Footer";
import { useAppSelector } from "../store/hooks";
import "./MainLayout.css";

function MainLayout() {
    const { user, hasTutorProfile } = useAppSelector((state) => state.auth);

    return (
        <div className="main-layout">
            <Header />

            {user?.role === "TUTOR" && hasTutorProfile === false ? (
                <p className="main-layout__tutor-warning">
                    Bạn chưa có hồ sơ gia sư, vui lòng <Link to={"/profile/tutor"} className="main-layout__tutor-warning-link">cập nhật</Link> hồ sơ gia sư để nhận lớp.
                </p>
            ) : null}

            <div className="main-layout__content">
                <Outlet />
            </div>

            <Footer />
        </div>
    );
}

export default MainLayout;
