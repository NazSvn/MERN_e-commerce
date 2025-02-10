import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      min: 0,
      required: true
    },
    image: {
      type: String,
      required: [true, 'Image is required']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subcategory: {
      type: String, // Store the subcategory slug
      validate: {
        validator: async function (value) {
          if (!value) return true // subcategory is optional
          const category = await mongoose
            .model('Category')
            .findById(this.category)
          return category?.subcategories.some((sub) => sub.slug === value)
        },
        message: 'Invalid subcategory for the selected category'
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

productSchema.index({ category: 1, subcategory: 1 })

const Product = mongoose.model('Product', productSchema)

export default Product
