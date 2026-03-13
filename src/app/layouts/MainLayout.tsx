import { Outlet } from "react-router-dom";
import Header from "../../shared/ui/AppHeader/Header";
import Footer from "../../shared/ui/AppFooter/Footer";
import "./MainLayout.css"

function MainLayout() {
    return (
        <>
            <div className="main-layout">
                <Header />
                <div>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    );
}

export default MainLayout;
