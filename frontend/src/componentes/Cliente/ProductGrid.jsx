import { useEffect, useState } from 'react'
import { listarProductos } from '../../services/productos'
import { useLocation } from 'react-router-dom'
import ProductCard from './ProductCard'

export default function ProductGrid() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const nombre = params.get('nombre') || undefined
    const categoriaId = params.get('categoriaId') || undefined
    setLoading(true)
    listarProductos({ nombre, categoriaId }).then(setProductos).catch(() => {}).finally(() => setLoading(false))
  }, [location.search])

  return (
    <div className="container">
      <h2 className="titulo">Productos Destacados</h2>
      {loading ? (
        <div className="text-center my-4"><div className="spinner-border text-success" role="status"></div></div>
      ) : (
        <div className="row" id="contenedor-productos">
          {productos.map((p) => (
            <div className="col-md-3 caja" key={p.id}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}