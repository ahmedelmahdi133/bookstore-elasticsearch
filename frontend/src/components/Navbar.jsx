import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (user) {
      loadCartCount()
    }
  }, [user])

  const loadCartCount = async () => {
    try {
      const response = await api.get('/cart/count')
      setCartCount(response.data.count)
    } catch (error) {
      console.error('Error loading cart count:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">📚 Bookstore</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/books">Books</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/books/search">Search</Link>
            </li>
            
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth/signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link position-relative" to="/cart">
                    <i className="bi bi-cart3"></i> Cart
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">My Orders</Link>
                </li>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle"></i> {user.username}
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
