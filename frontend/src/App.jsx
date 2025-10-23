import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './componentes/Navbar/Navbar'
import Footer from './componentes/Footer/Footer'
import Home from './pages/Home/Home'
import Inventario from './pages/Inventario/Inventario'
import Contacto from './pages/Contacto/Contacto'
import Dashboard from './pages/Dashboard/Dashboard'
import Usuarios from './pages/Usuarios/Usuarios'
import Login from './pages/Login/Login'
import ProtectedRoute from './componentes/shared/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './componentes/shared/ToastProvider'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1 container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
