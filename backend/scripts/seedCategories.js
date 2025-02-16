import mongoose from 'mongoose'
import { Category } from '../models/category.model.js'
import dotenv from 'dotenv'

dotenv.config()

const categories = [
  {
    name: 'Belts',
    slug: 'belts',
    subcategories: [
      { name: "Women's Belts", slug: 'women_belts' },
      { name: "Men's Belts", slug: 'men_belts' }
    ]
  },
  {
    name: 'Wallets & Cardholders',
    slug: 'wallets_cardholders',
    subcategories: [
      { name: 'Bi-fold & Tri-fold Wallets', slug: 'bi_fold_trifold_wallets' },
      { name: 'Slim / Card Wallets', slug: 'slim_card_wallets' }
    ]
  },
  {
    name: 'Bags & Cases',
    slug: 'bags_cases',
    subcategories: [
      { name: 'Briefcases', slug: 'briefcases' },
      { name: 'Laptop Bags', slug: 'laptop_bags' }
    ]
  },
  {
    name: 'Money Clips & Coin Purses',
    slug: 'money_clips_coin_purses',
    subcategories: [
      { name: 'Coin Purses', slug: 'coin_purses' },
      { name: 'Money Clips', slug: 'money_clips' }
    ]
  },
  {
    name: 'Small Leather Accessories',
    slug: 'small_leather_accessories',
    subcategories: [
      { name: 'Bracelets & Cuffbands', slug: 'bracelets_cuffbands' },
      { name: 'Watch Straps', slug: 'watch_straps' }
    ]
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    subcategories: []
  }
]

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    for (const category of categories) {
      await Category.findOneAndUpdate({ slug: category.slug }, category, {
        upsert: true,
        new: true
      })
    }

    console.log('Categories seeded successfully')
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

seedCategories()
