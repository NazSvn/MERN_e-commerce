import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useProductStore } from "../stores/useProductStore";
import { memo, useEffect, useMemo, useState } from "react";

const CategoryItem = memo(({ category }) => {
  const { products } = useProductStore();
  const [categoryImage, setCategoryImage] = useState("");

  const categoryProducts = useMemo(() => {
    if (!products.length || !category?.slug) return [];
    return products.filter(
      (product) => product.category?.slug === category.slug,
    );
  }, [products, category?.slug]);

  useEffect(() => {
    if (categoryProducts.length > 0) {
      setCategoryImage(categoryProducts[0].image);
    }
  }, [categoryProducts]);

  return (
    <div className="group relative h-96 w-full overflow-hidden rounded-lg">
      <Link to={"/category/" + category?.slug}>
        <div className="h-full w-full cursor-pointer">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-gray-900 opacity-50" />
          <img
            src={categoryImage}
            alt={category?.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute right-0 bottom-0 left-0 z-20 p-4">
            <h3 className="mb-2 text-2xl font-bold text-white">
              {category?.name}
            </h3>
            <p className="text-sm text-gray-200">Explore {category?.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
});

CategoryItem.displayName = "CategoryItem";
export default CategoryItem;

CategoryItem.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
};
