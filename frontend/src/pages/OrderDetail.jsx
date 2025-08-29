import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

const OrderDetail = () => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const { id } = useParams()

  useEffect(() => {
    loadOrder()
  }, [id])

  const loadOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`)
      setOrder(response.data)
    } catch (error) {
      setMessage('Error loading order details')
      console.error('Error loading order:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (!order) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <i className="bi bi-exclamation-triangle display-1 text-muted"></i>
          <h3 className="text-muted mt-3">Order not found</h3>
          <Link to="/orders" className="btn btn-primary">Back to Orders</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold gradient-text">Order Details</h1>
            <Link to="/orders" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>Back to Orders
            </Link>
          </div>
        </div>
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

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                Order #{order._id.slice(-8)}
                <span className={`badge ${getStatusBadgeClass(order.status)} ms-2`}>
                  {order.status}
                </span>
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted">Ordered on {formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Items</h5>
            </div>
            <div className="card-body">
              {order.items.map((item) => (
                <div key={item.book._id} className="row mb-3 pb-3 border-bottom">
                  <div className="col-md-8">
                    <h6>{item.book.title}</h6>
                    <p className="text-muted">by {item.book.author}</p>
                    <p className="text-muted">Quantity: {item.quantity}</p>
                  </div>
                  <div className="col-md-4 text-end">
                    <p className="mb-0">${item.book.price} each</p>
                    <p className="fw-bold">${(item.book.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Items:</span>
                <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total: ${order.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="mb-0">Shipping Address</h5>
              </div>
              <div className="card-body">
                <p className="mb-1">{order.shippingAddress.street}</p>
                <p className="mb-1">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="mb-0">{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
