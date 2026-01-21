import React, { createContext, useState, useContext, useEffect } from 'react'
import { toast } from '../utils/toast'

const AuthContext = createContext()

// Store token in memory
let authToken = null

// Helper to get token from localStorage
const getStoredToken = () => {
  try {
    return localStorage.getItem('authToken')
  } catch (error) {
    return null
  }
}

// Helper to save token to localStorage
const saveToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
  } catch (error) {
    console.error('Failed to save token:', error)
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      // Get token from localStorage if available
      const storedToken = getStoredToken()
      
      if (storedToken) {
        authToken = storedToken
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else {
            // Token is invalid or expired
            authToken = null
            saveToken(null)
            setUser(null)
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          authToken = null
          saveToken(null)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const signUp = async (email, password, name, phone = '') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
          confirmPassword: password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Signup failed')
        return { success: false, message: data.message || 'Signup failed' }
      }

      // Store token in memory and localStorage
      authToken = data.token
      saveToken(authToken)
      setUser(data.user)
      toast.success(data.message || 'Account created successfully!')

      return { success: true, message: data.message || 'Account created successfully!' }
    } catch (error) {
      toast.error(error.message)
      return { success: false, message: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Invalid email or password')
        return { success: false, message: data.message || 'Invalid email or password' }
      }

      // Store token in memory and localStorage
      authToken = data.token
      saveToken(authToken)
      setUser(data.user)
      toast.success(data.message || 'Logged in successfully!')

      return { success: true, message: data.message || 'Logged in successfully!' }
    } catch (error) {
      toast.error(error.message)
      return { success: false, message: error.message }
    }
  }

  const signOut = () => {
    authToken = null
    saveToken(null)
    setUser(null)
    toast.success('Logged out successfully!')
  }

  const updateProfile = async (updates) => {
    if (user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/update-profile/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(updates)
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || 'Failed to update profile')
          return { success: false, message: data.message || 'Failed to update profile' }
        }

        // Fetch updated user data
        const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        toast.success('Profile updated successfully!')
        return { success: true, message: 'Profile updated successfully!' }
      } catch (error) {
        toast.error(error.message)
        return { success: false, message: error.message }
      }
    }
    toast.error('No user logged in')
    return { success: false, message: 'No user logged in' }
  }

  const addAddress = async (address) => {
    if (user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/add-address/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(address)
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || 'Failed to add address')
          return { success: false, message: data.message || 'Failed to add address' }
        }

        // Fetch updated user data
        const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        toast.success('Address added successfully!')
        return { success: true, message: 'Address added successfully!', addressId: data.address.id }
      } catch (error) {
        toast.error(error.message)
        return { success: false, message: error.message }
      }
    }
    toast.error('No user logged in')
    return { success: false, message: 'No user logged in' }
  }

  const updateAddress = async (addressId, updatedAddress) => {
    if (user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/update-address/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            addressId,
            ...updatedAddress
          })
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || 'Failed to update address')
          return { success: false, message: data.message || 'Failed to update address' }
        }

        // Fetch updated user data
        const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        toast.success('Address updated successfully!')
        return { success: true, message: 'Address updated successfully!' }
      } catch (error) {
        toast.error(error.message)
        return { success: false, message: error.message }
      }
    }
    toast.error('No user logged in')
    return { success: false, message: 'No user logged in' }
  }

  const deleteAddress = async (addressId) => {
    if (user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/delete-address/${user.id}/${addressId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || 'Failed to delete address')
          return { success: false, message: data.message || 'Failed to delete address' }
        }

        // Fetch updated user data
        const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        toast.success('Address deleted successfully!')
        return { success: true, message: 'Address deleted successfully!' }
      } catch (error) {
        toast.error(error.message)
        return { success: false, message: error.message }
      }
    }
    toast.error('No user logged in')
    return { success: false, message: 'No user logged in' }
  }

  const setPrimaryAddress = async (addressId) => {
    if (user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/set-primary-address/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            addressId
          })
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || 'Failed to set primary address')
          return { success: false, message: data.message || 'Failed to set primary address' }
        }

        // Fetch updated user data
        const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        toast.success('Primary address updated!')
        return { success: true, message: 'Primary address updated!' }
      } catch (error) {
        toast.error(error.message)
        return { success: false, message: error.message }
      }
    }
    toast.error('No user logged in')
    return { success: false, message: 'No user logged in' }
  }

  const addBookmark = async (product) => {
    if (user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookmark/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productEmoji: product.emoji,
            productCategory: product.category
          })
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || 'Failed to bookmark product')
          return { success: false, message: data.message || 'Failed to bookmark product' }
        }

        toast.success('Product bookmarked!')
        return { success: true, message: 'Product bookmarked successfully!' }
      } catch (error) {
        toast.error(error.message)
        return { success: false, message: error.message }
      }
    }
    toast.error('Please login to bookmark')
    return { success: false, message: 'No user logged in' }
  }

  const removeBookmark = async (productId) => {
    if (user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookmark/remove/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || 'Failed to remove bookmark')
          return { success: false, message: data.message || 'Failed to remove bookmark' }
        }

        toast.success('Bookmark removed!')
        return { success: true, message: 'Bookmark removed successfully!' }
      } catch (error) {
        toast.error(error.message)
        return { success: false, message: error.message }
      }
    }
    toast.error('Please login to remove bookmark')
    return { success: false, message: 'No user logged in' }
  }

  const checkBookmark = async (productId) => {
    if (user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookmark/check/${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          return { isBookmarked: false }
        }

        return { isBookmarked: data.isBookmarked }
      } catch (error) {
        console.error('Error checking bookmark:', error)
        return { isBookmarked: false }
      }
    }
    return { isBookmarked: false }
  }

  const getBookmarks = async () => {
    if (user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookmark/user/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          return { success: false, bookmarks: [], message: data.message }
        }

        return { success: true, bookmarks: data.bookmarks || [] }
      } catch (error) {
        console.error('Error fetching bookmarks:', error)
        return { success: false, bookmarks: [], message: error.message }
      }
    }
    return { success: false, bookmarks: [], message: 'No user logged in' }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      setPrimaryAddress,
      addBookmark,
      removeBookmark,
      checkBookmark,
      getBookmarks
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
