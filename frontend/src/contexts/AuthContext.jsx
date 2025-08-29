import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
      
      return { success: true, message: response.data.message }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      return { success: false, message }
    }
  }

  const signup = async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', { username, email, password })
      return { success: true, message: response.data.message }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed'
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return { success: true, message: response.data.message }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send password reset email'
      return { success: false, message }
    }
  }

  const resetPassword = async (token, password, confirmPassword) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { 
        password, 
        confirmPassword 
      })
      return { success: true, message: response.data.message }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password'
      return { success: false, message }
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
