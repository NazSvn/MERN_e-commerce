import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { motion } from "framer-motion";
import { Star, Trash } from "lucide-react";

const ProductsList = () => {
  const { products, getAllProducts, toggleFeaturedProduct, deleteProduct } =
    useProductStore();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  return (
    <motion.div
      className="mx-2 overflow-hidden rounded-lg bg-gray-800 shadow-lg sm:mx-auto sm:max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="grid grid-cols-6 items-center gap-1 bg-gray-700 px-2 py-3">
        {["Product", "Price", "Category", "Featured", "Actions"].map(
          (header, i) => (
            <div
              key={header}
              className={`${i === 0 && "col-span-2 px-0"} py-3.5 text-[0.550rem] font-medium tracking-wider text-gray-400 uppercase sm:text-xs`}
            >
              {header}
            </div>
          ),
        )}
      </div>
      <div className="">
        {products.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-6 items-center gap-1 px-2 py-4 hover:bg-gray-700"
          >
            <div className="col-span-2 flex items-center min-[500px]:flex-row pr-1">
              <img
                className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                src={product.image}
                alt={product.name}
              />
              <div className="ml-2 max-w-[120px] truncate text-sm font-medium text-white sm:ml-4 sm:max-w-[200px]">
                {product.name}
              </div>
            </div>
            <div className="truncate text-sm text-gray-300 ">
              ${product.price.toFixed(2)}
            </div>
            <div className="text-sm text-gray-300">{product.category}</div>
            <div className="flex pl-2">
              <button
                onClick={() => toggleFeaturedProduct(product._id)}
                className={`w-fit rounded-full p-1 ${
                  product.isFeatured
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-600 text-gray-300"
                } transition-colors duration-200 hover:bg-yellow-500`}
              >
                <Star className="h-5 w-5" />
              </button>
            </div>
            <div className="flex pl-2">
              <button
                onClick={() => deleteProduct(product._id)}
                className="w-fit text-red-400 hover:text-red-300"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductsList;
