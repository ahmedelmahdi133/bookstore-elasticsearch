import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const response = await api.get('/cart')
      setCart(response.data)
    } catch (error) {
      setMessage('Error loading cart')
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (bookId, quantity) => {
    try {
      await api.put('/cart/update', { bookId, quantity })
      loadCart()
    } catch (error) {
      setMessage('Error updating cart')
      console.error('Error updating cart:', error)
    }
  }

  const removeFromCart = async (bookId) => {
    try {
      await api.delete(`/cart/remove/${bookId}`)
      loadCart()
    } catch (error) {
      setMessage('Error removing item from cart')
      console.error('Error removing from cart:', error)
    }
  }

  if (loading) {
    return (
      <div className="container my-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="page-header text-center">
        <h1 className="fw-bold gradient-text">Shopping Cart</h1>
        <p className="text-muted">Review your selected books</p>
      </div>

      {message && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      {cart && cart.items && cart.items.length > 0 ? (
        <div className="row">
          <div className="col-lg-8">
            {cart.items.map((item) => (
              <div key={item.book._id} className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5 className="card-title">{item.book.title}</h5>
                      <p className="text-muted">by {item.book.author}</p>
                      <p className="card-text">{item.book.description}</p>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="mb-2">
                        <span className="price-tag">${item.book.price}</span>
                      </div>
                      <div className="input-group mb-2" style={{ width: '120px', marginLeft: 'auto' }}>
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className="form-control text-center" 
                          value={item.quantity}
                          readOnly
                        />
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.book._id)}
                      >
                        <i className="bi bi-trash"></i> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${cart.total?.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total Items:</span>
                  <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total: ${cart.total?.toFixed(2)}</strong>
                </div>
                <Link to="/checkout" className="btn btn-success w-100">
                  <i className="bi bi-credit-card me-2"></i>Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-cart-x display-1 text-muted"></i>
          <h3 className="text-muted mt-3">Your cart is empty</h3>
          <p className="text-muted">Start shopping to add items to your cart.</p>
          <Link to="/books" className="btn btn-primary">
            <i className="bi bi-book me-2"></i>Browse Books
          </Link>
        </div>
      )}
    </div>
  )
}

export default Cart
