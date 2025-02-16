import { Star, Trash } from "lucide-react";
import PropTypes from "prop-types";
import { memo } from "react";

const ProductsListCard = memo(({ product, ondelete, onToggleFeatured }) => {
  return (
    <div
      key={product._id}
      className="grid grid-cols-6 items-center gap-1 px-2 py-4 hover:bg-gray-700"
    >
      <div className="col-span-2 flex flex-col pr-1 min-[500px]:flex-row min-[500px]:items-center">
        <img
          className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
          src={product.image}
          alt={product.name}
        />
        <div className="ml-2 max-w-[120px] truncate text-sm font-medium text-white sm:ml-4 sm:max-w-[200px]">
          {product.name}
        </div>
      </div>
      <div className="truncate text-sm text-gray-300">
        ${product.price.toFixed(2)}
      </div>
      <div className="truncate text-sm text-gray-300">
        {product.category.name}
      </div>
      <div className="flex pl-2">
        <button
          onClick={() => onToggleFeatured(product._id)}
          className={`w-fit cursor-pointer rounded-full border p-1 ${
            product.isFeatured ? "text-yellow-400" : "text-gray-600"
          } transition-colors duration-200 hover:bg-yellow-500`}
        >
          <Star className="h-3.5 w-3.5 min-[500px]:h-5 min-[500px]:w-5" />
        </button>
      </div>
      <div className="flex pl-2">
        <button
          onClick={() => ondelete(product)}
          className="w-fit cursor-pointer text-red-400 hover:text-red-300"
        >
          <Trash className="h-3.5 w-3.5 min-[500px]:h-5 min-[500px]:w-5" />
        </button>
      </div>
    </div>
  );
});

ProductsListCard.displayName = "ProductsListCard";

export default ProductsListCard;

ProductsListCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.object,
    isFeatured: PropTypes.bool.isRequired,
  }).isRequired,
  ondelete: PropTypes.func.isRequired,
  onToggleFeatured: PropTypes.func.isRequired,
};
