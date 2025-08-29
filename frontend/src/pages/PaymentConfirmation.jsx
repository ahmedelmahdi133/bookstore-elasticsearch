import React from 'react'
import { Link } from 'react-router-dom'

const PaymentConfirmation = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card text-center">
            <div className="card-body p-5">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              
              <h1 className="card-title fw-bold gradient-text mb-3">
                Payment Successful!
              </h1>
              
              <p className="card-text text-muted mb-4">
                Thank you for your order. Your payment has been processed successfully 
                and your books will be shipped to your address soon.
              </p>
              
              <div className="alert alert-success mb-4">
                <strong>What's next?</strong>
                <ul className="list-unstyled mb-0 mt-2">
                  <li>✓ You'll receive an email confirmation shortly</li>
                  <li>✓ Track your order in the "My Orders" section</li>
                  <li>✓ Your books will be shipped within 2-3 business days</li>
                </ul>
              </div>
              
              <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                <Link to="/orders" className="btn btn-primary">
                  <i className="bi bi-bag-check me-2"></i>View My Orders
                </Link>
                <Link to="/books" className="btn btn-outline-secondary">
                  <i className="bi bi-book me-2"></i>Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-12 text-center">
          <h3 className="fw-bold gradient-text mb-4">Need Help?</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-headset display-6 text-primary mb-3"></i>
                  <h5>Customer Support</h5>
                  <p className="text-muted">Get help with your order</p>
                  <button className="btn btn-outline-primary">Contact Support</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-truck display-6 text-info mb-3"></i>
                  <h5>Shipping Info</h5>
                  <p className="text-muted">Track your delivery</p>
                  <button className="btn btn-outline-info">Track Order</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-arrow-return-left display-6 text-warning mb-3"></i>
                  <h5>Returns</h5>
                  <p className="text-muted">Easy 30-day returns</p>
                  <button className="btn btn-outline-warning">Return Policy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentConfirmation
