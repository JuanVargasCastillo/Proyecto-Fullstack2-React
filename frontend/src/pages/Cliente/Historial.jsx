import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarBoletas } from '../../services/boletas'
import { useToast } from '../../componentes/shared/ToastProvider'

export default function Historial() {
  const [boletas, setBoletas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { show } = useToast()

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true)
        const data = await listarBoletas()
        const arr = Array.isArray(data) ? data : []
        const ordenadas = arr.slice().sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
        setBoletas(ordenadas)
      } catch (e) {
        setError('No se pudo cargar tu historial de compras. Intenta nuevamente más tarde.')
        show(e?.message || 'Error al cargar historial', 'danger')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  if (loading) {
    return (
      <div className="container my-4 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <div className="mt-2">Cargando historial…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    )
  }

  if (!boletas.length) {
    return (
      <div className="container my-4">
        <div className="card p-4 text-center">
          <h5 className="mb-2">Aún no has realizado compras 🐰</h5>
          <button className="btn btn-volver" onClick={() => navigate('/')}>Ir a la tienda</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-4">
      <h4 className="mb-3">Historial de compras</h4>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>N° Boleta</th>
              <th>Fecha</th>
              <th>Subtotal</th>
              <th>Envío</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {boletas.map((b) => (
              <tr key={b.id}>
                <td>#{b.correlativo || b.id}</td>
                <td>{new Date(b.creadoEn).toLocaleString('es-CL')}</td>
                <td>${new Intl.NumberFormat('es-CL').format(Number(b.subtotal || 0))}</td>
                <td>${new Intl.NumberFormat('es-CL').format(Number(b.costoEnvio || 0))}</td>
                <td>${new Intl.NumberFormat('es-CL').format(Number(b.total || 0))}</td>
                <td className="text-end">
                  <button className="btn btn-outline-primary" onClick={() => navigate(`/boleta/${b.id}`)}>Ver detalle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}