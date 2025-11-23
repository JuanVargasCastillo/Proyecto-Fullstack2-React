import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AdminLayout from './componentes/Admin/AdminLayout'
import { CartProvider } from './context/CartContext'
import { SearchProvider } from './context/SearchContext'
import ClientLayout from './componentes/Cliente/ClientLayout'
import HomeCliente from './pages/Cliente/HomeCliente'
import Checkout from './pages/Cliente/Checkout'
import Boleta from './pages/Cliente/Boleta'
import Historial from './pages/Cliente/Historial'
import Inventario from './pages/Inventario/Inventario'
import Dashboard from './pages/Dashboard/Dashboard'
import Usuarios from './pages/Usuarios/Usuarios'
import Login from './pages/Login/Login'
import ProtectedRoute from './componentes/shared/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './componentes/shared/ToastProvider'

function App() {
  const location = useLocation()
  const isLoginRoute = location.pathname === '/login'

  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
        <SearchProvider>
        <div className="d-flex flex-column min-vh-100">
          {/* eliminado Navbar global; AdminLayout manejará la navegación */}
          <main className="flex-grow-1">
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Cliente público: Home y detalle accesibles sin sesión */}
              <Route element={<ClientLayout />}>
                <Route path="/" element={<HomeCliente />} />
                <Route path="/producto/:id" element={<div className="container">Detalle de producto</div>} />
              </Route>

              {/* Cliente protegido: rutas que requieren sesión CLIENTE */}
              <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]}><ClientLayout /></ProtectedRoute>}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/boleta/:id" element={<Boleta />} />
                <Route path="/historial" element={<Historial />} />
              </Route>

              {/* Admin protegido por rol */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="inventario" element={<Inventario />} />
                <Route path="usuarios" element={<Usuarios />} />
              </Route>

              {/* No autenticado → /login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          {/* eliminado Footer global; AdminLayout manejará estructura visual */}
        </div>
        </SearchProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
