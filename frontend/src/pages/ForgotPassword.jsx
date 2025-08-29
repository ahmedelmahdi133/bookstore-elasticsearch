import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const { forgotPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await forgotPassword(email)
    
    setMessage(result.message)
    setMessageType(result.success ? 'success' : 'danger')
    setLoading(false)
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4 gradient-text">Forgot Password</h2>
              
              <p className="text-muted text-center mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {message && (
                <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
                  {message}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setMessage('')}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="text-center">
                <Link to="/auth/login" className="text-decoration-none">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
