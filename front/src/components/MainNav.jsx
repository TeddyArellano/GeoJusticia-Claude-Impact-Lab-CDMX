import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/mapas', label: 'Mapas' },
  { to: '/delegados_geojusticia', label: 'Denuncias' },
]

function MainNav() {
  return (
    <header className="main-nav">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-ring">G</span>
          <span className="brand-pin">*</span>
        </div>
        <div className="brand-text">
          <strong>GeoJusticia</strong>
          <small>CDMX</small>
        </div>
      </div>

      <nav className="primary-nav" aria-label="Navegacion principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'primary-link active' : 'primary-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default MainNav
