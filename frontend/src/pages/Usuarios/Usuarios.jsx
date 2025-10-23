import { useEffect, useState } from 'react'
import { listarUsuarios, cambiarEstadoUsuario, eliminarUsuario } from '../../services/usuarios'
import { useToast } from '../../componentes/shared/ToastProvider'

export default function Usuarios() {
  const { show } = useToast()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4>Usuarios</h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={cargar} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
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
              {usuarios.map((u) => (
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
                  <td className="text-end">
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