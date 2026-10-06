import { useEffect, useState } from 'react'
import { Eye, FileText, Plus, Search, X } from 'lucide-react'
import api from '../services/api'
import './Historias.css'

function Historias() {
  const [historias, setHistorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [mostrarModal, setMostrarModal] = useState(false)
  const [pacientes, setPacientes] = useState([])
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('')
  const [mensajeModal, setMensajeModal] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarHistoria, setMostrarHistoria] = useState(false)
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null)

  const [guardando, setGuardando] = useState(false)
  const [mensajeFormulario, setMensajeFormulario] = useState('')

  const [formulario, setFormulario] = useState({
    motivo_consulta: '',
    antecedentes_medicos: '',
    alergias: '',
    medicamentos_actuales: '',
    antecedentes_odontologicos: '',
    habitos: '',
    diagnostico: '',
    observaciones: '',
  })

  useEffect(() => {
    cargarHistorias()
  }, [])

  const cargarHistorias = async () => {
    try {
      setCargando(true)
      setError('')

      const response = await api.get('/api/historias/')

      setHistorias(response.data.results || response.data)
    } catch (error) {
      console.error('Error al cargar historias clínicas:', error)
      setError('No se pudieron cargar las historias clínicas.')
    } finally {
      setCargando(false)
    }
  }

  const cargarPacientes = async () => {
    try {
      const response = await api.get('/api/pacientes/')

      setPacientes(response.data.results || response.data)
    } catch (error) {
      console.error('Error al cargar pacientes:', error)
    }
  }

  const abrirNuevaHistoria = () => {
    cargarPacientes()

    setPacienteSeleccionado('')
    setMensajeModal('')
    setMensajeFormulario('')

    setFormulario({
      motivo_consulta: '',
      antecedentes_medicos: '',
      alergias: '',
      medicamentos_actuales: '',
      antecedentes_odontologicos: '',
      habitos: '',
      diagnostico: '',
      observaciones: '',
    })

    setMostrarModal(true)
  }

  const cerrarModalPaciente = () => {
    setMostrarModal(false)
    setPacienteSeleccionado('')
    setMensajeModal('')
  }

  const continuarNuevaHistoria = () => {
    const historiaExistente = historias.find(
      (historia) => String(historia.paciente) === String(pacienteSeleccionado),
    )

    if (historiaExistente) {
      setMensajeModal('Este paciente ya tiene una historia clínica registrada.')
      return
    }

    setMensajeModal('')
    setMostrarModal(false)
    setMostrarFormulario(true)
  }

  const actualizarCampo = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  const guardarHistoria = async (e) => {
    e.preventDefault()

    if (!formulario.motivo_consulta.trim()) {
      setMensajeFormulario('El motivo de consulta es obligatorio.')
      return
    }

    try {
      setGuardando(true)
      setMensajeFormulario('')

      await api.post('/api/historias/', {
        paciente: Number(pacienteSeleccionado),
        ...formulario,
      })

      setMostrarFormulario(false)

      await cargarHistorias()

      setPacienteSeleccionado('')

      setFormulario({
        motivo_consulta: '',
        antecedentes_medicos: '',
        alergias: '',
        medicamentos_actuales: '',
        antecedentes_odontologicos: '',
        habitos: '',
        diagnostico: '',
        observaciones: '',
      })
    } catch (error) {
      console.error('Error al guardar historia clínica:', error)

      const errores = error.response?.data

      if (errores?.paciente) {
        setMensajeFormulario(
          Array.isArray(errores.paciente)
            ? errores.paciente[0]
            : errores.paciente,
        )
      } else if (errores?.motivo_consulta) {
        setMensajeFormulario(
          Array.isArray(errores.motivo_consulta)
            ? errores.motivo_consulta[0]
            : errores.motivo_consulta,
        )
      } else {
        setMensajeFormulario('No se pudo guardar la historia clínica.')
      }
    } finally {
      setGuardando(false)
    }
  }

  const verHistoria = (historia) => {
    setHistoriaSeleccionada(historia)
    setMostrarHistoria(true)
  }

  const cerrarHistoria = () => {
    setMostrarHistoria(false)
    setHistoriaSeleccionada(null)
  }

  const historiasFiltradas = historias.filter((historia) => {
    const texto = busqueda.toLowerCase()

    return (
      historia.paciente_nombre?.toLowerCase().includes(texto) ||
      historia.motivo_consulta?.toLowerCase().includes(texto)
    )
  })

  const pacienteActual = pacientes.find(
    (paciente) => String(paciente.id) === String(pacienteSeleccionado),
  )

  const pacienteTieneHistoria = historias.some(
    (historia) => String(historia.paciente) === String(pacienteSeleccionado),
  )

  return (
    <div className="historias-page">
      <div className="historias-header">
        <div>
          <h1>Historias clínicas</h1>
          <p>Consulta y administra las historias clínicas de tus pacientes.</p>
        </div>

        <button className="btn-nueva-historia" onClick={abrirNuevaHistoria}>
          <Plus size={18} />
          Nueva historia
        </button>
      </div>

      <div className="historias-toolbar">
        <div className="buscador-historia">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por paciente o motivo de consulta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {cargando && (
        <div className="estado-historia">
          <p>Cargando historias clínicas...</p>
        </div>
      )}

      {error && <div className="mensaje-error">{error}</div>}

      {!cargando && !error && (
        <div className="tabla-historias-container">
          <table className="tabla-historias">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Motivo de consulta</th>
                <th>Odontólogo</th>
                <th>Fecha de actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {historiasFiltradas.length > 0 ? (
                historiasFiltradas.map((historia) => (
                  <tr key={historia.id}>
                    <td>
                      <div className="historia-nombre">
                        <div className="historia-avatar">
                          <FileText size={16} />
                        </div>

                        <strong>{historia.paciente_nombre}</strong>
                      </div>
                    </td>

                    <td>{historia.motivo_consulta}</td>

                    <td>{historia.odontologo_nombre || 'Sin asignar'}</td>

                    <td>
                      {new Date(
                        historia.fecha_actualizacion,
                      ).toLocaleDateString('es-CO')}
                    </td>

                    <td>
                      <div className="acciones-historia">
                        <button
                          className="btn-ver-historia"
                          title="Ver historia clínica"
                          onClick={() => verHistoria(historia)}
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="sin-historias">
                    No se encontraron historias clínicas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: SELECCIONAR PACIENTE */}

      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModalPaciente}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Nueva historia clínica</h2>
                <p>Selecciona el paciente para comenzar.</p>
              </div>

              <button
                className="btn-cerrar-modal"
                onClick={cerrarModalPaciente}
                title="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="formulario-historia">
              <div className="campo-formulario">
                <label htmlFor="paciente">Paciente *</label>

                <select
                  id="paciente"
                  value={pacienteSeleccionado}
                  onChange={(e) => {
                    setPacienteSeleccionado(e.target.value)
                    setMensajeModal('')
                  }}
                >
                  <option value="">Selecciona un paciente</option>

                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nombres} {paciente.apellidos} -{' '}
                      {paciente.documento}
                    </option>
                  ))}
                </select>

                {mensajeModal && (
                  <div className="mensaje-error mensaje-modal">
                    {mensajeModal}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarModalPaciente}>
                Cancelar
              </button>

              <button
                className="btn-guardar"
                disabled={!pacienteSeleccionado || pacienteTieneHistoria}
                onClick={continuarNuevaHistoria}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREAR HISTORIA */}

      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-contenido modal-historia">
            <div className="modal-header">
              <div>
                <h2>Historia clínica</h2>
                <p>Completa la información clínica del paciente.</p>
              </div>

              <button
                className="btn-cerrar-modal"
                onClick={() => setMostrarFormulario(false)}
                title="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={guardarHistoria} className="formulario-historia">
              <div className="paciente-seleccionado">
                <FileText size={18} />

                <div>
                  <span>Paciente</span>

                  <strong>
                    {pacienteActual?.nombres} {pacienteActual?.apellidos}
                  </strong>

                  <small>Documento: {pacienteActual?.documento}</small>
                </div>
              </div>

              <div className="campo-formulario">
                <label htmlFor="motivo_consulta">Motivo de consulta *</label>

                <textarea
                  id="motivo_consulta"
                  rows="3"
                  value={formulario.motivo_consulta}
                  onChange={(e) =>
                    actualizarCampo('motivo_consulta', e.target.value)
                  }
                  placeholder="Describe el motivo de consulta..."
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="antecedentes_medicos">
                  Antecedentes médicos
                </label>

                <textarea
                  id="antecedentes_medicos"
                  rows="3"
                  value={formulario.antecedentes_medicos}
                  onChange={(e) =>
                    actualizarCampo('antecedentes_medicos', e.target.value)
                  }
                  placeholder="Registra antecedentes médicos relevantes..."
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="alergias">Alergias</label>

                <textarea
                  id="alergias"
                  rows="3"
                  value={formulario.alergias}
                  onChange={(e) => actualizarCampo('alergias', e.target.value)}
                  placeholder="Registra alergias conocidas..."
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="medicamentos_actuales">
                  Medicamentos actuales
                </label>

                <textarea
                  id="medicamentos_actuales"
                  rows="3"
                  value={formulario.medicamentos_actuales}
                  onChange={(e) =>
                    actualizarCampo('medicamentos_actuales', e.target.value)
                  }
                  placeholder="Registra medicamentos que utiliza actualmente..."
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="antecedentes_odontologicos">
                  Antecedentes odontológicos
                </label>

                <textarea
                  id="antecedentes_odontologicos"
                  rows="3"
                  value={formulario.antecedentes_odontologicos}
                  onChange={(e) =>
                    actualizarCampo(
                      'antecedentes_odontologicos',
                      e.target.value,
                    )
                  }
                  placeholder="Registra antecedentes odontológicos relevantes..."
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="habitos">Hábitos</label>

                <textarea
                  id="habitos"
                  rows="3"
                  value={formulario.habitos}
                  onChange={(e) => actualizarCampo('habitos', e.target.value)}
                  placeholder="Registra hábitos relevantes para la valoración..."
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="diagnostico">Diagnóstico</label>

                <textarea
                  id="diagnostico"
                  rows="3"
                  value={formulario.diagnostico}
                  onChange={(e) =>
                    actualizarCampo('diagnostico', e.target.value)
                  }
                  placeholder="Registra el diagnóstico..."
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="observaciones">Observaciones</label>

                <textarea
                  id="observaciones"
                  rows="3"
                  value={formulario.observaciones}
                  onChange={(e) =>
                    actualizarCampo('observaciones', e.target.value)
                  }
                  placeholder="Agrega observaciones adicionales..."
                />
              </div>

              {mensajeFormulario && (
                <div className="mensaje-error">{mensajeFormulario}</div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setMostrarFormulario(false)}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-guardar"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : 'Guardar historia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER HISTORIA */}

      {mostrarHistoria && historiaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarHistoria}>
          <div
            className="modal-contenido modal-historia"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Historia clínica</h2>
                <p>Información clínica del paciente</p>
              </div>

              <button
                className="btn-cerrar-modal"
                onClick={cerrarHistoria}
                title="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="detalle-historia">
              <div className="detalle-paciente">
                <FileText size={22} />

                <div>
                  <span>Paciente</span>

                  <strong>{historiaSeleccionada.paciente_nombre}</strong>
                </div>
              </div>

              <div className="detalle-grid">
                <div className="detalle-item">
                  <span>Odontólogo</span>

                  <strong>
                    {historiaSeleccionada.odontologo_nombre || 'Sin asignar'}
                  </strong>
                </div>

                <div className="detalle-item">
                  <span>Fecha de creación</span>

                  <strong>
                    {new Date(
                      historiaSeleccionada.fecha_creacion,
                    ).toLocaleDateString('es-CO')}
                  </strong>
                </div>

                <div className="detalle-item">
                  <span>Última actualización</span>

                  <strong>
                    {new Date(
                      historiaSeleccionada.fecha_actualizacion,
                    ).toLocaleDateString('es-CO')}
                  </strong>
                </div>
              </div>

              <div className="detalle-seccion">
                <h3>Motivo de consulta</h3>

                <p>{historiaSeleccionada.motivo_consulta || 'No registrado'}</p>
              </div>

              <div className="detalle-seccion">
                <h3>Antecedentes médicos</h3>

                <p>
                  {historiaSeleccionada.antecedentes_medicos ||
                    'No registrados'}
                </p>
              </div>

              <div className="detalle-seccion">
                <h3>Alergias</h3>

                <p>{historiaSeleccionada.alergias || 'No registradas'}</p>
              </div>

              <div className="detalle-seccion">
                <h3>Medicamentos actuales</h3>

                <p>
                  {historiaSeleccionada.medicamentos_actuales ||
                    'No registrados'}
                </p>
              </div>

              <div className="detalle-seccion">
                <h3>Antecedentes odontológicos</h3>

                <p>
                  {historiaSeleccionada.antecedentes_odontologicos ||
                    'No registrados'}
                </p>
              </div>

              <div className="detalle-seccion">
                <h3>Hábitos</h3>

                <p>{historiaSeleccionada.habitos || 'No registrados'}</p>
              </div>

              <div className="detalle-seccion">
                <h3>Diagnóstico</h3>

                <p>{historiaSeleccionada.diagnostico || 'No registrado'}</p>
              </div>

              <div className="detalle-seccion">
                <h3>Observaciones</h3>

                <p>{historiaSeleccionada.observaciones || 'No registradas'}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarHistoria}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Historias
