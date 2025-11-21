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
    } finally {
      setLoading(false)
    }
  }

  async function add(productoId, cantidad = 1) {
    await addItem(productoId, cantidad)
    await refresh()
    setOpen(true)
  }

  async function inc(itemId) {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return
    await updateItem(itemId, (item.cantidad || 0) + 1)
    await refresh()
  }

  async function dec(itemId) {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return
    const next = (item.cantidad || 0) - 1
    await updateItem(itemId, next < 0 ? 0 : next)
    await refresh()
  }

  async function remove(itemId) {
    await removeItem(itemId)
    await refresh()
  }

  async function empty() {
    await emptyCart()
    await refresh()
  }

  function openDrawer() { setOpen(true) }
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