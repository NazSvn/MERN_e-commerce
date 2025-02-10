import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function resetIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    // Drop existing indexes
    await mongoose.connection.collection('categories').dropIndexes()

    console.log('Indexes dropped successfully')

    // Let the application recreate indexes
    await mongoose.connection.close()

    console.log('Done! Now restart your application')
    process.exit(0)
  } catch (error) {
    console.error('Error resetting indexes:', error)
    process.exit(1)
  }
}

resetIndexes()
