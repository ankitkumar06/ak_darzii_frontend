import { Link, useLocation } from 'react-router-dom'
import SearchBar from './SearchBar'
import { useAuth } from '../context/AuthContext'

export default function Header({ cartCount, onNavigate }) {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const isHomeActive = () => {
    return location.pathname === '/' || location.pathname === '/home' || location.pathname === '/index'
  }

  const isActive = (path) => location.pathname === path

  const handleSignOut = () => {
    signOut()
  }

  return (
    <header>
      <div className="header-container">
        <Link to="/" className="logo">
          {/* 🛒 EStore */}
          <img src="../src/images/logo2.png" alt="ak-darzii" className="logo-image" />
        </Link>
        <SearchBar />
        <div className="nav-buttons">
          <Link to="/">
            <button className={isHomeActive() ? 'active' : ''}>
              Home
            </button>
          </Link>

          {/* <Link to="/category/electronics">
            <button className={location.pathname === '/category/electronics' ? 'active' : ''}>
              Electronics
            </button>
          </Link>

          <Link to="/category/clothes">
            <button className={location.pathname === '/category/clothes' ? 'active' : ''}>
              Clothes
            </button>
          </Link>

          <Link to="/category/accessories">
            <button className={location.pathname === '/category/accessories' ? 'active' : ''}>
              Accessories
            </button>
          </Link> */}

          <Link to="/cart">
            <button className={`cart-button ${isActive('/cart') ? 'active' : ''}`}>
              🛒 Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </Link>

          {user ? (
            <Link to="/profile">
              <button className={isActive('/profile') ? 'active' : ''}>
                My Profile
              </button>
            </Link>
          ) : (
            <Link to="/signin">
              <button className={isActive('/signin') ? 'active' : ''}>
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

