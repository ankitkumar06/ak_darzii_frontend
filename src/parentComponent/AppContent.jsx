import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Header from '../components/Header'
import CategoryBar from '../components/CategoryBar'
import ProductList from '../pages/ProductList'
import ProductDetail from '../pages/ProductDetail'
import SearchResults from '../pages/SearchResults'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import NotFound from '../pages/NotFound'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Profile from '../pages/Profile'
import EditProfile from '../pages/EditProfile'
import ManageAddresses from '../pages/ManageAddresses'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'

const AppContent = ({ cart, setCart }) => {
  const navigate = useNavigate()

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const handleNavigate = (page) => {
    navigate(page === 'home' ? '/' : `/${page}`)
  }

  return (
    <div className="app">
      <Header
        cartCount={cart.length}
        onNavigate={handleNavigate}
      />
      <CategoryBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProductList onAddToCart={addToCart} />} />
          <Route path="/home" element={<ProductList onAddToCart={addToCart} />} />
          <Route path="/index" element={<ProductList onAddToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
          <Route path="/category/:category" element={<ProductList onAddToCart={addToCart} />} />
          <Route path="/search" element={<SearchResults onAddToCart={addToCart} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/manage-addresses" element={<ManageAddresses />} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cart}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onCheckout={() => navigate('/checkout')}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cartItems={cart}
                onClearCart={clearCart}
                onBackHome={() => {
                  navigate('/')
                  clearCart()
                }}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
        {/* </Routes>
      </main> */}
    </div>
  )
}
export default AppContent