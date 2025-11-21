import { useCart } from '../../context/CartContext'

export default function CartOverlay() {
  const { open, closeDrawer } = useCart()
  return (
    <div className="fondo-carrito" style={{ display: open ? 'block' : 'none' }} onClick={closeDrawer}></div>
  )
}