import CategoryItem from "../components/CategoryItem";

const categories = [
  {
    href: "/jeans",
    name: "Jeans",
    imageUrl: "/products/men-chino-pants-beige.jpg",
  },
  {
    href: "/tshirts",
    name: "T-Shirts",
    imageUrl: "/products/men-golf-polo-t-shirt-blue.jpg",
  },
  {
    href: "/women",
    name: "hoodie",
    imageUrl: "/products/women-stretch-popover-hoodie-black.jpg",
  },
  {
    href: "/shoes",
    name: "shoes",
    imageUrl: "/products/knit-athletic-sneakers-gray.jpg",
  },
  {
    href: "/bags",
    name: "dakine",
    imageUrl: "/products/backpack.jpg",
  },
  {
    href: "/misc",
    name: "plates",
    imageUrl: "/products/6-piece-white-dinner-plate-set.jpg",
  },
  {
    href: "/jewelry",
    name: "jewelry",
    imageUrl: "/products/double-elongated-twist-french-wire-earrings.webp",
  },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
    </div>
  );
};

export default HomePage;
