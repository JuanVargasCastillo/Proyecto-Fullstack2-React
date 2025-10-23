import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../componentes/shared/ToastProvider'

export default function Login() {
  const { login } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!email) errs.email = 'El correo es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Formato de correo inválido'
    if (!password) errs.password = 'La contraseña es obligatoria'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      const user = await login(email, password)
      show(`Bienvenido ${user.nombre}`, 'success')
      navigate('/dashboard')
    } catch (err) {
      show(err.message || 'Error de autenticación', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow" style={{ maxWidth: 420, width: '100%' }}>
        <div className="card-header text-center" style={{ backgroundColor: '#1f8a4b', color: '#fff' }}>
          <div className="d-flex flex-column align-items-center py-2">
            {/* Logo GreenBunny: reemplazar src por la ruta real cuando esté disponible */}
            <div className="fw-bold fs-5">GreenBunny</div>
            <small className="text-white-50">Panel de Administración</small>
          </div>
        </div>
        <div className="card-body">
          <h5 className="mb-3 text-center">Iniciar sesión</h5>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-2">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <a href="#" className="text-decoration-none" onClick={(e) => e.preventDefault()}>¿Has olvidado tu contraseña?</a>
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}