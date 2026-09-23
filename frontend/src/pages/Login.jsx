import './Login.css'
import logoDentalsoft from '../assets/logo-dentalsoft.png'
import consultorio from '../assets/consultorio.jpg'
import { CalendarDays, Users, BarChart3 } from 'lucide-react'

function Login() {
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

          <form>
            <div className="input-group">
              <label htmlFor="correo">Correo electrónico</label>

              <input id="correo" type="email" placeholder="tu@email.com" />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>

              <input id="password" type="password" placeholder="••••••••••••" />
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
