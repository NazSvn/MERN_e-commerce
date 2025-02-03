import Order from '../../models/order.model.js'
import Product from '../../models/product.model.js'
import User from '../../models/user.model.js'
import { getDates } from '../utils/controller.utils.js'

export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments()
  const totalProducts = await Product.countDocuments()

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // Group by null to get a single document
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ])

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0
  }

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue
  }
}

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ])
    const dateArray = getDates(startDate, endDate)

    return dateArray.map((date) => {
      const data = dailySalesData.find((item) => item._id === date)
      return {
        date,
        sales: data ? data.sales : 0,
        revenue: data ? data.revenue : 0
      }
    })
  } catch (error) {
    throw error
  }
}
