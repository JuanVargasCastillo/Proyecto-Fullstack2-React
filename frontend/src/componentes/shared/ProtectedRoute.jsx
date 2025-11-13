import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function hasValidJwt() {
  try {
    const raw = localStorage.getItem('usuarioLogueado')
    if (!raw) return false
    const u = JSON.parse(raw)
    const token = typeof u?.token === 'string' ? u.token : ''
    if (!token) return false
    // Acepta tokens con o sin prefijo Bearer
    const jwt = token.startsWith('Bearer ') ? token.substring(7) : token
    const parts = jwt.split('.')
    if (parts.length < 2) return false
    const payloadB64 = parts[1]
    // base64url → base64
    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
    const json = JSON.parse(atob(padded))
    const exp = Number(json?.exp || 0) // segundos epoch
    if (!exp) return true // si no hay exp, asumir válido
    const now = Math.floor(Date.now() / 1000)
    return now < exp
  } catch {
    return false
  }
}

export default function ProtectedRoute({ children }) {
  const { loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status"></div>
      </div>
    )
  }

  const isValid = hasValidJwt()
  if (!isValid) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}