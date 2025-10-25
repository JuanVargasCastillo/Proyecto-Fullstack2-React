import api from './api'

export async function crearProducto(prod) {
  const { data } = await api.post('/api/productos', prod)
  return data
}

export async function obtenerProducto(id) {
  const { data } = await api.get(`/api/productos/${id}`)
  return data
}

export async function listarProductos({ nombre, categoriaId } = {}) {
  const { data } = await api.get('/api/productos', { params: { nombre, categoriaId } })
  return data
}

export async function actualizarProducto(id, prod) {
  const { data } = await api.put(`/api/productos/${id}`, prod)
  return data
}

export async function eliminarProducto(id) {
  await api.delete(`/api/productos/${id}`)
}

export async function actualizarStock(id, stock) {
  const { data } = await api.patch(`/api/productos/${id}/stock`, { stock })
  return data
}

export async function subirImagenProducto(id, file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post(`/api/productos/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function listarPorCategoria(categoriaId) {
  const { data } = await api.get(`/api/productos/categoria/${categoriaId}`)
  return data
}

export async function listarStockBajo(threshold = 5) {
  const { data } = await api.get('/api/productos/low-stock', { params: { threshold } })
  return data
}

export async function listarProductosBajoStock(threshold = 5) {
  const { data } = await api.get('/api/productos')
  return Array.isArray(data) ? data.filter((p) => Number(p?.stock ?? 0) < threshold) : []
}

export async function desactivarProducto(id) {
  const { data } = await api.patch(`/api/productos/${id}/desactivar`)
  return data
}