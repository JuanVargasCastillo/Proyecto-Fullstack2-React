import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

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
    <nav className="navbar navbar-expand-lg navbar-light bg-light w-100 py-1 gb-navbar">
      <div className="container-fluid d-flex align-items-center">
        <button className="btn btn-hamburguesa me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuLateral" aria-controls="menuLateral" aria-label="Abrir menú">
          <i className="bi bi-list fs-3"></i>
        </button>

        <div className="gb-nav-center d-flex align-items-center gap-2 mx-auto">
          <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
            <img src="/img/logo.png" alt="Logo Tienda" />
          </Link>
          <h5 className="mb-0 titulo-admin">Panel Administrador</h5>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-notificacion position-relative" type="button">
            <i className="bi bi-bell"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
          </button>

          <button className="btn btn-cerrar-sesion" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}