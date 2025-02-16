import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const CouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const {
    availableCoupon,
    appliedCoupon,
    applyCoupon,
    getCoupon,
    removeCoupon,
    loading,
  } = useCartStore();

  useEffect(() => {
    getCoupon();
  }, [getCoupon]);

  const handleUseCoupon = useCallback(() => {
    if (availableCoupon && userInputCode === "") {
      setUserInputCode(availableCoupon.code);
    } else if (availableCoupon && userInputCode) {
      setUserInputCode("");
    }
  }, [availableCoupon, userInputCode]);

  const handleApplyCoupon = useCallback(async () => {
    if (!userInputCode) {
      toast.error("Please insert a valid code");
      return;
    }
    if (appliedCoupon) {
      toast.error("Coupon already applied");
      return;
    }

    await applyCoupon(userInputCode);
  }, [appliedCoupon, applyCoupon, userInputCode]);

  const handleRemoveCoupon = useCallback(async () => {
    await removeCoupon();
    setUserInputCode("");
    await getCoupon();
  }, [removeCoupon, getCoupon]);

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="voucher"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Do you have a voucher or gift card?
          </label>
          <input
            type="text"
            id="voucher"
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Enter code here"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            required
          />
        </div>

        <button
          type="button"
          className={`flex w-full cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none`}
          onClick={handleApplyCoupon}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            "Apply Coupon"
          )}
        </button>
      </div>

      {appliedCoupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Applied Coupon</h3>

          <p className="mt-2 text-sm text-gray-400">
            {appliedCoupon.code} - {appliedCoupon.discountPercentage}% off
          </p>

          <button
            type="button"
            className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none"
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </button>
        </div>
      )}

      {availableCoupon && !appliedCoupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Your Available Coupon:
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {availableCoupon.code} - {availableCoupon.discountPercentage}% off
            </p>
            <button
              className={`flex w-28 cursor-pointer items-center justify-center rounded-lg ${userInputCode ? "bg-red-400 hover:bg-red-500/90 focus:ring-2 focus:ring-red-300" : "bg-emerald-600 hover:bg-emerald-700"} px-2.5 py-1.5 text-sm font-medium text-white focus:ring-2 focus:ring-emerald-300 focus:outline-none`}
              onClick={handleUseCoupon}
            >
              {userInputCode ? "Remove code" : "Use Coupon"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default CouponCard;
