import { Link, useNavigate } from 'react-router-dom'
import { Offcanvas } from 'bootstrap'

export default function AdminSidebar() {
  const navigate = useNavigate()

  const handleNavigate = (path) => {
    navigate(path)
    const menuEl = document.getElementById('menuLateral')
    if (menuEl) {
      const offcanvasInstance = Offcanvas.getInstance(menuEl) || new Offcanvas(menuEl)
      offcanvasInstance.hide()
    }
  }

  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="menuLateral" aria-labelledby="menuLateralLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="menuLateralLabel">Menú</h5>
        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => handleNavigate('/dashboard')}>Inicio</button>
          </li>
          <li className="list-group-item">
            <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => handleNavigate('/inventario')}>Productos</button>
          </li>
          <li className="list-group-item">
            <a className="text-decoration-none d-flex align-items-center" data-bs-toggle="collapse" href="#menuCategorias" role="button" aria-expanded="false" aria-controls="menuCategorias">
              Categorías <i className="bi bi-chevron-down ms-2"></i>
            </a>
            <div className="collapse mt-2" id="menuCategorias">
              <ul className="list-unstyled ps-3">
                <li className="mb-1"><Link className="text-decoration-none" to="/inventario#Hombre" data-bs-dismiss="offcanvas">Hombre</Link></li>
                <li className="mb-1"><Link className="text-decoration-none" to="/inventario#Mujer" data-bs-dismiss="offcanvas">Mujer</Link></li>
                <li className="mb-1"><Link className="text-decoration-none" to="/inventario#Ninos" data-bs-dismiss="offcanvas">Niños</Link></li>
              </ul>
            </div>
          </li>
          <li className="list-group-item">
            <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => handleNavigate('/usuarios')}>Usuarios</button>
          </li>
          <li className="list-group-item">
            <span className="text-muted">Configuración</span>
          </li>
          <li className="list-group-item">
            <span className="text-muted">Ayuda</span>
          </li>
          <li className="list-group-item">
            <span className="text-muted">Perfil</span>
          </li>
        </ul>
      </div>
    </div>
  )
}