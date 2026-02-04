import React, { Suspense, lazy } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Header from '../components/Header'
import CategoryBar from '../components/CategoryBar'

const ProductList = lazy(() => import('../pages/ProductList'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const SearchResults = lazy(() => import('../pages/SearchResults'))
const Cart = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const NotFound = lazy(() => import('../pages/NotFound'))
const SignIn = lazy(() => import('../pages/SignIn'))
const SignUp = lazy(() => import('../pages/SignUp'))
const Profile = lazy(() => import('../pages/Profile'))
const EditProfile = lazy(() => import('../pages/EditProfile'))
const ManageAddresses = lazy(() => import('../pages/ManageAddresses'))
const Bookmarks = lazy(() => import('../pages/Bookmarks'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))
const Orders = lazy(() => import('../pages/Orders'))

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
        <Suspense fallback={<div className="loading">Loading...</div>}>
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
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/orders" element={<Orders />} />
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
        </Suspense>
      </main>
        {/* </Routes>
      </main> */}
    </div>
  )
}
export default AppContent