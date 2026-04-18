# GeoJusticia CDMX

GeoJusticia es una plataforma ciudadana para identificar, priorizar y reportar problemas urbanos en la Ciudad de Mexico mediante contexto territorial.

## Idea del proyecto

En CDMX, muchas quejas urbanas no se atienden a tiempo por duplicidad, desorden y falta de priorizacion geografica. GeoJusticia transforma esos reportes en informacion accionable para ciudadania y alcaldias.

Objetivo principal:

- Facilitar denuncias ciudadanas claras y con seguimiento.
- Visualizar concentraciones de incidencias por zona.
- Apoyar la priorizacion territorial por tema y estatus.

Propuesta de valor:

- No es un buzon aislado de quejas.
- Es una herramienta de gestion urbana basada en datos.

## Arquitectura de carpetas

```text
.
├── README.md
├── package.json
├── package-lock.json
├── front/
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── ...
├── back/
│   ├── README.md
│   ├── src/
│   └── tests/
└── extra/
    ├── README.md
    ├── data/
    ├── documents/
    ├── notebooks/
    └── web/
```

Descripcion de carpetas:

- front: aplicacion principal (React + Vite).
- back: base para servicios y pruebas backend.
- extra: datasets, notebooks y recursos de referencia.

## Funcionalidad actual

Rutas principales:

- /: inicio con buscador de direcciones y sugerencias.
- /mapas: visor geoespacial con capas, filtros y metricas.
- /delegados_geojusticia: portal de denuncias.
- /denuncias: alias del portal de denuncias.

Flujo de uso:

1. El usuario busca una direccion.
2. El mapa se centra en la zona consultada.
3. El usuario revisa capas y contexto territorial.
4. El usuario registra una denuncia.
5. El sistema genera folio y guarda historial local.

Portal de denuncias:

- Seleccion de alcaldia con autocompletado.
- Seleccion de categoria y nivel de urgencia.
- Captura de datos de contacto y descripcion.
- Generacion de folio de reporte.
- Persistencia local en localStorage.

## Datos utilizados

### Datos usados directamente por la app actual

- Nominatim (OpenStreetMap): geocodificacion y sugerencias de direcciones.
- Datos operativos del mapa en front/src/data/geojusticiaMock.js:
  - COMPLAINTS
  - HEAT_POINTS
  - WIFI_POINTS
- Datos reales incorporados en frontend:
  - pasos-seguros-cdmx.csv (base de SAFE_CROSSINGS)
  - ubicacion_c5_c2.csv (base de C5_C2_LOCATIONS)

### Detalle por fuente y como se usa

| Fuente / archivo | Registros | Como se usa en la app |
| --- | ---: | --- |
| front/src/data/geojusticiaMock.js -> COMPLAINTS | 560 | Base de KPIs, filtros, ranking por tema, ranking por alcaldia y tendencia semanal. |
| front/src/data/geojusticiaMock.js -> HEAT_POINTS | 320 | Capa de calor para visualizar concentracion espacial de incidencias. |
| front/src/data/geojusticiaMock.js -> WIFI_POINTS | 260 | Capa de infraestructura digital como contexto territorial adicional. |
| extra/data/pasos-seguros-cdmx.csv -> SAFE_CROSSINGS | 109 | Capa de cruces seguros para referencia de movilidad y seguridad vial. |
| extra/data/ubicacion_c5_c2.csv -> C5_C2_LOCATIONS | 6 | Capa de centros C2/C5 para contexto de cobertura de monitoreo urbano. |
| API Nominatim (OpenStreetMap) | variable (hasta 6 sugerencias por consulta en inicio y 1 resultado en mapa) | Busqueda de direcciones, geocodificacion y centrado de mapa por ubicacion consultada. |

### Resumen general de volumen de datos (MapasPage)

- COMPLAINTS: 560 registros de incidencias georreferenciadas.
- HEAT_POINTS: 320 puntos para capa de calor.
- WIFI_POINTS: 260 puntos de infraestructura digital.
- SAFE_CROSSINGS: 109 cruces seguros (desde pasos-seguros-cdmx.csv).
- C5_C2_LOCATIONS: 6 centros (5 C2 + 1 C5, desde ubicacion_c5_c2.csv).
- Cobertura analitica base:
  - 16 alcaldias
  - 7 temas de incidencia
  - 8 semanas para tendencia temporal

### Insights operativos visibles en la vista de mapas

Distribucion por estatus (sobre 560 incidencias):

- Pendiente: 268 (47.9%)
- Cerrado: 189 (33.8%)
- Atendido: 103 (18.4%)
- Carga activa (pendiente + atendido): 371 (66.3%)
- Tasa de resolucion visible en KPI (cerrado / total): 33.8%

Top 3 temas con mayor frecuencia:

- ALUMBRADO: 121 (21.6%)
- MANTENIMIENTO VIA PUBLICA: 109 (19.5%)
- DESAZOLVE: 72 (12.9%)
- Concentracion de los 3 temas principales: 302 incidencias (53.9% del total)

Top 3 alcaldias con mayor numero de incidencias en el dataset base:

- Milpa Alta: 46
- Gustavo A. Madero: 42
- Azcapotzalco: 41

Como usa estos datos MapasPage:

- KPI principal: total, pendientes, atendidos, cerrados y tasa de resolucion.
- Ranking por tema: top de incidencias por categoria.
- Ranking por alcaldia: concentracion territorial de reportes.
- Tendencia semanal: serie de 8 semanas para el tema dominante filtrado.
- Capas del mapa: puntos de quejas, calor, wifi, cruces seguros y centros C2/C5.

### Datos disponibles como referencia (no usados en runtime del frontend)

- 07-2025-wifi_gratuito_en_postes-del-c5.xlsx
- diccionario_coloniasiecm_2022.xlsx
- diccionario_datos_ri_6.csv
- equivalencias_parada_id.csv
- MEX-INEGI.40.201.01-INV-2010.xml
- archivos en extra/documents
- archivos en extra/web
- archivos en extra/notebooks

Nota:

- En esta version final del frontend no se usa pipeline de salud para render o logica funcional.

## Stack tecnologico

- React 19
- Vite
- React Router
- Leaflet
- React Leaflet
- leaflet.heat
- CSS por pagina/modulo

## Ejecucion local

Frontend:

```bash
cd front
npm install
npm run dev
```

Comandos utiles:

```bash
npm run build
npm run lint
```

## Estado del proyecto

Version final presentable (MVP funcional).

Incluye:

- Navegacion completa de Inicio a Mapas y Denuncias.
- Visualizacion territorial para apoyo de priorizacion urbana.
- Registro de denuncias con folio e historial local.

## Contexto del evento

Este proyecto fue desarrollado para el evento **Mexico City | Claude Impact Lab**.

- Referencia oficial del evento: [Luma - Mexico City Claude Impact Lab](https://luma.com/claudemexicocitylab?tk=oELi62)
- Video DEMO del proyecto: [GeoJusticia DEMO](https://youtu.be/8pO6592fX8I)
- Enfoque elegido por el equipo: **Scorecard de Servicios**
- Objetivo dentro del track: evaluar y visualizar la capacidad de respuesta de servicios urbanos a partir de reportes ciudadanos y analitica territorial.

## Nombre oficial

Nombre oficial del proyecto: GeoJusticia.
