const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders/create
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice, paymentMethod, stripeSessionId, paymentStatus } =
      req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Check stock availability
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for: ${product.name}` });
      }
    }

    // Deduct stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod: paymentMethod || 'COD',
      stripeSessionId: stripeSessionId || '',
      paymentStatus: paymentStatus || 'Pending',
    });

    // Send Order Confirmation Email
    try {
      const itemsHtml = orderItems.map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">Rs. ${item.price.toLocaleString()}</td>
        </tr>
      `).join('');

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #4CAF50; text-align: center;">Order Confirmed! 🎉</h1>
          <p>Hi ${req.user.name},</p>
          <p>Thank you for shopping at ShopCart! Your order has been successfully placed.</p>
          
          <h3 style="border-bottom: 2px solid #4CAF50; padding-bottom: 5px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f9f9f9;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <h3 style="text-align: right; color: #333;">Total: Rs. ${totalPrice.toLocaleString()}</h3>
          <p><strong>Payment Method:</strong> ${paymentMethod === 'Stripe' ? 'Paid via Credit Card' : 'Cash on Delivery'}</p>
          <p><strong>Shipping To:</strong> ${shippingAddress.address}, ${shippingAddress.city}</p>
          
          <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
            You can view your order status by logging into your ShopCart account.
          </p>
        </div>
      `;

      await sendEmail({
        email: req.user.email,
        subject: `ShopCart Order Confirmation - Rs. ${totalPrice.toLocaleString()}`,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.error('Order confirmation email failed:', emailErr.message);
      // We don't throw an error here because the order was already saved successfully.
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Order.deleteOne({ _id: order._id });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder };
