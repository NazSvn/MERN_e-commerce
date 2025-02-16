import cloudinary from '../../lib/cloudinary.js'
import { redis } from '../../lib/redis.js'
import Category from '../../models/category.model.js'
import Product from '../../models/product.model.js'
import { handleError } from '../../utils/errorhandler.js'

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category')
    res.status(200).json({ products })
  } catch (error) {
    const errorMessage = handleError(error, 'Error getting products')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get('featured_Products')

    if (featuredProducts) {
      return res.status(200).json(JSON.parse(featuredProducts))
    }

    // if not in redis, fetch from db
    // .lean() to convert to a plain js object instead of mongodb document. good for performance

    featuredProducts = await Product.find({ isFeatured: true })
      .populate('category')
      .lean()

    if (!featuredProducts) {
      return res.status(404).json({ message: 'No featured products found' })
    }

    await redis.set('featured_Products', JSON.stringify(featuredProducts))
    res.status(200).json(featuredProducts)
  } catch (error) {
    const errorMessage = handleError(error, 'Error getting featured products')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, categorySlug, subcategorySlug } =
      req.body
    let cloudinaryResponse = null

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: 'products'
      })
    }

    const category = await Category.findOne({ slug: categorySlug })
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    if (subcategorySlug) {
      const validSubcategory = category.subcategories.some(
        (sub) => sub.slug === subcategorySlug
      )
      if (!validSubcategory) {
        return res.status(404).json({ message: 'Subcategory not found' })
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : '',
      category: category._id,
      subcategory: subcategorySlug
    })

    await product.populate('category')

    res.status(201).json(product)
  } catch (error) {
    const errorMessage = handleError(error, 'Error creating product')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0] // get the public id from the url
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`)
        /* console.log(`Product image deleted from Cloudinary: ${publicId}`) */
      } catch (error) {
        const errorMessage = handleError(error, 'Error deleting product image')
        throw new Error(errorMessage)
      }
    }

    await Product.findByIdAndDelete(id)
    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    const errorMessage = handleError(error, 'Error deleting product')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          price: 1
        }
      }
    ])

    res.status(200).json(products)
  } catch (error) {
    const errorMessage = handleError(
      error,
      'Error getting recommended products'
    )
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params
  try {
    const categoryDoc = await Category.findOne({ slug: category })
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const products = await Product.find({ category: categoryDoc._id }).populate(
      'category'
    )
    res.status(200).json({ products })
  } catch (error) {
    const errorMessage = handleError(error, 'Error getting products')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    product.isFeatured = !product.isFeatured
    const updatedProduct = await product.save()
    await updateFeaturedProductsCache()
    res.status(200).json(updatedProduct)
  } catch (error) {
    const errorMessage = handleError(error, 'Error toggling featured product')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true })
      .populate('category')
      .lean()
    await redis.set('featured_Products', JSON.stringify(featuredProducts))
  } catch (error) {
    const errorMessage = handleError(error, 'Error updating cahche')
    res.status(500).json({ message: errorMessage })
  }
}
