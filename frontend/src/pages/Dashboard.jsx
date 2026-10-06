import { useState } from 'react'
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react'

import Pacientes from './Pacientes'
import Historias from './Historias'
import './Dashboard.css'

function Dashboard({ onLogout }) {
  const [seccion, setSeccion] = useState('inicio')

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🦷</span>
          <h2>DentalSoft</h2>
        </div>

        <nav className="sidebar-menu">
          <button
            className={seccion === 'inicio' ? 'active' : ''}
            onClick={() => setSeccion('inicio')}
          >
            <LayoutDashboard size={20} />
            <span>Inicio</span>
          </button>

          <button
            className={seccion === 'pacientes' ? 'active' : ''}
            onClick={() => setSeccion('pacientes')}
          >
            <Users size={20} />
            <span>Pacientes</span>
          </button>

          <button>
            <CalendarDays size={20} />
            <span>Citas</span>
          </button>

          <button
            className={seccion === 'historias' ? 'active' : ''}
            onClick={() => setSeccion('historias')}
          >
            <ClipboardList size={20} />
            <span>Historias clínicas</span>
          </button>

          <button>
            <Stethoscope size={20} />
            <span>Tratamientos</span>
          </button>

          <button>
            <Receipt size={20} />
            <span>Facturación</span>
          </button>

          <button>
            <BarChart3 size={20} />
            <span>Reportes</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button>
            <Settings size={20} />
            <span>Configuración</span>
          </button>

          <button onClick={onLogout}>
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        {seccion === 'inicio' ? (
          <>
            <header className="dashboard-header">
              <div>
                <h1>Buenos días, Administrador 👋</h1>
                <p>Aquí tienes un resumen de tu clínica.</p>
              </div>

              <div className="user-profile">
                <div className="user-avatar">A</div>

                <div>
                  <strong>Administrador</strong>
                  <span>Administrador</span>
                </div>
              </div>
            </header>

            <section className="dashboard-cards">
              <div className="dashboard-card">
                <div className="card-icon">
                  <Users size={23} />
                </div>

                <div>
                  <span>Pacientes</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <CalendarDays size={23} />
                </div>

                <div>
                  <span>Citas de hoy</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <Stethoscope size={23} />
                </div>

                <div>
                  <span>Tratamientos</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <Receipt size={23} />
                </div>

                <div>
                  <span>Ingresos del mes</span>
                  <strong>$0</strong>
                </div>
              </div>
            </section>

            <section className="dashboard-welcome">
              <h2>Resumen de la clínica</h2>

              <p>
                Desde aquí podrás gestionar pacientes, citas, historias
                clínicas, tratamientos y facturación.
              </p>
            </section>
          </>
        ) : seccion === 'pacientes' ? (
          <Pacientes />
        ) : seccion === 'historias' ? (
          <Historias />
        ) : null}
      </main>
    </div>
  )
}

export default Dashboard
