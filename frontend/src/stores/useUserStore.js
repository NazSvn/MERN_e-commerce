import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
  user: null,
  loding: false,
  checkAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      if (error.response) {
        console.error("Server error", error.message);
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        console.error("Network error", error.message);
        toast.error(error.request.message || "An error occurred");
      } else {
        console.error("Error", error.message);
        toast.error(error.message || "An error occurred");
      }
    }
  },
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      if (error.response) {
        console.error("Server error", error.message);
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        console.error("Network error", error.message);
        toast.error(error.request.message || "An error occurred");
      } else {
        console.error("Error", error.message);
        toast.error(error.message || "An error occurred");
      }
    }
  },
  checkAuthState: async () => {
    set({ checkAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ user: res.data, checkAuth: false });
    } catch (error) {
      set({ checkAuth: false, user: null });
      console.error(error.message);
    }
  },
  logout: async () => {
    try {
      set({ loading: true });
      await axiosInstance.post("/auth/logout");
      set({ user: null, loading: false });
    } catch (error) {
      set({ loading: false });
      if (error.response) {
        console.error("Server error", error.message);
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        console.error("Network error", error.message);
        toast.error(error.request.message || "An error occurred");
      } else {
        console.error("Error", error.message);
        toast.error(error.message || "An error occurred");
      }
    }
  },
}));
