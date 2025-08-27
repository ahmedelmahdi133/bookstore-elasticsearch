import express from "express";
import Cart from "../models/Cart.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";
import stripe from "../config/stripe.js";

const router = express.Router();

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Please login first.");
    return res.redirect("/auth/login");
  }
  next();
};

router.get("/", requireLogin, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user.id })
      .populate('items.book');
    
    if (!cart) {
      return res.render("cart/index", { 
        title: "Shopping Cart", 
        cart: { items: [], totalAmount: 0, totalItems: 0 }
      });
    }

    res.render("cart/index", { 
      title: "Shopping Cart", 
      cart 
    });
  } catch (err) {
    console.log("Error fetching cart:", err);
    req.flash("error", "Failed to load cart");
    res.redirect("/books");
  }
});

router.post("/add", requireLogin, async (req, res) => {
  try {
    console.log("Add to cart request body:", req.body);
    console.log("Content-Type:", req.headers['content-type']);
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    const { bookId, quantity = 1 } = req.body;
    
    if (!bookId) {
      return res.status(400).json({ error: "Book ID is required" });
    }

    // Get book details
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check stock
    if (book.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.session.user.id });
    if (!cart) {
      cart = new Cart({ user: req.session.user.id, items: [] });
    }

    // Add item to cart
    await cart.addItem(bookId, parseInt(quantity), book.price);

    console.log("Item added to cart successfully");
    res.json({ 
      success: true, 
      message: "Item added to cart",
      cartItems: cart.totalItems,
      cartTotal: cart.totalAmount
    });
  } catch (err) {
    console.log("Error adding to cart:", err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Update cart item quantity
router.put("/update", requireLogin, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.session.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await cart.updateQuantity(bookId, parseInt(quantity));

    res.json({ 
      success: true, 
      message: "Cart updated",
      cartItems: cart.totalItems,
      cartTotal: cart.totalAmount
    });
  } catch (err) {
    console.log("Error updating cart:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// Remove item from cart
router.delete("/remove/:bookId", requireLogin, async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const cart = await Cart.findOne({ user: req.session.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await cart.removeItem(bookId);

    res.json({ 
      success: true, 
      message: "Item removed from cart",
      cartItems: cart.totalItems,
      cartTotal: cart.totalAmount
    });
  } catch (err) {
    console.log("Error removing from cart:", err);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

// Clear cart
router.delete("/clear", requireLogin, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user.id });
    if (cart) {
      await cart.clearCart();
    }

    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.log("Error clearing cart:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// Get cart count (for navbar)
router.get("/count", requireLogin, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user.id });
    const count = cart ? cart.totalItems : 0;
    
    res.json({ count });
  } catch (err) {
    console.log("Error getting cart count:", err);
    res.json({ count: 0 });
  }
});

export default router;
