import { useSearchParams, Link } from 'react-router-dom'
import PRODUCTS from '../data/products'

export default function SearchResults({ onAddToCart }) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const searchResults = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="search-results-container">
      <h2>Search Results for "{query}"</h2>
      {searchResults.length === 0 ? (
        <div className="no-results">
          <p>No products found matching your search.</p>
          <Link to="/">
            <button className="back-to-products-btn">Back to All Products</button>
          </Link>
        </div>
      ) : (
        <>
          <p className="results-count">Found {searchResults.length} product(s)</p>
          <div className="products-container">
            {searchResults.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-link">
                  <div className="product-image">{product.emoji}</div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">Rs {product.price.toFixed(2)}</p>
                  </div>
                </Link>
                <button
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
