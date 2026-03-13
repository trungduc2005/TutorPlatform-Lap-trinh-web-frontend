import { useRoutes } from "react-router-dom";
import routes from "./routes";

function AppRouter() {
    const elements = useRoutes(routes);

    return <>{elements}</>;
}

export default AppRouter;
