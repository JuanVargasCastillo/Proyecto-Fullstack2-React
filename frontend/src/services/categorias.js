import api from './api'

export async function listarCategorias() {
  const { data } = await api.get('/api/categorias')
  return data
}