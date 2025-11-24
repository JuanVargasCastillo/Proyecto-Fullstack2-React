import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AdminNavbar from '../Admin/AdminNavbar'
import AdminFooter from '../Admin/AdminFooter'
import { Outlet } from 'react-router-dom'
import CategoryOffcanvas from './CategoryOffcanvas'

export default function ClientLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar showAdminTitle={false} showSearch={true} />
      <CategoryOffcanvas />
      <div className="bg-success text-white text-center py-2">
        <strong>Explora nuestras categorías</strong>
      </div>
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  )
}