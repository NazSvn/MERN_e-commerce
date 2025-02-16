import { useProductStore } from "../stores/useProductStore";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import DeleteWarning from "./DeleteWarning";
import ProductsListCard from "./ProductListCard";

const ProductsList = () => {
  const { products, toggleFeaturedProduct, deleteProduct } = useProductStore();

  const [showModal, setShowModal] = useState({
    isShowing: false,
    product: null,
  });

  const handleDelete = useCallback(
    async (product) => {
      setShowModal({ isShowing: false, product: null });
      await deleteProduct(product);
    },
    [deleteProduct],
  );

  const handleToggleFeatured = useCallback(
    (productId) => {
      toggleFeaturedProduct(productId);
    },
    [toggleFeaturedProduct],
  );

  const handleOpenModal = useCallback((product) => {
    setShowModal({
      isShowing: true,
      product: product,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal({
      isShowing: false,
      product: null,
    });
  }, []);

  const tableHeaders = useMemo(
    () => ["Product", "Price", "Category", "Featured", "Actions"],
    [],
  );

  return (
    <motion.div
      className="overflow-hidden rounded-lg bg-gray-800 shadow-lg sm:mx-auto sm:max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="grid grid-cols-6 items-center gap-1 bg-gray-700 px-2 py-3">
        {tableHeaders.map((header, i) => (
          <div
            key={header}
            className={`${i === 0 && "col-span-2 px-0"} py-3.5 text-[0.550rem] font-medium tracking-wider text-white uppercase sm:text-xs`}
          >
            {header}
          </div>
        ))}
      </div>
      <div className="">
        {products.map((product) => (
          <ProductsListCard
            key={product._id}
            product={product}
            onToggleFeatured={handleToggleFeatured}
            ondelete={handleOpenModal}
          />
        ))}
      </div>
      <DeleteWarning
        isOpen={showModal.isShowing}
        onClose={handleCloseModal}
        title="Delete Product"
        description={`Are you sure you want to delete ${showModal?.product?.name} product? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonClass="bg-red-500 hover:bg-red-600 focus:ring-red-500"
        onConfirm={() => handleDelete(showModal?.product?._id)}
      />
    </motion.div>
  );
};

export default ProductsList;
