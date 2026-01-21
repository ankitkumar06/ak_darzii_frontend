import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
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
        return { success: false, message: data.message || 'Signup failed' }
      }

      // Store user in localStorage and state
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)

      return { success: true, message: data.message || 'Account created successfully!' }
    } catch (error) {
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
        return { success: false, message: data.message || 'Invalid email or password' }
      }

      // Store user in localStorage and state
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)

      return { success: true, message: data.message || 'Logged in successfully!' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const signOut = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return { success: true, message: 'Profile updated successfully!' }
    }
    return { success: false, message: 'No user logged in' }
  }

  const addAddress = (address) => {
    if (user) {
      const newAddress = {
        id: Date.now(),
        ...address,
        isDefault: user.addresses.length === 0 ? true : false
      }
      const updatedUser = {
        ...user,
        addresses: [...user.addresses, newAddress],
        primaryAddressId: newAddress.isDefault ? newAddress.id : user.primaryAddressId
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return { success: true, message: 'Address added successfully!', addressId: newAddress.id }
    }
    return { success: false, message: 'No user logged in' }
  }

  const updateAddress = (addressId, updatedAddress) => {
    if (user) {
      const updatedUser = {
        ...user,
        addresses: user.addresses.map(addr =>
          addr.id === addressId ? { ...addr, ...updatedAddress } : addr
        )
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return { success: true, message: 'Address updated successfully!' }
    }
    return { success: false, message: 'No user logged in' }
  }

  const deleteAddress = (addressId) => {
    if (user) {
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId)
      const updatedUser = {
        ...user,
        addresses: updatedAddresses,
        primaryAddressId: addressId === user.primaryAddressId ? (updatedAddresses.length > 0 ? updatedAddresses[0].id : null) : user.primaryAddressId
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return { success: true, message: 'Address deleted successfully!' }
    }
    return { success: false, message: 'No user logged in' }
  }

  const setPrimaryAddress = (addressId) => {
    if (user) {
      const updatedUser = {
        ...user,
        addresses: user.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        })),
        primaryAddressId: addressId
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return { success: true, message: 'Primary address updated!' }
    }
    return { success: false, message: 'No user logged in' }
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
      setPrimaryAddress
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
