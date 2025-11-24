import { createContext, useContext, useEffect, useState } from 'react'
import { useToast } from '../componentes/shared/ToastProvider'
import { addItem, emptyCart, getCarrito, removeItem, updateItem } from '../services/carrito'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ carritoId: null, subtotal: 0, items: [] })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { show } = useToast()

  async function refresh() {
    setLoading(true)
    try {
      const c = await getCarrito()
      setCart(c)
    } catch {
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
        show('Producto agregado al carrito', 'success')
      }
    } catch (err) {
      const status = err?.status
      const code = err?.code || (String(err?.message || '').includes('stockInsuficiente') ? 'stockInsuficiente' : '')
      if (status === 400 && code === 'stockInsuficiente') {
        show('No hay stock disponible para este producto en este momento.', 'warning')
      } else if (status === 401 || status === 403) {
        show('Debes iniciar sesión para usar el carrito.', 'warning')
      } else {
        show('No se pudo agregar el producto al carrito', 'danger')
      }
    }
  }

  async function inc(itemId) {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return
    try {
      const data = await updateItem(itemId, (item.cantidad || 0) + 1)
      if (data) setCart(data)
    } catch (err) {
      const status = err?.status
      const code = err?.code || (String(err?.message || '').includes('stockInsuficiente') ? 'stockInsuficiente' : '')
      if (status === 400 && code === 'stockInsuficiente') {
        show('No hay stock disponible para este producto en este momento.', 'warning')
      } else if (status === 401 || status === 403) {
        show('Debes iniciar sesión para usar el carrito.', 'warning')
      } else {
        show('No se pudo actualizar el carrito', 'danger')
      }
    }
  }

  async function dec(itemId) {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return
    const next = (item.cantidad || 0) - 1
    try {
      const data = await updateItem(itemId, next < 0 ? 0 : next)
      if (data) setCart(data)
    } catch (err) {
      const status = err?.status
      const code = err?.code || (String(err?.message || '').includes('stockInsuficiente') ? 'stockInsuficiente' : '')
      if (status === 400 && code === 'stockInsuficiente') {
        show('No hay stock disponible para este producto en este momento.', 'warning')
      } else if (status === 401 || status === 403) {
        show('Debes iniciar sesión para usar el carrito.', 'warning')
      } else {
        show('No se pudo actualizar el carrito', 'danger')
      }
    }
  }

  async function remove(itemId) {
    try {
      await removeItem(itemId)
      await refresh()
      show('Producto eliminado', 'success')
    } catch {
      show('No se pudo eliminar el producto', 'danger')
    }
  }

  async function empty() {
    try {
      const data = await emptyCart()
      if (data) setCart(data)
    } catch (err) {
      const status = err?.status
      if (status === 401 || status === 403) {
        show('Debes iniciar sesión para usar el carrito.', 'warning')
      } else {
        show('No se pudo vaciar el carrito', 'danger')
      }
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