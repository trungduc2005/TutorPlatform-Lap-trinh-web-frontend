import MainLayout from "../layouts/MainLayout";
import Error404 from "../../pages/ErrorPages/Error404"
import Home from "../../pages/Home/Home"
import ClassListing from "../../pages/ClassListing/ClassListing";
import ClassDetail from "../../pages/ClassDetail/ClassDetail";
import RequireGuest from "./guards/RequireGuest";
import RequireAuth from "./guards/RequireAuth";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import RequireRole from "./guards/RequireRole";
import Profile from "../../pages/ProfilePage/Profile";
import ProfileInfo from "../../pages/ProfilePage/ProfileInfoPage/ProfileInfo";
import TutorInfo from "../../pages/ProfilePage/TutorInfo/TutorInfo";
import Chat from "../../pages/Chat/Chat";
import ClassroomCallingPage from "../../pages/ClassroomCalling/ClassroomCallingPage";
import AdminLayout from "../layouts/AdminLayout";
import NotificationMana from "../../pages/AdminPages/NotificationMana/NotitficationMana";
import UnregisterClassMana from "../../pages/AdminPages/UnregisteredClassMana/UnregisteredClassMana";
import PaymentMana from "../../pages/AdminPages/PaymentMana/PaymentMana";
import AdminDashboard from "../../pages/AdminPages/AdminDashboard/AdminDashboard";
import TutorsList from "../../pages/TutorsList/TutorsList";
import Contract from "../../pages/Contract/Contract";
import ClassApplications from "../../pages/ClassApplications/ClassApplications";
import TutorDetail from "../../pages/TutorDetail/TutorDetail";
import HireTutor from "../../pages/HireTutor/HireTutor";
import HirerClassManagement from "../../pages/HirerClassManagement/HirerClassManagement";
import HirerApplicationManagement from "../../pages/HirerApplicationManagement/HirerApplicationManagement";
import FeaturedTutorMana from "../../pages/AdminPages/FeaturedTutorMana/FeaturedTutorMana";
import ContractMana from "../../pages/AdminPages/ContractMana/ContractMana";
import AccountMana from "../../pages/AdminPages/AccountMana/AccountMana";
import FilterOptionMana from "../../pages/AdminPages/FilterOptionMana/FilterOptionMana";

const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "classes", element: <ClassListing /> },
            { path: "featured-tutors", element: <TutorsList /> },
            { path: "contract", element: <Contract /> },
            { path: "tutors/:id", element: <TutorDetail /> },
            { path: "class/:id", element: <ClassDetail /> },
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
                        children: [
                            { path: "tutor/class-applications", element: <ClassApplications /> }
                        ],
                    },
                    {
                        element: <RequireRole allow={["HIRER"]} />,
                        children: [
                            { path: "hire-tutor", element: <HireTutor /> },
                            { path: "hirer/class-management", element: <HirerClassManagement /> },
                            { path: "hirer/application-management", element: <HirerApplicationManagement /> },
                        ],
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
                            { path: "unregister-class-management", element: <UnregisterClassMana /> },
                            { path: "payment-management", element: <PaymentMana /> },
                            { path: "notification-management", element: <NotificationMana /> },
                            { path: "featured-tutor-management", element: <FeaturedTutorMana /> },
                            { path: "contract-management", element: <ContractMana /> },
                            { path: "account-management", element: <AccountMana /> },
                            { path: "filteroption-class-management", element: <FilterOptionMana /> },
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
