import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  next();
});

// Instance method to add item to cart
cartSchema.methods.addItem = function(bookId, quantity, price) {
  const existingItemIndex = this.items.findIndex(item => 
    item.book.toString() === bookId.toString()
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      book: bookId,
      quantity: quantity,
      price: price
    });
  }
  
  return this.save();
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = function(bookId) {
  this.items = this.items.filter(item => 
    item.book.toString() !== bookId.toString()
  );
  return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateQuantity = function(bookId, quantity) {
  const item = this.items.find(item => 
    item.book.toString() === bookId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(bookId);
    }
    item.quantity = quantity;
    return this.save();
  }
  
  throw new Error('Item not found in cart');
};

// Instance method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
