import api from './api'

export async function getCarrito() {
  const { data } = await api.get('/api/carrito')
  return data
}

export async function addItem(productoId, cantidad = 1) {
  const { data } = await api.post('/api/carrito/items', { productoId, cantidad })
  return data
}

export async function updateItem(itemId, cantidad) {
  const { data } = await api.put(`/api/carrito/items/${itemId}`, { cantidad })
  return data
}

export async function removeItem(itemId) {
  const { data } = await api.delete(`/api/carrito/items/${itemId}`)
  return data
}

export async function emptyCart() {
  const { data } = await api.delete('/api/carrito')
  return data
}