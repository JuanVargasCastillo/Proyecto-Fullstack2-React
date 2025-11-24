import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../shared/ToastProvider'

export default function CartButton() {
  const { cart } = useCart()
  const navigate = useNavigate()
  const { show } = useToast()
  const count = (cart?.items || []).reduce((s, i) => s + (i?.cantidad || 0), 0)
  return (
    <button
      className="btn position-relative"
      type="button"
      onClick={() => {
        if (count <= 0) {
          show('Agrega un producto para ver el carrito', 'warning')
          navigate('/')
        } else {
          navigate('/carrito')
        }
      }}
      aria-label="Carrito"
    >
      <i className="bi bi-cart3 fs-4"></i>
      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle p-1 rounded-circle" id="cart-count">{count}</span>
    </button>
  )
}