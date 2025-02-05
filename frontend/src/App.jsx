import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import Loading from "./components/Loading";
import AdminPage from "./pages/AdminPage";

function App() {
  const { user, checkAuthState, checkAuth } = useUserStore();

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  if (checkAuth) return <Loading />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white">
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <HomePage />}
          ></Route>
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <HomePage />}
          ></Route>
          <Route
            path="/admin-dashboard"
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to={"/"} />
            }
          ></Route>
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
