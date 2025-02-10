import jwt from 'jsonwebtoken'
import { redis } from '../../lib/redis.js'
import { TOKEN_EXPIRY, COOKIE_OPTIONS } from './auth.constants.js'

// helper functions to generate tokens

export const generateTokens = async (userId) => {
  try {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: TOKEN_EXPIRY.ACCESS
    })

    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: TOKEN_EXPIRY.REFRESH
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.error('Token generation error:', error)
    throw new Error('Failed to generate tokens')
  }
}

// Helper functions to store and retrieve refresh tokens

export const storeRefreshToken = async (userId, refreshToken) => {
  try {
    const expiryInSeconds = 7 * 24 * 60 * 60
    await redis.set(
      `refreshToken:${userId}`,
      refreshToken,
      'EX',
      expiryInSeconds
    )
  } catch (error) {
    console.error('Store refresh token error:', error)
    throw new Error('Failed to store refresh token')
  }
}

// helpter functions to set cookies

export const setCookies = (res, { accessToken, refreshToken }) => {
  try {
    res.cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000
    })

    res.cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
  } catch (error) {
    console.error('Set cookies error:', error)
    throw new Error('Failed to set cookies')
  }
}

export const clearCookies = (res) => {
  try {
    res.clearCookie('accessToken', COOKIE_OPTIONS)
    res.clearCookie('refreshToken', COOKIE_OPTIONS)
  } catch (error) {
    console.error('Clear cookies error:', error)
    throw new Error('Failed to clear cookies')
  }
}

export const decodeRefreshToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
  } catch (error) {
    console.error('Decode refresh token error:', error)
    throw new Error('Invalid refresh token')
  }
}
