import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Middleware: check login
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Please login first.");
    return res.redirect("/auth/login");
  }
  next();
};

// Get user orders
router.get("/", requireLogin, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.user.id })
      .populate('items.book')
      .sort({ createdAt: -1 });

    res.render("orders/index", { 
      title: "My Orders", 
      orders 
    });
  } catch (err) {
    console.log("Error fetching orders:", err);
    req.flash("error", "Failed to load orders");
    res.redirect("/");
  }
});

// Get single order
router.get("/:orderId", requireLogin, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.session.user.id
    }).populate('items.book');

    if (!order) {
      req.flash("error", "Order not found");
      return res.redirect("/orders");
    }

    res.render("orders/detail", { 
      title: "Order Details", 
      order 
    });
  } catch (err) {
    console.log("Error fetching order:", err);
    req.flash("error", "Failed to load order details");
    res.redirect("/orders");
  }
});

export default router;
