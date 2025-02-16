import { ShoppingCart } from "lucide-react";
import PropTypes from "prop-types";

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={`${product.name} image`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="mt-4 px-5 pb-5 lg:h-20">
        <h5 className="text-xl font-medium tracking-tight text-white">
          {product.name}
        </h5>
      </div>
      <div className="mt-0.5 px-5 lg:h-20">
        <h5 className="text-sm tracking-tight text-white/60">
          {product.description}
        </h5>
      </div>
      <div className="mt-auto p-2">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <p>
              <span className="text-2xl font-medium text-emerald-400">
                ${product.price}
              </span>
            </p>
          </div>
        </div>

        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          onClick={onClick}
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};
export default ProductCard;

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
