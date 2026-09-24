import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('access_token')),
  )

  return isAuthenticated ? (
    <Dashboard />
  ) : (
    <Login onLogin={() => setIsAuthenticated(true)} />
  )
}

export default App
