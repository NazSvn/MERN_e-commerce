import { Lock, LogOut, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";
  return (
    <header className="fixed top-0 left-0 z-40 w-full border-b border-emerald-800 bg-gray-900/90 shadow-lg backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <Link
            to={"/"}
            className="flex items-center space-x-2 text-2xl font-bold text-emerald-400"
          >
            Home
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 transition duration-300 ease-in-out hover:text-emerald-400"
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="group relative text-gray-300 transition duration-300 ease-in-out hover:text-emerald-400"
              >
                <ShoppingCart
                  className="mr-1 inline-block group-hover:text-emerald-400"
                  size={22}
                />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 block h-5 w-5 content-center rounded-full bg-emerald-500 text-center text-xs text-white transition duration-300 ease-in-out group-hover:bg-emerald-400">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                to={"/admin-dashboard"}
                className="flex items-center rounded-md bg-emerald-700 px-3 py-1 font-medium text-white transition duration-300 ease-in-out hover:bg-emerald-600"
              >
                <Lock className="mr-1 inline-block" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="flex cursor-pointer items-center rounded-md bg-gray-700 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-gray-600"
              >
                <LogOut size={18} />
                <span className="ml-2 hidden sm:inline">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-emerald-700"
                >
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="flex items-center rounded-md bg-gray-700 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-gray-600"
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
