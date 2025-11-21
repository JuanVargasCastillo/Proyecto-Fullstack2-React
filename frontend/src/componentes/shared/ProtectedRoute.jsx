import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function getStoredUser() {
  try {
    const rawUser = localStorage.getItem('user') || localStorage.getItem('usuarioLogueado')
    if (!rawUser) return null
    const u = JSON.parse(rawUser)
    return u
  } catch {
    return null
  }
}

function hasValidJwt(u) {
  try {
    const token = typeof u?.token === 'string' ? u.token : ''
    if (!token) return false
    const jwt = token.startsWith('Bearer ') ? token.substring(7) : token
    const parts = jwt.split('.')
    if (parts.length < 2) return false
    const payloadB64 = parts[1]
    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
    const json = JSON.parse(atob(padded))
    const exp = Number(json?.exp || 0)
    if (!exp) return true
    const now = Math.floor(Date.now() / 1000)
    return now < exp
  } catch {
    return false
  }
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status"></div>
      </div>
    )
  }

  const user = getStoredUser()
  const isValid = hasValidJwt(user)
  if (!isValid) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const rol = String(user?.rol || '').toUpperCase()
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const ok = allowedRoles.includes(rol)
    if (!ok) {
      // Redirigir según rol actual
      if (rol === 'SUPER_ADMIN') return <Navigate to="/admin" replace />
      return <Navigate to="/" replace />
    }
  }
  return children
}