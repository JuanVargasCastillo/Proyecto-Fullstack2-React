export default function ProductosList({ productos = [], onDelete }) {
  if (!productos.length) {
    return <p className="text-muted">No hay productos para mostrar.</p>
  }
  return (
    <div className="row g-3">
      {productos.map((p) => (
        <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
          <div className="card h-100">
            {p.imagenUrl ? (
              <img src={`http://localhost:8080${p.imagenUrl}`} className="card-img-top" alt={p.nombre} />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 150 }}>
                <span className="text-secondary">Sin imagen</span>
              </div>
            )}
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{p.nombre}</h5>
              {p.descripcion && <p className="card-text text-muted">{p.descripcion}</p>}
              <div className="mt-auto d-flex justify-content-between">
                <span className="fw-bold">${p.precio}</span>
                <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>Stock: {p.stock}</span>
              </div>
              <div className="mt-2 text-end">
                {onDelete && (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(p.id)}>Eliminar</button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}