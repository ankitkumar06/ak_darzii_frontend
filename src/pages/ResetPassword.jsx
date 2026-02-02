import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const navigate = useNavigate()
  const { token } = useParams()

  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/verify-reset-token/${token}`
        )
        setTokenValid(response.data.success)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'This reset link is invalid or has expired.'
        )
        setTokenValid(false)
      } finally {
        setValidating(false)
      }
    }

    if (token) {
      verifyToken()
    } else {
      setError('Reset token is missing')
      setValidating(false)
    }
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('All fields are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password/${token}`,
        {
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }
      )

      if (response.data.success) {
        setSuccess(response.data.message)
        setFormData({
          password: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          navigate('/signin')
        }, 3000)
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to reset password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Verifying...</h1>
          <p>Checking your reset link...</p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Reset Link Invalid</h1>
          {error && <div className="error-message">{error}</div>}
          <div className="auth-footer">
            <p>
              <Link to="/forgot-password">Request a new reset link</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Reset Password</h1>
        <p className="subtitle">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Resetting...' : 'Reset Password'}
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
