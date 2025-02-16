import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const usePurchaseStore = create((set) => ({
  isProcessing: false,

  handleCheckoutSuccess: async (sessionId) => {
    set({ isProcessing: true });
    try {
      await axiosInstance.post("/payments/checkout-success", { sessionId });
      set({ isProcessing: false });
    } catch (error) {
      set({ isProcessing: false });
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
