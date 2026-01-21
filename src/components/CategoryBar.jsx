import { Link, useLocation } from 'react-router-dom'
import PRODUCTS from '../data/products'

export default function CategoryBar() {
  const location = useLocation()

  // compute unique categories from products
  const cats = Array.from(new Set(PRODUCTS.map(p => p.category))).filter(Boolean)

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home' || location.pathname === '/index' || location.pathname === '/category/all'
    }
    return location.pathname === `/category/${path}`
  }

  return (
    <nav className="category-bar" aria-label="Product categories">
      <Link to="/" className={`category-button ${isActive('/') ? 'active' : ''}`}>
        All
      </Link>

      {cats.map(cat => (
        <Link
          key={cat}
          to={`/category/${cat}`}
          className={`category-button ${isActive(cat) ? 'active' : ''}`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </Link>
      ))}
    </nav>
  )
}
