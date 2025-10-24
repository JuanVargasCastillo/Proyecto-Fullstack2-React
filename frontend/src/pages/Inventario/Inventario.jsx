import { useEffect, useState } from 'react'
import { listarProductos, listarProductosBajoStock, eliminarProducto } from '../../services/productos'
import { useToast } from '../../componentes/shared/ToastProvider'
import ProductosList from '../../componentes/Productos/ProductosList'
import CrearProd from '../../componentes/CrearProd/CrearProd'

export default function Inventario() {
  const { show } = useToast()
  const [productos, setProductos] = useState([])
  const [bajoStock, setBajoStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  const cargar = async () => {
    try {
      setLoading(true)
      const [all, low] = await Promise.all([
        listarProductos(),
        listarProductosBajoStock(3),
      ])
      setProductos(all)
      setBajoStock(low)
    } catch (err) {
      show(err.message, 'danger')
    } finally {
      setLoading(false)
    }
  }

  const borrar = async (id) => {
    if (!isSuperAdmin) {
      show('Acción permitida solo para SUPER_ADMIN', 'warning')
      return
    }
    if (!confirm('¿Eliminar producto?')) return
    try {
      await eliminarProducto(id)
      show('Producto eliminado', 'success')
      await cargar()
    } catch (err) {
      show(err.message, 'danger')
    }
  }

  useEffect(() => { cargar() }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      const usr = raw ? JSON.parse(raw) : null
      const role = String(usr?.rol ?? usr?.role ?? '').toUpperCase()
      setIsSuperAdmin(role === 'SUPER_ADMIN')
    } catch (e) {
      setIsSuperAdmin(false)
    }
  }, [])

  return (
    <div className="container">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4>Inventario</h4>
            <button className="btn btn-outline-secondary btn-sm" onClick={cargar} disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
          {loading ? (
            <div className="text-center"><div className="spinner-border" role="status"></div></div>
          ) : (
            <ProductosList productos={productos} onDelete={borrar} canDelete={isSuperAdmin} />
          )}
        </div>
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5>Bajo stock</h5>
              {bajoStock.length ? (
                <ul className="list-group list-group-flush">
                  {bajoStock.map((p) => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between">
                      <span>{p.nombre}</span>
                      <span className="badge bg-warning text-dark">{p.stock}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Sin alertas de stock</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            {isSuperAdmin ? (
              <CrearProd />
            ) : (
              <div className="card p-3">
                <h6 className="text-muted mb-0">Solo SUPER_ADMIN puede crear productos</h6>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}