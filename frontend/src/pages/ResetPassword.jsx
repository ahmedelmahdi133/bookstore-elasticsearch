import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const { token } = useParams()
  const { resetPassword } = useAuth()
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

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('danger')
      setLoading(false)
      return
    }

    const result = await resetPassword(token, formData.password, formData.confirmPassword)
    
    if (result.success) {
      setMessage(result.message)
      setMessageType('success')
      setTimeout(() => navigate('/auth/login'), 2000)
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
              <h2 className="card-title text-center mb-4 gradient-text">Reset Password</h2>
              
              <p className="text-muted text-center mb-4">
                Enter your new password below.
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
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">New Password</label>
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

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
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

export default ResetPassword
