import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import PRODUCTS from '../data/products'

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find(p => p.id === parseInt(id))
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

//   useEffect(() => {
//   fetch(`/api/products/${id}`).then(r => r.json()).then(setProduct);
// }, [id]);

  if (!product) {
    return (
      <div className="product-detail-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')}>Back to Products</button>
      </div>
    )
  }

  return (
    <div className="product-detail-container">
      <button className="back-link" onClick={() => navigate('/')}>← Back</button>
      <div className="product-detail">
        <div className="product-images-section">
          <div className="main-image">
            <div className="image-display">{product.images[selectedImageIndex]}</div>
          </div>
          <div className="thumbnail-images">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                {img}
              </div>
            ))}
          </div>
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          
          <div className="rating-section">
            <span className="rating">⭐ {product.rating}</span>
            <span className="reviews">({product.reviews} reviews)</span>
          </div>

          <p className="product-detail-price">Rs {product.price.toFixed(2)}</p>
          <p className="product-detail-description">{product.fullDescription}</p>

          <div className="specifications">
            <h3>Key Specifications:</h3>
            <ul className="specs-list">
              {product.specs.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>

          <button
            className="add-to-cart-btn-large"
            onClick={() => {
              onAddToCart(product)
              navigate('/cart')
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

