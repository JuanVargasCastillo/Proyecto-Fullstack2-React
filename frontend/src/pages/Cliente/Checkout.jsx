import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { generarBoletaConEnvio } from '../../services/boletas'
import { useState, useMemo } from 'react'
import { useToast } from '../../componentes/shared/ToastProvider'

export default function Checkout() {
  const { cart, empty, refresh } = useCart()
  const navigate = useNavigate()
  const { show } = useToast()

  const REGIONES_Y_COMUNAS = {
    'Región Metropolitana': ['Santiago', 'Maipú', 'Ñuñoa', 'Puente Alto', 'Providencia'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón'],
    'Biobío': ['Concepción', 'Talcahuano', 'Chiguayante', 'San Pedro de la Paz'],
    'Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla'],
  }
  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|duocuc\.cl|duoc\.profesor\.cl)$/

  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    departamento: '',
    region: '',
    comuna: '',
    indicacionesEntrega: ''
  })

  const [emailError, setEmailError] = useState('')
  const [comunaError, setComunaError] = useState('')
  const comunas = useMemo(() => REGIONES_Y_COMUNAS[form.region] || [], [form.region])

  const items = useMemo(() => (Array.isArray(cart?.items) ? cart.items : []), [cart?.items])
  const coupon = useMemo(() => String(localStorage.getItem('cupon') || '').toUpperCase(), [])
  const totalProductos = useMemo(() => (items.reduce((s, i) => s + Number(i?.totalLinea || 0), 0)), [items])
  const descuento = useMemo(() => {
    if (coupon === 'CLUB10') return Math.round(totalProductos * 0.10)
    if (coupon === 'BIENVENIDA5') return Math.round(totalProductos * 0.05)
    return 0
  }, [coupon, totalProductos])
  const subtotalConDescuento = useMemo(() => {
    const v = totalProductos - descuento
    return v > 0 ? v : 0
  }, [totalProductos, descuento])
  const costoEnvio = useMemo(() => (subtotalConDescuento > 20000 ? 0 : 3000), [subtotalConDescuento])
  const neto = useMemo(() => (subtotalConDescuento > 0 ? Math.round(subtotalConDescuento / 1.19) : 0), [subtotalConDescuento])
  const iva = useMemo(() => Math.round(subtotalConDescuento - neto), [subtotalConDescuento, neto])
  const total = useMemo(() => Math.round(subtotalConDescuento + costoEnvio), [subtotalConDescuento, costoEnvio])

  async function pagar() {
    try {
      const correoOk = emailRegex.test(String(form.correo || '').trim())
      if (!correoOk) {
        const msg = 'Correo inválido. Solo se aceptan: @gmail.com, @hotmail.com, @duocuc.cl, @duoc.profesor.cl.'
        setEmailError(msg)
        show(msg, 'danger')
        return
      }
      if (!form.region) {
        show('Seleccione una región', 'danger')
        return
      }
      if (!form.comuna || !comunas.includes(form.comuna)) {
        setComunaError('Seleccione una comuna válida')
        show('Seleccione una comuna válida', 'danger')
        return
      }
      const b = await generarBoletaConEnvio({ ...form, codigoCupon: coupon || null })
      await empty()
      await refresh()
      navigate(`/boleta/${b.id}`)
    } catch (e) {
      const status = e?.status
      const code = e?.code || (String(e?.message || '').includes('stockInsuficiente') ? 'stockInsuficiente' : '')
      if (status === 400 && code === 'stockInsuficiente') {
        show('No hay stock disponible para este producto en este momento.', 'warning')
      } else if (status === 401 || status === 403) {
        show('Debes iniciar sesión para usar el carrito.', 'warning')
      } else {
        show('Error al pagar', 'danger')
      }
    }
  }

  return (
      <div className="container my-3">
        <div className="row">
          <div className="col-md-8">
            {(cart?.items || []).map((item) => (
              <div className="card-producto" key={item.id}>
                <div className="flex-grow-1">
                  <strong>{item.nombre}</strong>
                  <div className="text-muted">Cantidad: {item.cantidad}</div>
                </div>
                <div className="precio">${new Intl.NumberFormat('es-CL').format(Number(item.totalLinea || 0))}</div>
              </div>
            ))}
            <div className="card p-3 mt-3">
              <h6 className="mb-2">Dirección de envío</h6>
              <div className="row g-2">
                <div className="col-md-6">
                  <input className="form-control" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Apellidos" value={form.apellidos} onChange={(e) => setForm((f) => ({ ...f, apellidos: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <input
                    type="email"
                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                    placeholder="Correo"
                    value={form.correo}
                    onChange={(e) => {
                      const v = e.target.value
                      setForm((f) => ({ ...f, correo: v }))
                      const ok = emailRegex.test(String(v).trim())
                      setEmailError(ok ? '' : 'Correo inválido. Solo se aceptan: @gmail.com, @hotmail.com, @duocuc.cl, @duoc.profesor.cl.')
                    }}
                  />
                  {emailError ? <div className="invalid-feedback d-block">{emailError}</div> : null}
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Calle" value={form.calle} onChange={(e) => setForm((f) => ({ ...f, calle: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Departamento (opcional)" value={form.departamento} onChange={(e) => setForm((f) => ({ ...f, departamento: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={form.region}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value, comuna: '' }))}
                  >
                    <option value="">Seleccione región</option>
                    {Object.keys(REGIONES_Y_COMUNAS).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <select
                    className={`form-select ${comunaError ? 'is-invalid' : ''}`}
                    value={form.comuna}
                    onChange={(e) => {
                      const v = e.target.value
                      setForm((f) => ({ ...f, comuna: v }))
                      const ok = v && comunas.includes(v)
                      setComunaError(ok ? '' : 'Seleccione una comuna válida')
                    }}
                    disabled={!form.region}
                  >
                    <option value="">Seleccione comuna</option>
                    {comunas.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {comunaError ? <div className="invalid-feedback d-block">{comunaError}</div> : null}
                </div>
                <div className="col-12">
                  <input className="form-control" placeholder="Indicaciones de entrega (opcional)" value={form.indicacionesEntrega} onChange={(e) => setForm((f) => ({ ...f, indicacionesEntrega: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="resumen-compra">
              <h5>Resumen</h5>
              <div className="d-flex justify-content-between">
                <span>Subtotal con descuento</span>
                <span className="precio">${new Intl.NumberFormat('es-CL').format(subtotalConDescuento)}</span>
              </div>
              {descuento > 0 ? (
                <div className="d-flex justify-content-between mt-1 text-muted small">
                  <span>Descuento ({coupon})</span>
                  <span className="precio">-${new Intl.NumberFormat('es-CL').format(descuento)}</span>
                </div>
              ) : null}
              <div className="d-flex justify-content-between mt-1 text-muted small">
                <span>IVA (19% incluido)</span>
                <span className="precio">${new Intl.NumberFormat('es-CL').format(iva)}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Envío</span>
                <span className="precio">${new Intl.NumberFormat('es-CL').format(costoEnvio)}</span>
              </div>
              <div className="d-flex justify-content-between mt-2 fw-bold">
                <span>Total</span>
                <span className="precio">${new Intl.NumberFormat('es-CL').format(total)}</span>
              </div>
              <button
                className="btn btn-pagar mt-3"
                onClick={pagar}
                disabled={Boolean(emailError) || Boolean(comunaError) || !form.region || !form.comuna}
              >
                Pagar
              </button>
              <button className="btn btn-seguir" onClick={() => navigate('/')}>Seguir comprando</button>
            </div>
          </div>
        </div>
      </div>
  )
}