import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import FormInput from "./FormInput";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import toast from "react-hot-toast";

const CreateProductForm = () => {
  const { categories } = useCategoryStore();

  const { createProduct, loading } = useProductStore();

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categorySlug: "",
    subcategorySlug: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categorySlug: "",
    subcategorySlug: "",
  });

  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.slug === newProduct.categorySlug),
    [categories, newProduct.categorySlug],
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categorySlug" ? { subcategorySlug: "" } : {}),
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      price: "",
      image: "",
      categorySlug: "",
      subcategorySlug: "",
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
    if (!newProduct.categorySlug.trim()) {
      newErrors.categorySlug = "Please select a category";
    }

    const selectedCategory = categories.find(
      (cat) => cat.slug === newProduct.categorySlug,
    );
    if (
      selectedCategory?.subcategories?.length > 0 &&
      !newProduct.subcategorySlug.trim()
    ) {
      newErrors.subcategorySlug = "Please select a subcategory";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        if (errors.image) setErrors({ ...errors, image: "" });
        const reader = new FileReader();
        reader.onload = () => {
          setNewProduct({ ...newProduct, image: reader.result });
        };
        reader.readAsDataURL(file); // convert to base64
      }
    },
    [errors, newProduct],
  );

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
          categorySlug: "",
          subcategorySlug: "",
        });
      } catch (error) {
        toast.error("Error creating product:", error.message);
      }
    }
  };

  const hasSubcategories = useMemo(
    () => selectedCategory?.subcategories?.length > 0,
    [selectedCategory],
  );

  return (
    <motion.div
      className="mx-auto mb-8 max-w-xl rounded-lg bg-gray-800 p-4 shadow-lg sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-6 text-2xl font-medium text-emerald-300">
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
            htmlFor="categorySlug"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="categorySlug"
            name="categorySlug"
            value={newProduct.categorySlug}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 pl-3 text-white placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-sm"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {hasSubcategories && (
          <div>
            <label
              htmlFor="subcategorySlug"
              className="block text-sm font-medium text-gray-300"
            >
              Subcategory
            </label>
            <select
              name="subcategorySlug"
              id="subcategorySlug"
              value={newProduct.subcategorySlug}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 pl-3 text-white placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-sm"
              required
            >
              <option value="">Select a subcategory</option>
              {selectedCategory.subcategories.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subcategorySlug && (
              <p className="mt-1 text-sm text-red-500">
                {errors.subcategorySlug}
              </p>
            )}
          </div>
        )}

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
          className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
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
