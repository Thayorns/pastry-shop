const express = require('express');
const { User, sequelize } = require('../models');
const { broadcastCoffee } = require('../websocket');

const router = express.Router();

// user gets his coffee count
router.get('/user-coffee/:login', async (req, res) => {
  const { login } = req.params;

  try {
    const user = await User.findOne({ where: { login } });
    if (user) {
      res.json({ coffee: user.coffee_count });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving coffee information:', error);
    res.status(500).json({ error: 'Error retrieving coffee information' });
  }
});

// admin adds coffee to a user
router.post('/admin-coffee', async (req, res) => {
  const { number, selectedCoffee } = req.body;

  if (!number || !selectedCoffee) {
    return res.status(400).json({ error: 'Number and selectedCoffee are required' });
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { qr_code: number },
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    const userLogin = user.login;
    let currentCoffeeCount = user.coffee_count + parseInt(selectedCoffee, 10);

    if (currentCoffeeCount === 7) currentCoffeeCount = 8;
    if (currentCoffeeCount > 8) currentCoffeeCount = currentCoffeeCount - 8;

    user.coffee_count = currentCoffeeCount;
    await user.save({ transaction });
    await transaction.commit();

    broadcastCoffee({ type: 'coffee', coffeeCount: currentCoffeeCount }, userLogin);

    res.status(200).json({ userLogin });
  } catch (error) {
    console.error('Error crediting coffee:', error);
    await transaction.rollback();
    res.status(500).send('Error crediting coffee.');
  }
});

module.exports = router;
