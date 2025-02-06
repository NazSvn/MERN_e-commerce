import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload } from "lucide-react";
import { useState } from "react";
import FormInput from "./FormInput";
import { useProductStore } from "../stores/useProductStore";

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
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });

  const { createProduct, loading } = useProductStore();

  // move to utils later
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
    };

    if (!newProduct.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!newProduct.description.trim()) {
      newErrors.description = "Product description is required";
    }
    if (!newProduct.price.trim()) {
      newErrors.price = "Product price is required";
    }
    if (!newProduct.image) {
      newErrors.image = "Product image is required";
    }
    if (!newProduct.category.trim()) {
      newErrors.category = "Please select a category";
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (errors.image) setErrors({ ...errors, image: "" });
      const reader = new FileReader();
      reader.onload = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file); // convert to base64
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await createProduct(newProduct);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          image: "",
          category: "",
        });
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
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
        <FormInput
          label={"Product Name"}
          name={"name"}
          value={newProduct.name}
          onChange={handleInputChange}
          error={errors.name}
          required
        />
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
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 pl-3 text-white placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-sm"
            required
          />
        </div>

        <FormInput
          label={"Price"}
          name={"price"}
          value={newProduct.price}
          onChange={handleInputChange}
          error={errors.price}
          required
          type={"number"}
          step="0.01"
          min={"0"}
        />

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
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 pl-3 text-white placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-sm"
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
          {errors.image && (
            <span className="ml-3 text-sm text-gray-400">{errors.image}</span>
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
