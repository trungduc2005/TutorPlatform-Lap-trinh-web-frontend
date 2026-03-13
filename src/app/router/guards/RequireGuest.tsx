import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

function RequireGuest() {
    const { status, user } = useAppSelector((state) => state.auth);

    if (status === "CHECKING") {
        return <div>Loading...</div>;
    }

    if (status === "AUTHENTICATED") {
        return (
            <Navigate
                to={user?.role === "TUTOR" ? "/tutor/dashboard" : "/parent/dashboard"}
                replace
            />
        );
    }

    return <Outlet />;
}

export default RequireGuest;
