import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, PlusCircle } from "lucide-react";
import CreateNewCategory from "../components/CreateNewCategory";
import EditCategory from "./EditCategory";

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState();
  const tabs = useMemo(
    () => [
      {
        id: "createcategory",
        label: "Create Category",
        icon: PlusCircle,
        component: CreateNewCategory,
      },
      {
        id: "editcategory",
        label: "Edit Category",
        icon: Pencil,
        component: EditCategory,
      },
    ],
    [],
  );

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const ActiveComponent = useMemo(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab?.component || null;
  }, [activeTab, tabs]);

  const getButtonClass = useCallback((isActive) => {
    return `mx-2 mb-4 flex w-full cursor-pointer items-center rounded-md px-1 py-2 text-sm 
    transition-colors duration-200 min-[500px]:w-auto sm:px-4 ${
      isActive
        ? "bg-emerald-600 text-white"
        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
    }`;
  }, []);

  return (
    <motion.div
      className="mx-auto max-w-xl rounded-lg bg-gray-800 pt-4 pb-0.5 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={getButtonClass(tab.id === activeTab)}
          >
            <tab.icon className="mr-1.5 h-5 w-5 sm:mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
      {ActiveComponent && (
        <div key={activeTab}>
          <ActiveComponent />
        </div>
      )}
    </motion.div>
  );
};

export default CategoryManagement;
