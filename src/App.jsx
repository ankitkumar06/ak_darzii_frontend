import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import AppContent from './parentComponent/AppContent'
import { AuthProvider } from './context/AuthContext'


function App() {
  const [cart, setCart] = useState([])

  return (
    <AuthProvider>
      <Router>
        <AppContent cart={cart} setCart={setCart} />
      </Router>
    </AuthProvider>
  )
}

export default App
