import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { generarBoleta } from '../../services/boletas'

export default function Checkout() {
  const { cart } = useCart()
  const navigate = useNavigate()

  async function pagar() {
    try {
      const b = await generarBoleta()
      navigate(`/boleta/${b.id}`)
    } catch {}
  }

  return (
      <div className="container my-3">
        <div className="row">
          <div className="col-md-8">
            {(cart?.items || []).map((item) => (
              <div className="card-producto" key={item.id}>
                <div className="flex-grow-1">
                  <strong>{item.nombre}</strong>
                  <div className="text-muted">Cantidad: {item.cantidad}</div>
                </div>
                <div className="precio">${new Intl.NumberFormat('es-CL').format(Number(item.totalLinea || 0))}</div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <div className="resumen-compra">
              <h5>Resumen</h5>
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span className="precio">${new Intl.NumberFormat('es-CL').format(Number(cart?.subtotal || 0))}</span>
              </div>
              <button className="btn btn-pagar mt-3" onClick={pagar}>Pagar</button>
              <button className="btn btn-seguir" onClick={() => navigate('/')}>Seguir comprando</button>
            </div>
          </div>
        </div>
      </div>
  )
}