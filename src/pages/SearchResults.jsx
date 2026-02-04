import { useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function SearchResults({ onAddToCart }) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 20

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true)
      try {
        const payload = { search: query, page, limit: LIMIT }
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products/getproduct`, payload)
        if (res.data && res.data.success) {
          setProducts(res.data.data || [])
          setTotalPages(res.data.totalPages || 1)
        } else {
          setProducts([])
        }
      } catch (err) {
        console.error(err)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page])

  useEffect(() => {
    setPage(1)
  }, [query])

  return (
    <div className="search-results-container">
      <h2>Search Results for "{query}"</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <div className="no-results">
          <p>No products found matching your search.</p>
          <Link to="/">
            <button className="back-to-products-btn">Back to All Products</button>
          </Link>
        </div>
      ) : (
        <>
          <p className="results-count">Found {products.length} product(s) on this page</p>
          <div className="products-container">
            {products.map(product => (
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

          {/* Pagination */}
          <div className="pagination" role="navigation" aria-label="Pagination">
            <button className="pagination-prev-next" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>

            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                <button key={pNum} className={`page-btn ${page === pNum ? 'active' : ''}`} onClick={() => setPage(pNum)} aria-current={page === pNum ? 'page' : undefined}>{pNum}</button>
              ))}
            </div>

            <button className="pagination-prev-next" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </>
      )}
    </div>
  )
}
