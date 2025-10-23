import { useEffect, useState } from 'react'
import { listarCategorias } from '../../services/categorias'
import { useToast } from '../../componentes/shared/ToastProvider'

export default function Home() {
  const { show } = useToast()
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listarCategorias().then(setCategorias).catch((e) => show(e.message, 'danger')).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container py-5">
          <h1 className="display-5 fw-bold">Tienda Virtual – Panel</h1>
          <p className="col-md-8 fs-5">Administra usuarios y productos de ropa reutilizada.</p>
        </div>
      </div>
      <h5 className="mb-3">Categorías</h5>
      {loading ? (
        <div className="text-center"><div className="spinner-border" role="status"></div></div>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {categorias.map((c) => (
            <span className="badge bg-secondary" key={c.id}>{c.nombre}</span>
          ))}
        </div>
      )}
    </div>
  )
}