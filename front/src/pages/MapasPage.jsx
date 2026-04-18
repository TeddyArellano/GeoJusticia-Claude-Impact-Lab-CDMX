import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GeoHeatLayer from '../components/GeoHeatLayer'
import {
  ALCALDIAS,
  C5_C2_LOCATIONS,
  COMPLAINTS,
  DEFAULT_CENTER,
  HEAT_POINTS,
  SAFE_CROSSINGS,
  STATUS_COLORS,
  TEMAS,
  WIFI_POINTS,
} from '../data/geojusticiaMock'
import './MapasPage.css'

function formatPct(value) {
  return `${Math.round(value)}%`
}

function SearchFocus({ target }) {
  const map = useMap()

  useEffect(() => {
    if (!target) {
      return
    }

    map.flyTo([target.lat, target.lon], 15, {
      duration: 1.25,
    })
  }, [map, target])

  return null
}

function SearchResultLayer({ target }) {
  const map = useMap()

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer?.options?.isSearchResult) {
        map.removeLayer(layer)
      }
    })

    if (!target) {
      return
    }

    const marker = L.circleMarker([target.lat, target.lon], {
      color: '#111827',
      fillColor: '#f59e0b',
      fillOpacity: 0.92,
      weight: 2,
      radius: 8,
      isSearchResult: true,
    }).addTo(map)

    return () => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker)
      }
    }
  }, [map, target])

  return null
}

function MapasPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryInUrl = searchParams.get('q') ?? ''

  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [searchError, setSearchError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const [mode, setMode] = useState('all')
  const [layers, setLayers] = useState({
    quejas: true,
    delitos: true,
    wifi: false,
    pasos: false,
    centros: true,
  })

  const [draftFilters, setDraftFilters] = useState({
    alcaldia: '',
    tema: '',
    estatus: '',
  })

  const [filters, setFilters] = useState({
    alcaldia: '',
    tema: '',
    estatus: '',
  })

  useEffect(() => {
    if (!queryInUrl) {
      return
    }

    let cancelled = false

    async function geocodeQuery() {
      try {
        setIsSearching(true)
        setSearchError('')

        const endpoint = new URL('https://nominatim.openstreetmap.org/search')
        endpoint.searchParams.set('q', `${queryInUrl}, Ciudad de Mexico, Mexico`)
        endpoint.searchParams.set('format', 'jsonv2')
        endpoint.searchParams.set('limit', '1')

        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('No se pudo buscar la direccion solicitada.')
        }

        const data = await response.json()

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No se encontro la direccion. Prueba con otra referencia.')
        }

        const first = data[0]
        const lat = Number(first.lat)
        const lon = Number(first.lon)

        if (Number.isNaN(lat) || Number.isNaN(lon)) {
          throw new Error('No fue posible interpretar el resultado geoespacial.')
        }

        if (!cancelled) {
          setSearchResult({
            lat,
            lon,
            displayName: first.display_name ?? queryInUrl,
          })
        }
      } catch (requestError) {
        if (!cancelled) {
          setSearchResult(null)
          setSearchError(requestError.message)
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false)
        }
      }
    }

    geocodeQuery()

    return () => {
      cancelled = true
    }
  }, [queryInUrl])

  const activeSearch = queryInUrl ? searchResult : null
  const activeSearchError = queryInUrl ? searchError : ''
  const activeSearchStatus = queryInUrl ? isSearching : false

  const effectiveInput = searchInput === '' ? queryInUrl : searchInput

  const filteredComplaints = useMemo(() => {
    return COMPLAINTS.filter((item) => {
      if (mode !== 'all' && item.tema !== mode) {
        return false
      }

      if (filters.alcaldia && item.alc !== filters.alcaldia) {
        return false
      }

      if (filters.tema && item.tema !== filters.tema) {
        return false
      }

      if (filters.estatus && item.status !== filters.estatus) {
        return false
      }

      return true
    })
  }, [filters, mode])

  const metrics = useMemo(() => {
    const total = filteredComplaints.length
    const resolved = filteredComplaints.filter((item) => item.status === 'cerrado').length
    const pending = filteredComplaints.filter((item) => item.status === 'pendiente').length
    const attended = filteredComplaints.filter((item) => item.status === 'atendido').length
    const light = filteredComplaints.filter((item) => item.tema === 'ALUMBRADO').length

    return {
      total,
      resolved,
      pending,
      attended,
      light,
      resolutionRate: total > 0 ? (resolved / total) * 100 : 0,
    }
  }, [filteredComplaints])

  const rankingByTheme = useMemo(() => {
    const countMap = new Map()

    filteredComplaints.forEach((item) => {
      countMap.set(item.tema, (countMap.get(item.tema) ?? 0) + 1)
    })

    const total = filteredComplaints.length || 1

    return [...countMap.entries()]
      .map(([tema, count]) => ({
        tema,
        count,
        pct: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)
  }, [filteredComplaints])

  const rankingByAlcaldia = useMemo(() => {
    const countMap = new Map()

    filteredComplaints.forEach((item) => {
      countMap.set(item.alc, (countMap.get(item.alc) ?? 0) + 1)
    })

    const total = filteredComplaints.length || 1

    return [...countMap.entries()]
      .map(([alc, count]) => ({
        alc,
        count,
        pct: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [filteredComplaints])

  const trendTheme = rankingByTheme[0]?.tema ?? 'ALUMBRADO'
  const trendData = useMemo(() => {
    return Array.from({ length: 8 }, (_, index) => {
      const week = index + 1
      return filteredComplaints.filter((item) => item.tema === trendTheme && item.week === week)
        .length
    })
  }, [filteredComplaints, trendTheme])

  const maxTrend = Math.max(...trendData, 1)

  const handleLayerToggle = (key) => {
    setLayers((previous) => ({
      ...previous,
      [key]: !previous[key],
    }))
  }

  const handleDraftChange = (key, value) => {
    setDraftFilters((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  const applyFilters = () => {
    setFilters(draftFilters)
  }

  const clearFilters = () => {
    const reset = {
      alcaldia: '',
      tema: '',
      estatus: '',
    }

    setDraftFilters(reset)
    setFilters(reset)
    setMode('all')
  }

  const quickFilterAlcaldia = (alcaldia) => {
    const nextFilters = {
      ...filters,
      alcaldia,
    }

    setFilters(nextFilters)
    setDraftFilters(nextFilters)
  }

  const submitMapSearch = (event) => {
    event.preventDefault()
    const query = effectiveInput.trim()

    if (!query) {
      setSearchInput('')
      setSearchResult(null)
      setSearchError('')
      setIsSearching(false)
      setSearchParams({})
      return
    }

    setSearchResult(null)
    setSearchError('')
    setSearchParams({ q: query })
  }

  return (
    <main className="geo-page">
      <section className="geo-shell">
        <header className="geo-header">
          <div className="geo-brand">
            <div className="geo-logo">@</div>
            <div>
              <h2>
                Geo<em>Justicia</em> CDMX
              </h2>
              <p>Portal ciudadano · Infraestructura urbana · SUAC/Locatel 2024</p>
            </div>
          </div>

          <div className="geo-pills">
            <div className="geo-pill">
              <b>{metrics.total.toLocaleString('es-MX')}</b> quejas infra
            </div>
            <div className="geo-pill">
              <b>{HEAT_POINTS.length.toLocaleString('es-MX')}</b> zonas de delitos
            </div>
            <div className="geo-pill">
              <b>{WIFI_POINTS.length.toLocaleString('es-MX')}</b> puntos C5
            </div>
            <div className="geo-pill">
              <b>{SAFE_CROSSINGS.length}</b> pasos seguros
            </div>
            <div className="geo-pill">
              <b>Ene-Feb 2024</b>
            </div>
          </div>
        </header>

        <div className="geo-layout">
          <aside className="geo-sidebar">
            <div className="s-block">
              <p className="s-label">resumen</p>
              <div className="kpi-grid">
                <div className="kpi">
                  <div className="kpi-lbl">Quejas activas</div>
                  <div className="kpi-val" style={{ color: 'var(--brand)' }}>
                    {metrics.total.toLocaleString('es-MX')}
                  </div>
                  <div className="kpi-sub">infraestructura</div>
                </div>

                <div className="kpi">
                  <div className="kpi-lbl">Resueltas</div>
                  <div className="kpi-val" style={{ color: '#276749' }}>
                    {metrics.resolved.toLocaleString('es-MX')}
                  </div>
                  <div className="kpi-sub">{formatPct(metrics.resolutionRate)} tasa resolucion</div>
                </div>

                <div className="kpi">
                  <div className="kpi-lbl">Pendientes</div>
                  <div className="kpi-val" style={{ color: '#c0392b' }}>
                    {metrics.pending.toLocaleString('es-MX')}
                  </div>
                  <div className="kpi-sub">sin resolver</div>
                </div>

                <div className="kpi">
                  <div className="kpi-lbl">Atendidas</div>
                  <div className="kpi-val" style={{ color: '#0e7490' }}>
                    {metrics.attended.toLocaleString('es-MX')}
                  </div>
                  <div className="kpi-sub">en proceso</div>
                </div>

                <div className="kpi">
                  <div className="kpi-lbl">Alumbrado</div>
                  <div className="kpi-val" style={{ color: '#b7791f' }}>
                    {metrics.light.toLocaleString('es-MX')}
                  </div>
                  <div className="kpi-sub">quejas de luz</div>
                </div>
              </div>
            </div>

            <div className="s-block">
              <p className="s-label">capas del mapa</p>

              <div className="layer-row">
                <div className="layer-info">
                  <div className="layer-icon" style={{ background: '#fff3e0' }}>
                    o
                  </div>
                  <div>
                    <div className="layer-name">Quejas ciudadanas</div>
                    <div className="layer-sub">{filteredComplaints.length.toLocaleString('es-MX')} puntos</div>
                  </div>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={layers.quejas}
                    onChange={() => handleLayerToggle('quejas')}
                  />
                  <span className="switch-track" />
                </label>
              </div>

              <div className="layer-row">
                <div className="layer-info">
                  <div className="layer-icon" style={{ background: '#fce4ec' }}>
                    #
                  </div>
                  <div>
                    <div className="layer-name">Delitos a peaton</div>
                    <div className="layer-sub">Heatmap FGJ 2024</div>
                  </div>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={layers.delitos}
                    onChange={() => handleLayerToggle('delitos')}
                  />
                  <span className="switch-track" />
                </label>
              </div>

              <div className="layer-row">
                <div className="layer-info">
                  <div className="layer-icon" style={{ background: '#e3f2fd' }}>
                    ~
                  </div>
                  <div>
                    <div className="layer-name">Postes C5 WiFi</div>
                    <div className="layer-sub">Infraestructura digital CDMX</div>
                  </div>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={layers.wifi}
                    onChange={() => handleLayerToggle('wifi')}
                  />
                  <span className="switch-track" />
                </label>
              </div>

              <div className="layer-row">
                <div className="layer-info">
                  <div className="layer-icon" style={{ background: '#e8f5e9' }}>
                    +
                  </div>
                  <div>
                    <div className="layer-name">Pasos seguros</div>
                    <div className="layer-sub">{SAFE_CROSSINGS.length} cruces viales</div>
                  </div>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={layers.pasos}
                    onChange={() => handleLayerToggle('pasos')}
                  />
                  <span className="switch-track" />
                </label>
              </div>

              <div className="layer-row">
                <div className="layer-info">
                  <div className="layer-icon" style={{ background: '#fff8e1' }}>
                    *
                  </div>
                  <div>
                    <div className="layer-name">Centros C2 / C5</div>
                    <div className="layer-sub">{C5_C2_LOCATIONS.length} centros de mando</div>
                  </div>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={layers.centros}
                    onChange={() => handleLayerToggle('centros')}
                  />
                  <span className="switch-track" />
                </label>
              </div>
            </div>

            <div className="s-block">
              <p className="s-label">filtrar quejas</p>

              <div className="f-group">
                <p className="f-lbl">Alcaldia</p>
                <select
                  value={draftFilters.alcaldia}
                  onChange={(event) => handleDraftChange('alcaldia', event.target.value)}
                >
                  <option value="">Todas</option>
                  {ALCALDIAS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="f-group">
                <p className="f-lbl">Tipo de queja</p>
                <select
                  value={draftFilters.tema}
                  onChange={(event) => handleDraftChange('tema', event.target.value)}
                >
                  <option value="">Todos los temas</option>
                  {TEMAS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="f-group">
                <p className="f-lbl">Estatus</p>
                <select
                  value={draftFilters.estatus}
                  onChange={(event) => handleDraftChange('estatus', event.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="cerrado">Resuelto</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="atendido">Atendido</option>
                </select>
              </div>

              <div className="btn-row">
                <button type="button" className="btn-apply" onClick={applyFilters}>
                  Aplicar filtro
                </button>
                <button type="button" className="btn-clear" onClick={clearFilters}>
                  Limpiar
                </button>
              </div>

              {(filters.alcaldia || filters.tema || filters.estatus) && (
                <span className="filter-pill">Filtros activos</span>
              )}
            </div>

            <div className="s-block">
              <p className="s-label">tipo de queja</p>
              {rankingByTheme.map((item) => (
                <div className="tema-row" key={item.tema}>
                  <span className="tdot" style={{ background: 'var(--brand)' }} />
                  <span className="tname">{item.tema}</span>
                  <span className="tbar-wrap">
                    <span className="tbar" style={{ width: `${item.pct}%` }} />
                  </span>
                  <span className="tcount">{item.count}</span>
                  <span className="ttasa">{formatPct(item.pct)}</span>
                </div>
              ))}
            </div>

            <div className="s-block">
              <p className="s-label">tendencia semanal - top 1</p>
              <div className="trend-bars" aria-label="Tendencia semanal">
                {trendData.map((value, index) => (
                  <div key={`week-${index + 1}`}>
                    <div className="trend-bar" style={{ height: `${(value / maxTrend) * 100}%` }} />
                    <div className="trend-week">S{index + 1}</div>
                  </div>
                ))}
              </div>
              <p className="kpi-sub" style={{ marginTop: '7px' }}>
                Tema lider: {trendTheme}
              </p>
            </div>

            <div className="s-block">
              <p className="s-label">por alcaldia - clic para filtrar</p>
              {rankingByAlcaldia.map((item, index) => (
                <div key={item.alc} className="alc-row" onClick={() => quickFilterAlcaldia(item.alc)}>
                  <span className="anum">{index + 1}</span>
                  <span className="aname">{item.alc}</span>
                  <span className="abar-wrap">
                    <span className="abar" style={{ width: `${item.pct}%` }} />
                  </span>
                  <span className="acount">{item.count}</span>
                  <span className="atasa">{formatPct(item.pct)}</span>
                </div>
              ))}
            </div>

          </aside>

          <section className="geo-map-wrap">
            <form className="geo-search" onSubmit={submitMapSearch}>
              <input
                type="text"
                value={effectiveInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Buscar direccion o colonia en CDMX"
                aria-label="Buscar direccion en mapa"
              />
              <button type="submit">Ubicar</button>
            </form>

            {activeSearchStatus && <div className="geo-status">Buscando direccion...</div>}
            {!activeSearchStatus && activeSearchError && (
              <div className="geo-status">{activeSearchError}</div>
            )}
            {!activeSearchStatus && !activeSearchError && activeSearch && (
              <div className="geo-status">{activeSearch.displayName}</div>
            )}

            <MapContainer center={DEFAULT_CENTER} zoom={11} className="geo-map" scrollWheelZoom>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              <SearchFocus target={activeSearch} />
              <SearchResultLayer target={activeSearch} />

              <GeoHeatLayer points={HEAT_POINTS} visible={layers.delitos} />

              {layers.wifi &&
                WIFI_POINTS.map((item) => (
                  <CircleMarker
                    key={item.id}
                    center={[item.lat, item.lon]}
                    radius={3}
                    pathOptions={{
                      color: '#1f6fd3',
                      fillColor: '#5da9f6',
                      fillOpacity: 0.65,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="geo-popup">
                        <h4>Punto C5 WiFi</h4>
                        <p>Alcaldia: {item.alc}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

              {layers.quejas &&
                filteredComplaints.map((item) => (
                  <CircleMarker
                    key={item.id}
                    center={[item.lat, item.lon]}
                    radius={4}
                    pathOptions={{
                      color: STATUS_COLORS[item.status],
                      fillColor: STATUS_COLORS[item.status],
                      fillOpacity: 0.82,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="geo-popup">
                        <h4>{item.tema}</h4>
                        <p>ID: {item.id}</p>
                        <p>Alcaldia: {item.alc}</p>
                        <p>Estatus: {item.status}</p>
                        <p>{item.descripcion}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

              {layers.pasos &&
                SAFE_CROSSINGS.map((item) => (
                  <CircleMarker
                    key={`ps-${item.id}`}
                    center={[item.lat, item.lon]}
                    radius={5}
                    pathOptions={{
                      color: '#276749',
                      fillColor: '#48bb78',
                      fillOpacity: 0.75,
                      weight: 1.5,
                    }}
                  >
                    <Popup>
                      <div className="geo-popup">
                        <h4>Paso seguro</h4>
                        <p>{item.name}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

              {layers.centros &&
                C5_C2_LOCATIONS.map((item) => (
                  <CircleMarker
                    key={`c2-${item.id}`}
                    center={[item.lat, item.lon]}
                    radius={9}
                    pathOptions={{
                      color: '#92400e',
                      fillColor: '#f59e0b',
                      fillOpacity: 0.9,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="geo-popup">
                        <h4>{item.nombre}</h4>
                        <p>Alcaldia: {item.alcaldia}</p>
                        <p>Region: {item.region}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

            </MapContainer>

            <div className="geo-toolbar">
              <button
                type="button"
                className={mode === 'all' ? 'active' : ''}
                onClick={() => setMode('all')}
              >
                Todas las quejas
              </button>
              <button
                type="button"
                className={mode === 'ALUMBRADO' ? 'active' : ''}
                onClick={() => setMode('ALUMBRADO')}
              >
                Alumbrado
              </button>
              <button
                type="button"
                className={mode === 'MANTENIMIENTO VIA PUBLICA' ? 'active' : ''}
                onClick={() => setMode('MANTENIMIENTO VIA PUBLICA')}
              >
                Via publica
              </button>
              <button
                type="button"
                className={mode === 'SOLICITUD DE VIGILANCIA' ? 'active' : ''}
                onClick={() => setMode('SOLICITUD DE VIGILANCIA')}
              >
                Vigilancia
              </button>
              <button
                type="button"
                className={mode === 'FALTA DE AGUA' ? 'active' : ''}
                onClick={() => setMode('FALTA DE AGUA')}
              >
                Agua
              </button>
            </div>

            <div className="geo-legend">
              <h4>Quejas ciudadanas</h4>
              <div className="geo-legend-row">
                <span className="geo-dot" style={{ background: STATUS_COLORS.pendiente }} />
                <span>Pendiente</span>
              </div>
              <div className="geo-legend-row">
                <span className="geo-dot" style={{ background: STATUS_COLORS.cerrado }} />
                <span>Resuelto</span>
              </div>
              <div className="geo-legend-row">
                <span className="geo-dot" style={{ background: STATUS_COLORS.atendido }} />
                <span>Atendido</span>
              </div>
              <div className="geo-divider" />
              <h4>Capas adicionales</h4>
              <div className="geo-legend-row">
                <span className="geo-dot" style={{ background: '#3b82f6', opacity: 0.72 }} />
                <span>Postes C5 WiFi</span>
              </div>
              <div className="geo-legend-row">
                <span className="geo-dot" style={{ background: '#48bb78' }} />
                <span>Pasos seguros</span>
              </div>
              <div className="geo-legend-row">
                <span className="geo-dot" style={{ background: '#f59e0b' }} />
                <span>Centros C2 / C5</span>
              </div>
              <div className="geo-legend-row">
                <span
                  style={{
                    width: '24px',
                    height: '9px',
                    borderRadius: '2px',
                    background:
                      'linear-gradient(90deg, rgba(248, 225, 108, 0.1), rgba(138, 28, 45, 0.8))',
                    flexShrink: 0,
                  }}
                />
                <span>Delitos peaton</span>
              </div>
            </div>

            <div className="geo-credit">GeoJusticia CDMX · FGJ + SUAC/Locatel + C5 · 2024</div>

            <button
              type="button"
              className="map-report-cta"
              onClick={() => navigate('/delegados_geojusticia')}
            >
              Reportar queja ciudadana ahora
            </button>
          </section>
        </div>
      </section>
    </main>
  )
}

export default MapasPage
