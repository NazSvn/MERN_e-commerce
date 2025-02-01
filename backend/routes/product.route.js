import express from 'express'
import { getAllProducts } from '../controllers/product/product.controller.js'
import {
  adminMiddleware,
  authMiddleware
} from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', authMiddleware, adminMiddleware, getAllProducts)

export default router
