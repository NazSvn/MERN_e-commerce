import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies

    if (!accessToken) {
      return res.status(401).json({ message: 'No token provided' })
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN)
      req.user = { _id: decoded.userId }
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error)
    return res.status(401).json({ message: 'Invalid token' })
  }
}
