import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Checkout = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  })

  const navigate = useNavigate()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const response = await api.get('/cart')
      setCart(response.data)
      if (!response.data.items || response.data.items.length === 0) {
        navigate('/cart')
      }
    } catch (error) {
      setMessage('Error loading cart')
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setMessage('')

    try {
      const response = await api.post('/payment/create-payment-intent', {
        shippingAddress: shippingInfo
      })
      
      // In a real implementation, you would integrate with Stripe here
      // For now, we'll simulate a successful payment
      setTimeout(() => {
        navigate('/payment/confirmation')
      }, 2000)
      
    } catch (error) {
      setMessage('Error processing payment')
      console.error('Error processing payment:', error)
      setProcessing(false)
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
        <h1 className="fw-bold gradient-text">Checkout</h1>
        <p className="text-muted">Complete your order</p>
      </div>

      {message && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Shipping Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label htmlFor="street" className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      name="street"
                      value={shippingInfo.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select
                      className="form-control"
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Payment Information</h5>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Payment processing with Stripe integration would be implemented here.
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                {cart?.items?.map((item) => (
                  <div key={item.book._id} className="d-flex justify-content-between mb-2">
                    <span>{item.book.title} x{item.quantity}</span>
                    <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total: ${cart?.total?.toFixed(2)}</strong>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-success w-100"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card me-2"></i>Complete Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout
