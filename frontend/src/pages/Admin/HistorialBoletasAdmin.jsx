import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarBoletasAdmin } from '../../services/boletas'
import { useToast } from '../../componentes/shared/ToastProvider'

export default function HistorialBoletasAdmin() {
  const [boletas, setBoletas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { show } = useToast()

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true)
        const data = await listarBoletasAdmin()
        const arr = Array.isArray(data) ? data : []
        const ordenadas = arr.slice().sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
        setBoletas(ordenadas)
      } catch (e) {
        setError('No se pudo cargar el historial de ventas. Inténtalo nuevamente más tarde.')
        show(e?.message || 'Error al cargar historial de ventas', 'danger')
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
        <div className="mt-2">Cargando ventas…</div>
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
          <h5 className="mb-2">Aún no hay ventas registradas.</h5>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-4">
      <h4 className="mb-3">Historial de ventas</h4>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>N° Boleta</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Subtotal</th>
              <th>Envío</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {boletas.map((b) => {
              const fecha = new Date(b.creadoEn).toLocaleDateString('es-CL')
              const cliente = b?.envio?.nombre && b?.envio?.apellidos ? `${b.envio.nombre} ${b.envio.apellidos}` : '—'
              const correo = b?.envio?.correo || '—'
              return (
                <tr key={b.id}>
                  <td>#{b.correlativo || b.id}</td>
                  <td>{fecha}</td>
                  <td>{cliente}</td>
                  <td>{correo}</td>
                  <td>${new Intl.NumberFormat('es-CL').format(Number(b.subtotal || 0))}</td>
                  <td>${new Intl.NumberFormat('es-CL').format(Number(b.costoEnvio || 0))}</td>
                  <td>${new Intl.NumberFormat('es-CL').format(Number(b.total || 0))}</td>
                  <td className="text-end">
                    <Link className="btn btn-verde-pastel" to={`/boleta/${b.id}`}>Ver detalle</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}