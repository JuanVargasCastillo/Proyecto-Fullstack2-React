import { useEffect, useMemo, useState } from 'react'
import { listarUsuarios, cambiarEstadoUsuario, eliminarUsuario, crearUsuario, actualizarUsuario } from '../../services/usuarios'
import { useToast } from '../../componentes/shared/ToastProvider'

export default function Usuarios() {
  const { show } = useToast()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'USER', activo: true })
  const [errors, setErrors] = useState({})

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  const cargar = async () => {
    try {
      setLoading(true)
      const data = await listarUsuarios()
      setUsuarios(data)
    } catch (err) {
      show(err.message, 'danger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return usuarios
    return usuarios.filter((u) =>
      String(u.nombre || '').toLowerCase().includes(q) ||
      String(u.email || '').toLowerCase().includes(q)
    )
  }, [search, usuarios])

  const toggleEstado = async (u) => {
    try {
      await cambiarEstadoUsuario(u.id, !u.activo)
      show('Estado actualizado', 'success')
      cargar()
    } catch (err) {
      show(err.message, 'danger')
    }
  }

  const borrar = async (id) => {
    if (!confirm('¿Eliminar usuario?')) return
    try {
      await eliminarUsuario(id)
      show('Usuario eliminado', 'success')
      cargar()
    } catch (err) {
      show(err.message, 'danger')
    }
  }

  const abrirCrear = () => {
    setEditUser(null)
    setForm({ nombre: '', email: '', rol: 'USER', activo: true })
    setErrors({})
    setShowForm(true)
  }

  const abrirEditar = (u) => {
    setEditUser(u)
    setForm({ nombre: u.nombre || '', email: u.email || '', rol: u.rol || 'USER', activo: !!u.activo })
    setErrors({})
    setShowForm(true)
  }

  const cancelarForm = () => {
    setShowForm(false)
    setEditUser(null)
    setErrors({})
  }

  const validar = () => {
    const errs = {}
    const nombre = String(form.nombre || '').trim()
    const email = String(form.email || '').trim()
    const rol = String(form.rol || '').trim().toUpperCase()

    if (!nombre) errs.nombre = 'El nombre es obligatorio'
    else if (nombre.length < 2) errs.nombre = 'Mínimo 2 caracteres'
    else if (nombre.length > 60) errs.nombre = 'Máximo 60 caracteres'

    if (!email) errs.email = 'El email es obligatorio'
    else if (!emailRegex.test(email)) errs.email = 'Formato de email inválido'
    else if (email.length > 120) errs.email = 'Máximo 120 caracteres'

    if (!['ADMIN', 'USER'].includes(rol)) errs.rol = 'Rol inválido'

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validar()
    setErrors(errs)
    if (Object.keys(errs).length) return

    try {
      const payload = { nombre: form.nombre.trim(), email: form.email.trim(), rol: form.rol.toUpperCase(), activo: !!form.activo }
      if (editUser) {
        await actualizarUsuario(editUser.id, payload)
        show('Usuario actualizado', 'success')
      } else {
        await crearUsuario(payload)
        show('Usuario creado', 'success')
      }
      setShowForm(false)
      setEditUser(null)
      await cargar()
    } catch (err) {
      show(err.message || 'Error al guardar', 'danger')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <div className="container">
      <div className="d-flex flex-column gap-3 mb-2">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Usuarios</h4>
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: 260 }}
              placeholder="Buscar por nombre o email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-success" onClick={abrirCrear}>+ Crear Usuario</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={cargar} disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="card">
            <div className="card-body">
              <h5 className="mb-3">{editUser ? 'Editar Usuario' : 'Crear Usuario'}</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    name="nombre"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    value={form.nombre}
                    onChange={handleChange}
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Rol</label>
                  <select
                    name="rol"
                    className={`form-select ${errors.rol ? 'is-invalid' : ''}`}
                    value={form.rol}
                    onChange={handleChange}
                  >
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                  {errors.rol && <div className="invalid-feedback">{errors.rol}</div>}
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
                    <label className="form-check-label">Activo</label>
                  </div>
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-success" type="submit">{editUser ? 'Guardar Cambios' : 'Crear'}</button>
                <button className="btn btn-outline-secondary" type="button" onClick={cancelarForm}>Cancelar</button>
              </div>
            </div>
          </form>
        )}
      </div>

      {loading ? (
        <div className="text-center"><div className="spinner-border" role="status"></div></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.rol === 'ADMIN' ? 'bg-primary' : 'bg-secondary'}`}>{u.rol}</span>
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={u.activo} onChange={() => toggleEstado(u)} />
                    </div>
                  </td>
                  <td className="text-end d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => abrirEditar(u)}>Editar</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => borrar(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}