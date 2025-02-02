import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity
} from '../controllers/cart/cart.controller'

const router = express.Router()

router.get('/', authMiddleware, getCartProducts)
router.post('/', authMiddleware, addToCart)
router.delete('/', authMiddleware, removeAllFromCart)
router.put('/:id', authMiddleware, updateQuantity)

export default router
