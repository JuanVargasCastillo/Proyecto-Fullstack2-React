import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginApi } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const resp = await loginApi(email, password)
    setUser(resp)
    localStorage.setItem('user', JSON.stringify(resp))
    return resp
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
    try { localStorage.removeItem('usuarioLogueado') } catch {}
  }

  const value = { user, login, logout, loading }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}