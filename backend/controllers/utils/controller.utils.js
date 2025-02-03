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

// helper function to get dates

export function getDates(startDate, endDate) {
  const dateArray = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dateArray.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dateArray
}
