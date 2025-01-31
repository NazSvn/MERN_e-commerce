import { validationResult } from 'express-validator'
// helper functions to validate request

export const validateRequest = (req) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg)
    throw new Error(errorMessages.join(', '))
  }
}

// helper function to sanitize user data for response

export const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
})
