import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useCartStore = create((set, get) => ({
  cart: [],
  availableCoupon: null,
  appliedCoupon: null,
  total: 0,
  subtotal: 0,
  loading: false,

  getCoupon: async () => {
    try {
      const res = await axiosInstance.get("/coupons");
      set({ availableCoupon: res.data });
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
  applyCoupon: async (code) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/coupons/validate", { code });
      set({ appliedCoupon: res.data });
      get().calculateTotals();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        toast.error(error.request.message || "An error occurred");
      } else {
        toast.error(error.message || "An error occurred");
      }
    } finally {
      set({ loading: false });
    }
  },
  removeCoupon: async () => {
    set({ appliedCoupon: null });
    get().calculateTotals();
    toast.success("Coupon removed successfully");
  },
  getCart: async () => {
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        toast.error(error.request.message || "An error occurred");
      } else {
        toast.error(error.message || "An error occurred");
      }
    }
  },
  addToCart: async (product) => {
    try {
      await axiosInstance.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
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
  clearCart: async () => {
    try {
      await axiosInstance.delete("/cart");
      set({ cart: [], coupon: null, total: 0, subtotal: 0 });
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
  removeFromCart: async (productId) => {
    try {
      await axiosInstance.delete("/cart", { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
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
  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    try {
      await axiosInstance.put(`/cart/${productId}`, {
        id: productId,
        quantity,
      });

      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item,
        ),
      }));
      get().calculateTotals();
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
  calculateTotals: () => {
    const { cart, appliedCoupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let total = subtotal;

    if (appliedCoupon) {
      const discount = subtotal * (appliedCoupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
