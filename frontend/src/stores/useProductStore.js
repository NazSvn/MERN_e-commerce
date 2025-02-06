import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/products", productData);
      set((prev) => ({
        products: [...prev.products, res.data],
        loading: false,
      }));
      set({ loading: false });
      toast.success("Product created successfully");
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
  getAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products");
      set({ products: res.data.products, loading: false });
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
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product._id !== id),
        loading: false,
      }));
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
  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.patch(`/products/${id}`);
      set((prev) => ({
        products: prev.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: response.data.isFeatured }
            : product,
        ),
        loading: false,
      }));
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
