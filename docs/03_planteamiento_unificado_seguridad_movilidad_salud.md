# Planteamiento inicial unificado

## Nombre de trabajo del MVP
Ruta Segura a Salud CDMX

## Objetivo del MVP
Dado un origen, un destino medico (o tipo de servicio) y una preferencia de transporte, recomendar rutas que balanceen:
- tiempo/distancia,
- riesgo delictivo esperado por zona-horario,
- accesibilidad real a servicios medicos.

## Entradas esperadas del usuario
- Punto de partida (direccion o coordenada).
- Punto de llegada (hospital/clinica o especialidad medica).
- Horario estimado de traslado.
- Preferencia modal: metro, trolebus, metrobus, RTP, etc.
- Criterio de optimizacion: mas corta / mas segura / balanceada.

## Salidas esperadas
- Ruta recomendada principal.
- 1 o 2 rutas alternativas.
- Indicadores por ruta:
  - tiempo estimado,
  - distancia,
  - riesgo relativo (bajo/medio/alto o score 0-100),
  - tramos sensibles y recomendacion breve.

## Integracion de los dos proyectos

### Lo que aporta el proyecto base (PDF)
- Arquitectura federada.
- Integracion GTFS + salud + consultas semanticas.
- Analisis geoespacial en grafo.

### Lo que aporta este track de seguridad
- Capa de riesgo delictivo FGJ por coordenada y horario.
- Priorizacion de delitos vinculados al traslado (transeunte, pasajero, vehiculo, violencia).
- Logica de decision de rutas por seguridad y no solo por distancia.

## Hipotesis operativa
Una ruta con ligeramente mayor tiempo puede reducir exposicion a zonas de mayor incidencia delictiva en el horario objetivo, mejorando seguridad percibida y real del usuario.

## K-Means en el planteamiento (seguridad)
Uso propuesto:
- Clustering territorial-temporal de incidentes para detectar zonas de riesgo similares.

Variables candidatas para clustering:
- latitud, longitud,
- franja horaria,
- categoria_delito (codificada),
- densidad de incidentes reciente,
- opcional: estacionalidad (mes/dia).

Salida de K-Means para el producto:
- etiqueta de cluster de riesgo para cada zona/nodo de transporte,
- severidad relativa por cluster para alimentar score de ruta.

## Funcion de decision (alto nivel)
Se propone un score multicriterio por ruta:
- Score_ruta = w1 * tiempo_norm + w2 * riesgo_norm + w3 * transbordos_norm

Donde:
- riesgo_norm se calcula agregando riesgo de nodos/tramos por horario,
- pesos w1, w2, w3 se ajustan al modo elegido por usuario.

## Dependencias de datos para completar MVP
- FGJ: ya disponible en este repo.
- GTFS CDMX: pendiente de incorporar al repo.
- Catalogo y puntos de servicios medicos (DENUE u otro): pendiente de incorporar al repo.
- Base cartografica OSM: consumo en visualizacion y/o ruteo.
