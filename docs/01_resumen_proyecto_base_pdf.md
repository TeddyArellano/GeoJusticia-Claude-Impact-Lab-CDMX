# Analisis del proyecto base (PDF Proyecto Datos)

## Fuente analizada
- Archivo: Proyecto Datos.pdf
- Extension del documento: 37 paginas.
- Tema central original: Salud y Transporte CDMX con base de datos federada para analisis territorial.

## Hallazgos clave del PDF

### 1) Enfoque conceptual
El documento base trabaja la relacion entre:
- accesibilidad geoespacial a salud,
- movilidad por transporte publico,
- y equidad territorial.

La idea central es que la conectividad urbana condiciona acceso real a servicios medicos.

### 2) Arquitectura de datos propuesta en el PDF
Modelo federado de 3 fuentes:
- Texto (.json): catalogo SCIAN para actividades de salud.
- Tabular (.csv): establecimientos de salud (DENUE).
- Grafo (.pkl): red de transporte (GTFS + nodos de salud) modelada con NetworkX.

Punto fuerte reutilizable para el hackathon:
- conservar independencia de fuentes y unir por capa logica.

### 3) Proceso tecnico del proyecto base
- Integracion virtual de fuentes heterogeneas.
- Perfilado de datos por tipo de fuente.
- Limpieza (normalizacion de texto, duplicados geoespaciales por umbral de 50 m).
- Analisis descriptivo y predictivo.
- Capa de preguntas en lenguaje natural asistida por LLM.

### 4) Tipos de preguntas trabajadas
- Descriptivas: cobertura de especialidades por alcaldia y cercania a paradas.
- Predictivas: zonas para abrir clinicas/hospitales, servicios faltantes, simulaciones de cierre de oferta.

### 5) Herramientas mencionadas
- Python, pandas, matplotlib.
- NetworkX para grafo de transporte.
- Folium + OpenStreetMap para visualizacion.

## Que conviene heredar para el nuevo proyecto
- Estructura de arquitectura federada.
- Logica de relacion espacial entre nodos de transporte y servicios de salud.
- Flujo de preguntas descriptivas/predictivas para interfaz tipo agente.

## Que debe cambiar para el track de seguridad
- Incluir explicitamente capa de riesgo delictivo (FGJ) en el modelo.
- Cambiar objetivo de solo accesibilidad a optimizacion multiobjetivo: tiempo + seguridad + cobertura medica.
- Priorizar delitos asociados al traslado en via publica y transporte.

## Conclusiones de uso como base
El PDF es una base metodologica robusta para este hackathon. El nuevo valor diferencial sera agregar seguridad urbana como variable principal de decision de ruta medica.
