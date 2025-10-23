import api from './api'

export async function listarUsuarios() {
  const { data } = await api.get('/api/users')
  return data
}

export async function crearUsuario(user) {
  const { data } = await api.post('/api/users', user)
  return data
}

export async function actualizarUsuario(id, user) {
  const { data } = await api.put(`/api/users/${id}`, user)
  return data
}

export async function eliminarUsuario(id) {
  await api.delete(`/api/users/${id}`)
}

export async function cambiarEstadoUsuario(id, activo) {
  const { data } = await api.patch(`/api/users/${id}/estado`, null, { params: { activo } })
  return data
}