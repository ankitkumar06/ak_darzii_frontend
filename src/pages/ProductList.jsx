import { useState,useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PRODUCTS from '../data/products'
import Banner from '../components/Banner'
import axios from 'axios';
import { useAuth } from '../context/AuthContext'

export default function ProductList({ onAddToCart }) {
  const { category } = useParams()
  const { user, addBookmark, removeBookmark, checkBookmark } = useAuth()
  const [products, setProducts] = useState([])
  const [bookmarkedProducts, setBookmarkedProducts] = useState(new Set())

 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/products/getproduct`
      );
      console.log(response.data.data, "response data........");
      setProducts(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchProducts();
}, []);



  const filtered = category && category !== 'all'
    ? products.filter(p => p.category === category)
    : products

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

  return (
    <div>
      <Banner />
      <div className="products-container">
      {filtered.map(product => (
        <div key={product.id} className="product-card">
          <Link to={`/product/${product.id}`} className="product-link">
            <div className="product-image">{product.emoji}</div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Rs {product.price.toFixed(2)}</p>
            </div>
          </Link>
          <div className="product-actions">
            <button
              className="add-to-cart-btn"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
            {user && (
              <button
                className={`bookmark-btn ${isBookmarked(product.id) ? 'bookmarked' : ''}`}
                onClick={(e) => handleBookmarkClick(e, product)}
                title={isBookmarked(product.id) ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked(product.id) ? '❤️' : '🤍'}
              </button>
            )}
          </div>
        </div>
      ))}

      
      </div>
    </div>
  )
}

