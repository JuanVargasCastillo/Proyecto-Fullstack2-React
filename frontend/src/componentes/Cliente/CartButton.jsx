import { useCart } from '../../context/CartContext'

export default function CartButton() {
  const { cart, openDrawer } = useCart()
  const count = (cart?.items || []).reduce((s, i) => s + (i?.cantidad || 0), 0)
  return (
    <button className="btn position-relative" type="button" onClick={openDrawer} aria-label="Carrito">
      <i className="bi bi-cart3 fs-4"></i>
      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle p-1 rounded-circle" id="cart-count">{count}</span>
    </button>
  )
}