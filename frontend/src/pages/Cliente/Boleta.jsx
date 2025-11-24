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
              <div className="text-muted mb-2">Fecha de compra: {new Date(boleta.creadoEn).toLocaleDateString('es-CL')}</div>
              <div className="d-flex justify-content-between">
                <span>Subtotal con descuento</span>
                <span className="precio">${new Intl.NumberFormat('es-CL').format(Number(boleta.subtotal || 0))}</span>
              </div>
              {Number(boleta.descuento || 0) > 0 ? (
                <div className="d-flex justify-content-between mt-1 text-muted">
                  <span>Descuento ({boleta.codigoCupon})</span>
                  <span className="precio">-${new Intl.NumberFormat('es-CL').format(Number(boleta.descuento || 0))}</span>
                </div>
              ) : null}
              <div className="d-flex justify-content-between mt-1">
                <span>Neto</span>
                <span className="precio">${new Intl.NumberFormat('es-CL').format(Number(boleta.neto || 0))}</span>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <span>IVA</span>
                <span className="precio">${new Intl.NumberFormat('es-CL').format(Number(boleta.iva || 0))}</span>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <span>Envío</span>
                <span className="precio">${new Intl.NumberFormat('es-CL').format(Number(boleta.costoEnvio || 0))}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Total</span>
                <span className="precio fw-bold">${new Intl.NumberFormat('es-CL').format(Number(boleta.total || 0))}</span>
              </div>
              {boleta?.envio ? (
                <div className="mb-3">
                  <div className="fw-bold">Dirección de envío</div>
                  <div className="text-muted">{boleta.envio.nombre} {boleta.envio.apellidos}</div>
                  <div className="text-muted">{boleta.envio.correo}</div>
                  <div className="text-muted">{boleta.envio.calle}{boleta.envio.departamento ? `, ${boleta.envio.departamento}` : ''}</div>
                  <div className="text-muted">{boleta.envio.comuna}, {boleta.envio.region}</div>
                  {boleta.envio.indicacionesEntrega ? <div className="text-muted">{boleta.envio.indicacionesEntrega}</div> : null}
                </div>
              ) : null}
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