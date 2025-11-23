import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import AdminFooter from './AdminFooter'
import { useAuth } from '../../context/AuthContext'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  const { user } = useAuth()
  const nombre = user?.nombre || 'Administrador'

  return (
    <div className="admin-layout d-flex flex-column min-vh-100">
      <AdminNavbar showAdminTitle={true} showSearch={false} />
      <AdminSidebar />

      <div className="bg-success text-white text-center py-2 gb-welcome">
        <div className="container">
          <p className="mb-0">Bienvenido, {nombre}</p>
        </div>
      </div>

      <main className="container my-3 flex-grow-1">
        <Outlet />
      </main>

      <AdminFooter />
    </div>
  )
}