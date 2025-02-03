import express from 'express'
import {
  adminMiddleware,
  authMiddleware
} from '../middleware/auth.middleware.js'
import { getAnalytics } from '../controllers/analytics/analytics.controller.js'

const router = express.Router()

router.get('/', authMiddleware, adminMiddleware, getAnalytics)

export default router
