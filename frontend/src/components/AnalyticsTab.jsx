import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loading from "./Loading";
import AnalyticsCard from "./AnalyticsCard";
import toast from "react-hot-toast";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response = await axios.get("/analytics");
      setAnalyticsData(response.data.analyticsData);
      setDailySalesData(response.data.dailySalesData);
    } catch (error) {
      toast.error("Error fetching analytics data:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const analyticsCards = useMemo(
    () => [
      {
        title: "Total Users",
        value: analyticsData.users.toLocaleString(),
        icon: Users,
        color: "from-emerald-500 to-teal-700",
      },
      {
        title: "Total Products",
        value: analyticsData.products.toLocaleString(),
        icon: Package,
        color: "from-emerald-500 to-green-700",
      },
      {
        title: "Total Sales",
        value: analyticsData.totalSales.toLocaleString(),
        icon: ShoppingCart,
        color: "from-emerald-500 to-cyan-700",
      },
      {
        title: "Total Revenue",
        value: `$${analyticsData.totalRevenue.toLocaleString()}`,
        icon: DollarSign,
        color: "from-emerald-500 to-lime-700",
      },
    ],
    [analyticsData],
  );

  const chartConfig = useMemo(
    () => ({
      lines: [
        {
          yAxisId: "left",
          type: "monotone",
          dataKey: "sales",
          stroke: "#10B981",
          activeDot: { r: 8 },
          name: "Sales",
        },
        {
          yAxisId: "right",
          type: "monotone",
          dataKey: "revenue",
          stroke: "#3B82F6",
          activeDot: { r: 8 },
          name: "Revenue",
        },
      ],
      axes: {
        xAxis: {
          dataKey: "name",
          stroke: "#D1D5DB",
        },
        yAxis: {
          stroke: "#D1D5DB",
        },
      },
    }),
    [],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map((card) => (
          <AnalyticsCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>
      <motion.div
        className="rounded-lg bg-gray-800/60 shadow-lg sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...chartConfig.axes.xAxis} />
            <YAxis yAxisId="left" {...chartConfig.axes.yAxis} />
            <YAxis
              yAxisId="right"
              orientation="right"
              {...chartConfig.axes.yAxis}
            />
            <Tooltip />
            <Legend />
            {chartConfig.lines.map((lineProps) => (
              <Line key={lineProps.dataKey} {...lineProps} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
export default AnalyticsTab;
