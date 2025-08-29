import React, { useState } from 'react'
import api from '../services/api'

const BookSearch = () => {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`)
      setBooks(response.data)
      setMessage('')
    } catch (error) {
      setMessage('Error searching books')
      console.error('Error searching books:', error)
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

  return (
    <div className="container my-5">
      <div className="page-header text-center">
        <h1 className="fw-bold gradient-text">Search Books</h1>
        <p className="text-muted">Find your next great read</p>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card search-card">
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for books by title, author, or description..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button 
                    className="btn btn-primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <i className="bi bi-search"></i>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
        {books.map((book, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card book-card h-100">
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

      {books.length === 0 && query && !loading && (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h3 className="text-muted mt-3">No books found</h3>
          <p className="text-muted">Try searching with different keywords.</p>
        </div>
      )}
    </div>
  )
}

export default BookSearch
