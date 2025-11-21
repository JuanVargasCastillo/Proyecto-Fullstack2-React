import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AdminNavbar from '../Admin/AdminNavbar'
import AdminFooter from '../Admin/AdminFooter'

export default function ClientLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="bg-success text-white text-center py-2">
        <strong>¡Envíos gratis por compras sobre $20.000!</strong>
      </div>
      <main className="flex-grow-1">
        {children}
      </main>
      <AdminFooter />
    </div>
  )
}