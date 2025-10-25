import { useEffect, useState } from 'react'
import { actualizarProducto, subirImagenProducto, actualizarStock } from '../../services/productos'
import { useToast } from '../shared/ToastProvider'

export default function EditarProductoModal({ product, onClose, onSaved, disabled }) {
  const { show } = useToast()
  const [precio, setPrecio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [stock, setStock] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [nombre, setNombre] = useState('')

  useEffect(() => {
    if (product) {
      setPrecio(String(product.precio ?? ''))
      setDescripcion(String(product.descripcion ?? ''))
      setStock(String(product.stock ?? ''))
      setNombre(String(product.nombre ?? ''))
      const current = product.imagenUrl ? `http://localhost:8080${product.imagenUrl}` : ''
      setPreviewUrl(current)
    }
  }, [product])

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f) {
      const url = URL.createObjectURL(f)
      setPreviewUrl(url)
    }
  }

  const clampStock = (val) => {
    const n = Number(val)
    if (Number.isNaN(n)) return ''
    return String(Math.min(9999, Math.max(0, Math.floor(n))))
  }

  const save = async () => {
    if (!product || disabled) return
    try {
      setSaving(true)
      let newImageUrl = product.imagenUrl || ''
      // Subir imagen si se seleccionó y tomar la nueva URL de respuesta
      if (file) {
        const uploaded = await subirImagenProducto(product.id, file)
        newImageUrl = uploaded?.imagenUrl ?? newImageUrl
      }
      const stockNumber = Number(clampStock(stock))
      const payload = {
        ...product,
        nombre: nombre.trim(),
        precio: Number(precio),
        descripcion,
        activo: product.activo,
        categoria: product.categoria,
        imagenUrl: newImageUrl,
        stock: stockNumber,
      }
      const updated = await actualizarProducto(product.id, payload)
      // Asegurar persistencia de stock en backend si PUT no lo aplica
      if (!Number.isNaN(stockNumber) && stockNumber !== Number(product.stock ?? 0)) {
        await actualizarStock(product.id, stockNumber)
      }
      show('Producto actualizado', 'success')
      onSaved?.(updated)
      onClose?.()
    } catch (err) {
      show(err.message || 'Error al actualizar producto', 'danger')
    } finally {
      setSaving(false)
    }
  }

  if (!product) return null

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <div className="modal-dialog">
        <div className="modal-content" style={{ borderRadius: 10, boxShadow: '0 8px 24px rgba(102, 187, 106, 0.15)' }}>
          <div className="modal-header">
            <h5 className="modal-title">Editar producto</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            {/* Preview de imagen */}
            {previewUrl ? (
              <div className="mb-3 d-flex justify-content-center">
                <img
                  src={previewUrl}
                  alt={product.nombre}
                  style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                />
              </div>
            ) : null}
            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFile}
                style={{ borderRadius: 10, border: '1px solid var(--gb-green)' }}
                disabled={disabled || saving}
              />
              <div className="form-text">Opcional: si seleccionas archivo, se reemplaza la imagen.</div>
            </div>
            {/* Campo de nombre del producto */}
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{ borderRadius: 10, border: '1px solid var(--gb-green)' }}
                disabled={disabled || saving}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input
                type="number"
                className="form-control"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                min="0"
                step="1"
                style={{ borderRadius: 10, border: '1px solid var(--gb-green)' }}
                disabled={disabled || saving}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                style={{ borderRadius: 10, border: '1px solid var(--gb-green)' }}
                disabled={disabled || saving}
              />
            </div>
            {!disabled && (
              <div className="mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  value={stock}
                  onChange={(e) => setStock(clampStock(e.target.value))}
                  min="0"
                  max="9999"
                  step="1"
                  style={{ borderRadius: 10, border: '1px solid var(--gb-green)' }}
                  disabled={saving}
                />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-sm"
              onClick={onClose}
              disabled={saving}
              style={{
                borderRadius: 10,
                padding: '4px 10px',
                border: '1px solid #f6c6d0',
                color: '#d36a89',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f6c6d0'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#d36a89' }}
            >
              Cancelar
            </button>
            <button
              className="btn btn-sm"
              onClick={save}
              disabled={disabled || saving}
              style={{
                borderRadius: 10,
                padding: '4px 10px',
                border: '1px solid #a8e6a1',
                color: '#45a157',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#a8e6a1'; e.currentTarget.style.color = '#1b3b21' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#45a157' }}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}