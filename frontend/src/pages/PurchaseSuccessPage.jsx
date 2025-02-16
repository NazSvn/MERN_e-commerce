import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { usePurchaseStore } from "../stores/usePurchaseStore";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const PurchaseSuccessPage = () => {
  const { isProcessing, handleCheckoutSuccess } = usePurchaseStore();
  const { clearCart } = useCartStore();

  const sessionId = useMemo(
    () => new URLSearchParams(window.location.search).get("session_id"),
    [],
  );

  const processCheckout = useCallback(async () => {
    if (!sessionId) return;

    try {
      await handleCheckoutSuccess(sessionId);
      await clearCart();
    } catch (error) {
      toast.error(error.message);
    }
  }, [clearCart, handleCheckoutSuccess, sessionId]);

  useEffect(() => {
    processCheckout();
  }, [processCheckout]);

  const orderDetails = useMemo(
    () => ({
      orderNumber: "#12345",
      estimatedDelivery: "3-5 business days",
    }),
    [],
  );

  if (isProcessing) return <Loading />;

  return (
    <div className="flex h-screen items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-lg bg-gray-800 shadow-xl">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="mb-4 h-16 w-16 text-emerald-400" />
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-emerald-400 sm:text-3xl">
            Purchase Successful!
          </h1>

          <p className="mb-2 text-center text-gray-300">
            Thank you for your order. We&apos;re processing it now.
          </p>
          <p className="mb-6 text-center text-sm text-emerald-400">
            Check your email for order details and updates.
          </p>
          <div className="mb-6 rounded-lg bg-gray-700 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Order number</span>
              <span className="text-sm font-medium text-emerald-400">
                {orderDetails.orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Estimated delivery</span>
              <span className="text-sm font-medium text-emerald-400">
                {orderDetails.estimatedDelivery}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white transition duration-300 hover:bg-emerald-700">
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>
            <Link
              to={"/"}
              className="flex w-full items-center justify-center rounded-lg bg-gray-700 px-4 py-2 font-bold text-emerald-400 transition duration-300 hover:bg-gray-600"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PurchaseSuccessPage;
