export const TOKEN_EXPIRY = {
  ACCESS: '15m',
  REFRESH: '7d'
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production'
}
