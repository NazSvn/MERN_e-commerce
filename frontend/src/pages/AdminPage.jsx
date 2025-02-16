import { useCallback, useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import {
  BarChart,
  ChevronLeft,
  ChevronRight,
  LayoutPanelTop,
  PlusCircle,
  ShoppingBasket,
} from "lucide-react";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab";
import CategoryManagement from "../components/CategoryManagement";
import { useCategoryStore } from "../stores/useCategoryStore";
import { useProductStore } from "../stores/useProductStore";

const AdminPage = () => {
  const { getCategories } = useCategoryStore();
  const { getAllProducts } = useProductStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getCategories();
    getAllProducts();
  }, [getAllProducts, getCategories]);

  const [activeTab, setActiveTab] = useState("create");

  const tabs = useMemo(
    () => [
      {
        id: "create",
        label: "Create Product",
        icon: PlusCircle,
        component: CreateProductForm,
      },
      {
        id: "products",
        label: "Products",
        icon: ShoppingBasket,
        component: ProductsList,
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart,
        component: AnalyticsTab,
      },
      {
        id: "CategoryManagement",
        label: "Category Management",
        icon: LayoutPanelTop,
        component: CategoryManagement,
      },
    ],
    [],
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex <= tabs.length && prevIndex + 1);
  }, [tabs.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex > 0 && prevIndex - 1);
  }, []);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const { isStartDisabled, isEndDisabled } = useMemo(
    () => ({
      isStartDisabled: currentIndex === 0,
      isEndDisabled: currentIndex === tabs.length - 1,
    }),
    [currentIndex, tabs.length],
  );

  const getNavButtonClass = useCallback(
    (isDisabled) => `
    absolute top-1.5 cursor-pointer rounded-full p-1 transition-colors duration-300 
    ${
      isDisabled
        ? "cursor-not-allowed bg-gray-400"
        : "bg-emerald-600 hover:bg-emerald-500"
    } min-[600px]:hidden
  `,
    [],
  );

  const ActiveComponent = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.component || null,
    [activeTab, tabs],
  );

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gray-900/90 text-white">
        <div className="relative z-10 container mx-auto px-3 py-10 min-[500px]:px-4">
          <motion.h1
            className="mx-4 mb-8 text-center text-4xl font-bold text-emerald-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Admin Dashboard
          </motion.h1>
          <div className="relative mx-4 mb-8 flex justify-center">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`mx-2 cursor-pointer items-center rounded-md px-4 py-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } ${currentIndex === i ? "flex" : "hidden"} w-[80%] justify-center min-[600px]:flex sm:w-auto sm:text-sm md:text-base`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            ))}
            <button
              onClick={prevSlide}
              disabled={isStartDisabled}
              className={`${getNavButtonClass(isStartDisabled)} -left-3`}
              aria-label="Previous tab"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={nextSlide}
              disabled={isEndDisabled}
              className={`${getNavButtonClass(isEndDisabled)} -right-3`}
              aria-label="Next tab"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
