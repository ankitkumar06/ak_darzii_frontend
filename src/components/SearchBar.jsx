import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
    }
  }

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="search-btn">
        🔍
      </button>
    </form>
  )
}
