const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/create', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;
