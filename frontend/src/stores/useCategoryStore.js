import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  deleting: false,
  getCategories: async () => {
    try {
      const response = await axiosInstance.get("/category");
      set({ categories: response.data });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        toast.error(error.request.message || "An error occurred");
      } else {
        toast.error(error.message || "An error occurred");
      }
    }
  },
  createCategory: async (categoryData) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/category", categoryData);
      set({ loading: false });
      toast.success("Category created successfully");
      await get().getCategories();
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
  updateCategory: async (slug, categoryData) => {
    set({ loading: true });
    try {
      await axiosInstance.patch(`/category/${slug}`, categoryData);
      set({ loading: false });
      toast.success("Category updated successfully");
      await get().getCategories();
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
  deleteCategory: async (slug) => {
    set({ deleting: true });
    try {
      await axiosInstance.delete(`/category/${slug}`);
      set({ deleting: false });
      toast.success("Deleted successfully");
      await get().getCategories();
    } catch (error) {
      set({ deleting: false });
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        toast.error(error.request.message || "An error occurred");
      } else {
        toast.error(error.message || "An error occurred");
      }
    }
  },
}));
