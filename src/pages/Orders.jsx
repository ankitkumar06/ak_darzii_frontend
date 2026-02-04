import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../utils/toast'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/user`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = await res.json()

        if (!res.ok) {
          toast.error(data.message || 'Failed to fetch orders')
          setLoading(false)
          return
        }

        setOrders(data.orders || [])
      } catch (err) {
        console.error('Fetch orders error:', err)
        toast.error('Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Access Denied</h1>
          <p>Please sign in to view your orders.</p>
          <button className="submit-btn" onClick={() => navigate('/signin')}>Sign In</button>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : orders.length === 0 ? (
        <p className="no-data">You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>Order ID: <strong>{order._id}</strong></div>
                <div>{new Date(order.createdAt).toLocaleString()}</div>
                <div>Status: <strong>{order.status}</strong></div>
              </div>
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="item-name">{item.name}</div>
                    <div className="item-qty">Qty: {item.quantity}</div>
                    <div className="item-price">₹{item.price}</div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div>Subtotal: ₹{order.subtotal}</div>
                <div>Shipping: ₹{order.shipping || 0}</div>
                <div>Total: <strong>₹{order.total}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
