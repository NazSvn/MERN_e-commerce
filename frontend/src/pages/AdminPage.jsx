import { useState } from "react";

import { motion } from "framer-motion";
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState();

  const tabs = [
    {
      id: "create",
      label: "Create Product",
      icon: PlusCircle,
    },
    {
      id: "products",
      label: "Products",
      icon: ShoppingBasket,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart,
    },
  ];

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gray-900/90 text-white">
        <div className="px4 relative z-10 container mx-auto py-16">
          <motion.h1
            className="mb-8 text-center text-4xl font-bold text-emerald-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Admin Dashboard
          </motion.h1>
          <div className="mb-8 flex justify-center">
            {" "}
            {tabs &&
              tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`mx-2 flex items-center rounded-md px-4 py-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
          </div>
          {activeTab === "create" && <CreateProductForm />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
