import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import CartButton from '../Cliente/CartButton'

export default function AdminNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    try {
      localStorage.removeItem('usuarioLogueado')
      logout && logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <nav className="navbar navbar-expand-lg gb-navbar w-100 py-2">
      <div className="container-fluid d-flex align-items-center position-relative">
        {/* Botón hamburguesa GreenBunny */}
        <button className="btn btn-hamburguesa me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuLateral" aria-controls="menuLateral" aria-label="Abrir menú">
          <i className="bi bi-list fs-3"></i>
        </button>

        {/* Logo a la izquierda */}
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <img src="/img/logo2.png" alt="Green Bunny Store" />
        </Link>

        {/* Texto centrado - posición absoluta para centrado perfecto */}
        <div className="position-absolute top-50 start-50 translate-middle d-none d-md-block">
          <h5 className="mb-0 titulo-admin">Panel Administrador</h5>
        </div>

        {/* Icono de notificaciones, carrito y acciones de sesión */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          <button className="btn btn-notificacion position-relative d-none d-sm-inline-flex" type="button" aria-label="Notificaciones">
            <i className="bi bi-bell"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
          </button>

          <CartButton />

          {user ? (
            <button className="btn btn-cerrar-sesion" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Cerrar Sesión
            </button>
          ) : (
            <Link className="btn btn-outline-primary" to="/login">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </nav>
  )
}