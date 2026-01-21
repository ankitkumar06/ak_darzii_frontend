import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function EditProfile() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || null
  })
  const [preview, setPreview] = useState(user?.profileImage || null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) {
    navigate('/signin')
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, PNG, GIF, or WebP)')
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB')
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }))
        setPreview(reader.result)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null
    }))
    setPreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email) {
      setError('Name and email are required')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    const result = updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      profileImage: formData.profileImage
    })
    setLoading(false)

    if (result.success) {
      setSuccess(result.message)
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Profile Image Upload */}
          <div className="image-upload-section">
            <div className="image-preview-container">
              {preview ? (
                <img src={preview} alt="Profile Preview" className="profile-preview" />
              ) : (
                <div className="profile-preview-empty">📷</div>
              )}
            </div>
            <div className="image-upload-controls">
              <label htmlFor="profileImage" className="upload-label">
                Choose Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-btn"
                >
                  Remove Image
                </button>
              )}
              <p className="image-hint">JPG, PNG, GIF or WebP • Max 2MB</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
