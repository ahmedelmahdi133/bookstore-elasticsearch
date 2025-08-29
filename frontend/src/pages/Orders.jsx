import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders')
      setOrders(response.data)
    } catch (error) {
      setMessage('Error loading orders')
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-success'
      case 'pending': return 'bg-warning'
      case 'cancelled': return 'bg-danger'
      default: return 'bg-secondary'
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
        <h1 className="fw-bold gradient-text">My Orders</h1>
        <p className="text-muted">Track your order history</p>
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

      {orders.length > 0 ? (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5 className="card-title">
                        Order #{order._id.slice(-8)}
                        <span className={`badge ${getStatusBadgeClass(order.status)} ms-2`}>
                          {order.status}
                        </span>
                      </h5>
                      <p className="text-muted">Ordered on {formatDate(order.createdAt)}</p>
                      <p className="card-text">
                        {order.items.length} item(s) • Total: ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="col-md-4 text-end">
                      <Link 
                        to={`/orders/${order._id}`} 
                        className="btn btn-outline-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-bag-x display-1 text-muted"></i>
          <h3 className="text-muted mt-3">No orders found</h3>
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/books" className="btn btn-primary">
            <i className="bi bi-book me-2"></i>Start Shopping
          </Link>
        </div>
      )}
    </div>
  )
}

export default Orders
