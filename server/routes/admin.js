const express = require('express');
const { Product, User } = require('../models');
const { upload } = require('../config/multer');

const router = express.Router();

// admin adds a product
router.post('/admin-settings/add-product', upload.single('photo'), async (req, res) => {
  const { title, description, price, ingredients, chapter } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const newProduct = await Product.create({ photo, title, description, price, ingredients, chapter });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Error adding product' });
  }
});

// admin promotes a user to "friend"
router.post('/admin-settings/add-friend', async (req, res) => {
  const { login } = req.body;

  try {
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.friend = true;
    await user.save();

    res.status(200).json({ message: 'User added to friends' });
  } catch (error) {
    console.error('User adding to friends error:', error);
    res.status(500).json({ error: 'User adding to friends error' });
  }
});

// admin promotes a user to "admin"
router.post('/admin-settings/add-admin', async (req, res) => {
  const { login } = req.body;

  try {
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.admin = true;
    await user.save();

    res.status(200).json({ message: 'User added as admin' });
  } catch (error) {
    console.error('Error adding new administrator:', error);
    res.status(500).json({ error: 'Error adding new administrator' });
  }
});

module.exports = router;
