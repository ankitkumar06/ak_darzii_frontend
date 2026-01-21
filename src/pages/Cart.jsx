import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Cart({ cartItems, onRemove, onUpdateQuantity, onCheckout }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = () => {
    if (!user) {
      alert('Please sign in to proceed with checkout')
      navigate('/signin')
      return
    }
    onCheckout()
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Start adding some products!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div style={{ fontSize: '2rem' }}>{item.emoji}</div>
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">
                Rs {item.price.toFixed(2)} each
              </div>
            </div>
            <div className="quantity-control">
              <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                -
              </button>
              <input
                type="number"
                className="quantity-input"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                min="1"
              />
              <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>
            <div style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
              Rs {(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              className="remove-btn"
              onClick={() => onRemove(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>Rs {total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Rs {(total > 0 ? 10 : 0).toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span>Rs {(total * 0.08).toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>Rs {(total + 10 + (total * 0.08)).toFixed(2)}</span>
        </div>
      </div>

      <button 
        className="checkout-btn" 
        onClick={handleCheckout}
        title={!user ? 'Please sign in to checkout' : ''}
      >
        {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
      </button>
    </div>
  )
}
