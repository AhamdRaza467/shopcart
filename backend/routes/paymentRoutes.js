const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

// Initialize Stripe with the secret key from .env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/stripe/create-checkout-session
// @access  Public
router.post('/stripe/create-checkout-session', async (req, res) => {
  try {
    const { orderItems, shippingFee } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Transform cart items into Stripe's line_items format
    const line_items = orderItems.map((item) => ({
      price_data: {
        currency: 'pkr',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(shippingFee * 100), currency: 'pkr' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify Stripe Session
// @route   GET /api/payment/stripe/verify-session/:sessionId
// @access  Public
router.get('/stripe/verify-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    if (session.payment_status === 'paid') {
      res.json({ success: true, session });
    } else {
      res.json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
