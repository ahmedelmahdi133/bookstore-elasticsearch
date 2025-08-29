import React, { useState, useEffect } from 'react'
import api from '../services/api'

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      const response = await api.get('/books')
      setBooks(response.data)
    } catch (error) {
      setMessage('Error loading books')
      console.error('Error loading books:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (bookId) => {
    try {
      await api.post('/cart/add', { bookId, quantity: 1 })
      setMessage('Book added to cart successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error adding book to cart')
      console.error('Error adding to cart:', error)
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
        <h1 className="fw-bold gradient-text">All Books</h1>
        <p className="text-muted">Discover our complete collection</p>
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

      <div className="row g-4">
        {books.map((book) => (
          <div key={book._id} className="col-md-6 col-lg-4">
            <div className="card book-card h-100">
              {book.imageUrl && (
                <img 
                  src={book.imageUrl} 
                  className="card-img-top" 
                  alt={book.title}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{book.title}</h5>
                <p className="text-muted">by {book.author}</p>
                <p className="card-text flex-grow-1">{book.description}</p>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="price-tag">${book.price}</span>
                    <button 
                      className="btn btn-primary"
                      onClick={() => addToCart(book._id)}
                    >
                      <i className="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-book display-1 text-muted"></i>
          <h3 className="text-muted mt-3">No books found</h3>
          <p className="text-muted">Check back later for new additions to our collection.</p>
        </div>
      )}
    </div>
  )
}

export default Books
