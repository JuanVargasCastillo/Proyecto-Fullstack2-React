import api from './api'

export async function enviarContacto(payload) {
  try {
    const { data } = await api.post('/api/contacto', payload)
    return data
  } catch (err) {
    return Promise.resolve({ ok: true })
  }
}