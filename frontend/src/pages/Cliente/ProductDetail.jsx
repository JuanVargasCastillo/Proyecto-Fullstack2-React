import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { obtenerProducto } from '../../services/productos'
import { useCart } from '../../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { add } = useCart()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  useEffect(() => {
    let mounted = true
    setLoading(true)
    obtenerProducto(id)
      .then((p) => { if (mounted) setProducto(p) })
      .catch(() => { if (mounted) setProducto(null) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  const img = useMemo(() => {
    const url = producto?.imagenUrl ? String(producto.imagenUrl) : ''
    return url ? base + url : ''
  }, [producto, base])

  const precio = useMemo(() => {
    return new Intl.NumberFormat('es-CL').format(Number(producto?.precio || 0))
  }, [producto])

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center my-4"><div className="spinner-border text-success" role="status"></div></div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>Producto no encontrado</span>
          <Link to="/" className="btn btn-verde-pastel">Volver a la tienda</Link>
        </div>
      </div>
    )
  }

  const stock = Number(producto?.stock ?? 0)

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start producto-detalle">
        <div className="col-md-6">
          <div className="detalle-media">
            {img ? (
              <img src={img} alt={producto?.nombre} className="img-fluid rounded shadow-sm" />
            ) : (
              <div className="bg-light rounded d-flex justify-content-center align-items-center" style={{height:'320px'}}>
                <span className="text-muted">Sin imagen</span>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="mb-2">{producto?.nombre}</h2>
          <p className="text-muted mb-3">{producto?.descripcion}</p>
          <div className="d-flex align-items-center mb-3">
            <span id="producto-precio" className="fs-4 fw-bold">${precio}</span>
            <span className={`ms-3 badge ${stock > 0 ? 'bg-success' : 'bg-danger'}`}>{stock > 0 ? 'En stock' : 'Sin stock disponible'}</span>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-verde-pastel" disabled={stock <= 0} onClick={() => add(producto.id, 1)}>Agregar al carrito</button>
            <Link to="/categorias" className="btn btn-rosa-pastel">Explorar más</Link>
          </div>
        </div>
      </div>
    </div>
  )
}