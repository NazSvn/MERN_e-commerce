import express from 'express'
import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile
} from '../controllers/auth/auth.controller.js'
import { validateLogin, validateSignup } from '../middleware/validate.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', validateSignup, signup)

router.post('/login', validateLogin, login)

router.post('/logout', logout)

router.post('/refresh-token', refreshToken)

router.get('/profile', authMiddleware, getProfile)

export default router
