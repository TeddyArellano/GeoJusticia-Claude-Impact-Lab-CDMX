# Contexto del proyecto y objetivo inicial

## Evento y marco
- Evento: Claude Impact Lab - Ciudad de Mexico.
- Formato: laboratorio colaborativo de un dia con datos abiertos reales de CDMX.
- Portal de datos: datos.cdmx.gob.mx.
- Track elegido por el equipo: Seguridad por colonia, extendido con movilidad y acceso a servicios medicos.

## Vision del equipo (fusion de ideas)
Construir una app/agente que recomiende rutas de transporte hacia servicios medicos, pero incorporando riesgo delictivo por zona y horario para que la persona pueda elegir entre:
- ruta mas corta,
- ruta mas segura,
- o ruta balanceada (tiempo + seguridad).

## Problema a resolver
En CDMX, muchas decisiones de movilidad medica se hacen sin una capa de riesgo territorial. Aunque una ruta sea rapida, puede cruzar zonas con mayor incidencia delictiva en ciertos horarios.

## Usuario objetivo (MVP)
- Ciudadania que necesita trasladarse a un servicio medico usando transporte publico.
- Casos urgentes no vitales (consulta, estudios, seguimiento).
- Usuarios con restricciones de presupuesto, horario o preferencia modal (metro, trolebus, etc.).

## Propuesta de valor inicial
- Unificar datos de seguridad FGJ + red de transporte (GTFS) + mapas OSM + puntos de atencion medica.
- Dar rutas accionables con explicacion simple del nivel de riesgo.
- Reducir incertidumbre para traslados medicos en zonas de alta complejidad urbana.

## Alcance de esta fase documental
Este repositorio ahora contiene documentacion de arranque (sin codigo) para:
- sintetizar el proyecto base del PDF,
- perfilar estructura y calidad de los CSV de seguridad disponibles,
- definir planteamiento tecnico inicial para el hackathon.
