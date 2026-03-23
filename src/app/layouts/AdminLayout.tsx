import { Outlet } from "react-router-dom";
import Footer from "../../shared/ui/AppFooter/Footer";
import AdminHeader from "../../shared/ui/AppHeader/AdminHeader";

function AdminLayout() {
    return (
        <>
            <AdminHeader/>
                <div className="admin-layout__content">
                    <Outlet/>
                </div>
            <Footer/>
        </>
    )
}

export default AdminLayout;