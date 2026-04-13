import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

function RequireGuest() {
    const { status } = useAppSelector((state) => state.auth);

    if (status === "CHECKING") {
        return <div>Loading...</div>;
    }

    if (status === "AUTHENTICATED") {
        return (
            <Navigate
                to={"/"}
                replace
            />  
        );
    }

    return <Outlet />;
}

export default RequireGuest;
