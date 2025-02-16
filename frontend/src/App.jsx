import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import toast, { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import Loading from "./components/Loading";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelledPage from "./pages/PurchaseCancelledPage";

function App() {
  const { user, checkAuthState, checkAuth } = useUserStore();
  const { getCart } = useCartStore();

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  useEffect(() => {
    const initializeCart = async () => {
      if (user) {
        try {
          await getCart();
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    initializeCart();
  }, [getCart, user]);

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
          <Route path="/category/:category" element={<CategoryPage />}></Route>
          <Route
            path="/cart"
            element={!user ? <Navigate to={"/login"} /> : <CartPage />}
          ></Route>
          <Route
            path="/purchase-success"
            element={
              !user ? <Navigate to={"/login"} /> : <PurchaseSuccessPage />
            }
          ></Route>
          <Route
            path="/purchase-cancelled"
            element={
              !user ? <Navigate to={"/login"} /> : <PurchaseCancelledPage />
            }
          ></Route>
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
