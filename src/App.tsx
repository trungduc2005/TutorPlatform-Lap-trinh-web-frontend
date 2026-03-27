import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ParentDashboard from "./pages/ParentDashboard/ParentDashboard";
import TutorDashboard from "./pages/TutorDashboard/TutorDashboard";
import Profile from "./pages/profile/Profile";
import Contract from "./pages/Contract/Contract"
import Header from "./shared/ui/AppHeader/Header";
import Footer from "./shared/ui/AppFooter/Footer";
import TutorsList from "./pages/TutorsList/TutorsList";
import TutorDetail from "./pages/TutorDetail/TutorDetail";
import ClassApplications from "./pages/ClassApplications/ClassApplications";


function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contract" element={<Contract />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/tutor" element={<TutorDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<TutorsList />} />
        <Route path="/tutors/:id" element={<TutorDetail />} />
        <Route path="/tutors" element={<TutorsList />} />
        <Route path="/tutor/class-applications" element={<ClassApplications />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;