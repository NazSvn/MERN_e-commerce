import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useState } from "react";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });

  const { loading } = useUserStore();

  const handleImageChange = (e) => {
    console.log("image here", e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newProduct);
  };

  return (
    <motion.div
      className="mx-auto mb-8 max-w-xl rounded-lg bg-gray-800 p-8 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="mb-6 text-2xl font-semibold text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            step="0.01"
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm leading-4 font-medium text-gray-300 shadow-sm hover:bg-gray-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
          >
            <Upload className="mr-2 inline-block h-5 w-5" />
            Upload Image
          </label>
          {newProduct.image && (
            <span className="ml-3 text-sm text-gray-400">Image uploaded </span>
          )}
        </div>

        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
