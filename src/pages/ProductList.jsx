import { useState,useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PRODUCTS from '../data/products'
import Banner from '../components/Banner'
import axios from 'axios';

export default function ProductList({ onAddToCart }) {
  const { category } = useParams()
  const [products, setProducts] = useState([])

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

    //  const [products, setProducts] = useState([]);
  //    useEffect(() => {
  //   const params = new URLSearchParams();
  //   if (category) params.set('category', category);
  //   fetch(`/api/products?${params.toString()}`)
  //     .then(r => r.json())
  //     .then(setProducts);
  // }, [category]);

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
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}

      
      </div>
    </div>
  )
}

