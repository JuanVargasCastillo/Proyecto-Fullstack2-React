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
    <div className="container gb-dashboard">
      <h4 className="mb-3 gb-dashboard-title">Dashboard</h4>
      <div className="row g-3">
        <div className="col-sm-6">
          <div className="card text-center gb-card">
            <div className="card-body">
              <h5>Productos</h5>
              <p className="display-6 gb-metric">{stats.productos}</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card text-center gb-card">
            <div className="card-body">
              <h5>Usuarios</h5>
              <p className="display-6 gb-metric">{stats.usuarios}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}