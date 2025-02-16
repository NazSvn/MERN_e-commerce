import { motion } from "framer-motion";
import PropTypes from "prop-types";

const AnalyticsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-gray-800 p-6 shadow-lg ${color}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-between">
        <div className="z-10">
          <p className="mb-1 text-sm font-medium text-emerald-300">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
      <div className="absolute -right-4 -bottom-4 text-emerald-800 opacity-50">
        <Icon className="h-32 w-32" />
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;

AnalyticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
};
