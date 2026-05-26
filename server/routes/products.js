const express = require('express');
const path = require('path');
const fs = require('fs');
const { Product } = require('../models');
const { uploadDir } = require('../config/multer');

const router = express.Router();

// user gets all products
router.get('/home', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error when receiving products:', error);
    res.status(500).json({ error: 'Error when receiving products' });
  }
});

// user gets a specific product
router.get('/home/:productTitle', async (req, res) => {
  const { productTitle } = req.params;

  try {
    const product = await Product.findOne({ where: { title: productTitle } });
    if (product) {
      console.log(`${product} is sent to client!`);
      res.json({
        title: product.title,
        photo: product.photo,
        description: product.description,
        ingredients: product.ingredients
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error retrieving product information:', error);
    res.status(500).json({ error: 'Error retrieving product information' });
  }
});

// admin deletes a product
router.delete('/home', async (req, res) => {
  const { title } = req.body;

  try {
    const product = await Product.findOne({ where: { title } });
    if (product) {
      if (product.photo) {
        const photoPath = path.join(uploadDir, product.photo);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      }

      await product.destroy();

      res.status(200).json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting products:', error);
    res.status(500).json({ error: 'Error deleting products' });
  }
});

module.exports = router;
