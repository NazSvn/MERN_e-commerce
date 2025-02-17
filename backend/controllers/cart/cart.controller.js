import Product from '../../models/product.model.js'
import { handleError } from '../../utils/errorHandler.js'

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body
    const user = req.user

    const existingItem = user.cartItems.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      user.cartItems.push(productId)
    }
    await user.save()
    res.status(200).json(user.cartItems)
  } catch (error) {
    const errorMessage = handleError(error, 'Error adding product to cart')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body
    const user = req.user
    if (!productId) {
      user.cartItems = []
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId)
    }

    await user.save()
    res.status(200).json(user.cartItems)
  } catch (error) {
    const errorMessage = handleError(error, 'Error removing product from cart')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.body
    const { quantity } = req.body
    const user = req.user
    const existingItem = user.cartItems.find((item) => item.id === productId)

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId)
        await user.save()
        res.status(200).json(user.cartItems)
      } else {
        existingItem.quantity = quantity
        await user.save()
        res.status(200).json(user.cartItems)
      }
    } else {
      res.status(404).json({ message: 'Product not found in cart' })
    }
  } catch (error) {
    const errorMessage = handleError(error, 'Error updating product quantity')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } })
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      )
      return {
        ...product.toJSON(),
        quantity: item.quantity
      }
    })

    res.status(200).json(cartItems)
  } catch (error) {
    const errorMessage = handleError(error, 'Error getting cart products')
    res.status(500).json({ message: 'Server error', errorMessage })
  }
}
