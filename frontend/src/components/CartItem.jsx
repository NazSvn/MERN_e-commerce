import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import PropTypes from "prop-types";
import { memo, useCallback } from "react";

const CartItem = memo(({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  const handleDecreaseQuantity = useCallback(async () => {
    await updateQuantity(item._id, item.quantity - 1);
  }, [item._id, item.quantity, updateQuantity]);

  const handleIncreaseQuantity = useCallback(async () => {
    await updateQuantity(item._id, item.quantity + 1);
  }, [item._id, item.quantity, updateQuantity]);

  const handleRemoveItem = useCallback(async () => {
    await removeFromCart(item._id);
  }, [item._id, removeFromCart]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <img
            className="h-20 rounded object-cover md:h-32"
            src={item.image}
            alt={item.name}
            loading="lazy"
          />
        </div>
        <label className="sr-only">Choose quantity:</label>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              onClick={handleDecreaseQuantity}
              aria-label="Decrease quantity"
            >
              <Minus className="text-gray-300" />
            </button>
            <p>{item.quantity}</p>
            <button
              className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              onClick={handleIncreaseQuantity}
              aria-label="Increase quantity"
            >
              <Plus className="text-gray-300" />
            </button>
          </div>

          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-emerald-400">
              ${item.price}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
            {item.name}
          </p>
          <p className="text-sm text-gray-400">{item.description}</p>

          <div className="flex items-center gap-4">
            <button
              className="inline-flex cursor-pointer items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline"
              onClick={handleRemoveItem}
              aria-label="Remove item"
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = "CartItem";

export default CartItem;

CartItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
  }),
};
