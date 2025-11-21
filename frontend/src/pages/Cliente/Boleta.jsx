import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { obtenerBoleta } from '../../services/boletas'

export default function Boleta() {
  const { id } = useParams()
  const [boleta, setBoleta] = useState(null)

  useEffect(() => {
    obtenerBoleta(id).then(setBoleta).catch(() => {})
  }, [id])

  return (
      <div className="container my-3">
        {!boleta ? (
          <div className="text-center my-4"><div className="spinner-border text-success" role="status"></div></div>
        ) : (
          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">Boleta #{boleta.correlativo}</h5>
              <div className="mb-2">Total: <strong>${new Intl.NumberFormat('es-CL').format(Number(boleta.total || 0))}</strong></div>
              <ul className="list-unstyled mt-3">
                {(boleta?.detalles || []).map((d, i) => (
                  <li key={i} className="d-flex justify-content-between">
                    <span>{d.nombre} x {d.cantidad}</span>
                    <span>${new Intl.NumberFormat('es-CL').format(Number(d.totalLinea || 0))}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
  )
}