import { body } from 'express-validator'

export const validateSignup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().not().isEmpty()
]

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').not().isEmpty()
]