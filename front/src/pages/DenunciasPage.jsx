import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './DenunciasPage.css'

const ALCALDES = [
  {
    municipio: 'Azcapotzalco',
    nombre: 'Margarita',
    apPaterno: 'Saldana',
    apMaterno: 'Hernandez',
    partido: 'COAL.',
    telefono: '55 53-54-99-94',
    poblacion: 432205,
  },
  {
    municipio: 'Coyoacan',
    nombre: 'Jose Giovani',
    apPaterno: 'Gutierrez',
    apMaterno: 'Aguilar',
    partido: 'COAL.',
    telefono: '55 56-59-59-34',
    poblacion: 614447,
  },
  {
    municipio: 'Cuajimalpa de Morelos',
    nombre: 'Adrian',
    apPaterno: 'Rubalcava',
    apMaterno: 'Suarez',
    partido: 'COAL.',
    telefono: '55 58-14-11-00',
    poblacion: 217686,
  },
  {
    municipio: 'Gustavo A. Madero',
    nombre: 'Enrique Rodrigo',
    apPaterno: 'Rojas',
    apMaterno: 'Serafin',
    partido: 'MORENA',
    telefono: '55 51-18-28-02',
    poblacion: 1173351,
  },
  {
    municipio: 'Iztacalco',
    nombre: 'Raul Armando',
    apPaterno: 'Quintero',
    apMaterno: 'Martinez',
    partido: 'COAL.',
    telefono: '55 56-54-33-33',
    poblacion: 404695,
  },
  {
    municipio: 'Iztapalapa',
    nombre: 'Raul',
    apPaterno: 'Basulto',
    apMaterno: 'Luviano',
    partido: 'COAL.',
    telefono: '55 56-85-40-22',
    poblacion: 1835486,
  },
  {
    municipio: 'La Magdalena Contreras',
    nombre: 'Luis Gerardo',
    apPaterno: 'Quijano',
    apMaterno: 'Morales',
    partido: 'COAL.',
    telefono: '55 54-49-60-00',
    poblacion: 247622,
  },
  {
    municipio: 'Alvaro Obregon',
    nombre: 'Lia',
    apPaterno: 'Limon',
    apMaterno: 'Garcia',
    partido: 'COAL.',
    telefono: '55 52-76-67-00',
    poblacion: 759137,
  },
  {
    municipio: 'Tlahuac',
    nombre: 'Araceli Berenice',
    apPaterno: 'Hernandez',
    apMaterno: 'Calderon',
    partido: 'COAL.',
    telefono: '55 58-42-89-77',
    poblacion: 392313,
  },
  {
    municipio: 'Tlalpan',
    nombre: 'Alfa Eliana',
    apPaterno: 'Gonzalez',
    apMaterno: 'Magallanes',
    partido: 'COAL.',
    telefono: '55 56-55-60-24',
    poblacion: 699928,
  },
  {
    municipio: 'Xochimilco',
    nombre: 'Juana Onesima',
    apPaterno: 'Delgado',
    apMaterno: 'Chavez',
    partido: 'MORENA',
    telefono: '55 89-57-36-00',
    poblacion: 442178,
  },
  {
    municipio: 'Benito Juarez',
    nombre: 'Santiago',
    apPaterno: 'Taboada',
    apMaterno: 'Cortina',
    partido: 'PAN',
    telefono: '55 56-04-12-12',
    poblacion: 434153,
  },
  {
    municipio: 'Cuauhtemoc',
    nombre: 'Raul',
    apPaterno: 'Ortega',
    apMaterno: 'Rodriguez',
    partido: 'PAN',
    telefono: '55 24-52-31-00',
    poblacion: 545884,
  },
  {
    municipio: 'Miguel Hidalgo',
    nombre: 'Mauricio',
    apPaterno: 'Tabe',
    apMaterno: 'Echartea',
    partido: 'COAL.',
    telefono: '55 52-76-77-01',
    poblacion: 414470,
  },
  {
    municipio: 'Venustiano Carranza',
    nombre: 'Adolfo',
    apPaterno: 'Hernandez',
    apMaterno: 'Garcia',
    partido: 'MORENA',
    telefono: '55 57-64-94-00',
    poblacion: 443704,
  },
]

const CATEGORIAS = [
  {
    titulo: 'Bacheo y pavimentacion',
    tags: 'BACHEO · MANTENIMIENTO VIA PUBLICA · REPARACION EMPEDRADO',
    color: '#f59e0b',
  },
  {
    titulo: 'Fuga o falta de agua',
    tags: 'FUGA DE AGUA · FALTA DE AGUA · TOMA DOMICILIARIA',
    color: '#3b82f6',
  },
  {
    titulo: 'Alumbrado publico',
    tags: 'LUMINARIA FUNDIDA · POSTE SIN LUZ · ZONA SIN ALUMBRADO',
    color: '#eab308',
  },
  {
    titulo: 'Drenaje y desazolve',
    tags: 'MANTENIMIENTO DRENAJE · DESAZOLVE · COLADERA / ALCANTARILLA',
    color: '#6366f1',
  },
  {
    titulo: 'Limpieza y residuos',
    tags: 'RECOLECCION BASURA · RETIRO CASCAJO / ESCOMBRO · TIRADERO',
    color: '#22c55e',
  },
  {
    titulo: 'Seguridad y vigilancia',
    tags: 'SOLICITUD VIGILANCIA · VEHICULO ABANDONADO · AMBULANTE IRREGULAR',
    color: '#ef4444',
  },
  {
    titulo: 'Areas verdes y parques',
    tags: 'PODA / RETIRO ARBOL · MANTENIMIENTO PARQUE / AREA VERDE',
    color: '#84cc16',
  },
  {
    titulo: 'Otro problema urbano',
    tags: 'SEMAFOROS · BALIZAMIENTO · VERIFICACION ADMINISTRATIVA',
    color: '#a1a1aa',
  },
]

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function buildFolio() {
  const date = new Date()
  const yy = String(date.getFullYear()).slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `GJ-${yy}${mm}${dd}-${random}`
}

function stepClass(step, activeStep) {
  if (step < activeStep) {
    return 'dgj-step done'
  }

  if (step === activeStep) {
    return 'dgj-step active'
  }

  return 'dgj-step wait'
}

function DenunciasPage() {
  const [alcaldiaInput, setAlcaldiaInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedMayor, setSelectedMayor] = useState(null)
  const [categoria, setCategoria] = useState(null)
  const [urgencia, setUrgencia] = useState('baja')
  const [derivarLocatel, setDerivarLocatel] = useState(false)

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    colonia: '',
    calle: '',
    descripcion: '',
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [successData, setSuccessData] = useState(null)
  const [misQuejas, setMisQuejas] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('gj_quejas') || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [showMisQuejas, setShowMisQuejas] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('gj_quejas') || '[]')
      return Array.isArray(parsed) && parsed.length > 0
    } catch {
      return false
    }
  })

  const activeStep = successData ? 4 : !selectedMayor ? 1 : !categoria ? 2 : 3

  const filteredMayors = useMemo(() => {
    const query = normalizeText(alcaldiaInput)

    if (!query) {
      return []
    }

    return ALCALDES.filter((item) => normalizeText(item.municipio).includes(query)).slice(0, 8)
  }, [alcaldiaInput])

  const rowsMisQuejas = useMemo(() => {
    return misQuejas.map((item) => {
      const dias = typeof item.dias === 'number' ? item.dias : 0
      const estatus = dias >= 15 ? 'escalado' : item.estatus

      return {
        ...item,
        dias,
        estatus,
      }
    })
  }, [misQuejas])

  const handleSelectMayor = (mayor) => {
    setSelectedMayor(mayor)
    setAlcaldiaInput(mayor.municipio)
    setShowDropdown(false)
    setErrorMessage('')
  }

  const handleSearchMayor = () => {
    const query = normalizeText(alcaldiaInput)

    const mayor = ALCALDES.find((item) => {
      const normalized = normalizeText(item.municipio)
      return normalized === query || normalized.includes(query)
    })

    if (!mayor) {
      setErrorMessage('Selecciona una alcaldia valida de la lista.')
      return
    }

    handleSelectMayor(mayor)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!selectedMayor) {
      setErrorMessage('Selecciona primero tu alcaldia.')
      return
    }

    if (!categoria) {
      setErrorMessage('Selecciona el tipo de problema.')
      return
    }

    const requiredFields = ['nombre', 'email', 'colonia', 'calle', 'descripcion']
    const hasMissing = requiredFields.some((field) => !formData[field].trim())

    if (hasMissing) {
      setErrorMessage('Completa todos los campos obligatorios.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Ingresa un correo electronico valido.')
      return
    }

    const folio = buildFolio()
    const complaint = {
      folio,
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      colonia: formData.colonia.trim(),
      calle: formData.calle.trim(),
      descripcion: formData.descripcion.trim(),
      alcaldia: selectedMayor.municipio,
      alcalde: `${selectedMayor.nombre} ${selectedMayor.apPaterno}`,
      categoria: categoria.titulo,
      urgencia,
      locatel: derivarLocatel,
      fecha: new Date().toISOString(),
      dias: 0,
      estatus: 'pendiente',
    }

    const nextComplaints = [complaint, ...misQuejas]
    setMisQuejas(nextComplaints)
    localStorage.setItem('gj_quejas', JSON.stringify(nextComplaints))

    setShowMisQuejas(true)
    setSuccessData({
      folio,
      alcaldia: complaint.alcaldia,
      alcalde: complaint.alcalde,
      categoria: complaint.categoria,
      email: complaint.email,
      locatel: complaint.locatel,
    })
    setErrorMessage('')
  }

  const resetForm = () => {
    setSuccessData(null)
    setAlcaldiaInput('')
    setSelectedMayor(null)
    setCategoria(null)
    setUrgencia('baja')
    setDerivarLocatel(false)
    setFormData({
      nombre: '',
      email: '',
      colonia: '',
      calle: '',
      descripcion: '',
    })
    setErrorMessage('')
  }

  return (
    <main className="dgj-page">
      <section className="dgj-nav">
        <div className="dgj-nav-brand">
          <div className="dgj-nav-logo">*</div>
          <div>
            <div className="dgj-nav-title">
              Geo<em>Justicia</em> CDMX
            </div>
            <div className="dgj-nav-sub">Plataforma ciudadana de peticiones</div>
          </div>
        </div>

        <div className="dgj-nav-right">
          <Link className="dgj-nav-link" to="/mapas">
            Ver mapa
          </Link>
          <span className="dgj-nav-tag">SUAC 0311</span>
        </div>
      </section>

      <section className="dgj-hero">
        <div className="dgj-hero-inner">
          <div className="dgj-hero-kicker">Justicia espacial · CDMX 2024</div>
          <h1>
            Tu queja llega al <em>alcalde correcto.</em>
            <br />
            Con nombre y apellido.
          </h1>
          <p>
            Selecciona tu alcaldia, describe el problema y tu peticion va directamente a quien tiene
            la obligacion legal de resolverlo. Si no responde en 15 dias, el sistema lo escala solo.
          </p>
          <div className="dgj-hero-stats">
            <div className="dgj-hstat">
              <div className="dgj-hstat-n">16</div>
              <div className="dgj-hstat-l">Alcaldias conectadas</div>
            </div>
            <div className="dgj-hstat">
              <div className="dgj-hstat-n">38,708</div>
              <div className="dgj-hstat-l">Quejas registradas 2024</div>
            </div>
            <div className="dgj-hstat">
              <div className="dgj-hstat-n">15 dias</div>
              <div className="dgj-hstat-l">Plazo maximo de atencion</div>
            </div>
          </div>
        </div>
      </section>

      <section className="dgj-main">
        <div className="dgj-stepper">
          <div className={stepClass(1, activeStep)}>
            <div className="dgj-step-dot">{activeStep > 1 ? '✓' : '1'}</div>
            <div className="dgj-step-text">Tu alcaldia</div>
          </div>
          <div className="dgj-step-line" />
          <div className={stepClass(2, activeStep)}>
            <div className="dgj-step-dot">{activeStep > 2 ? '✓' : '2'}</div>
            <div className="dgj-step-text">El problema</div>
          </div>
          <div className="dgj-step-line" />
          <div className={stepClass(3, activeStep)}>
            <div className="dgj-step-dot">{activeStep > 3 ? '✓' : '3'}</div>
            <div className="dgj-step-text">Tus datos</div>
          </div>
          <div className="dgj-step-line" />
          <div className={stepClass(4, activeStep)}>
            <div className="dgj-step-dot">{successData ? '✓' : '4'}</div>
            <div className="dgj-step-text">Confirmacion</div>
          </div>
        </div>

        {!successData ? (
          <>
            <div className="dgj-section-card">
              <div className="dgj-section-head">
                <div className="dgj-section-icon" style={{ background: '#d8f3dc' }}>
                  #
                </div>
                <div>
                  <div className="dgj-section-title">En que alcaldia es el problema?</div>
                  <div className="dgj-section-sub">Busca por nombre y te mostramos quien esta a cargo</div>
                </div>
              </div>

              <div className="dgj-section-body">
                <div className="dgj-search-wrap">
                  <div className="dgj-search-input-row">
                    <input
                      type="text"
                      value={alcaldiaInput}
                      placeholder="Escribe tu alcaldia..."
                      autoComplete="off"
                      onChange={(event) => {
                        setAlcaldiaInput(event.target.value)
                        setShowDropdown(true)
                        setSelectedMayor(null)
                        setErrorMessage('')
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowDropdown(false)
                        }, 180)
                      }}
                    />
                    <button type="button" className="dgj-btn-buscar" onClick={handleSearchMayor}>
                      Buscar
                    </button>
                  </div>

                  {showDropdown && filteredMayors.length > 0 ? (
                    <div className="dgj-dropdown">
                      {filteredMayors.map((item) => (
                        <button
                          type="button"
                          key={item.municipio}
                          className="dgj-dd-item"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSelectMayor(item)}
                        >
                          <span>{item.municipio}</span>
                          <span className="dgj-dd-item-pop">{item.poblacion.toLocaleString('es-MX')} hab.</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                {selectedMayor ? (
                  <div className="dgj-alcalde-card">
                    <div className="dgj-alcalde-avatar">
                      {selectedMayor.nombre.charAt(0)}
                      {selectedMayor.apPaterno.charAt(0)}
                    </div>
                    <div className="dgj-alcalde-info">
                      <div className="dgj-alcalde-name">
                        {selectedMayor.nombre} {selectedMayor.apPaterno} {selectedMayor.apMaterno}
                      </div>
                      <div className="dgj-alcalde-alcaldia">Alcalde de {selectedMayor.municipio}</div>
                      <div className="dgj-alcalde-meta">
                        <span>
                          <span className="dgj-partido-badge">{selectedMayor.partido}</span>
                        </span>
                        <span>Tel: {selectedMayor.telefono}</span>
                        <span>Hab: {selectedMayor.poblacion.toLocaleString('es-MX')}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {selectedMayor ? (
              <div className="dgj-section-card">
                <div className="dgj-section-head">
                  <div className="dgj-section-icon" style={{ background: '#fef3c7' }}>
                    +
                  </div>
                  <div>
                    <div className="dgj-section-title">Cual es el problema?</div>
                    <div className="dgj-section-sub">
                      Selecciona la categoria, puedes agregar detalles despues
                    </div>
                  </div>
                </div>

                <div className="dgj-section-body">
                  <div className="dgj-cat-grid">
                    {CATEGORIAS.map((item, index) => (
                      <button
                        key={item.titulo}
                        type="button"
                        className={
                          categoria?.titulo === item.titulo ? 'dgj-cat-item selected' : 'dgj-cat-item'
                        }
                        onClick={() => {
                          setCategoria(item)
                          setErrorMessage('')
                        }}
                      >
                        <span className="dgj-cat-stripe" style={{ background: item.color }} />
                        <span className="dgj-cat-num">{index + 1}</span>
                        <span className="dgj-cat-body">
                          <span className="dgj-cat-title">{item.titulo}</span>
                          <span className="dgj-cat-tags">{item.tags}</span>
                        </span>
                        <span className="dgj-cat-check">✓</span>
                      </button>
                    ))}
                  </div>

                  <div className="dgj-urg-wrapper">
                    <div className="dgj-form-label">Nivel de urgencia</div>
                    <div className="dgj-urgencia-row">
                      <button
                        type="button"
                        className={urgencia === 'baja' ? 'dgj-urg-btn sel-baja' : 'dgj-urg-btn'}
                        onClick={() => setUrgencia('baja')}
                      >
                        Baja - puede esperar
                      </button>
                      <button
                        type="button"
                        className={urgencia === 'media' ? 'dgj-urg-btn sel-media' : 'dgj-urg-btn'}
                        onClick={() => setUrgencia('media')}
                      >
                        Media - afecta el dia a dia
                      </button>
                      <button
                        type="button"
                        className={urgencia === 'alta' ? 'dgj-urg-btn sel-alta' : 'dgj-urg-btn'}
                        onClick={() => setUrgencia('alta')}
                      >
                        Alta - riesgo inmediato
                      </button>
                    </div>
                  </div>

                  <div className="dgj-escalacion-box">
                    <div className="dgj-esc-title">Que pasa si no responden?</div>
                    <div className="dgj-esc-timeline">
                      <div className="dgj-esc-node">
                        <div className="dgj-esc-circle n1">1</div>
                        <div className="dgj-esc-label">Alcalde</div>
                        <div className="dgj-esc-days">Dia 1</div>
                      </div>
                      <div className="dgj-esc-arrow">→</div>
                      <div className="dgj-esc-node">
                        <div className="dgj-esc-circle n2">2</div>
                        <div className="dgj-esc-label">Director</div>
                        <div className="dgj-esc-days">Dia 15</div>
                      </div>
                      <div className="dgj-esc-arrow">→</div>
                      <div className="dgj-esc-node">
                        <div className="dgj-esc-circle n3">3</div>
                        <div className="dgj-esc-label">Sistema CDMX</div>
                        <div className="dgj-esc-days">Dia 30</div>
                      </div>
                    </div>
                    <div className="dgj-esc-help">
                      El reporte se envia al alcalde. Si en 15 dias no hay respuesta, escala
                      automaticamente.
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {selectedMayor ? (
              <form className="dgj-section-card" onSubmit={handleSubmit}>
                <div className="dgj-section-head">
                  <div className="dgj-section-icon" style={{ background: '#eff6ff' }}>
                    @
                  </div>
                  <div>
                    <div className="dgj-section-title">Tus datos y ubicacion exacta</div>
                    <div className="dgj-section-sub">
                      Para generar folio de seguimiento y notificarte avances
                    </div>
                  </div>
                </div>

                <div className="dgj-section-body">
                  <div className="dgj-form-grid">
                    <div className="dgj-form-group">
                      <label className="dgj-form-label" htmlFor="dgj-nombre">
                        Nombre completo *
                      </label>
                      <input
                        id="dgj-nombre"
                        className="dgj-form-input"
                        type="text"
                        value={formData.nombre}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            nombre: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="dgj-form-group">
                      <label className="dgj-form-label" htmlFor="dgj-email">
                        Correo electronico *
                      </label>
                      <input
                        id="dgj-email"
                        className="dgj-form-input"
                        type="email"
                        value={formData.email}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            email: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="dgj-form-group">
                      <label className="dgj-form-label" htmlFor="dgj-colonia">
                        Colonia *
                      </label>
                      <input
                        id="dgj-colonia"
                        className="dgj-form-input"
                        type="text"
                        value={formData.colonia}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            colonia: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="dgj-form-group">
                      <label className="dgj-form-label" htmlFor="dgj-calle">
                        Calle y referencias *
                      </label>
                      <input
                        id="dgj-calle"
                        className="dgj-form-input"
                        type="text"
                        value={formData.calle}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            calle: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="dgj-form-group dgj-form-full">
                      <label className="dgj-form-label" htmlFor="dgj-desc">
                        Descripcion detallada del problema *
                      </label>
                      <textarea
                        id="dgj-desc"
                        className="dgj-form-textarea"
                        rows={4}
                        value={formData.descripcion}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            descripcion: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="dgj-form-group dgj-form-full dgj-locatel-wrap">
                      <div className="dgj-locatel-row">
                        <input
                          id="dgj-locatel"
                          type="checkbox"
                          checked={derivarLocatel}
                          onChange={(event) => setDerivarLocatel(event.target.checked)}
                        />
                        <label htmlFor="dgj-locatel">
                          Derivar tambien esta queja a Locatel / SUAC (0311) para seguimiento
                          oficial.
                        </label>
                      </div>
                    </div>
                  </div>

                  {errorMessage ? <p className="dgj-error">{errorMessage}</p> : null}

                  <button type="submit" className="dgj-btn-submit">
                    Enviar peticion al alcalde <span className="arrow">→</span>
                  </button>
                </div>
              </form>
            ) : null}
          </>
        ) : (
          <section className="dgj-confirm-screen">
            <div className="dgj-confirm-check">✓</div>
            <div className="dgj-confirm-mini">Peticion registrada</div>
            <div className="dgj-confirm-folio">{successData.folio}</div>
            <div className="dgj-confirm-alcalde">
              Enviada al Alcalde {successData.alcalde} - {successData.alcaldia}
            </div>
            <div className="dgj-confirm-sub">
              Tu queja de {successData.categoria} fue registrada.
              {successData.locatel ? ' Tambien se derivo a Locatel 0311.' : ''} Recibiras
              actualizaciones en {successData.email}.
            </div>

            <div className="dgj-confirm-timeline">
              <div className="dgj-ct-row">
                <div className="dgj-ct-dot" style={{ background: '#52b788' }} />
                <span>
                  <strong>Hoy</strong> - Peticion registrada y enviada al alcalde
                </span>
              </div>
              <div className="dgj-ct-row">
                <div className="dgj-ct-dot" style={{ background: '#52b788' }} />
                <span>
                  <strong>Cada lunes</strong> - Reporte semanal al despacho de la alcaldia
                </span>
              </div>
              <div className="dgj-ct-row">
                <div className="dgj-ct-dot" style={{ background: '#fcd34d' }} />
                <span>
                  <strong>Dia 15</strong> - Sin respuesta: escalacion automatica al Director
                </span>
              </div>
              <div className="dgj-ct-row">
                <div className="dgj-ct-dot" style={{ background: '#fca5a5' }} />
                <span>
                  <strong>Dia 30</strong> - Escala al Sistema de Gestion de CDMX
                </span>
              </div>
            </div>

            <div className="dgj-confirm-actions">
              <button type="button" className="dgj-ca-btn" onClick={() => setShowMisQuejas(true)}>
                Ver mis quejas
              </button>
              <button type="button" className="dgj-ca-btn" onClick={resetForm}>
                Reportar otro problema
              </button>
              <Link to="/mapas" className="dgj-ca-btn primary">
                Ver mapa de la ciudad →
              </Link>
            </div>
          </section>
        )}

        {showMisQuejas ? (
          <section className="dgj-section-card dgj-misquejas">
            <div className="dgj-section-head">
              <div className="dgj-section-icon" style={{ background: '#f0fdf4' }}>
                =
              </div>
              <div>
                <div className="dgj-section-title">Mis peticiones registradas</div>
                <div className="dgj-section-sub">Solo visibles en este dispositivo</div>
              </div>
            </div>

            <div className="dgj-section-body">
              {rowsMisQuejas.length === 0 ? (
                <div className="dgj-quejas-empty">
                  <div className="icon">~</div>
                  Aun no tienes quejas registradas
                </div>
              ) : (
                <table className="dgj-quejas-table">
                  <thead>
                    <tr>
                      <th>Folio</th>
                      <th>Tipo</th>
                      <th>Colonia</th>
                      <th>Estado</th>
                      <th>Dias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsMisQuejas.map((item) => {
                      const pillClass =
                        item.estatus === 'escalado'
                          ? 'dgj-pill-escalado'
                          : item.estatus === 'atendido'
                            ? 'dgj-pill-atendido'
                            : 'dgj-pill-pendiente'

                      return (
                        <tr key={item.folio}>
                          <td>
                            <span className="dgj-folio-cell">{item.folio}</span>
                          </td>
                          <td>
                            <strong>{item.categoria}</strong>
                            <br />
                            <span className="dgj-soft-cell">{item.alcaldia}</span>
                          </td>
                          <td>{item.colonia}</td>
                          <td>
                            <span className={`dgj-status-pill ${pillClass}`}>
                              {item.estatus === 'escalado'
                                ? 'Escalado'
                                : item.estatus === 'atendido'
                                  ? 'Atendido'
                                  : 'Pendiente'}
                            </span>
                          </td>
                          <td>
                            <span className={item.dias >= 15 ? 'dgj-days-badge urgent' : 'dgj-days-badge'}>
                              {item.dias}d
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        ) : null}

        <section className="dgj-info-wrap">
          <div className="dgj-info-label">Como funciona GeoJusticia?</div>
          <div className="dgj-info-grid">
            <div className="dgj-info-card">
              <div className="dgj-info-card-icon">o</div>
              <div className="dgj-info-card-title">Datos abiertos de la ciudad</div>
              <div className="dgj-info-card-body">
                Cruzamos FGJ, C5 WiFi, GTFS y quejas historicas para estimar el indice de injusticia
                espacial por zona.
              </div>
            </div>

            <div className="dgj-info-card">
              <div className="dgj-info-card-icon">!</div>
              <div className="dgj-info-card-title">Rendicion de cuentas automatica</div>
              <div className="dgj-info-card-body">
                El alcalde recibe reportes de seguimiento. Sin respuesta en 15 dias, el sistema escala.
              </div>
            </div>

            <div className="dgj-info-card">
              <div className="dgj-info-card-icon">@</div>
              <div className="dgj-info-card-title">Indice de injusticia espacial</div>
              <div className="dgj-info-card-body">
                Medimos el riesgo del trayecto ciudadano, no solo lo que ocurre dentro del servicio.
              </div>
            </div>

            <div className="dgj-info-card">
              <div className="dgj-info-card-icon">#</div>
              <div className="dgj-info-card-title">Tus datos, tu control</div>
              <div className="dgj-info-card-body">
                Tu nombre y correo solo se usan para enviarte folio y actualizaciones.
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

export default DenunciasPage
