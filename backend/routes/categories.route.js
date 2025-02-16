import express from 'express'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory
} from '../controllers/category/category.controller.js'
import {
  adminMiddleware,
  authMiddleware
} from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getAllCategories)
router.post('/', authMiddleware, adminMiddleware, createCategory)
router.patch('/:slug', authMiddleware, adminMiddleware, updateCategory)
router.delete('/:slug', authMiddleware, adminMiddleware, deleteCategory)

export default router
