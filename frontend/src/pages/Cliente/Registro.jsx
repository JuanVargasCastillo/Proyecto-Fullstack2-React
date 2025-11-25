import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import '../../assets/styles/registro.css'

const REGIONES_Y_COMUNAS = {
  'Región Metropolitana': ['Santiago', 'Maipú', 'Ñuñoa', 'Puente Alto', 'Providencia'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón'],
  'Biobío': ['Concepción', 'Talcahuano', 'Chiguayante', 'San Pedro de la Paz'],
  'Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla'],
}

export default function Registro() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [telefono, setTelefono] = useState('')
  const [region, setRegion] = useState('')
  const [comuna, setComuna] = useState('')
  const [mensajePassword, setMensajePassword] = useState('')
  const [pwdClass, setPwdClass] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [errores, setErrores] = useState('')
  const [okMsg, setOkMsg] = useState('')
  const comunas = useMemo(() => REGIONES_Y_COMUNAS[region] || [], [region])

  function getPwdStrength(p) {
    if (!p || p.length <= 8) return { text: 'Débil', cls: 'pwd-weak' }
    const hasUpper = /[A-Z]/.test(p)
    if (hasUpper) return { text: 'Fuerte', cls: 'pwd-strong' }
    return { text: 'Media', cls: 'pwd-medium' }
  }

  function validarPasswordLive(p, c) {
    const s = getPwdStrength(p)
    setMensajePassword(s.text)
    setPwdClass(s.cls)
    if (c && p !== c) return false
    return p && p.length >= 8
  }

  function onPassChange(v) {
    setPassword(v)
    validarPasswordLive(v, confirm)
  }

  function onConfirmChange(v) {
    setConfirm(v)
    validarPasswordLive(password, v)
  }

  function onEmailChange(v) {
    setEmail(v)
    const ok = /^[^\s@]+@(gmail\.com|hotmail\.com|duocuc\.cl|duoc\.profesor\.cl)$/.test(String(v).trim())
    const msg = 'Correo inválido. Solo se aceptan: @gmail.com, @hotmail.com, @duocuc.cl, @duoc.profesor.cl'
    setEmailError(ok ? '' : msg)
  }

  function onTelefonoChange(v) {
    const digits = String(v).replace(/\D/g, '')
    setTelefono(digits)
    if (digits.length > 9) setPhoneError('Teléfono inválido (máximo 9 dígitos)')
    else setPhoneError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErrores('')
    setOkMsg('')

    const emailOk = /^[^\s@]+@(gmail\.com|hotmail\.com|duocuc\.cl|duoc\.profesor\.cl)$/.test(email.trim())
    if (!nombre.trim()) { setErrores('El nombre es obligatorio'); return }
    if (!emailOk) { setErrores('Correo inválido. Solo se aceptan: @gmail.com, @hotmail.com, @duocuc.cl, @duoc.profesor.cl'); return }
    if (!password || password.length < 8) { setErrores('La contraseña debe tener al menos 8 caracteres'); return }
    if (password !== confirm) { setErrores('Las contraseñas no coinciden'); return }

    if (telefono && !/^\d{9}$/.test(telefono)) { setErrores('Teléfono inválido (9 dígitos)'); return }
    if ((region && !comuna) || (!region && comuna)) { setErrores('Debe seleccionar región y comuna'); return }

    const payload = { nombre: nombre.trim(), email: email.trim(), password }
    if (telefono) payload.telefono = telefono
    if (region) payload.region = region
    if (comuna) payload.comuna = comuna

    try {
      await api.post('/api/users/admin/crear-usuario', payload)
      const u = await login(email.trim(), password)
      setOkMsg('Usuario registrado correctamente. Redirigiendo...')
      setTimeout(() => navigate('/'), 800)
    } catch (err) {
      const msg = String(err?.message || '')
      if (msg.includes('duplicate') || msg.includes('Unique') || msg.includes('exists') || msg.includes('email')) {
        setErrores('El correo ya está registrado')
      } else {
        setErrores('Error al registrar usuario')
      }
    }
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form id="formRegistro" onSubmit={onSubmit}>
            <div className="titulo-registro">Registro de Usuario</div>

            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre completo:</label>
              <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo electrónico:</label>
              <input type="email" className="form-control" id="correo" value={email} onChange={(e) => onEmailChange(e.target.value)} required />
              {emailError ? <div className="error-text mt-1">{emailError}</div> : null}
            </div>

            <div className="mb-3">
              <label htmlFor="pass" className="form-label">Contraseña:</label>
              <input type="password" className="form-control" id="pass" value={password} onChange={(e) => onPassChange(e.target.value)} required />
              <div className="pwd-feedback d-flex align-items-center gap-2 mt-1">
                <span className={`pwd-dot ${pwdClass}-dot`} aria-hidden="true"></span>
                <span className={`fw-bold ${pwdClass}`}>{mensajePassword}</span>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPass" className="form-label">Confirmar contraseña:</label>
              <input type="password" className="form-control" id="confirmPass" value={confirm} onChange={(e) => onConfirmChange(e.target.value)} required />
              {confirm ? (
                password && confirm === password ? (
                  <div className="confirm-feedback mt-1"><i className="bi bi-check-circle-fill confirm-icon ok"></i></div>
                ) : (
                  <div className="confirm-feedback mt-1"><i className="bi bi-x-circle-fill confirm-icon bad"></i></div>
                )
              ) : null}
            </div>

            <div className="mb-3">
              <label htmlFor="telefono" className="form-label">Teléfono:</label>
              <input type="text" className={`form-control ${phoneError ? 'is-invalid' : ''}`} id="telefono" value={telefono} onChange={(e) => onTelefonoChange(e.target.value)} placeholder="9 dígitos" inputMode="numeric" />
              {phoneError ? <div className="invalid-feedback d-block">{phoneError}</div> : null}
            </div>

            <div className="mb-3">
              <label htmlFor="region" className="form-label">Seleccione Región:</label>
              <select id="region" className="form-select" value={region} onChange={(e) => { setRegion(e.target.value); setComuna('') }}>
                <option value="">Seleccione región</option>
                {Object.keys(REGIONES_Y_COMUNAS).map((r) => (<option key={r} value={r}>{r}</option>))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="comuna" className="form-label">Seleccione Comuna:</label>
              <select id="comuna" className="form-select" value={comuna} onChange={(e) => setComuna(e.target.value)}>
                <option value="">Seleccione comuna</option>
                {comunas.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>

            <div id="errores" className="mb-3 fw-bold" style={{ color: errores ? 'red' : 'inherit' }}>{errores}</div>
            {okMsg ? <div className="mb-3 fw-bold" style={{ color: 'green' }}>{okMsg}</div> : null}

            <div className="text-center">
              <input type="submit" value="Registrar Usuario" className="btn btn-registrar me-2" disabled={Boolean(phoneError)} />
              <input type="reset" value="Limpiar Formulario" className="btn btn-limpiar" onClick={() => { setErrores(''); setOkMsg(''); setMensajePassword(''); setRegion(''); setComuna(''); setTelefono(''); setPassword(''); setConfirm(''); setNombre(''); setEmail('') }} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}