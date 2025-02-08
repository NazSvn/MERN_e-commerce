import express from 'express'
import {
  createCategory,
  getAllCategories,
  updateCategory
} from '../controllers/category/category.controller.js'
import { adminMiddleware, authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/',adminMiddleware, adminMiddleware, getAllCategories)
router.post('/',authMiddleware, adminMiddleware, createCategory)
router.patch('/:slug', authMiddleware, adminMiddleware, updateCategory)

export default router
