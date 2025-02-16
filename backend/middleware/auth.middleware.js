import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { handleError } from '../utils/errorhandler.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies

    if (!accessToken) {
      return res.status(401).json({ message: 'No token provided' })
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN)
      const user = await User.findById(decoded.userId).select('-password')
      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
  } catch (error) {
    const errorMessage = handleError(error, 'Invalid token')
    return res.status(401).json({ message: errorMessage })
  }
}

export const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      next()
    }
  } catch (error) {
    const errorMessage = handleError(error, 'Access denied - admin only')
    return res.status(403).json({ message: errorMessage })
  }
}
