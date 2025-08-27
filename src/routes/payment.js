import express from "express";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import stripe from "../config/stripe.js";
import emailService from "../services/emailService.js";

const router = express.Router();

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Please login first.");
    return res.redirect("/auth/login");
  }
  next();
};

router.get("/checkout", requireLogin, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe || !process.env.STRIPE_PUBLISHABLE_KEY) {
      req.flash("error", "Payment system is not configured. Please contact support.");
      return res.redirect("/cart");
    }

    const cart = await Cart.findOne({ user: req.session.user.id })
      .populate('items.book');
    
    if (!cart || cart.items.length === 0) {
      req.flash("error", "Your cart is empty");
      return res.redirect("/cart");
    }

    res.render("payment/checkout", { 
      title: "Checkout", 
      cart,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (err) {
    console.log("Error loading checkout:", err);
    req.flash("error", "Failed to load checkout");
    res.redirect("/cart");
  }
});

router.post("/create-payment-intent", requireLogin, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(500).json({ error: "Payment system not configured" });
    }

    const cart = await Cart.findOne({ user: req.session.user.id })
      .populate('items.book');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Verify stock availability
    for (const item of cart.items) {
      if (item.book.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.book.title}` 
        });
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cart.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: req.session.user.id,
        cartId: cart._id.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: cart.totalAmount
    });
  } catch (err) {
    console.log("Error creating payment intent:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

router.post("/success", requireLogin, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(500).json({ error: "Payment system not configured" });
    }

    const { paymentIntentId, shippingAddress } = req.body;
    
    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: "Payment not completed" });
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.session.user.id })
      .populate('items.book');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Create order
    const orderItems = cart.items.map(item => ({
      book: item.book._id,
      title: item.book.title,
      author: item.book.author,
      price: item.price,
      quantity: item.quantity
    }));

    const order = new Order({
      user: req.session.user.id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      status: 'paid',
      paymentInfo: {
        stripePaymentIntentId: paymentIntentId,
        paymentMethod: paymentIntent.payment_method_types[0],
        paidAt: new Date()
      },
      shippingAddress
    });

    await order.save();

    // Update book stock
    for (const item of cart.items) {
      await Book.findByIdAndUpdate(
        item.book._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Get user details for email
    const user = await User.findById(req.session.user.id);
    
    // Send order confirmation email
    if (user && user.email) {
      try {
        const orderDetails = {
          orderNumber: order.orderNumber,
          items: order.items,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress
        };
        
        await emailService.sendOrderConfirmationEmail(user.email, user.username, orderDetails);
        console.log("Order confirmation sent");
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }
    }

    // Clear cart
    await cart.clearCart();

    res.json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber
    });
  } catch (err) {
    console.log("Error processing payment:", err);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

router.get("/confirmation/:orderId", requireLogin, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.session.user.id
    }).populate('items.book');

    if (!order) {
      req.flash("error", "Order not found");
      return res.redirect("/orders");
    }

    res.render("payment/confirmation", { 
      title: "Order Confirmation", 
      order 
    });
  } catch (err) {
    console.log("Error loading confirmation:", err);
    req.flash("error", "Failed to load order details");
    res.redirect("/orders");
  }
});

// Webhook for Stripe events
router.post("/webhook", express.raw({type: 'application/json'}), async (req, res) => {
  // Check if Stripe is configured
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('Webhook received but Stripe not configured');
    return res.status(400).send('Stripe not configured');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update order status if needed
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

export default router;
