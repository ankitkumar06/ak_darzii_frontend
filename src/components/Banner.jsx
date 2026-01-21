import React, { useState, useEffect } from 'react'

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: 'Welcome to EStore',
      subtitle: 'Find the best products at amazing prices',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '🛍️'
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Check out our latest collection',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '🎉'
    },
    {
      id: 3,
      title: 'Special Offers',
      subtitle: 'Up to 50% off on selected items',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '⭐'
    },
    {
      id: 4,
      title: 'Fast Shipping',
      subtitle: 'Free delivery on orders above Rs 500',
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: '🚚'
    }
  ]

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="banner-container">
      <div className="banner-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ background: slide.background }}
          >
            <div className="banner-content">
              <div className="banner-icon">{slide.icon}</div>
              <h2 className="banner-title">{slide.title}</h2>
              <p className="banner-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button className="banner-btn prev-btn" onClick={prevSlide} aria-label="Previous slide">
          ❮
        </button>
        <button className="banner-btn next-btn" onClick={nextSlide} aria-label="Next slide">
          ❯
        </button>
      </div>

      {/* Slide Indicators (Dots) */}
      <div className="banner-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
