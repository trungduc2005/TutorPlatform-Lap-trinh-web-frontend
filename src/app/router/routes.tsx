import MainLayout from "../layouts/MainLayout";
import Error404 from "../../pages/ErrorPages/Error404"
import Home from "../../pages/Home/Home"
import About from "../../pages/About/About";
import ClassListing from "../../pages/ClassListing/ClassListing";
import RequireGuest from "./guards/RequireGuest";
import RequireAuth from "./guards/RequireAuth";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import RequireRole from "./guards/RequireRole";
import ParentDashboard from "../../pages/ParentDashboard/ParentDashboard";
import TutorDashboard from "../../pages/TutorDashboard/TutorDashboard";
import Profile from "../../pages/profile/Profile";
import ProfileInfo from "../../pages/profile/profileInfo/ProfileInfo";
import TutorInfo from "../../pages/profile/TutorInfo/TutorInfo";


const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "about", element: <About /> },
            { path: "classes", element: <ClassListing /> },
            {
                element: <RequireGuest />,
                children: [
                    { path: "login", element: <Login /> },
                    { path: "register", element: <Register /> },
                ],
            },
            {
                element: <RequireAuth />,
                children: [
                    {
                        element: <RequireRole allow={["TUTOR"]} />,
                        children: [{ path: "tutor/dashboard", element: <TutorDashboard /> }],
                    },
                    {
                        element: <RequireRole allow={["HIRER"]} />,
                        children: [{ path: "parent/dashboard", element: <ParentDashboard /> }],
                    },
                    {
                        path: "/profile", element: <Profile />,
                        children: [
                            { index: true, element: <ProfileInfo /> },
                            { path: "tutor", element: <TutorInfo /> },
                        ]
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <Error404 />,
    },
];

export default routes;
