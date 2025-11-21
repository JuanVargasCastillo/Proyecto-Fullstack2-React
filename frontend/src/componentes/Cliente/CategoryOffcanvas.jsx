import { useEffect, useState } from 'react'
import { listarCategorias } from '../../services/categorias'
import { useNavigate, useLocation } from 'react-router-dom'

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
    navigate({ pathname: '/', search: params.toString() })
  }

  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="menuLateral" aria-labelledby="menuLateralLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="menuLateralLabel">Categorías</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <ul className="list-unstyled">
          <li><button type="button" className="nav-link w-100 text-start" onClick={() => go(null)}>Todos</button></li>
          {categorias.map((c) => (
            <li key={c.id}><button type="button" className="nav-link w-100 text-start" onClick={() => go(c.id)}>{c.nombre}</button></li>
          ))}
        </ul>
      </div>
    </div>
  )
}