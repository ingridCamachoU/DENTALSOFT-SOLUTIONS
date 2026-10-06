import { useState } from 'react'
import './Login.css'
import logoDentalsoft from '../assets/logo-dentalsoft.png'
import consultorio from '../assets/consultorio.jpg'
import api from '../services/api'
import { CalendarDays, Users, BarChart3 } from 'lucide-react'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await api.post('/api/token/', {
        email,
        password,
      })

      console.log('Login exitoso:', response.data)

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem(
        'session_expires_at',
        String(Date.now() + 8 * 60 * 60 * 1000),
      )

      onLogin()
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    }
  }

  return (
    <div className="login-page">
      {/* Panel izquierdo */}

      <section
        className="login-brand"
        style={{
          backgroundImage: `var(--gradient-brand), url(${consultorio})`,
        }}
      >
        <div className="brand-logo">
          <img src={logoDentalsoft} alt="DentalSoft Solutions" />
        </div>

        <div className="brand-content">
          <h2>
            Todo lo que tu clínica
            <br />
            necesita, en un solo lugar.
          </h2>

          <div className="benefit">
            <div className="benefit-icon">
              <CalendarDays size={30} />
            </div>

            <div>
              <h3>Gestión de citas</h3>
              <p>Administra y organiza las citas de tus pacientes.</p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">
              <Users size={30} />
            </div>

            <div>
              <h3>Pacientes</h3>
              <p>Historias clínicas completas y seguras.</p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">
              <BarChart3 size={30} />
            </div>

            <div>
              <h3>Reportes</h3>
              <p>Estadísticas y reportes para tomar mejores decisiones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Panel derecho */}
      <section className="login-panel">
        <div className="login-box">
          <div className="login-title">
            <h2>¡Bienvenido!</h2>
            <p>Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="correo">Correo electrónico</label>

              <input
                id="correo"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>

              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
            </button>

            <div className="forgot-password">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
          </form>

          <div className="register-text">
            No tienes cuenta?
            <a href="#"> Regístrate</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
