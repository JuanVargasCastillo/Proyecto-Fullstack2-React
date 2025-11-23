import { createContext, useContext, useEffect, useState } from 'react'
import { addItem, emptyCart, getCarrito, removeItem, updateItem } from '../services/carrito'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ carritoId: null, subtotal: 0, items: [] })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      const c = await getCarrito()
      setCart(c)
    } catch (e) {
      // Ignorar 401 si no hay sesión
    } finally {
      setLoading(false)
    }
  }

  async function add(productoId, cantidad = 1) {
    try {
      const data = await addItem(productoId, cantidad)
      if (data) {
        setCart(data)
        setOpen(true)
      }
    } catch (e) {
      window.location.href = '/login'
    }
  }

  async function inc(itemId) {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return
    try {
      const data = await updateItem(itemId, (item.cantidad || 0) + 1)
      if (data) setCart(data)
    } catch (e) {
      window.location.href = '/login'
    }
  }

  async function dec(itemId) {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return
    const next = (item.cantidad || 0) - 1
    try {
      const data = await updateItem(itemId, next < 0 ? 0 : next)
      if (data) setCart(data)
    } catch (e) {
      window.location.href = '/login'
    }
  }

  async function remove(itemId) {
    try {
      const data = await removeItem(itemId)
      if (data) setCart(data)
    } catch (e) {
      window.location.href = '/login'
    }
  }

  async function empty() {
    try {
      const data = await emptyCart()
      if (data) setCart(data)
    } catch (e) {
      window.location.href = '/login'
    }
  }

  async function openDrawer() { await refresh(); setOpen(true) }
  function closeDrawer() { setOpen(false) }

  useEffect(() => { refresh() }, [])

  const value = {
    cart,
    loading,
    open,
    openDrawer,
    closeDrawer,
    refresh,
    add,
    inc,
    dec,
    remove,
    empty,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}