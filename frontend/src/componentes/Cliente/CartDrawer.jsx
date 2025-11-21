import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function CartDrawer() {
  const { cart, open, closeDrawer, inc, dec, remove } = useCart()
  const navigate = useNavigate()

  const total = Number(cart?.subtotal || 0)

  return (
    <div id="carritoLateral" className="carrito-lateral" style={{ right: open ? 0 : -400 }}>
      <div className="carrito-header">
        <h5>Mi Carrito</h5>
        <button id="cerrarCarrito" className="btn-cerrar" onClick={closeDrawer}>&times;</button>
      </div>
      <div className="carrito-body">
        <ul id="listaCarrito" className="list-unstyled">
          {(cart?.items || []).map((item) => (
            <li key={item.id} className="d-flex align-items-center mb-3">
              <div className="flex-grow-1">
                <strong>{item.nombre}</strong><br />
                ${new Intl.NumberFormat('es-CL').format(Number(item.precioUnitario || 0))}
              </div>
              <div className="d-flex align-items-center">
                <button className="btn btn-cantidad me-1" onClick={() => dec(item.id)}>-</button>
                <span className="px-2">{item.cantidad}</span>
                <button className="btn btn-cantidad ms-1" onClick={() => inc(item.id)}>+</button>
                <button className="btn btn-eliminar ms-2" onClick={() => remove(item.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="total text-end mt-3">
          <strong>Total: ${new Intl.NumberFormat('es-CL').format(total)}</strong>
        </div>
      </div>
      <div className="carrito-footer d-flex justify-content-between mt-3">
        <button id="volver" className="btn btn-volver" onClick={closeDrawer}>Volver</button>
        <button id="continuar" className="btn btn-primary" onClick={() => { closeDrawer(); navigate('/checkout') }}>Continuar</button>
      </div>
    </div>
  )
}