import Coupon from '../../models/coupon.model.js'
import { handleError } from '../../utils/errorHandler.js'

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true
    })

    res.status(200).json(coupon || null)
  } catch (error) {
    const errorMessage = handleError(error, 'Error getting coupon')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body
    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      userId: req.user._id
    })

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }
    if (coupon.expirationDate < Date.now()) {
      coupon.isActive = false
      await coupon.save()
      return res.status(400).json({ message: 'Coupon expired' })
    }

    res.status(200).json({
      message: 'Coupon is valid',
      code: coupon.code,
      discountPercentage: coupon.discountPercentage
    })
  } catch (error) {
    const errorMessage = handleError(error, 'Error validating coupon')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}
