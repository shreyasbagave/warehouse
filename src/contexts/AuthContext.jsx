import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mockup mode - Provide default mock user
const defaultUser = {
  id: 1,
  name: 'Demo User',
  role: 'farmer',
  email: 'demo@fwms.com'
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser)

  const login = (userData) => {
    setUser(userData || defaultUser)
  }

  const logout = () => {
    setUser(defaultUser)
  }

  const value = {
    user,
    login,
    logout,
    loading: false,
    isAuthenticated: true,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

