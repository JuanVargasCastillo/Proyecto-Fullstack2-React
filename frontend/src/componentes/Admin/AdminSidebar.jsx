import { Link, useNavigate } from 'react-router-dom'
import { Offcanvas } from 'bootstrap'

export default function AdminSidebar() {
  const navigate = useNavigate()

  const cleanupBackdropAndScroll = () => {
    document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop').forEach(el => el.remove())
    document.body.classList.remove('offcanvas-open', 'modal-open')
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('padding-right')
    document.body.style.removeProperty('touch-action')
    document.documentElement.style.removeProperty('overflow')
  }

  const handleNavigate = (path) => {
    navigate(path)
    const menuEl = document.getElementById('menuLateral')
    if (menuEl) {
      const offcanvasInstance = Offcanvas.getInstance(menuEl) || new Offcanvas(menuEl)
      const onHidden = () => {
        cleanupBackdropAndScroll()
        menuEl.removeEventListener('hidden.bs.offcanvas', onHidden)
      }
      menuEl.addEventListener('hidden.bs.offcanvas', onHidden)
      offcanvasInstance.hide()
    }
    // Limpieza inmediata por si la navegación ocurre antes de que termine la transición
    cleanupBackdropAndScroll()
    // Fallback tras la duración típica de transición de Bootstrap
    setTimeout(() => cleanupBackdropAndScroll(), 350)
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