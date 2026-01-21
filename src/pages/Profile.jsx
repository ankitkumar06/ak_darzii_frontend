import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Access Denied</h1>
          <p>Please sign in to view your profile.</p>
          <Link to="/signin">
            <button className="submit-btn">Sign In</button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const primaryAddress = user.addresses?.find(addr => addr.id === user.primaryAddressId)

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="profile-image" />
            ) : (
              <span className="profile-avatar-text">👤</span>
            )}
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            {user.phone && <p>{user.phone}</p>}
          </div>
          <button onClick={handleSignOut} className="signout-btn">
            🚪 Sign Out
          </button>
        </div>

        {/* Profile Actions */}
        <div className="profile-actions">
          <Link to="/edit-profile">
            <button className="action-btn">✏️ Edit Profile</button>
          </Link>
          <Link to="/manage-addresses">
            <button className="action-btn">📍 Manage Addresses</button>
          </Link>
          <Link to="/bookmarks">
            <button className="action-btn">❤️ My Bookmarks</button>
          </Link>
        </div>

        {/* Profile Details */}
        <div className="profile-grid">
          {/* Account Information */}
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{user.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone:</span>
              <span className="value">{user.phone || 'Not provided'}</span>
            </div>
            <div className="info-row">
              <span className="label">Member Since:</span>
              <span className="value">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Primary Address */}
          <div className="profile-section">
            <h2>Primary Shipping Address</h2>
            {primaryAddress ? (
              <div className="address-card primary">
                <div className="address-badge">📍 Primary</div>
                <p className="address-name">{primaryAddress.fullName}</p>
                <p>{primaryAddress.street}</p>
                <p>{primaryAddress.city}, {primaryAddress.state} {primaryAddress.zipCode}</p>
                <p>{primaryAddress.country}</p>
                <p className="phone">📱 {primaryAddress.phone}</p>
              </div>
            ) : (
              <p className="no-data">No primary address set. 
                <Link to="/manage-addresses"> Add one</Link>
              </p>
            )}
          </div>
        </div>

        {/* All Addresses */}
        <div className="profile-section full-width">
          <h2>All Addresses ({user.addresses?.length || 0})</h2>
          {user.addresses && user.addresses.length > 0 ? (
            <div className="addresses-grid">
              {user.addresses.map(address => (
                <div key={address.id} className={`address-card ${address.isDefault ? 'primary' : ''}`}>
                  {address.isDefault && <div className="address-badge">📍 Primary</div>}
                  <p className="address-name">{address.fullName}</p>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  <p>{address.country}</p>
                  <p className="phone">📱 {address.phone}</p>
                  <p className="address-type">Type: <span>{address.type || 'Other'}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No addresses added yet. 
              <Link to="/manage-addresses"> Add your first address</Link>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="profile-footer">
          <button onClick={() => navigate('/')} className="btn-secondary">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
