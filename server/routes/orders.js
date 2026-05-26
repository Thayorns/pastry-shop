const express = require('express');
const { Order, User } = require('../models');
const { broadcast } = require('../websocket');

const router = express.Router();

// user creates an order
router.post('/shop', async (req, res) => {
  const { title, name, phone, date, login, photo, count, time } = req.body;

  try {
    const newOrder = await Order.create({ title, name, phone, date, login, photo, count, time });

    broadcast({ type: 'newOrder', order: newOrder });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: 'Order error!' });
  }
});

// admin accepts an order
router.post('/news', async (req, res) => {
  const { title, name } = req.body;

  try {
    const anOrder = await Order.findOne({ where: { title, name } });
    if (!anOrder) {
      return res.status(404).json({ error: 'Order was not found' });
    }

    anOrder.isaccepted = true;
    await anOrder.save();

    res.status(200).json({ message: `Client order ${name} - approved` });
  } catch (error) {
    console.error('Order approved error:', error);
    res.status(500).json({ error: 'Order approved error' });
  }
});

// admin deletes an order
router.delete('/news', async (req, res) => {
  const { title, name } = req.body;

  try {
    const result = await Order.destroy({ where: { title, name } });
    if (result > 0) {
      res.status(200).json({ message: 'Order successfully deleted' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Order delete error:', error);
    res.status(500).json({ error: 'Order delete error' });
  }
});

// admin/user gets all/his orders
router.get('/news/:login', async (req, res) => {
  const { login } = req.params;

  try {
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.admin) {
      const orders = await Order.findAll();
      res.status(200).json(orders);
    } else {
      const userOrders = await Order.findAll({ where: { login } });
      res.status(200).json(userOrders);
    }
  } catch (error) {
    console.error('Order receiving error:', error);
    res.status(500).json({ error: 'Order receiving error' });
  }
});

module.exports = router;
