import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import api from '../services/api'
import './Pacientes.css'

function Pacientes() {
  const [mensajeExito, setMensajeExito] = useState('')
  const [mensajeError, setMensajeError] = useState('')
  const [erroresFormulario, setErroresFormulario] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [pacientes, setPacientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [formulario, setFormulario] = useState({
    tipo_documento: 'CC',
    documento: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    sexo: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: 'Cúcuta',
  })

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const response = await api.get('/api/pacientes/')
        setPacientes(response.data)
      } catch (error) {
        console.error('Error al cargar pacientes:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarPacientes()
  }, [])

  useEffect(() => {
    const manejarTecla = (event) => {
      if (event.key === 'Escape') {
        setMostrarModal(false)
      }
    }

    if (mostrarModal) {
      document.addEventListener('keydown', manejarTecla)
    }

    return () => {
      document.removeEventListener('keydown', manejarTecla)
    }
  }, [mostrarModal])

  const manejarCambio = (event) => {
    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))

    if (erroresFormulario[name]) {
      setErroresFormulario((anterior) => ({
        ...anterior,
        [name]: '',
      }))
    }
  }

  const cerrarModal = () => {
    setMostrarModal(false)
    setErroresFormulario({})
    setMensajeError('')
  }

  const guardarPaciente = async (event) => {
    event.preventDefault()

    const nuevosErrores = {}

    if (!formulario.tipo_documento) {
      nuevosErrores.tipo_documento = 'Selecciona un tipo de documento.'
    }

    if (!formulario.documento.trim()) {
      nuevosErrores.documento = 'El número de documento es obligatorio.'
    }

    if (!formulario.nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres son obligatorios.'
    }

    if (!formulario.apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios.'
    }

    setErroresFormulario(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }
    setGuardando(true)

    setMensajeError('')

    try {
      const response = await api.post('/api/pacientes/', formulario)

      setPacientes((anterior) => [response.data, ...anterior])
      setMostrarModal(false)

      setMensajeExito(
        `Paciente ${response.data.nombres} ${response.data.apellidos} registrado correctamente.`,
      )

      setTimeout(() => {
        setMensajeExito('')
      }, 4000)

      setFormulario({
        tipo_documento: 'CC',
        documento: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        sexo: '',
        telefono: '',
        correo: '',
        direccion: '',
        ciudad: 'Cúcuta',
      })
    } catch (error) {
      setGuardando(false)
      console.error('Error al guardar paciente:', error)

      if (error.response?.data?.documento) {
        setMensajeError('El número de documento ya está registrado.')
      } else {
        setMensajeError(
          'No se pudo registrar el paciente. Verifica los datos e inténtalo nuevamente.',
        )
      }

      setTimeout(() => {
        setMensajeError('')
      }, 5000)
    }
  }

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.toLowerCase()

    return (
      paciente.nombres.toLowerCase().includes(texto) ||
      paciente.apellidos.toLowerCase().includes(texto) ||
      paciente.documento.toLowerCase().includes(texto)
    )
  })

  return (
    <div className="pacientes-page">
      {mensajeExito && (
        <div className="mensaje-exito">
          <span className="mensaje-exito-icono">✓</span>

          <div>
            <strong>Paciente registrado</strong>
            <p>{mensajeExito}</p>
          </div>
        </div>
      )}

      {mensajeError && (
        <div className="mensaje-error">
          <span className="mensaje-error-icono">!</span>

          <div>
            <strong>Error al registrar</strong>
            <p>{mensajeError}</p>
          </div>
        </div>
      )}

      <div className="pacientes-header">
        <div>
          <h1>Pacientes</h1>
          <p>Gestiona la información de los pacientes de tu clínica.</p>
        </div>

        <button
          className="btn-nuevo-paciente"
          onClick={() => {
            setErroresFormulario({})
            setMensajeError('')
            setMostrarModal(true)
          }}
        >
          <Plus size={18} />
          Nuevo paciente
        </button>
      </div>

      <div className="pacientes-toolbar">
        <div className="pacientes-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>
      </div>

      <div className="pacientes-card">
        {cargando ? (
          <p className="pacientes-mensaje">Cargando pacientes...</p>
        ) : pacientesFiltrados.length === 0 ? (
          <p className="pacientes-mensaje">No se encontraron pacientes.</p>
        ) : (
          <div className="tabla-contenedor">
            <table className="pacientes-table">
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Ciudad</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {pacientesFiltrados.map((paciente) => (
                  <tr key={paciente.id}>
                    <td>
                      {paciente.tipo_documento} {paciente.documento}
                    </td>

                    <td>
                      <strong>
                        {paciente.nombres} {paciente.apellidos}
                      </strong>
                    </td>

                    <td>{paciente.telefono || '—'}</td>

                    <td>{paciente.ciudad}</td>

                    <td>
                      <span
                        className={`estado-paciente ${
                          paciente.activo ? 'activo' : 'inactivo'
                        }`}
                      >
                        {paciente.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="modal-paciente"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Nuevo paciente</h2>
                <p>Registra la información del paciente.</p>
              </div>

              <button className="modal-cerrar" onClick={cerrarModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="tipo_documento">Tipo de documento</label>

                  <select
                    id="tipo_documento"
                    name="tipo_documento"
                    value={formulario.tipo_documento}
                    onChange={manejarCambio}
                  >
                    <option value="CC">Cédula de ciudadanía</option>
                    <option value="TI">Tarjeta de identidad</option>
                    <option value="RC">Registro civil</option>
                    <option value="CE">Cédula de extranjería</option>
                    <option value="PA">Pasaporte</option>
                  </select>
                  {erroresFormulario.tipo_documento && (
                    <span className="error-campo">
                      {erroresFormulario.tipo_documento}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="documento">Número de documento</label>

                  <input
                    id="documento"
                    name="documento"
                    type="text"
                    placeholder="Ej. 1234567890"
                    value={formulario.documento}
                    onChange={manejarCambio}
                  />
                  {erroresFormulario.documento && (
                    <span className="error-campo">
                      {erroresFormulario.documento}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="nombres">Nombres</label>

                  <input
                    id="nombres"
                    name="nombres"
                    type="text"
                    placeholder="Ej. María"
                    value={formulario.nombres}
                    onChange={manejarCambio}
                  />
                  {erroresFormulario.nombres && (
                    <span className="error-campo">
                      {erroresFormulario.nombres}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos</label>

                  <input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    placeholder="Ej. González"
                    value={formulario.apellidos}
                    onChange={manejarCambio}
                  />
                  {erroresFormulario.apellidos && (
                    <span className="error-campo">
                      {erroresFormulario.apellidos}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>

                  <input
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    type="date"
                    value={formulario.fecha_nacimiento}
                    onChange={manejarCambio}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sexo">Sexo</label>

                  <select
                    id="sexo"
                    name="sexo"
                    value={formulario.sexo}
                    onChange={manejarCambio}
                  >
                    <option value="">Seleccionar</option>
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>

                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="Ej. 3001234567"
                    value={formulario.telefono}
                    onChange={manejarCambio}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="correo">Correo electrónico</label>

                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    placeholder="Ej. correo@email.com"
                    value={formulario.correo}
                    onChange={manejarCambio}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="direccion">Dirección</label>

                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Ej. Calle 10 # 5-20"
                    value={formulario.direccion}
                    onChange={manejarCambio}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad</label>

                  <input
                    id="ciudad"
                    name="ciudad"
                    type="text"
                    value={formulario.ciudad}
                    onChange={manejarCambio}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-guardar-paciente"
                  onClick={guardarPaciente}
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : 'Guardar paciente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pacientes
