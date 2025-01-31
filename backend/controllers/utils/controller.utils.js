import { validationResult } from 'express-validator'
// helper functions to validate request

export const validateRequest = (req) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }
}

// helper function to sanitize user data for response

export const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
})
