import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {
  getCoupon,
  validateCoupon
} from '../controllers/coupon/coupon.controller.js'

const router = express.Router()

router.get('/', authMiddleware, getCoupon)
router.post('/validate', authMiddleware, validateCoupon)

export default router
