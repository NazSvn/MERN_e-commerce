import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.route.js'
import productsRoutes from './routes/product.route.js'
import { connectDB } from './lib/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.disable('x-powered-by')

app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)

  // Connect to MongoDB
  connectDB()
})
