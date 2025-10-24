import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../shared/ToastProvider'

export default function Navbar() {
  const { user, login, logout } = useAuth()
  const { show } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      show('Email y contraseña son obligatorios', 'danger')
      return
    }
    try {
      setLoading(true)
      const u = await login(email, password)
      show(`Bienvenido ${u.nombre}`, 'success')
      setEmail('')
      setPassword('')
    } catch (err) {
      show(err.message || 'Error de autenticación', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Tienda Virtual</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/inventario">Inventario</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/usuarios">Usuarios</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
            </li>
          </ul>

          {!user ? (
            <form className="d-flex" onSubmit={handleLogin}>
              <input type="email" className="form-control me-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className="form-control me-2" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="btn btn-outline-light" type="submit" disabled={loading}>
                {loading ? '...' : 'Iniciar sesión'}
              </button>
            </form>
          ) : (
            <div className="d-flex align-items-center text-white">
              <span className="me-3">Hola, {user.nombre} ({user.rol})</span>
              <button className="btn btn-outline-light" onClick={() => { logout(); show('Sesión cerrada', 'success') }}>Salir</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}