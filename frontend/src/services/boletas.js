import api from './api'

export async function generarBoleta() {
  const { data } = await api.post('/api/boletas')
  return data
}

export async function generarBoletaConEnvio(envio) {
  const { data } = await api.post('/api/boletas/envio', envio)
  return data
}

export async function listarBoletas() {
  const { data } = await api.get('/api/boletas')
  return data
}

export async function listarBoletasAdmin() {
  const { data } = await api.get('/api/admin/boletas')
  return data
}

export async function obtenerBoleta(id) {
  const { data } = await api.get(`/api/boletas/${id}`)
  return data
}