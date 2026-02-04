import { useState,useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Banner from '../components/Banner'
import axios from 'axios';
import { useAuth } from '../context/AuthContext'

export default function ProductList({ onAddToCart }) {
  const { category } = useParams()
  const { user, addBookmark, removeBookmark, checkBookmark } = useAuth()
  const [products, setProducts] = useState([])
  const [bookmarkedProducts, setBookmarkedProducts] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [productRatings, setProductRatings] = useState({}) // Store ratings by productId
  const [userRatings, setUserRatings] = useState({}) // Store user's ratings by productId
  const [ratingStates, setRatingStates] = useState({}) // Store UI state for rating

  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 20 // products per page

 useEffect(() => {
  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const payload = { page, limit: LIMIT }
      if (category) payload.category = category

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/products/getproduct`,
        payload,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data && response.data.success) {
        setProducts(response.data.data || [])
        // Debug safeguard: log type/value and only call if it's a function
        console.log('DEBUG setTotalPages typeof', typeof setTotalPages, setTotalPages)
        if (typeof setTotalPages === 'function') {
          setTotalPages(response.data.totalPages || 1)
        } else {
          console.warn('setTotalPages is not a function - skipping setTotalPages call', setTotalPages)
        }

        // Fetch ratings for current page products
        (response.data.data || []).forEach(product => {
          fetchProductRatings(product.id)
        })

        // If user is logged in, fetch their ratings
        if (user) {
          fetchUserAllRatings()
        }
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error(error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user, category, page])

// Reset to first page when category changes
useEffect(() => {
  setPage(1)
}, [category])



  // products are fetched from server with optional category filter so we use them directly
  const filtered = products

  const handleBookmarkClick = async (e, product) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please login to bookmark products')
      return
    }

    if (bookmarkedProducts.has(product.id)) {
      const result = await removeBookmark(product.id)
      if (result.success) {
        setBookmarkedProducts(prev => {
          const newSet = new Set(prev)
          newSet.delete(product.id)
          return newSet
        })
      }
    } else {
      const result = await addBookmark(product)
      if (result.success) {
        setBookmarkedProducts(prev => new Set(prev).add(product.id))
      }
    }
  }

  const isBookmarked = (productId) => bookmarkedProducts.has(productId)

  // Fetch ratings for a specific product
  const fetchProductRatings = async (productId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/rating/product/${productId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.success) {
        setProductRatings(prev => ({
          ...prev,
          [productId]: {
            averageRating: response.data.averageRating,
            totalRatings: response.data.totalRatings
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching product ratings:', error);
    }
  };

  // Fetch all user ratings
  const fetchUserAllRatings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/rating/user/all`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.success) {
        const ratingsMap = {};
        response.data.ratings.forEach(r => {
          ratingsMap[r.productId] = r.rating;
        });
        setUserRatings(ratingsMap);
      }
    } catch (error) {
      console.error('Error fetching user ratings:', error);
    }
  };

  // Handle rating click
  const handleRatingClick = async (productId, productName, ratingValue) => {
    if (!user) {
      alert('Please login to rate products');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/rating/add`,
        {
          productId,
          productName,
          rating: ratingValue,
          review: ''
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update user ratings
        setUserRatings(prev => ({
          ...prev,
          [productId]: ratingValue
        }));

        // Refresh product ratings
        fetchProductRatings(productId);

        alert('Rating saved successfully!');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      alert('Failed to save rating');
    }
  };

  // Render star rating component
  const renderStarRating = (productId, productName, isInteractive = true) => {
    const userRating = userRatings[productId];
    const productRating = productRatings[productId];
    const avgRating = productRating?.averageRating || 0;
    const totalRatings = productRating?.totalRatings || 0;

    return (
      <div className="product-rating">
        <div className={`stars-container ${isInteractive ? 'interactive' : ''}`}>
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`star ${star <= (userRating || avgRating) ? 'filled' : ''}`}
              onClick={() => isInteractive && handleRatingClick(productId, productName, star)}
              style={{
                cursor: isInteractive ? 'pointer' : 'default',
                color: star <= (userRating || avgRating) ? '#fbbf24' : '#d1d5db'
              }}
            >
              ★
            </span>
          ))}
        </div>
        <div className="rating-info">
          <span className="average-rating">{avgRating.toFixed(1)}</span>
          <span className="review-count">({totalRatings})</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Banner />
      <div className="products-container">
        {isLoading ? (
          <div className="loading-container">
            <p className="loading-text">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="no-products">
            <p>No products found</p>
          </div>
        ) : (
          <>
            {filtered.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <div className="bookmark-icon">
                    <button
                      className={`bookmark-btn ${isBookmarked(product.id) ? 'bookmarked' : ''}`}
                      onClick={(e) => handleBookmarkClick(e, product)}
                      title={isBookmarked(product.id) ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      {isBookmarked(product.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <Link to={`/product/${product.id}`} className="view-icon">
                    👁️
                  </Link>
                  <Link to={`/product/${product.id}`} className="product-image">
                    {product.emoji}
                  </Link>
                </div>
                <div className="product-info">
                  <Link to={`/product/${product.id}`} className="product-link">
                    <h3 className="product-name">{product.name}</h3>
                  </Link>
                  <p className="product-price">Rs {product.price.toFixed(2)}</p>
                  {renderStarRating(product.id, product.name, true)}
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(product)}
                >
                  Add To Cart
                </button>
              </div>
            ))}

            {/* Pagination controls */}
           
          </>
        )}

      
      </div>
       <div className="pagination" role="navigation" aria-label="Pagination">
              <button className="pagination-prev-next" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>

              <div className="pagination-pages" aria-hidden={false}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                  <button
                    key={pNum}
                    className={`page-btn ${page === pNum ? 'active' : ''}`}
                    onClick={() => setPage(pNum)}
                    aria-current={page === pNum ? 'page' : undefined}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button className="pagination-prev-next" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
            </div>
    </div>
  )
}

