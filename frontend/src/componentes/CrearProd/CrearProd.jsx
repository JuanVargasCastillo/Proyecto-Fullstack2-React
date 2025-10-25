import { useEffect, useState } from 'react'
import { crearProducto, subirImagenProducto } from '../../services/productos'
import { listarCategorias } from '../../services/categorias'
import { useToast } from '../shared/ToastProvider'

export default function CrearProd() {
  const { show } = useToast()
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: 0, categoria: null })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    listarCategorias().then(setCategorias).catch((e) => show(e.message, 'danger'))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.precio || !form.categoria) {
      show('Nombre, precio y categoría son obligatorios', 'danger')
      return
    }
    try {
      setLoading(true)
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        stock: Number(form.stock),
        categoria: { id: Number(form.categoria) },
        activo: true,
      }
      const creado = await crearProducto(payload)
      if (file) {
        await subirImagenProducto(creado.id, file)
      }
      show('Producto creado correctamente', 'success')
      setForm({ nombre: '', descripcion: '', precio: '', stock: 0, categoria: null })
      setFile(null)
    } catch (err) {
      show(err.message || 'Error al crear producto', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-3 shadow-sm rounded-3">
      <h5 className="mb-3">Crear Producto</h5>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Precio</label>
          <input type="number" min="0" step="0.01" className="form-control" name="precio" value={form.precio} onChange={handleChange} />
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" rows="3" name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Stock</label>
          <input type="number" min="0" className="form-control" name="stock" value={form.stock} onChange={handleChange} />
        </div>
        <div className="col-md-8">
          <label className="form-label">Categoría</label>
          <select className="form-select" name="categoria" value={form.categoria || ''} onChange={handleChange}>
            <option value="">Seleccione...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Imagen</label>
          <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
        </div>
      </div>
      <div className="mt-3">
        <button className="btn btn-success" type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Crear producto'}</button>
      </div>
    </form>
  )
}