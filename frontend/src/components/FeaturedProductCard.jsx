import { ShoppingCart } from "lucide-react";
import PropTypes from "prop-types";

const FeaturedProductCard = ({ product, onClick }) => {
  return (
    <div
      key={product._id}
      className="w-full flex-shrink-0 px-2 sm:w-1/2 lg:w-1/3 xl:w-1/4"
    >
      <div className="h-full overflow-hidden rounded-lg border border-emerald-500/30 bg-white/10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-medium text-white">
            {product.name}
          </h3>
          <p className="mb-4 font-medium text-emerald-300">
            ${product.price.toFixed(2)}
          </p>
          <button
            onClick={onClick}
            className="flex w-full cursor-pointer items-center justify-center rounded bg-emerald-600 px-4 py-2 font-medium text-white transition-colors duration-300 hover:bg-emerald-500"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductCard;

FeaturedProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
