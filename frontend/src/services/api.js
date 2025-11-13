import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err?.response?.data?.error || err?.response?.data || err.message
    return Promise.reject(new Error(typeof message === 'string' ? message : JSON.stringify(message)))
  },
)

export default api