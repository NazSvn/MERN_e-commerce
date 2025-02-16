import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import CouponCard from "../components/CouponCard";
import EmptyCartUI from "./EmptyCartUI";
import PeopleAlsoBought from "../components/PeopleAlsoBought";

const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <div className="py-10">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <motion.div
            className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}
            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>

          {cart.length > 0 && (
            <motion.div
              className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <OrderSummary />
              <CouponCard />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CartPage;
