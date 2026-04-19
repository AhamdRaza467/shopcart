const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
} = require('../controllers/adminController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
