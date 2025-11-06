import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor de solicitud: agrega Authorization automáticamente si existe token en localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('usuarioLogueado')
      if (raw) {
        const user = JSON.parse(raw)
        const token = user?.token
        if (token && typeof token === 'string') {
          // Si el token ya incluye "Bearer ", úsalo tal cual; si no, prefija
          const value = token.startsWith('Bearer ') ? token : `Bearer ${token}`
          config.headers = config.headers || {}
          config.headers.Authorization = value
        }
      }
    } catch {}
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de respuesta: en 401/403, limpiar sesión y redirigir a login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem('usuarioLogueado')
      } catch {}
      // Redirige al login (navigation fuera de React por simplicidad)
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    const message = err?.response?.data?.error || err?.response?.data || err.message
    return Promise.reject(new Error(typeof message === 'string' ? message : JSON.stringify(message)))
  },
)

export default api