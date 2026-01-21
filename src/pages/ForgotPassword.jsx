import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(
        // 'http://localhost:5000/auth/forgot-password',
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        { email }
      )

      if (response.data.success) {
        setSuccess(response.data.message)
        setEmail('')
        setTimeout(() => {
          navigate('/signin')
        }, 3000)
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to send reset link. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Forgot Password?</h1>
        <p className="subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Enter your email"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password? <Link to="/signin">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
