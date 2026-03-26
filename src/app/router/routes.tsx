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
import Profile from "../../pages/ProfilePage/Profile";
import ProfileInfo from "../../pages/ProfilePage/ProfileInfoPage/ProfileInfo";
import TutorInfo from "../../pages/ProfilePage/TutorInfo/TutorInfo";
import Chat from "../../pages/Chat/Chat";
import ClassroomCallingPage from "../../pages/ClassroomCalling/ClassroomCallingPage";
import { Children } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AdminHome from "../../pages/AdminPages/AdminDashboard/AdminDashboard";
import NotificationMana from "../../pages/AdminPages/NotitficationMana";
import RegisterClassMana from "../../pages/AdminPages/RegisteredClassMana";
import UnregisterClassMana from "../../pages/AdminPages/UnregisteredClassMana";
import PaymentMana from "../../pages/AdminPages/PaymentMana";
import AdminDashboard from "../../pages/AdminPages/AdminDashboard/AdminDashboard";
import FeaturedTutorMana from "../../pages/AdminPages/FeaturedTutorMana";
import ContractMana from "../../pages/AdminPages/ContractMana";


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
                    { path: "chat", element: <Chat /> },
                    { path: "classroom-calling", element: <ClassroomCallingPage />},
                ],
            },
        ],
    },
    {
        path: "/admin",
        element: <RequireAuth/>,
        children: [
            {
                element: <RequireRole allow={["ADMIN"]} />,
                children: [
                    {   
                        element: <AdminLayout/>,
                        children: [
                            { index: true, element: <AdminDashboard /> },
                            { path: "admin-dashboard", element: <AdminDashboard /> },
                            { path: "register-class-management", element: <RegisterClassMana /> },
                            { path: "unregister-class-management", element: <UnregisterClassMana /> },
                            { path: "payment-management", element: <PaymentMana /> },
                            { path: "notification-management", element: <NotificationMana /> },
                            { path: "featured-tutor-management", element: <FeaturedTutorMana /> },
                            { path: "contract-management", element: <ContractMana /> },
                            { 
                                path: "profile", element: <Profile />,
                                children: [
                                    {index: true, element: <ProfileInfo/>},
                                ]
                            },
                        ]
                    }
                ]
            },
        ]
    },
    {
        path: "*",
        element: <Error404 />,
    },
];

export default routes;
