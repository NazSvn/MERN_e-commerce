import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import PropTypes from "prop-types";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";
import FeaturedProductCard from "./FeaturedProductCard";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartStore();
  const { user } = useUserStore();

  const handleAddToCart = useCallback(
    async (product) => {
      if (!user) {
        toast.error("Please login to add products to cart", { id: "login" });
        return;
      } else {
        await addToCart(product);
      }
    },
    [addToCart, user],
  );

  const handleResize = useCallback(() => {
    if (window.innerWidth < 640) setItemsPerPage(1);
    else if (window.innerWidth < 1024) setItemsPerPage(2);
    else if (window.innerWidth < 1280) setItemsPerPage(3);
    else setItemsPerPage(4);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  }, [itemsPerPage]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  }, [itemsPerPage]);

  const { isStartDisabled, isEndDisabled } = useMemo(
    () => ({
      isStartDisabled: currentIndex === 0,
      isEndDisabled: currentIndex >= featuredProducts.length - itemsPerPage,
    }),
    [currentIndex, featuredProducts.length, itemsPerPage],
  );

  const transformStyle = useMemo(
    () => ({
      transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
    }),
    [currentIndex, itemsPerPage],
  );

  const getPrevButtonClass = useMemo(
    () =>
      `absolute top-1/2 -left-2 -translate-y-1/2 transform cursor-pointer rounded-full p-1 transition-colors duration-300 sm:-left-4 sm:p-2 ${
        isStartDisabled
          ? "cursor-not-allowed bg-gray-400"
          : "bg-emerald-600 hover:bg-emerald-500"
      }`,
    [isStartDisabled],
  );

  const getNextButtonClass = useMemo(
    () =>
      `absolute top-1/2 -right-2 -translate-y-1/2 transform cursor-pointer rounded-full p-1 transition-colors duration-300 sm:-right-4 sm:p-2 ${
        isEndDisabled
          ? "cursor-not-allowed bg-gray-400"
          : "bg-emerald-600 hover:bg-emerald-500"
      }`,
    [isEndDisabled],
  );

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-5xl font-bold text-emerald-400 sm:text-6xl">
          Featured
        </h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={transformStyle}
            >
              {featuredProducts &&
                featuredProducts?.map((product) => (
                  <FeaturedProductCard
                    key={product._id}
                    product={product}
                    onClick={() => handleAddToCart(product)}
                  />
                ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={getPrevButtonClass}
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={getNextButtonClass}
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default FeaturedProducts;

FeaturedProducts.propTypes = {
  featuredProducts: PropTypes.array.isRequired,
};
