import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

function RequireAuth() {
    const { status } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (status === "CHECKING") {
        return <div>Loading...</div>;
    }

    return status === "AUTHENTICATED" ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
}

export default RequireAuth;
