import { useEffect, useMemo, useState } from 'react'
import { listarProductos } from '../../services/productos'
import { useLocation } from 'react-router-dom'
import ProductCard from './ProductCard'
import { useSearch } from '../../context/SearchContext'

export default function ProductGrid({ title = 'Productos Destacados' }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const { query = '' } = useSearch() || {}

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoriaId = params.get('categoriaId') || undefined
    setLoading(true)
    listarProductos({ categoriaId }).then(setProductos).catch(() => {}).finally(() => setLoading(false))
  }, [location.search])

  const visibles = useMemo(() => {
    const q = String(query || '').trim().toLowerCase()
    if (!q) return productos
    return productos.filter((p) => {
      const nombre = String(p?.nombre || '').toLowerCase()
      const descripcion = String(p?.descripcion || '').toLowerCase()
      return nombre.includes(q) || descripcion.includes(q)
    })
  }, [productos, query])

  return (
    <div className="container">
      <h2 className="titulo">{title}</h2>
      {loading ? (
        <div className="text-center my-4"><div className="spinner-border text-success" role="status"></div></div>
      ) : (
        <div className="row" id="contenedor-productos">
          {visibles.map((p) => (
            <div className="col-md-3 caja" key={p.id}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}