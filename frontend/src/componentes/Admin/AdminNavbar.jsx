import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSearch } from '../../context/SearchContext'
import CartButton from '../Cliente/CartButton'

export default function AdminNavbar({ showAdminTitle = true, showSearch = false }) {
  const { user, logout } = useAuth()
  const { query, setQuery } = useSearch() || { query: '', setQuery: () => {} }
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    try {
      localStorage.removeItem('usuarioLogueado')
      logout && logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  const isClientLayout = showSearch
  const onSearchSubmit = (e) => { e.preventDefault() }

  return (
    <nav className="navbar navbar-expand-lg gb-navbar w-100 py-2">
      <div className="container-fluid d-flex align-items-center position-relative">
        {/* Botón hamburguesa GreenBunny */}
        <button className="btn btn-hamburguesa me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuLateral" aria-controls="menuLateral" aria-label="Abrir menú">
          <i className="bi bi-list fs-3"></i>
        </button>

        {/* Logo a la izquierda */}
        <Link className="navbar-brand d-flex align-items-center" to={isClientLayout ? '/' : '/admin'}>
          <img src="/img/logo2.png" alt="Green Bunny Store" />
        </Link>

        {/* Texto centrado - posición absoluta para centrado perfecto */}
        {showAdminTitle ? (
          <div className="position-absolute top-50 start-50 translate-middle d-none d-md-block">
            <h5 className="mb-0 titulo-admin">Panel Administrador</h5>
          </div>
        ) : null}

        {showSearch ? (
          <form onSubmit={onSearchSubmit} className="d-none d-md-flex position-absolute top-50 start-50 translate-middle" style={{ maxWidth: 500, width: '100%' }}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
          </form>
        ) : null}

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
            <>
              <Link className="btn btn-outline-primary me-2" to="/login">Iniciar Sesión</Link>
              <Link className="btn btn-success" to="/registro">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}