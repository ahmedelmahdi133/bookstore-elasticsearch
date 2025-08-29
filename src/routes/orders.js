import express from "express";
import Order from "../models/Order.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const requireLogin = auth();

// Get user orders
router.get("/", requireLogin, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.book')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.log("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

// Get single order
router.get("/:orderId", requireLogin, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.userId
    }).populate('items.book');

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.log("Error fetching order:", err);
    res.status(500).json({ error: "Failed to load order details" });
  }
});

export default router;
