import { useCallback, useEffect } from "react";
import Loading from "./Loading";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "./ProductCard";
import { useCartStore } from "../stores/useCartStore";

const PeopleAlsoBought = () => {
  const { loading, getRecommendedProducts, recommendations } =
    useProductStore();

  const { addToCart } = useCartStore();

  useEffect(() => {
    getRecommendedProducts();
  }, [getRecommendedProducts]);

  const handleAddToCart = useCallback(
    async (product) => {
      await addToCart(product);
    },
    [addToCart],
  );

  if (loading) return <Loading />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-medium text-emerald-400">
        People also bought
      </h3>
      <div className="lg: grid-col-3 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recommendations.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};
export default PeopleAlsoBought;
