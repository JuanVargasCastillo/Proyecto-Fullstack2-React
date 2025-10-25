import { useEffect, useState } from 'react'
import { listarProductos, listarProductosBajoStock, eliminarProducto, desactivarProducto, actualizarProducto } from '../../services/productos'
import { useToast } from '../../componentes/shared/ToastProvider'
import ProductosList from '../../componentes/Productos/ProductosList'
import EditarProductoModal from '../../componentes/Productos/EditarProductoModal'
import CrearProd from '../../componentes/CrearProd/CrearProd'
import { listarCategorias } from '../../services/categorias'

export default function Inventario() {
  const { show } = useToast()
  const [productos, setProductos] = useState([])
  const [bajoStock, setBajoStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categorias, setCategorias] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)

  const cargar = async () => {
    try {
      setLoading(true)
      const [all, low] = await Promise.all([
        listarProductos(),
        listarProductosBajoStock(5),
      ])
      setProductos(all)
      const alertas = all.filter(p => p.stock < 5)
      setBajoStock(alertas)
    } catch (err) {
      show(err.message, 'danger')
    } finally {
      setLoading(false)
    }
  }

  const borrar = async (id) => {
    if (!isSuperAdmin) {
      show('Acción disponible solo para SUPER_ADMIN', 'warning')
      return
    }
    if (!confirm('¿Eliminar producto?')) return
    try {
      await eliminarProducto(id)
      show('Producto eliminado correctamente', 'success')
      await cargar()
    } catch (err) {
      show(err.message || 'Error al eliminar producto', 'danger')
    }
  }

  const startEdit = (p) => {
    if (!isSuperAdmin) {
      show('Acción disponible solo para SUPER_ADMIN', 'warning')
      return
    }
    setEditingProduct(p)
  }

  const closeEdit = () => setEditingProduct(null)

  const onSaved = async () => {
    await cargar()
  }

  const toggleActivo = async (p) => {
    if (!isSuperAdmin) {
      show('Acción disponible solo para SUPER_ADMIN', 'warning')
      return
    }
    try {
      if (p.activo) {
        await desactivarProducto(p.id)
        show('Producto desactivado', 'success')
      } else {
        const payload = { ...p, activo: true }
        await actualizarProducto(p.id, payload)
        show('Producto activado', 'success')
      }
      await cargar()
    } catch (err) {
      show(err.message || 'Error al cambiar estado', 'danger')
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

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await listarCategorias()
        setCategorias(Array.isArray(data) ? data : [])
      } catch (e) {
        setCategorias([])
      }
    }
    fetchCategorias()
  }, [])

  const stockBadgeClass = (stock) => {
    if (stock === 0) return 'badge bg-danger'
    if (stock < 5) return 'badge bg-warning text-dark'
    return 'badge bg-success'
  }

  const stockBadgeText = (stock) => {
    if (stock === 0) return 'Sin stock'
    if (stock < 5) return `${stock} ⚠️`
    return String(stock)
  }

  return (
    <div className="container">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="mb-0">Inventario</h4>
            <div className="d-flex align-items-center gap-2">
              <div className="position-relative" style={{ minWidth: 280 }}>
                <i className="bi bi-search position-absolute" style={{ left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gb-green)' }}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar producto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderRadius: 12, padding: '8px 12px 8px 32px', border: '1px solid var(--gb-green)', outline: 'none' }}
                />
              </div>
              <div className="position-relative" style={{ minWidth: 220 }}>
                <i className="bi bi-tag position-absolute" style={{ left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gb-green)' }}></i>
                <select
                  className="form-select"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  aria-label="Filtrar por categoría"
                  style={{ borderRadius: 12, padding: '8px 12px 8px 32px', border: '1px solid var(--gb-green)', outline: 'none' }}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn-success btn-sm" onClick={cargar} disabled={loading} style={{ transition: 'all 0.3s ease' }}>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>
          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-success me-2" role="status"></div>
              <span className="text-success">Cargando inventario…</span>
            </div>
          ) : (
            <>
              <ProductosList
                productos={productos}
                onDelete={borrar}
                canDelete={isSuperAdmin}
                searchQuery={searchQuery}
                categoryId={selectedCategoryId}
                onEdit={startEdit}
                onToggleActivo={toggleActivo}
              />
              {editingProduct && (
                <EditarProductoModal
                  product={editingProduct}
                  onClose={closeEdit}
                  onSaved={onSaved}
                  disabled={!isSuperAdmin}
                />
              )}
            </>
          )}
        </div>
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm rounded-3" style={{ transition: 'all 0.3s ease' }}>
            <div className="card-body">
              <h5>Alertas de Stock</h5>
              {bajoStock.length ? (
                <ul className="list-group list-group-flush">
                  {bajoStock.map((p) => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center" title={p.categoria?.nombre ? `Categoría: ${p.categoria.nombre}` : 'Stock crítico'}>
                      <span>{p.nombre}</span>
                      <span className={stockBadgeClass(p.stock)} title={p.stock === 0 ? 'Inventario agotado' : 'Stock crítico'}>
                        {stockBadgeText(p.stock)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted d-flex align-items-center gap-2">
                  <span role="img" aria-label="estable">🟢</span>
                  Inventario estable – sin alertas de stock
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            {isSuperAdmin ? (
              <CrearProd />
            ) : (
              <div className="card p-3 shadow-sm rounded-3">
                <h6 className="text-muted mb-0">Solo SUPER_ADMIN puede crear productos</h6>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}