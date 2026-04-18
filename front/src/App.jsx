import { Navigate, Route, Routes } from 'react-router-dom'
import MainNav from './components/MainNav'
import DenunciasPage from './pages/DenunciasPage'
import HomePage from './pages/HomePage'
import MapasPage from './pages/MapasPage'

function App() {
  return (
    <div className="app-shell">
      <MainNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mapas" element={<MapasPage />} />
        <Route path="/delegados_geojusticia" element={<DenunciasPage />} />
        <Route path="/denuncias" element={<DenunciasPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
