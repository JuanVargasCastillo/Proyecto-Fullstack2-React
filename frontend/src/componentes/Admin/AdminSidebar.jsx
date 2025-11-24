import { Link, useNavigate } from 'react-router-dom'
import { Offcanvas } from 'bootstrap'
import './AdminSidebar.css'
import { useEffect } from 'react'

export default function AdminSidebar() {
  const navigate = useNavigate()

  const cleanupBackdropAndScroll = () => {
    document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop').forEach(el => el.remove())
    document.body.classList.remove('offcanvas-open', 'modal-open')
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('padding-right')
    document.body.style.removeProperty('touch-action')
    document.documentElement.style.removeProperty('overflow')
    // Forzar retiro de clases/elementos residuales
    document.body.classList.remove('offcanvas-backdrop')
    document.querySelectorAll('.offcanvas.show').forEach(el => el.classList.remove('show'))
    const menuEl = document.getElementById('menuLateral')
    if (menuEl) {
      menuEl.classList.remove('show')
      menuEl.setAttribute('aria-hidden', 'true')
    }
  }

  const safeHideOffcanvas = () => {
    const menuEl = document.getElementById('menuLateral')
    if (menuEl) {
      const offcanvasInstance = Offcanvas.getInstance(menuEl) || new Offcanvas(menuEl)
      offcanvasInstance.hide()
    }
    // Limpieza inmediata y fallback tras la transición
    cleanupBackdropAndScroll()
    setTimeout(() => cleanupBackdropAndScroll(), 350)
  }

  useEffect(() => {
    const menuEl = document.getElementById('menuLateral')
    if (!menuEl) return
    const onHidden = () => cleanupBackdropAndScroll()
    const onHide = () => cleanupBackdropAndScroll()
    menuEl.addEventListener('hidden.bs.offcanvas', onHidden)
    menuEl.addEventListener('hide.bs.offcanvas', onHide)
    return () => {
      menuEl.removeEventListener('hidden.bs.offcanvas', onHidden)
      menuEl.removeEventListener('hide.bs.offcanvas', onHide)
    }
  }, [])

  const handleNavigate = (path) => {
    navigate(path)
    safeHideOffcanvas()
  }

  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="menuLateral" aria-labelledby="menuLateralLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="menuLateralLabel">Menú</h5>
        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" onClick={safeHideOffcanvas}></button>
      </div>
      <div className="offcanvas-body gb-admin-sidebar">
        <ul className="list-group list-group-flush gb-menu-list">
          <li className="list-group-item">
            <button type="button" className="gb-menu-item btn btn-link" onClick={() => handleNavigate('/admin')}>
              <i className="bi bi-house gb-menu-icon" aria-hidden="true"></i>
              <span>Inicio</span>
            </button>
          </li>
          <li className="list-group-item">
            <button type="button" className="gb-menu-item btn btn-link" onClick={() => handleNavigate('/admin/inventario')}>
              <i className="bi bi-box-seam gb-menu-icon" aria-hidden="true"></i>
              <span>Productos</span>
            </button>
          </li>
          {false && (
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
          )}
          <li className="list-group-item">
            <button type="button" className="gb-menu-item btn btn-link" onClick={() => handleNavigate('/admin/usuarios')}>
              <i className="bi bi-people gb-menu-icon" aria-hidden="true"></i>
              <span>Usuarios</span>
            </button>
          </li>
          <li className="list-group-item">
            <button type="button" className="gb-menu-item btn btn-link" onClick={() => handleNavigate('/admin/boletas')}>
              <i className="bi bi-journal-text gb-menu-icon" aria-hidden="true"></i>
              <span>Historial de ventas</span>
            </button>
          </li>
          <li className="list-group-item gb-bottom-start">
            <div className="gb-divider"></div>
          </li>
          <li className="list-group-item">
            <div className="gb-menu-item">
              <i className="bi bi-gear gb-menu-icon" aria-hidden="true"></i>
              <span>Configuración</span>
            </div>
          </li>
          <li className="list-group-item">
            <div className="gb-menu-item">
              <i className="bi bi-question-circle gb-menu-icon" aria-hidden="true"></i>
              <span>Ayuda</span>
            </div>
          </li>
          <li className="list-group-item">
            <div className="gb-menu-item">
              <i className="bi bi-person-circle gb-menu-icon" aria-hidden="true"></i>
              <span>Perfil</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}