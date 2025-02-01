import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

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
    console.error('Auth Middleware Error:', error)
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      next()
    }
  } catch (error) {
    console.error('Admin Middleware Error:', error)
    return res.status(403).json({ message: 'Access denied - admin only' })
  }
}
