import { validationResult } from 'express-validator'
import Coupon from '../../models/coupon.model'
import { stripe } from '../../lib/stripe'
// helper functions to validate request

export const validateRequest = (req) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg)
    throw new Error(errorMessages.join(', '))
  }
}

// helper function to sanitize user data for response

export const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
})

export async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percentange_off: discountPercentage,
    duration: 'once'
  })

  return coupon.id
}

export async function createNewcoupon(userId) {
  const newCoupon = new Coupon({
    code: 'Gift' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId
  })

  await newCoupon.save()
  return newCoupon
}
