import mongoose from 'mongoose'

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    sparce: true
  }
})

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    subcategories: { type: [subcategorySchema], default: [] }
  },
  { timestamps: true }
)

categorySchema.index(
  { 'subcategories.slug': 1 },
  {
    unique: true,
    sparse: true, // Add sparse index
    partialFilterExpression: { 'subcategories.slug': { $exists: true } } // Only index documents where slug exists
  }
)

categorySchema.methods.hasSubcategories = function () {
  return this.subcategories && this.subcategories.length > 0
}

const Category = mongoose.model('Category', categorySchema)

export default Category
