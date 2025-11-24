import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AdminNavbar from '../Admin/AdminNavbar'
import AdminFooter from '../Admin/AdminFooter'
import { Outlet, useLocation } from 'react-router-dom'
import CategoryOffcanvas from './CategoryOffcanvas'

export default function ClientLayout() {
  const location = useLocation()
  const bannerText = location.pathname.startsWith('/categorias')
    ? 'Explora nuestras categorías'
    : '¡Envíos gratis por compras sobre $20.000!'
  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar showAdminTitle={false} showSearch={true} />
      <CategoryOffcanvas />
      <div className="bg-success text-white text-center py-2">
        <strong>{bannerText}</strong>
      </div>
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  )
}