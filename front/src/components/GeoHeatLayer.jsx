import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

function GeoHeatLayer({ points, visible }) {
  const map = useMap()

  useEffect(() => {
    if (!visible || points.length === 0) {
      return undefined
    }

    const heatLayer = L.heatLayer(points, {
      radius: 16,
      blur: 14,
      maxZoom: 15,
      minOpacity: 0.28,
      gradient: {
        0.2: '#f8e16c',
        0.45: '#f08a4b',
        0.75: '#d64550',
        1: '#8a1c2d',
      },
    }).addTo(map)

    return () => {
      map.removeLayer(heatLayer)
    }
  }, [map, points, visible])

  return null
}

export default GeoHeatLayer
