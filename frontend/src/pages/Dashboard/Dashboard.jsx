import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarProductos, listarProductosBajoStock } from '../../services/productos'
import { listarUsuarios } from '../../services/usuarios'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../componentes/shared/ToastProvider'
import './Dashboard.css'

export default function Dashboard() {
  const { show } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ 
    productos: 0, 
    usuarios: 0, 
    productosBajoStock: 0 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const [productos, usuarios, productosBajoStock] = await Promise.all([
          listarProductos(),
          listarUsuarios(),
          listarProductosBajoStock()
        ])
        
        setStats({
          productos: productos.length,
          usuarios: usuarios.length,
          productosBajoStock: productosBajoStock.length
        })
      } catch (error) {
        show(error.message || 'Error al cargar estadísticas', 'danger')
      } finally {
        setLoading(false)
      }
    }

    cargarEstadisticas()
  }, [show])

  const handleNavigateToInventario = () => {
    navigate('/admin/inventario')
  }

  const handleNavigateToUsuarios = () => {
    navigate('/admin/usuarios')
  }

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4 dashboard-container">
      {/* Título de bienvenida */}
      <div className="text-center mb-4">
        <h2 className="dashboard-welcome">
          Bienvenido, {user?.nombre || 'Usuario'} — Panel general de la tienda
        </h2>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row g-4 mb-5 justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card dashboard-card dashboard-card-green h-100">
            <div className="card-body text-center">
              <div className="dashboard-icon mb-3">
                <i className="bi bi-box-seam"></i>
              </div>
              <h5 className="card-title">Total de Productos</h5>
              <p className="dashboard-number">{stats.productos}</p>
              <small className="text-muted">Productos registrados</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card dashboard-card dashboard-card-pink h-100">
            <div className="card-body text-center">
              <div className="dashboard-icon mb-3">
                <i className="bi bi-people"></i>
              </div>
              <h5 className="card-title">Total de Usuarios</h5>
              <p className="dashboard-number">{stats.usuarios}</p>
              <small className="text-muted">Usuarios registrados</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card dashboard-card dashboard-card-warning h-100">
            <div className="card-body text-center">
              <div className="dashboard-icon mb-3">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <h5 className="card-title">Stock Bajo</h5>
              <p className="dashboard-number">{stats.productosBajoStock}</p>
              <small className="text-muted">Productos con menos de 5 unidades</small>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acceso rápido */}
      <div className="row g-3 justify-content-center">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <button 
            className="btn dashboard-btn dashboard-btn-primary w-100"
            onClick={handleNavigateToInventario}
          >
            <i className="bi bi-receipt me-2"></i>
            Gestionar Productos
          </button>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <button 
            className="btn dashboard-btn dashboard-btn-secondary w-100"
            onClick={handleNavigateToUsuarios}
          >
            <i className="bi bi-person-gear me-2"></i>
            Gestionar Usuarios
          </button>
        </div>
      </div>
    </div>
  )
}