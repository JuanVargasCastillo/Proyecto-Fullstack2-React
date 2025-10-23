import { useEffect, useState } from 'react'
import { listarProductos } from '../../services/productos'
import { listarUsuarios } from '../../services/usuarios'
import { useToast } from '../../componentes/shared/ToastProvider'

export default function Dashboard() {
  const { show } = useToast()
  const [stats, setStats] = useState({ productos: 0, usuarios: 0 })

  useEffect(() => {
    Promise.all([listarProductos(), listarUsuarios()])
      .then(([p, u]) => setStats({ productos: p.length, usuarios: u.length }))
      .catch((e) => show(e.message, 'danger'))
  }, [])

  return (
    <div className="container">
      <h4 className="mb-3">Dashboard</h4>
      <div className="row g-3">
        <div className="col-sm-6">
          <div className="card text-center">
            <div className="card-body">
              <h5>Productos</h5>
              <p className="display-6">{stats.productos}</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card text-center">
            <div className="card-body">
              <h5>Usuarios</h5>
              <p className="display-6">{stats.usuarios}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}