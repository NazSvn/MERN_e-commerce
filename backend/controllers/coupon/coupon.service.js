import Coupon from '../../models/coupon.model.js'
import { stripe } from '../../lib/stripe.js'

// helper function to create a stripe coupon

export async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percentange_off: discountPercentage,
    duration: 'once'
  })

  return coupon.id
}

// helper function to create a new coupon
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
