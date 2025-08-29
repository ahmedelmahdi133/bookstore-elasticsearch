import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="display-4 fw-bold gradient-text mb-4">
                  Welcome to Your 
                  <span className="d-block">Modern Bookstore</span>
                </h1>
                <p className="lead text-muted mb-4 fs-5">
                  Discover thousands of books, from timeless classics to modern bestsellers. 
                  Your next great read is just a click away.
                </p>
                <div className="hero-buttons d-flex flex-wrap gap-3">
                  <Link to="/books" className="btn btn-primary btn-lg px-4 py-3">
                    <i className="bi bi-book me-2"></i>Browse Books
                  </Link>
                  {!user ? (
                    <Link to="/auth/signup" className="btn btn-outline-secondary btn-lg px-4 py-3">
                      <i className="bi bi-person-plus me-2"></i>Join Now
                    </Link>
                  ) : (
                    <Link to="/cart" className="btn btn-success btn-lg px-4 py-3">
                      <i className="bi bi-cart3 me-2"></i>My Cart
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image text-center">
                <div className="floating-books">
                  <div className="book-stack">
                    <div className="book book-1">📖</div>
                    <div className="book book-2">📚</div>
                    <div className="book book-3">📗</div>
                    <div className="book book-4">📘</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container my-5">
        <div className="row text-center mb-5">
          <div className="col-12">
            <h2 className="fw-bold gradient-text mb-3">Why Choose Our Bookstore?</h2>
            <p className="text-muted">Everything you need for the perfect reading experience</p>
          </div>
        </div>
        
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card card h-100 text-center p-4">
              <div className="feature-icon mb-3">
                <i className="bi bi-search display-4 text-primary"></i>
              </div>
              <h5 className="fw-bold">Smart Search</h5>
              <p className="text-muted">Find any book instantly with our advanced search powered by Elasticsearch</p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="feature-card card h-100 text-center p-4">
              <div className="feature-icon mb-3">
                <i className="bi bi-cart-check display-4 text-success"></i>
              </div>
              <h5 className="fw-bold">Easy Shopping</h5>
              <p className="text-muted">Simple cart management and secure checkout with Stripe payment processing</p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="feature-card card h-100 text-center p-4">
              <div className="feature-icon mb-3">
                <i className="bi bi-truck display-4 text-info"></i>
              </div>
              <h5 className="fw-bold">Fast Delivery</h5>
              <p className="text-muted">Quick and reliable delivery to your doorstep with order tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section py-5 mt-5">
        <div className="container">
          <div className="row text-center text-white">
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h3 className="display-6 fw-bold">1000+</h3>
                <p className="mb-0">Books Available</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h3 className="display-6 fw-bold">500+</h3>
                <p className="mb-0">Happy Customers</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h3 className="display-6 fw-bold">50+</h3>
                <p className="mb-0">Genres</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h3 className="display-6 fw-bold">24/7</h3>
                <p className="mb-0">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
