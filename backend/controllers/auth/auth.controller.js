import { redis } from '../../lib/redis.js'
import User from '../../models/user.model.js'
import { handleError } from '../../utils/errorHandler.js'
import { sanitizeUser, validateRequest } from '../utils/controller.utils.js'
import {
  clearCookies,
  decodeRefreshToken,
  generateTokens,
  setCookies,
  storeRefreshToken
} from './auth.service.js'

// controller functions

export const signup = async (req, res) => {
  try {
    validateRequest(req)

    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ name, email, password })
    const tokens = await generateTokens(user._id)

    await storeRefreshToken(user._id, tokens.refreshToken)

    setCookies(res, tokens)

    res.status(201).json(sanitizeUser(user))
  } catch (error) {
    const errorMessage = handleError(error, 'Error creating user')
    res.status(500).json({ message: errorMessage })
  }
}

export const login = async (req, res) => {
  try {
    validateRequest(req)

    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // authenticate user
    const tokens = await generateTokens(user._id)

    await storeRefreshToken(user._id, tokens.refreshToken)

    setCookies(res, tokens)

    res.status(200).json(sanitizeUser(user))
  } catch (error) {
    const errorMessage = handleError(error, 'Error logging in')
    res.status(500).json({ message: errorMessage })
  }
}

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      clearCookies(res)
      return res.status(200).json({ message: 'Logged out successfully' })
    }

    try {
      const decoded = await decodeRefreshToken(refreshToken)
      await redis.del(`refreshToken:${decoded.userId}`)
    } catch (error) {
      throw new Error(error.message)
    }
    clearCookies(res)
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    const errorMessage = handleError(error, 'Error logging out')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' })
    }

    const decoded = await decodeRefreshToken(refreshToken)

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const storedRefreshToken = await redis.get(`refreshToken:${decoded.userId}`)

    if (!storedRefreshToken || refreshToken !== storedRefreshToken) {
      return res
        .status(401)
        .json({ message: 'Refresh token expired or invalid' })
    }

    const tokens = await generateTokens(decoded.userId)

    await storeRefreshToken(decoded.userId, tokens.refreshToken)
    setCookies(res, tokens)

    res.status(200).json({ message: 'Token refreshed successfully' })
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to refresh token')
    return res.status(401).json({ message: errorMessage })
  }
}

export const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(sanitizeUser(user))
  } catch (error) {
    const errorMessage = handleError(error, 'Error getting user profile')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}
