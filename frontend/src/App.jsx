import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AdminLayout from './componentes/Admin/AdminLayout'
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
  const isAuthenticated = !!localStorage.getItem('usuarioLogueado')

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="d-flex flex-column min-vh-100">
          {/* eliminado Navbar global; AdminLayout manejará la navegación */}
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/inventario" element={<ProtectedRoute><AdminLayout><Inventario /></AdminLayout></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
              <Route path="/usuarios" element={<ProtectedRoute><AdminLayout><Usuarios /></AdminLayout></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
            </Routes>
          </main>
          {/* eliminado Footer global; AdminLayout manejará estructura visual */}
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
