import { redis } from '../../lib/redis.js'
import User from '../../models/user.model.js'
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
    console.error(error)
    res.status(500).json({ message: error.message })
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
    console.error(error)
    res.status(500).json({ message: error.message })
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
    } catch (tokenErrror) {
      console.error('Token verification failed:', tokenErrror)
    }
    clearCookies(res)
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
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
    console.error('Refresh token error:', error)
    return res.status(401).json({ message: 'Failed to refresh token' })
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
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
