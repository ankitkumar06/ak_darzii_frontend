import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Checkout({ cartItems, onClearCart, onBackHome }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: ''
  })
  const [orderPlaced, setOrderPlaced] = useState(false)

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 10
  const tax = total * 0.08
  const finalTotal = total + shipping + tax

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFillPrimaryAddress = () => {
    if (!user || !user.addresses || user.addresses.length === 0) {
      alert('No addresses found. Please add an address in your profile first.')
      return
    }

    const primaryAddress = user.addresses.find(addr => addr.id === user.primaryAddressId) || user.addresses[0]
    
    const [firstName, ...lastNameParts] = primaryAddress.fullName.split(' ')
    const lastName = lastNameParts.join(' ') || 'User'

    setFormData(prev => ({
      ...prev,
      firstName: firstName || '',
      lastName: lastName,
      email: user.email,
      address: primaryAddress.street,
      city: primaryAddress.city,
      zipCode: primaryAddress.zipCode
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.cardNumber) {
      alert('Please fill all required fields')
      return
    }

    // Build order payload
    const payload = {
      items: cartItems.map(item => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      subtotal: total,
      shipping,
      tax,
      total: finalTotal,
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed to place order')
        return
      }

      // Clear cart and show success
      onClearCart()
      setOrderPlaced(true)
    } catch (err) {
      console.error('Place order error:', err)
      alert('Failed to place order')
    }
  }

  if (orderPlaced) {
    return ( 
      <div className="checkout-container">
        <div className="success-message">
          ✓ Order placed successfully!
        </div>
        <h2>Thank You for Your Purchase!</h2>
        <p>Your order has been confirmed and will be shipped soon.</p>
        <div className="order-summary" style={{ marginTop: '20px' }}>
          <h3>Order Details:</h3>
          {cartItems.map(item => (
            <div key={item.id} className="order-item">
              <span>{item.name} x {item.quantity}</span>
              <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-total">
            Total: Rs {finalTotal.toFixed(2)}
          </div>
        </div>
        <button className="continue-shopping-btn" onClick={onBackHome}>
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="order-summary">
        <h3>Order Summary:</h3>
        {cartItems.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name} x {item.quantity}</span>
            <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-row" style={{ marginTop: '10px' }}>
          <span>Subtotal:</span>
          <span>Rs {total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Rs {shipping.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span>Rs {tax.toFixed(2)}</span>
        </div>
        <div className="order-total">
          Total: Rs {finalTotal.toFixed(2)}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="shipping-header">
          <h3>Shipping Information</h3>
          {user && user.addresses && user.addresses.length > 0 && (
            <button 
              type="button" 
              onClick={handleFillPrimaryAddress} 
              className="fill-address-btn"
            >
              📍 Use Primary Address
            </button>
          )}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>ZIP Code *</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h3>Payment Information</h3>
        <div className="form-group">
          <label>Card Number *</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
            />
          </div>
        </div>

        <button type="submit" className="place-order-btn">
          Place Order
        </button>
        <button type="button" className="back-btn" onClick={onBackHome}>
          Cancel
        </button>
      </form>
    </div>
  )
}
