# Arquitectura inicial (sin codigo)

## Capas del sistema

## 1) Capa de datos
Fuentes previstas:
- Seguridad FGJ (CSV): eventos delictivos georreferenciados.
- Transporte GTFS (CSV): rutas, paradas, secuencias y horarios.
- Servicios medicos (DENUE/otros): establecimientos con coordenadas y tipo.
- OpenStreetMap: mapa base y contexto territorial.

## 2) Capa de preparacion
- Limpieza y estandarizacion de columnas clave.
- Normalizacion de alcaldias/colonias/categorias.
- Geovalidacion de coordenadas.
- Construccion de features temporales y espaciales para riesgo.

## 3) Capa analitica
- Riesgo: clustering (K-Means) + scoring por nodo/tramo.
- Movilidad: grafo de transporte (GTFS) y calculo de rutas.
- Fusion: enriquecimiento de rutas con score de riesgo por horario.

## 4) Capa de producto
- Consulta de rutas por lenguaje natural o formulario guiado.
- Vista mapa con OSM + trazos + niveles de riesgo.
- Explicabilidad minima: por que se recomienda una ruta sobre otra.

## Propuesta de nombres de bases de datos (logica)
- db_seguridad_fgj
- db_movilidad_gtfs
- db_salud_servicios
- db_feature_store_riesgo (derivada)

Nota: pueden ser esquemas o colecciones separadas segun stack final.

## Modelo de entidades base (conceptual)
- IncidenteSeguridad: id, fecha_hora, delito, categoria, alcaldia, lat, lon.
- NodoTransporte: stop_id, nombre, lat, lon, modo.
- AristaTransporte: source, target, route_id, travel_time_est.
- ServicioMedico: id, nombre, tipo, alcaldia, lat, lon.
- RutaEvaluada: nodos, tiempo, riesgo, score_total.

## Despliegue propuesto en Vercel
Uso recomendado:
- Frontend web y capa ligera de API (si aplica) en Vercel.
- Procesamiento pesado de datos y pipelines fuera de Vercel (previo o backend dedicado).

Razon:
- Vercel es ideal para UI y experiencia de consulta rapida.
- No es ideal para pipelines ETL masivos de CSV de millones de filas en tiempo de solicitud.

## Resultado esperado para demo de hackathon
- App web desplegada en Vercel con flujo completo de consulta.
- Mapa OSM interactivo.
- Comparacion de al menos 2 rutas por caso (mas corta vs mas segura).
- Explicacion textual corta del riesgo por ruta.
