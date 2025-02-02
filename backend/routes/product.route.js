import express from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct
} from '../controllers/product/product.controller.js'
import {
  adminMiddleware,
  authMiddleware
} from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', authMiddleware, adminMiddleware, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/recommended', getRecommendedProducts)
router.post('/', authMiddleware, adminMiddleware, createProduct)
router.patch('/:id', authMiddleware, adminMiddleware, toggleFeaturedProduct)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct)

export default router
