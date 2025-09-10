import Navbar from "./components/navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUpPage";
import LogIn from "./pages/LogInPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { use, useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("Auth User in App.jsx:", authUser);
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ?<HomePage />: <Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser?<SignUp /> :<Naviagte to="/"/>} />
        <Route path="/login" element={!authUser?<LogIn />:<Naviagte to="/"/>} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to="/login"/> } />
      </Routes>
    </div>
  );
};

export default App;

