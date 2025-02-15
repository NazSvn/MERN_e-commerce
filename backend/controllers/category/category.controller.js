import Category from '../../models/category.model.js'

export const createCategory = async (req, res) => {
  try {
    const { name, slug, subcategories } = req.body

    if (subcategories && !Array.isArray(subcategories)) {
      return res.status(400).json({ message: 'Subcategories must be an array' })
    }

    const existingCategory = await Category.findOne({ slug })
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' })
    }

    if (subcategories && subcategories.length > 0) {
      const existingSubcategory = await Category.findOne({
        subcategories: { $elemMatch: { slug } }
      })

      if (existingSubcategory) {
        return res.status(400).json({ message: 'Subcategory already exists' })
      }

      for (const sub of subcategories) {
        const existingSub = await Category.findOne({
          subcategories: { $elemMatch: { slug: sub.slug } }
        })
        if (existingSub) {
          return res
            .status(400)
            .json({ message: `Subcategory '${sub.slug}' already exists` })
        }
      }
    }

    const category = await Category.create({
      name,
      slug,
      subcategories: subcategories
    })

    res.status(201).json(category)
  } catch (error) {
    const errorMessage = handleError(error, 'Error creating category')
    res.status(500).json({ message: 'Error creating category', errorMessage })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { name, slug, subcategories } = req.body

    if (!Array.isArray(subcategories)) {
      return res.status(400).json({ message: 'Subcategories must be an array' })
    }

    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug, subcategories },
      { new: true }
    )

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.status(200).json(category)
  } catch (error) {
    const errorMessage = handleError(error, 'Error updating category')
    res.status(500).json({ message: 'Error updating category', errorMessage })
  }
}

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
    res.status(200).json(categories)
  } catch (error) {
    const errorMessage = handleError(error, 'Error getting categories')
    res.status(500).json({ message: errorMessage })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ slug: req.params.slug })
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.status(200).json({ message: 'Category deleted successfully' })
  } catch (error) {
    const errorMessage = handleError(error, 'Error deleting category')
    res.status(500).json({ message: errorMessage })
  }
}
