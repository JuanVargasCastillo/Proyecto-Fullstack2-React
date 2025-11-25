import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import api from '../../services/api'
import { obtenerProducto } from '../../services/productos'

export default function Carrito() {
  const { cart, inc, dec, remove } = useCart()
  const navigate = useNavigate()

  const [coupon, setCoupon] = useState(() => String(localStorage.getItem('cupon') || '').toUpperCase())
  const [couponMsg, setCouponMsg] = useState('')
  const [couponClass, setCouponClass] = useState('small mt-1')
  const [images, setImages] = useState({})

  const items = useMemo(() => (Array.isArray(cart?.items) ? cart.items : []), [cart?.items])

  useEffect(() => {
    const base = api?.defaults?.baseURL || 'http://localhost:8080'
    const toLoad = items.filter(i => i?.productoId && !images[i.productoId])
    if (!toLoad.length) return
    const load = async () => {
      const updates = {}
      for (const it of toLoad) {
        try {
          const p = await obtenerProducto(it.productoId)
          const url = p?.imagenUrl ? base + p.imagenUrl : ''
          updates[it.productoId] = url
        } catch {
          updates[it.productoId] = ''
        }
      }
      if (Object.keys(updates).length) setImages(prev => ({ ...prev, ...updates }))
    }
    load()
  }, [items, images])

  const totalBruto = useMemo(() => {
    return items.reduce((s, i) => s + Number(i?.totalLinea || 0), 0)
  }, [items])

  const ahorro = useMemo(() => {
    const code = String(coupon || '').toUpperCase()
    if (code === 'CLUB10') return Math.round(totalBruto * 0.10)
    if (code === 'BIENVENIDA5') return Math.round(totalBruto * 0.05)
    return 0
  }, [coupon, totalBruto])

  const subtotalVisual = useMemo(() => {
    const v = totalBruto - ahorro
    return v > 0 ? v : 0
  }, [totalBruto, ahorro])

  const iva = useMemo(() => {
    const neto = subtotalVisual > 0 ? Math.round(subtotalVisual / 1.19) : 0
    return Math.round(subtotalVisual - neto)
  }, [subtotalVisual])

  const cantidadTotal = useMemo(() => {
    return items.reduce((s, i) => s + Number(i?.cantidad || 0), 0)
  }, [items])

  const applyCoupon = () => {
    const code = String(coupon || '').trim().toUpperCase()
    if (code === 'CLUB10') {
      setCouponMsg('Cupón CLUB10 aplicado: 10% de descuento.')
      setCouponClass('small mt-1 msg-cupon-rosado')
    } else if (code === 'BIENVENIDA5') {
      setCouponMsg('Cupón BIENVENIDA5 aplicado: 5% de descuento.')
      setCouponClass('small mt-1 msg-cupon-rosado')
    } else if (code === '') {
      setCouponMsg('Se quitó el cupón.')
      setCouponClass('small mt-1 text-muted')
    } else {
      setCouponMsg('Cupón inválido.')
      setCouponClass('small mt-1 text-danger')
    }
    localStorage.setItem('cupon', code)
  }

  if (items.length === 0) {
    return (
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card p-4 text-center">
              <h5 className="mb-2">Agrega un producto para ver el carrito</h5>
              <button className="btn btn-volver" onClick={() => navigate('/')}>Seguir comprando</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-4">
      <div className="row g-4">
        <div className="col-lg-8">
          <div id="listaProductos">
            {items.map((item) => {
              const img = images[item.productoId] || ''
              const precioCU = Number(item?.precioUnitario || 0)
              const linea = Number(item?.totalLinea || 0)
              return (
                <div className="card-producto d-flex align-items-center mb-3 p-2 border rounded" key={item.id}>
                  {img ? (
                    <img src={img} alt={item.nombre} width="80" className="me-3" />
                  ) : (
                    <div className="me-3" style={{ width: 80, height: 80, backgroundColor: '#f0f0f0' }}></div>
                  )}
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.nombre}</h6>
                    <span className="precio">${new Intl.NumberFormat('es-CL').format(precioCU)}</span>
                  </div>
                  <div className="d-flex align-items-center ms-auto">
                    <button className="btn-cantidad btn btn-sm me-1" onClick={() => dec(item.id)}>-</button>
                    <span className="px-2">{item.cantidad}</span>
                    <button className="btn-cantidad btn btn-sm ms-1 me-3" onClick={() => inc(item.id)}>+</button>
                    <span className="precio fw-bold me-3">${new Intl.NumberFormat('es-CL').format(linea)}</span>
                    <button className="btn btn-sm me-0 p-0 btn-trash" onClick={() => remove(item.id)}>
                      <i className="bi bi-trash fs-5"></i>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="resumen-compra shadow-sm">
            <div className="resumen-header"><i className="bi bi-bag-fill me-2"></i> Bolsa de compras</div>
            <div className="p-3">
              <div className="d-flex justify-content-between">
                <span>Total productos (<span id="cantProd">{cantidadTotal}</span>):</span>
                <span id="totalBruto" className="precio">${new Intl.NumberFormat('es-CL').format(totalBruto)}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Ahorro:</span>
                <span id="ahorro" className="precio">${new Intl.NumberFormat('es-CL').format(ahorro)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Subtotal:</span>
                <span id="subtotal" className="precio">${new Intl.NumberFormat('es-CL').format(subtotalVisual)}</span>
              </div>
              <div className="d-flex justify-content-between mt-2 text-muted small">
                <span>IVA (19% incluido)</span>
                <span id="iva" className="precio">${new Intl.NumberFormat('es-CL').format(iva)}</span>
              </div>
              <div className="cupon mt-3">
                <div className="input-group">
                  <input id="inputCupon" type="text" className="form-control" placeholder="Ingresar cupón (CLUB10)" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                  <button id="btnCupon" className="btn" onClick={applyCoupon}>Aplicar</button>
                </div>
                <div id="msgCupon" className={couponClass}>{couponMsg}</div>
              </div>
              <button id="btnPagar" className="btn btn-pagar mt-3 w-100" onClick={() => navigate('/checkout')}>Ir a pagar</button>
              <button id="btnSeguir" className="btn btn-seguir mt-2 w-100" onClick={() => navigate('/')}>Seguir comprando</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}