import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Bookmarks() {
  const { user, getBookmarks, removeBookmark } = useAuth()
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Access Denied</h1>
          <p>Please sign in to view your bookmarks.</p>
          <Link to="/signin">
            <button className="submit-btn">Sign In</button>
          </Link>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true)
      const result = await getBookmarks()
      if (result.success) {
        setBookmarks(result.bookmarks)
      }
      setIsLoading(false)
    }

    fetchBookmarks()
  }, [getBookmarks])

  const handleRemoveBookmark = async (productId) => {
    const result = await removeBookmark(productId)
    if (result.success) {
      setBookmarks(prev => prev.filter(b => b.productId !== productId))
    }
  }

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-wrapper">
        {/* Header */}
        <div className="bookmarks-header">
          <h1>❤️ My Bookmarks</h1>
          <p className="bookmarks-count">
            {bookmarks.length} {bookmarks.length === 1 ? 'product' : 'products'} bookmarked
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="loading-message">Loading bookmarks...</div>
        ) : bookmarks && bookmarks.length > 0 ? (
          <div className="bookmarks-grid">
            {bookmarks.map(bookmark => (
              <div key={bookmark.productId} className="bookmark-item">
                <div className="bookmark-image-wrapper">
                  <div className="bookmark-image">{bookmark.productEmoji}</div>
                </div>
                
                <div className="bookmark-details">
                  <h3 className="bookmark-name">{bookmark.productName}</h3>
                  
                  <div className="bookmark-meta">
                    <span className="bookmark-category">
                      📦 {bookmark.productCategory || 'Uncategorized'}
                    </span>
                  </div>

                  <p className="bookmark-price">
                    Rs <span className="price-amount">{bookmark.productPrice?.toFixed(2) || 'N/A'}</span>
                  </p>

                  <p className="bookmark-added">
                    Added on {new Date(bookmark.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="bookmark-actions">
                  <button
                    onClick={() => handleViewProduct(bookmark.productId)}
                    className="btn-view-product"
                    title="View product details"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.productId)}
                    className="btn-remove-bookmark"
                    title="Remove from bookmarks"
                  >
                    ❤️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-bookmarks">
            <p className="empty-icon">🤍</p>
            <h2>No Bookmarks Yet</h2>
            <p>Start adding your favorite products to bookmarks!</p>
            <Link to="/">
              <button className="btn-continue-shopping">
                🛍️ Continue Shopping
              </button>
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="bookmarks-footer">
          <button
            onClick={() => navigate('/profile')}
            className="btn-secondary"
          >
            ⬅️ Back to Profile
          </button>
        </div>
      </div>

      <style>{`
        .bookmarks-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .bookmarks-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .bookmarks-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .bookmarks-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
        }

        .bookmarks-count {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        .loading-message {
          padding: 3rem 2rem;
          text-align: center;
          font-size: 1.1rem;
          color: #666;
        }

        .bookmarks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 2rem;
        }

        .bookmark-item {
          background: white;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .bookmark-item:hover {
          border-color: #667eea;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
          transform: translateY(-4px);
        }

        .bookmark-image-wrapper {
          height: 200px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .bookmark-image {
          font-size: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bookmark-details {
          padding: 1.5rem;
          flex-grow: 1;
        }

        .bookmark-name {
          font-size: 1.3rem;
          margin: 0 0 1rem 0;
          color: #333;
          font-weight: 600;
        }

        .bookmark-meta {
          margin-bottom: 1rem;
        }

        .bookmark-category {
          display: inline-block;
          background: #f0f0f0;
          color: #666;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .bookmark-price {
          font-size: 1.5rem;
          color: #667eea;
          margin: 0.5rem 0;
          font-weight: 600;
        }

        .price-amount {
          font-size: 1.8rem;
        }

        .bookmark-added {
          font-size: 0.85rem;
          color: #999;
          margin: 0.5rem 0 0 0;
        }

        .bookmark-actions {
          display: flex;
          gap: 0.5rem;
          padding: 1.5rem;
          border-top: 1px solid #f0f0f0;
          background: #fafafa;
        }

        .btn-view-product,
        .btn-remove-bookmark {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-view-product {
          background: #667eea;
          color: white;
        }

        .btn-view-product:hover {
          background: #5568d3;
          transform: scale(1.02);
        }

        .btn-remove-bookmark {
          background: #fee;
          color: #c33;
        }

        .btn-remove-bookmark:hover {
          background: #fdd;
        }

        .empty-bookmarks {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .empty-icon {
          font-size: 4rem;
          margin: 0;
        }

        .empty-bookmarks h2 {
          font-size: 1.8rem;
          color: #333;
          margin: 1rem 0;
        }

        .empty-bookmarks p {
          font-size: 1rem;
          margin: 0.5rem 0 2rem 0;
        }

        .btn-continue-shopping {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-continue-shopping:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .bookmarks-footer {
          padding: 2rem;
          border-top: 1px solid #f0f0f0;
          background: #fafafa;
          display: flex;
          justify-content: center;
        }

        .btn-secondary {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #5568d3;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .bookmarks-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .bookmarks-header h1 {
            font-size: 1.8rem;
          }

          .bookmark-image {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  )
}
