export default function ProductosList({ productos = [], onDelete, canDelete = true, searchQuery = '', categoryId = '' }) {
  const formatPrice = (value) => {
    try {
      const n = Number(value)
      return n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
    } catch {
      return `$${value}`
    }
  }

  const stockBadge = (stock) => {
    if (stock === 0) {
      return { cls: 'badge bg-danger', text: 'Sin stock', title: 'Inventario agotado' }
    }
    if (stock < 5) {
      return { cls: 'badge bg-warning text-dark', text: `⚠️ Stock: ${stock}`, title: 'Stock crítico' }
    }
    return { cls: 'badge bg-success', text: `Stock: ${stock}`, title: 'Stock disponible' }
  }

  // Filtrado client-side por nombre y categoría
  const q = String(searchQuery || '').trim().toLowerCase()
  const cid = String(categoryId || '').trim()
  const filtered = productos
    .filter((p) => !q || String(p.nombre || '').toLowerCase().includes(q))
    .filter((p) => !cid || String(p?.categoria?.id ?? '') === cid)

  // Mensajes según estado y búsqueda/categoría
  if (!productos.length && !q && !cid) {
    return <p className="text-center text-muted my-4">No hay productos registrados todavía 🛒</p>
  }
  if ((q || cid) && !filtered.length) {
    return <p className="text-center text-muted my-4">No se encontraron productos</p>
  }

  return (
    <div className="row g-3">
      {filtered.map((p) => {
        const isLowStock = p.stock < 5 && p.stock > 0
        const isOutOfStock = p.stock === 0
        const badge = stockBadge(p.stock)
        
        const cardStyle = {
          transition: 'all 0.3s ease',
          borderColor: isOutOfStock ? '#e74c3c' : (isLowStock ? '#f7cad0' : undefined),
          borderWidth: (isOutOfStock || isLowStock) ? '2px' : '1px'
        }
        
        const thumbUrl = p.imagenUrl ? `http://localhost:8080${p.imagenUrl}` : null
        
        return (
          <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
            <div 
              className="card h-100 shadow-sm rounded-3" 
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Imagen de producto estilo catálogo */}
              <div className="d-flex justify-content-center pt-3">
                {thumbUrl ? (
                  <>
                    {/* Desktop / md+ */}
                    <img
                      src={thumbUrl}
                      alt={p.nombre}
                      className="d-none d-md-block"
                      style={{
                        width: 200,
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 10,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)'
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1), 0 0 10px rgba(102, 187, 106, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    {/* Mobile / sm */}
                    <img
                      src={thumbUrl}
                      alt={p.nombre}
                      className="d-block d-md-none w-100"
                      style={{
                        height: 160,
                        objectFit: 'cover',
                        borderRadius: 10,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)'
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1), 0 0 10px rgba(102, 187, 106, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  </>
                ) : (
                  <>
                    {/* Placeholder Desktop / md+ */}
                    <div
                      className="d-none d-md-flex align-items-center justify-content-center"
                      style={{
                        width: 200,
                        height: 200,
                        backgroundColor: '#f0f0f0',
                        borderRadius: 10,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)'
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1), 0 0 10px rgba(102, 187, 106, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      <i className="bi bi-image" style={{ fontSize: '2rem', color: '#777' }}></i>
                      <span className="ms-2" style={{ color: '#777' }}>Sin imagen</span>
                    </div>
                    {/* Placeholder Mobile / sm */}
                    <div
                      className="d-flex d-md-none align-items-center justify-content-center w-100"
                      style={{
                        height: 160,
                        backgroundColor: '#f0f0f0',
                        borderRadius: 10,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)'
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1), 0 0 10px rgba(102, 187, 106, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      <i className="bi bi-image" style={{ fontSize: '2rem', color: '#777' }}></i>
                      <span className="ms-2" style={{ color: '#777' }}>Sin imagen</span>
                    </div>
                  </>
                )}
              </div>

              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-center">{p.nombre}</h5>
                {p.categoria?.nombre && (
                  <p className="text-center text-muted mb-2">
                    <i className="bi bi-tag me-1"></i>
                    {p.categoria.nombre}
                  </p>
                )}
                {p.descripcion && (
                  <p className="card-text text-muted text-center">{p.descripcion}</p>
                )}
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold" style={{ color: 'var(--gb-green)' }}>
                      {formatPrice(p.precio)}
                    </span>
                    <span className={badge.cls} title={badge.title}>
                      {badge.text}
                    </span>
                  </div>
                  <div className="text-center">
                    {onDelete && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(p.id)}
                        disabled={!canDelete}
                        title={!canDelete ? 'Acción disponible solo para SUPER_ADMIN' : 'Eliminar'}
                        style={{ transition: 'all 0.3s ease' }}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}