import jwt from 'jsonwebtoken'
import { redis } from '../../lib/redis.js'
import { TOKEN_EXPIRY, COOKIE_OPTIONS } from './auth.constants.js'

// helper functions to generate tokens

export const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: TOKEN_EXPIRY.ACCESS
  })

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: TOKEN_EXPIRY.REFRESH
  })

  return { accessToken, refreshToken }
}

// Helper functions to store and retrieve refresh tokens

export const storeRefreshToken = async (userId, refreshToken) => {
  const expiryInSeconds = 7 * 24 * 60 * 60
  await redis.set(`refreshToken:${userId}`, refreshToken, 'EX', expiryInSeconds)
}

// helpter functions to set cookies

export const setCookies = (res, { accessToken, refreshToken }) => {
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000
  })

  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

export const clearCookies = (res) => {
  res.clearCookie('accessToken', COOKIE_OPTIONS)
  res.clearCookie('refreshToken', COOKIE_OPTIONS)
}

export const decodeRefreshToken = async (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
}
