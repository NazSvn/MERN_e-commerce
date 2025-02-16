import { useCallback, useMemo, useRef, useState } from "react";
import { useCategoryStore } from "../stores/useCategoryStore";
import { motion } from "framer-motion";
import { Loader, Plus, PlusCircle, X } from "lucide-react";
import FormInput from "./FormInput";
import getSlug from "../utils/getSlug";
import toast from "react-hot-toast";

const CreateNewCategory = () => {
  const { loading, createCategory } = useCategoryStore();
  const categoryInputRef = useRef(null);
  const subcategoryRefs = useRef([]);

  const [categoryData, setCategoryData] = useState({
    name: "",
    subcategories: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    subcategories: [],
  });

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
      }
      if (sub.name.trim() && sub.name.trim().length < 2) {
        newErrors.subcategories[index] =
          "Subcategory name must be at least 2 characters long";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [categoryData]);

  const handleCategoryChange = useCallback((e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // reset error message when start typing again
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }, []);

  const handleSubcategoryChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => {
      const newSubcategories = [...prev.subcategories];
      newSubcategories[index] = {
        ...newSubcategories[index],
        [name]: value,
        slug: name === "name" ? getSlug(value) : newSubcategories[index].slug,
      };
      return {
        ...prev,
        subcategories: newSubcategories,
      };
    });

    // reset error message when start typing again
    setErrors((prev) => {
      const newSubcategoryErrors = [...prev.subcategories];
      newSubcategoryErrors[index] = "";
      return {
        ...prev,
        subcategories: newSubcategoryErrors,
      };
    });
  }, []);

  const addSubcategory = useCallback(() => {
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
  }, [categoryData]);

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

  const handleKeyDown = useCallback(
    (e, type, index = null) => {
      if (e.key === "Escape") {
        if (type === "category") {
          setCategoryData((prev) => ({
            ...prev,
            name: "",
          }));
          categoryInputRef.current?.blur();
        } else if (type === "subcategory" && index !== null) {
          // If subcategory is empty, remove it
          if (!categoryData.subcategories[index].name.trim()) {
            removeSubcategory(index);
          } else {
            // Clear the subcategory
            const newSubcategories = [...categoryData.subcategories];
            newSubcategories[index] = { name: "", slug: "" };
            setCategoryData((prev) => ({
              ...prev,
              subcategories: newSubcategories,
            }));
          }
          subcategoryRefs.current[index]?.blur();
        }
      }
    },
    [categoryData.subcategories, removeSubcategory],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const formData = {
        name: categoryData.name,
        slug: getSlug(categoryData.name),
        subcategories: categoryData.subcategories
          .filter((sub) => sub.name.trim() !== "")
          .map((sub) => ({
            name: sub.name.trim(),
            slug: getSlug(sub.name),
          })),
      };

      try {
        await createCategory(formData);
        setCategoryData({
          name: "",
          subcategories: [],
        });
      } catch (error) {
        toast.error("Error submitting form:", error.message);
      }
    },
    [categoryData, createCategory, validateForm],
  );

  const submitButtonContent = useMemo(
    () =>
      loading ? (
        <>
          <Loader className="mr-2 h-5 w-5 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Category
        </>
      ),
    [loading],
  );

  return (
    <motion.div
      className="mx-auto mb-8 rounded-lg bg-gray-800 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="mb-6 text-2xl font-medium text-emerald-300">
        Create New Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            label="Category Name"
            name="name"
            value={categoryData.name}
            onChange={handleCategoryChange}
            onKeyDown={(e) => handleKeyDown(e, "category")}
            error={errors.name}
            required
            ref={categoryInputRef}
          />

          <div className="space-y-4">
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

            {categoryData.subcategories.map((subcategory, index) => (
              <div key={index} className="relative flex items-center gap-4">
                <div className="flex-1">
                  <FormInput
                    label="Subcategory Name"
                    name="name"
                    placeholder="Subcategory Name"
                    value={subcategory.name}
                    onChange={(e) => handleSubcategoryChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(e, "subcategory", index)}
                    error={errors.subcategories[index]}
                    ref={(el) => (subcategoryRefs.current[index] = el)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSubcategory(index)}
                  className="absolute top-9 -right-5.5 cursor-pointer rounded-full border text-gray-400 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full cursor-pointer justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          disabled={loading}
        >
          {submitButtonContent}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateNewCategory;
