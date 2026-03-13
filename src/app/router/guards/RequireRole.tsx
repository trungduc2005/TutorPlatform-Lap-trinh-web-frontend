import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "../../../features/auth/model/authTypes";
import { useAppSelector } from "../../store/hooks";

function RequireRole({ allow }: { allow: UserRole[] }) {
    const { status, user } = useAppSelector((state) => state.auth);

    if (status === "CHECKING") {
        return <div>Loading...</div>;
    }

    if (status !== "AUTHENTICATED" || !user) {
        return <Navigate to="/login" replace />;
    }

    return allow.includes(user.role) ? <Outlet /> : <Navigate to="/403" replace />;
}

export default RequireRole;
