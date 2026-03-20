import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USER = {
  _id: 'sa_001',
  username: 'star',
  role: 'superadmin',
  email: 'contact@admin.com',
  coins: 0,
  isActive: true,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (username, password) => {
    setLoading(true)
    setError('')
    try {
      await new Promise(r => setTimeout(r, 800))
      if (username === 'superadmin' && password === 'SuperAdmin@123') {
        setUser(MOCK_USER)
        return true
      }
      setError('Invalid username or password')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
