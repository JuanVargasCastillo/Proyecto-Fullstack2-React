import { useEffect, useRef, useState } from 'react'
import { listarCategorias } from '../../services/categorias'
import { useNavigate, useLocation } from 'react-router-dom'
import '../../assets/styles/categorias.css'

export default function CategoryOffcanvas() {
  const [categorias, setCategorias] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => {})
  }, [])

  const go = (categoriaId) => {
    const params = new URLSearchParams(location.search)
    if (categoriaId) {
      params.set('categoriaId', String(categoriaId))
    } else {
      params.delete('categoriaId')
    }
    const el = document.getElementById('menuLateral')
    const bootstrap = window.bootstrap
    if (el && bootstrap?.Offcanvas) {
      const instance = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el)
      const onHiddenNavigate = () => {
        el.removeEventListener('hidden.bs.offcanvas', onHiddenNavigate)
        navigate({ pathname: '/categorias', search: params.toString() })
      }
      el.addEventListener('hidden.bs.offcanvas', onHiddenNavigate)
      instance.hide()
    } else {
      navigate({ pathname: '/categorias', search: params.toString() })
      cleanupBackdrop()
    }
  }

  function cleanupBackdrop() {
    try {
      document.querySelectorAll('.offcanvas-backdrop').forEach((el) => el.remove())
      document.body.style.overflow = ''
      document.body.classList.remove('offcanvas-open')
    } catch {}
  }

  const ocRef = useRef(null)

  useEffect(() => {
    const el = ocRef.current
    const bootstrap = window.bootstrap
    if (!el || !bootstrap?.Offcanvas) return
    const instance = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el, { backdrop: true, scroll: true })
    const onHidden = () => cleanupBackdrop()
    const onHide = () => cleanupBackdrop()
    el.addEventListener('hidden.bs.offcanvas', onHidden)
    el.addEventListener('hide.bs.offcanvas', onHide)
    return () => {
      el.removeEventListener('hidden.bs.offcanvas', onHidden)
      el.removeEventListener('hide.bs.offcanvas', onHide)
      try { instance.hide(); instance.dispose() } catch {}
      cleanupBackdrop()
    }
  }, [])

  return (
    <div ref={ocRef} className="offcanvas offcanvas-start" tabIndex="-1" id="menuLateral" aria-labelledby="menuLateralLabel" data-bs-scroll="true" data-bs-backdrop="true">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="menuLateralLabel">Categorías</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body categorias-body">
        <ul className="list-unstyled categorias-list">
          <li><button type="button" className="nav-link w-100 text-start" data-bs-dismiss="offcanvas" onClick={() => go(null)}><i className="bi bi-grid me-2"></i>Todos</button></li>
          {categorias.map((c) => (
            <li key={c.id}><button type="button" className="nav-link w-100 text-start" data-bs-dismiss="offcanvas" onClick={() => go(c.id)}><i className="bi bi-tag me-2"></i>{c.nombre}</button></li>
          ))}
        </ul>
      </div>
    </div>
  )
}