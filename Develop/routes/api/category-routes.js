const express = require('express');
const router = express.Router();
const { Category, Product } = require('../../models');

const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: Product,
    });
    res.json(categories);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const foundCategory = await Category.findByPk(categoryId, {
      include: [{ model: Product }],
    });

    if (!foundCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(foundCategory);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.post('/', async (req, res) => {
  try {
    const { CategoryName } = req.body;
    const newCategory = await Category.create({ category_name: CategoryName });

    res.status(201).json(newCategory);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedData = req.body;

    const existingCategory = await Category.findOne({ where: { id: categoryId } });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await Category.update(updatedData, {
      where: {
        id: categoryId,
      },
    });

    const updatedCategory = await Category.findByPk(categoryId);

    res.json(updatedCategory);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    handleServerError(res, error);
  }
});

module.exports = router;

