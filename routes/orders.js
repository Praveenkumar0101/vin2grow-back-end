// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Create new order
router.post('/', async (req, res) => {
  const { userId, items, total } = req.body;
  const newOrder = new Order({ userId, items, total });
  await newOrder.save();
  res.status(201).json(newOrder);
});

module.exports = router;
