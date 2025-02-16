import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import { useCategoryStore } from "../stores/useCategoryStore";

const HomePage = () => {
  const { getFeaturedProducts, products, loading } = useProductStore();
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    getFeaturedProducts();
    getCategories();
  }, [getFeaturedProducts, getCategories]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-center text-5xl font-bold text-emerald-400 sm:text-6xl">
          Categories
        </h1>
        <p className="mb-12 text-center text-xl text-gray-300">
          Discover the latest trends
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
      {!loading && products.length > 0 && (
        <FeaturedProducts featuredProducts={products} />
      )}
    </div>
  );
};

export default HomePage;
