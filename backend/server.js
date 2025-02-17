import './utils/instrument.mjs'
import * as Sentry from '@sentry/node'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import path from 'path'

import authRoutes from './routes/auth.route.js'
import productsRoutes from './routes/product.route.js'
import cartRoutes from './routes/cart.route.js'
import couponRoutes from './routes/coupon.route.js'
import paymentRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import categoriesRoutes from './routes/categories.route.js'
import { connectDB } from './lib/db.js'
import { corsMiddleware } from './middleware/cors.middleware.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())
app.disable('x-powered-by')
app.use(corsMiddleware())

app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoriesRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
}

Sentry.setupExpressErrorHandler(app)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)

  // Connect to MongoDB
  connectDB()
})
