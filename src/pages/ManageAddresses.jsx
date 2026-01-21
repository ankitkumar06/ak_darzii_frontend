import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ManageAddresses() {
  const { user, addAddress, updateAddress, deleteAddress, setPrimaryAddress } = useAuth()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    type: 'home'
  })

  if (!user) {
    navigate('/signin')
    return null
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      type: 'home'
    })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.street || 
        !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      setError('All fields are required')
      return false
    }

    const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number')
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (editingId) {
      (async () => {
        const result = await updateAddress(editingId, formData)
        if (result.success) {
          setSuccess('Address updated successfully!')
          setTimeout(resetForm, 1500)
        } else {
          setError(result.message)
        }
      })()
    } else {
      (async () => {
        const result = await addAddress(formData)
        if (result.success) {
          setSuccess('Address added successfully!')
          setTimeout(resetForm, 1500)
        } else {
          setError(result.message)
        }
      })()
    }
  }

  const handleEdit = (address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      type: address.type || 'home'
    })
    setEditingId(address.id)
    setShowForm(true)
    setError('')
  }

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      (async () => {
        const result = await deleteAddress(addressId)
        if (result.success) {
          setSuccess('Address deleted successfully!')
          setTimeout(() => setSuccess(''), 1500)
        } else {
          setError(result.message)
        }
      })()
    }
  }

  const handleSetPrimary = (addressId) => {
    (async () => {
      const result = await setPrimaryAddress(addressId)
      if (result.success) {
        setSuccess('Primary address updated!')
        setTimeout(() => setSuccess(''), 1500)
      } else {
        setError(result.message)
      }
    })()
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <h1>Manage Shipping Addresses</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Add Address Button */}
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="add-address-btn">
            ➕ Add New Address
          </button>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="address-form-section">
            <h2>{editingId ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
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
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Zip code"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="type">Address Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  {editingId ? 'Update Address' : 'Add Address'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        <div className="addresses-section">
          <h2>Your Addresses ({user.addresses?.length || 0})</h2>
          {user.addresses && user.addresses.length > 0 ? (
            <div className="addresses-list">
              {user.addresses.map(address => (
                <div
                  key={address.id}
                  className={`address-item ${address.isDefault ? 'is-primary' : ''}`}
                >
                  <div className="address-content">
                    <div className="address-header">
                      <h3>{address.fullName}</h3>
                      {address.isDefault && <span className="badge-primary">📍 Primary</span>}
                      <span className="badge-type">{address.type}</span>
                    </div>
                    <p className="address-line">{address.street}</p>
                    <p className="address-line">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="address-line">{address.country}</p>
                    <p className="address-phone">📱 {address.phone}</p>
                  </div>

                  <div className="address-actions">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetPrimary(address.id)}
                        className="btn-action btn-primary"
                        title="Set as primary address"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="btn-action btn-edit"
                      title="Edit address"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="btn-action btn-delete"
                      title="Delete address"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No addresses added yet.</p>
          )}
        </div>

        {/* Back Button */}
        <div className="profile-footer">
          <button onClick={() => navigate('/profile')} className="btn-secondary">
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  )
}
