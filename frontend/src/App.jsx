import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('access_token')),
  )

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      return
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      )

      const tiempoRestante = payload.exp * 1000 - Date.now()

      if (tiempoRestante <= 0) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setIsAuthenticated(false)
        return
      }

      const temporizador = setTimeout(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setIsAuthenticated(false)
      }, tiempoRestante)

      return () => clearTimeout(temporizador)
    } catch (error) {
      console.error('Error al verificar la expiración del token:', error)
    }
  }, [isAuthenticated])

  const cerrarSesion = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setIsAuthenticated(false)
  }
  return isAuthenticated ? (
    <Dashboard onLogout={cerrarSesion} />
  ) : (
    <Login onLogin={() => setIsAuthenticated(true)} />
  )
}

export default App
