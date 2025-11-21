import { useEffect, useState } from 'react'
import { listarBoletas } from '../../services/boletas'

export default function Historial() {
  const [boletas, setBoletas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listarBoletas().then(setBoletas).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
      <div className="container my-3">
        <h5 className="mb-3">Historial de Compras</h5>
        {loading ? (
          <div className="text-center my-4"><div className="spinner-border text-success" role="status"></div></div>
        ) : (
          <div className="list-group">
            {boletas.map((b) => (
              <a key={b.id} href={`/boleta/${b.id}`} className="list-group-item list-group-item-action">
                Boleta #{b.correlativo} — Total ${new Intl.NumberFormat('es-CL').format(Number(b.total || 0))}
              </a>
            ))}
          </div>
        )}
      </div>
  )
}