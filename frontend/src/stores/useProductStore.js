import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useProductStore = create((set, get) => ({
  products: [],
  recommendations: [],
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
      await get().getAllProducts();
    } catch (error) {
      set({ loading: false });
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        toast.error(error.request.message || "An error occurred");
      } else {
        toast.error(error.message || "An error occurred");
      }
    }
  },
  getProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/products/category/${category}`);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        toast.error(error.request.message || "An error occurred");
      } else {
        toast.error(error.message || "An error occurred");
      }
    }
  },
  getRecommendedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products/recommended");
      set({ recommendations: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        toast.error(error.request.message || "An error occurred");
      } else {
        toast.error(error.message || "An error occurred");
      }
    }
  },
  getFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products/featured");
      set({ products: res.data, loading: false });
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
