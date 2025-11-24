import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('user')
    if (raw) {
      const u = JSON.parse(raw)
      const t = u?.token
      if (t) {
        config.headers.Authorization = `Bearer ${t}`
      }
    }
  } catch {}
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const data = err?.response?.data
    const code = data?.error
    const message = code || data || err.message
    const e = new Error(typeof message === 'string' ? message : JSON.stringify(message))
    e.status = status
    e.data = data
    e.code = code
    return Promise.reject(e)
  },
)

export default api