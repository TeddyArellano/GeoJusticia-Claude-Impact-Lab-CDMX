# Roadmap hackathon (1 dia) y pendientes criticos

## Plan de ejecucion sugerido (dia del evento)

### Bloque 1 - Definicion final de alcance (60-90 min)
- Congelar objetivo del MVP: ruta medica mas segura vs mas corta.
- Definir 2 o 3 escenarios de demo (por ejemplo Iztapalapa -> hospital de referencia).
- Cerrar criterios de score de riesgo (version simple para demo).

### Bloque 2 - Integracion minima de datos (2-3 h)
- Cargar FGJ limpio (subset reciente + columnas clave).
- Integrar GTFS esencial (stops, routes, trips/stop_times o equivalente minimo).
- Integrar puntos medicos (DENUE u otra fuente validada).

### Bloque 3 - Modelo y logica de ruta (2-3 h)
- Generar clusters K-Means de riesgo por zona-horario.
- Enriquecer nodos/tramos con score de riesgo.
- Generar recomendacion de rutas con 3 modos: corta, segura, balanceada.

### Bloque 4 - Producto y narrativa (2-3 h)
- UI en Vercel con mapa OSM.
- Mostrar comparativa de rutas y explicacion.
- Preparar pitch de impacto social y limites del modelo.

## Pendientes de datos (hoy)
1. Incorporar GTFS al repositorio de trabajo.
2. Incorporar dataset de servicios medicos para destino.
3. Definir si la unidad de riesgo sera por punto, celda o tramo de ruta.
4. Definir ventana temporal de entrenamiento (historico completo vs reciente).

## Riesgos tecnicos
- Volumen alto de CSV FGJ para tiempo limitado del hackathon.
- Cobertura incompleta por nulos geograficos (~5%).
- Diferencias de nomenclatura en categorias y alcaldias.
- Riesgo de sobre-ingenieria: construir demasiado y no llegar a demo funcional.

## Mitigaciones
- Trabajar con version recortada para demo (por fecha y columnas).
- Estandarizar catalogos al inicio.
- Priorizar funcionalidades visibles para usuario final.
- Mantener una metrica de exito simple y demostrable.

## Metrica minima de exito para demo
- El sistema retorna al menos 2 rutas para un caso real.
- Cada ruta incluye tiempo y riesgo relativo.
- El usuario puede cambiar prioridad (seguridad/tiempo) y observar diferencia de recomendacion.

## Decisiones de producto por confirmar con el equipo
- Destino medico: seleccionado por nombre, categoria o ambos.
- Riesgo: escala textual (bajo/medio/alto) o numerica (0-100).
- Preferencia modal: una modalidad fija o multimodal.
- Nivel de explicacion: breve para ciudadano o tecnico para jurado.
