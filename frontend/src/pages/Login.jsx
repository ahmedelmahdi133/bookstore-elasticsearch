import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      setMessage(result.message)
      setMessageType('success')
      setTimeout(() => navigate('/'), 1500)
    } else {
      setMessage(result.message)
      setMessageType('danger')
    }
    
    setLoading(false)
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4 gradient-text">Login</h2>
              
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
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <div className="text-center">
                <Link to="/auth/forgot-password" className="text-decoration-none">
                  Forgot your password?
                </Link>
              </div>

              <hr />
              
              <div className="text-center">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/auth/signup" className="text-decoration-none">
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
