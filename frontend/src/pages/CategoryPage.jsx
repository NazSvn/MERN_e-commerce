import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCallback, useEffect } from "react";
import Loading from "../components/Loading";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";

const CategoryPage = () => {
  const { getProductsByCategory, products, loading } = useProductStore();
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const { category } = useParams();

  useEffect(() => {
    getProductsByCategory(category);
  }, [getProductsByCategory, category]);

  const handleAddToCart = useCallback(
    async (product) => {
      if (!user) {
        toast.error("Please login to add products to cart", { id: "login" });
        return;
      } else {
        await addToCart(product);
      }
    },
    [user, addToCart],
  );

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.h1
          className="mb-8 text-center text-4xl font-bold text-emerald-400 sm:text-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {products[0]?.category.name}
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {products?.length === 0 && (
            <h2 className="col-span-full text-center text-3xl font-medium text-gray-300">
              No products found
            </h2>
          )}

          {products?.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={() => handleAddToCart(product)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
