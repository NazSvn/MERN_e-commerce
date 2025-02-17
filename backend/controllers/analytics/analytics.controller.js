import {
  getAnalyticsData,
  getDailySalesData
} from '../analytics/analytics.service.js'

export const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData()

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000) //  7 days ago

    const dailySalesData = await getDailySalesData(startDate, endDate)

    res.status(200).json({ analyticsData, dailySalesData })
  } catch (error) {
    const errorMessage = handleError(error, 'Error getting analytics')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}
