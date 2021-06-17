const { Router } = require('express');
const router = new Router();
const menu = require('../menu.json');
const { filterOrders, findOrder } = require('../database/db-operations');const { calDiffInTime, checkUser, createOrder } = require('../functions');

router.get('/coffee', (req, res) => {
  res.json(menu);
});

// Create Order
router.post('/order', (req, res) => {
  const order = req.body;
  console.log(order);
  res.json(createOrder(order));
});

// Find specific orders
router.get('/orderId/:id', (req, res) => {
  const orderId = req.params.id;
  const order = findOrder(orderId);
  res.json(calDiffInTime(order));
});

// Find order history
router.get('/order/:id', (req, res) => {
  const userId = req.params.id;

  const orders = filterOrders(userId);
  res.json(calDiffInTime(orders));
});

// Create account
router.post('/account', (req, res) => {
  const account = req.body;
  console.log(account);
  res.json(checkUser(account));
});


module.exports = router;
