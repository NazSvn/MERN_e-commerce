import { motion } from "framer-motion";
import { Loader, Pencil, Plus, Trash, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import FormInput from "./FormInput";

import { useCategoryStore } from "../stores/useCategoryStore";
import Tooltip from "./Tooltip";
import getSlug from "../utils/getSlug";
import DeleteWarning from "./DeleteWarning";
import toast from "react-hot-toast";

const EditCategory = () => {
  const { categories, updateCategory, loading, deleteCategory, deleting } =
    useCategoryStore();
  const categoryInputRef = useRef(null);
  const subcategoryRefs = useRef([]);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");

  const [categoryData, setCategoryData] = useState({
    name: "",
    slug: "",
    subcategories: [],
  });
  const [errors, setErrors] = useState({
    name: "",
    subcategories: [],
  });

  const [showModal, setShowModal] = useState(false);

  const handleSelectChange = useCallback(
    (e) => {
      const { value } = e.target;

      setSelectedCategorySlug(value);

      if (!value) {
        setCategoryData({
          name: "",
          slug: "",
          subcategories: [],
        });
        return;
      }

      const selectedCategory = categories.find((cat) => cat.slug === value);
      if (selectedCategory) {
        setCategoryData({
          name: selectedCategory.name,
          slug: selectedCategory.slug,
          subcategories: selectedCategory.subcategories.map((sub) => ({
            name: sub.name,
            slug: sub.slug,
          })),
        });
        setErrors({
          name: "",
          subcategories: new Array(selectedCategory.subcategories.length).fill(
            "",
          ),
        });
      }
    },
    [categories],
  );

  const handleKeyDown = useCallback(
    (e, type, index = null) => {
      if (e.key === "Escape") {
        if (type === "category") {
          // Reset to original category name
          const originalCategory = categories.find(
            (cat) => cat.slug === selectedCategorySlug,
          );
          if (originalCategory) {
            setCategoryData((prev) => ({
              ...prev,
              name: originalCategory.name,
            }));
          }

          categoryInputRef.current?.blur();
        } else if (type === "subcategory" && index !== null) {
          // reset to original subcategory name
          const originalCategory = categories.find(
            (cat) => cat.slug === selectedCategorySlug,
          );
          if (originalCategory && originalCategory.subcategories[index]) {
            const newSubcategories = [...categoryData.subcategories];
            newSubcategories[index] = {
              ...newSubcategories[index],
              name: originalCategory.subcategories[index].name,
            };
            setCategoryData((prev) => ({
              ...prev,
              subcategories: newSubcategories,
            }));
          }

          subcategoryRefs.current[index]?.blur();
        }
      }
    },
    [categories, selectedCategorySlug, categoryData.subcategories],
  );

  // move to utils later
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      name: value,
      slug: getSlug(value),
    }));

    setErrors((prev) => ({
      ...prev,
      name: "",
    }));
  };

  const handleSubcategoryChange = useCallback((index, e) => {
    const { value } = e.target;
    setCategoryData((prev) => {
      const newSubcategories = [...prev.subcategories];
      newSubcategories[index] = {
        ...newSubcategories[index],
        name: value,
        slug: getSlug(value),
      };
      return {
        ...prev,
        subcategories: newSubcategories,
      };
    });

    setErrors((prev) => {
      const newSubcategoryErrors = [...prev.subcategories];
      newSubcategoryErrors[index] = "";
      return {
        ...prev,
        subcategories: newSubcategoryErrors,
      };
    });
  }, []);

  const addSubcategory = () => {
    const hasEmptySubcategory = categoryData.subcategories.some(
      (sub) => !sub.name.trim(),
    );

    if (hasEmptySubcategory) {
      setErrors((prev) => ({
        ...prev,
        subcategories: categoryData.subcategories.map((sub) =>
          !sub.name.trim() ? "Please fill in or remove empty subcategory" : "",
        ),
      }));
      return;
    }
    setCategoryData((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, { name: "", slug: "" }],
    }));

    setErrors((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, ""],
    }));
  };

  const removeSubcategory = useCallback((index) => {
    setCategoryData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {
      name: "",
      subcategories: [...categoryData.subcategories.map(() => "")],
    };

    let isValid = true;

    if (!categoryData.name.trim()) {
      newErrors.name = "Category name is required";
      isValid = false;
    } else if (categoryData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters long";
      isValid = false;
    }

    categoryData.subcategories.forEach((sub, index) => {
      if (!sub.name.trim()) {
        newErrors.subcategories[index] =
          "Please fill in or remove empty subcategory";
        isValid = false;
      } else if (sub.name.trim().length < 2) {
        newErrors.subcategories[index] =
          "Subcategory name must be at least 2 characters long";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [categoryData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const formData = {
        name: categoryData.name.trim(),
        slug: getSlug(categoryData.name),
        subcategories: categoryData.subcategories
          .filter((sub) => sub.name.trim() !== "")
          .map((sub) => ({
            name: sub.name.trim(),
            slug: getSlug(sub.name),
          })),
      };

      try {
        await updateCategory(selectedCategorySlug, formData);
      } catch (error) {
        toast.error("Error submitting form:", error.message);
      }
    },
    [categoryData, selectedCategorySlug, updateCategory, validateForm],
  );

  const handleDelete = useCallback(async () => {
    try {
      setShowModal(false);
      await deleteCategory(selectedCategorySlug);
      setSelectedCategorySlug("");
      setCategoryData({
        name: "",
        slug: "",
        subcategories: [],
      });
    } catch (error) {
      toast.error("Error submitting form:", error.message);
    }
  }, [deleteCategory, selectedCategorySlug]);

  return (
    <motion.div
      className="mx-auto mb-8 max-w-xl rounded-lg bg-gray-800 px-7 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="mb-6 text-2xl font-medium text-emerald-300">
        Edit Category
      </h2>

      <div className="mb-4">
        <select
          id="categorySlug"
          name="categorySlug"
          value={selectedCategorySlug}
          onChange={handleSelectChange}
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

      {selectedCategorySlug && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label={"Category Name"}
            name={"name"}
            type="text"
            value={categoryData.name}
            onChange={handleCategoryChange}
            onKeyDown={(e) => handleKeyDown(e, "category")}
            error={errors.name}
            ref={categoryInputRef}
          />

          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-200">
              Subcategories
            </label>
            <button
              type="button"
              onClick={addSubcategory}
              className="flex cursor-pointer items-center text-sm text-emerald-400 hover:text-emerald-300"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Subcategory
            </button>
          </div>

          {categoryData.subcategories.map((subcat, index) => (
            <div
              key={subcat._id || index}
              className="relative flex items-center gap-4"
            >
              <div className="flex-1">
                <FormInput
                  name={"name"}
                  type="text"
                  value={subcat.name}
                  onChange={(e) => handleSubcategoryChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(e, "subcategory", index)}
                  error={errors.subcategories[index]}
                  ref={(el) => (subcategoryRefs.current[index] = el)}
                />
              </div>

              <button
                type="button"
                onClick={() => removeSubcategory(index)}
                className="absolute top-4 -right-5.5 cursor-pointer rounded-full border text-gray-400 hover:text-red-400"
              >
                <Tooltip text={"delete"}>
                  <X className="h-4 w-4" />
                </Tooltip>
              </button>
            </div>
          ))}

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
                <Pencil className="mr-2 h-5 w-5" />
                Update category
              </>
            )}
          </button>
        </form>
      )}
      {selectedCategorySlug && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="mt-4 flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          disabled={deleting}
        >
          {deleting ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Dedeleting...
            </>
          ) : (
            <>
              <Trash className="mr-2 h-5 w-5" />
              Delete category
            </>
          )}
        </button>
      )}

      <DeleteWarning
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryData.name}"? This action cannot be undone. All subcategories will also be deleted.`}
        confirmText="Delete"
        confirmButtonClass="bg-red-500 hover:bg-red-600 focus:ring-red-500"
        onConfirm={handleDelete}
      />
    </motion.div>
  );
};

export default EditCategory;
