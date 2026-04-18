# 🗺️ Klaud: Índice de Injusticia Espacial en la Ciudad de México

**Vectores de Dignidad: El derecho a la salud más allá de la puerta**

Un proyecto de análisis de datos geoespaciales que mapea la inseguridad en las rutas obligatorias hacia centros de salud pública en la Ciudad de México.

---

## 🎯 Propósito del Proyecto

En la CDMX, el acceso a servicios de salud pública no es simplemente una puerta a cruzar. Para el 80% de los usuarios del sistema público (IMSS-Bienestar/SEDESA), es un trayecto que debe recorrerse a pie desde estaciones de Metro, Metrobús o RTP.

**El problema:** Cuando el Estado asigna obligatoriamente una clínica por jurisdicción, impone también un trayecto. Si ese trayecto carece de luminarias, está en una zona de alta incidencia delictiva, o carece de vigilancia, el paciente debe pagar un "impuesto de riesgo" para acceder a su derecho constitucional.

**La solución:** Klaud integra datos de criminalidad, infraestructura y transporte público para crear un índice único de justicia espacial, permitiendo:

- 📊 **Priorización de infraestructura** basada en datos matemáticos, no en intuición política
- 🚌 **Rediseño de rutas de transporte** que conecten pacientes con hospitales de forma segura
- 🛡️ **Auditoría ciudadana** con herramientas de visualización accesibles
- 💡 **Optimización de vigilancia** del C5 en horarios de máxima vulnerabilidad

---

## 📁 Estructura del Proyecto

```
Klaud/
├── README.md                              # Este archivo
├── main.ipynb                             # Notebook principal con pitch y visión
├── notebook_limpieza_datos.ipynb          # Pipeline de limpieza: Bronze → Silver → Gold
│
├── Data Sources (CSV, XLSX, PDF)
│   ├── carpetas_investigacion_fgj_2024.csv          # Delitos reportados (FGJ)
│   ├── 07-2025-wifi_gratuito_en_postes-del-c5.xlsx # Infraestructura digital C5
│   ├── stops.txt                          # Paradas de transporte público (GTFS)
│   ├── diccionario_datos_centros_de_salud.csv      # Metadata de unidades médicas
│   ├── Directorio-Hospitales-y-Centros-Salud.pdf   # Directorio de salud
│   ├── pasos-seguros-cdmx.csv             # Rutas de seguridad vial
│   ├── ubicacion_c5_c2.csv                # Ubicación de cámaras del C5
│   ├── diccionario_colonias_iecm_2022.xlsx         # Codificación de colonias
│   ├── equivalencias_parada_id.csv        # Homologación de paradas
│   ├── MEX-INEGI.40.201.01-INV-2010.xml  # Datos geoespaciales INEGI
│   └── justicia_espacial_cdmx.html        # Visualización interactiva
│
├── Análisis y Visualizaciones
│   ├── main.html                          # Reporte principal interactivo
│   ├── notebook_limpieza_datos.html       # Reporte de ETL
│   ├── mapa_injusticia.html               # Mapa temático de inseguridad
│   └── justicia_espacial_cdmx.html        # Mapa de justicia espacial
│
└── .git/                                  # Control de versiones
```

---

## 🔄 Pipeline de Datos

El proyecto sigue un modelo de capas de madurez de datos:

### **Bronze Layer** (Datos Crudos)
- Descarga directa de [datos.cdmx.gob.mx](https://datos.cdmx.gob.mx)
- Archivos originales sin transformación
- Documentación de calidad inicial

### **Silver Layer** (Datos Limpios)
Transformaciones realizadas:

| Dataset | Registros | Acciones |
|---------|-----------|----------|
| **FGJ 2024** | 138,630 → 129,633 | Descartar 8,997 sin coords; normalizar 15+ variantes de alcaldía; clasificar delitos por relevancia (peatón/transporte) |
| **WiFi C5** | 13,714 | Normalizar alcaldías; decodificar ID de programa; validar bbox CDMX |
| **GTFS Stops** | 11,362 → 11,315 | Descartar 47 paradas fuera de bbox; inferir sistema de transporte desde zone_id; mapear accesibilidad |
| **RI-6 (Infraestructura)** | 1,814 colonias | Derivar índice normalizado de vulnerabilidad de alumbrado (0.0–1.0) |

**Formato:** Parquet con geometría en UTM 14N (EPSG:32614) para cálculos espaciales eficientes

### **Gold Layer** (Análisis Listos para Consumo)
- Tablas agregadas por alcaldía
- Índices derivados de justicia espacial
- Exportación a DuckDB para SQL analítico

---

## 📊 Descripción de Datos

### 🗑️ **Carpetas de Investigación FGJ (Criminalidad)**
- **Fuente:** [FGJ CDMX - Datos Abiertos](https://datos.cdmx.gob.mx/dataset/carpetas-de-investigacion-fgj-de-la-ciudad-de-mexico)
- **Cobertura:** 2024 completo (138,630 carpetas)
- **Relevancia:** Clasificadas en 3 categorías:
  - `peaton`: Robo a transeúnte, lesiones, violencia, homicidios
  - `transporte`: Delitos en Metro, Metrobús, Taxi, RTP
  - `otro`: Todos los demás
- **Limitaciones:** Cifra negra estimada ~85%; solo delitos reportados

### 🛰️ **WiFi Gratuito en Postes del C5 (Infraestructura Digital)**
- **Fuente:** [C5 CDMX - Datos Abiertos](https://datos.cdmx.gob.mx/dataset/wifi-gratuito-en-postes-del-c5)
- **Cobertura:** 13,714 postes activos distribuidos en 16 alcaldías
- **Proxy:** Inversión institucional en infraestructura urbana; correlaciona con zonas de vigilancia

### 🚌 **GTFS - Paradas de Transporte Público**
- **Fuente:** [GTFS CDMX - Datos Abiertos](https://datos.cdmx.gob.mx/dataset/gtfs)
- **Cobertura:** 11,315 paradas clasificadas por sistema:
  - Metro (5,401 paradas)
  - Metrobús (3,208 paradas)
  - RTP / Tren Ligero (2,121 paradas)
  - Otros (585 paradas)
- **Uso:** Base para cálculo de "última milla" desde parada a centro de salud

### 🏥 **Centros de Salud (SEDESA)**
- **Fuente:** [Directorio oficial de SEDESA](https://datos.cdmx.gob.mx/dataset/centros-de-salud)
- **Cobertura:** Hospitales, clínicas y centros de salud públicos
- **Problema a resolver:** Geocodificación y atribución de jurisdicción

### 💡 **Infraestructura Física por Colonia (RI-6 INEGI)**
- **Fuente:** [Registro de Infraestructura 2022](https://sieg.cdmx.gob.mx/)
- **Variables clave:**
  - `AlumP_sum`: Score de alumbrado público por colonia (0–985)
  - `r_AlumP_Mn`: Ranking de alumbrado (1=mejor, 5=peor)
  - `S_RI_6`: Score de rezago de infraestructura (19–43)
- **Derivadas:** `vulnerabilidad_luz`, `rezago_infra` (normalizadas 0.0–1.0)

---

## 📓 Notebooks Disponibles

### `main.ipynb`
**Contenido:**
- Pitch del proyecto y contexto político
- Motivación: "El impuesto de riesgo"
- Beneficios esperados
- Fuentes de datos abiertos referenciadas

**Ejecutar para:** Entender la visión general y justificación del proyecto

### `notebook_limpieza_datos.ipynb`
**Pipeline completo:**
1. Carga y auditoría de 4 datasets crudos
2. Limpieza específica por dataset (normalización, validación, decodificación)
3. Creación de variables derivadas
4. Exportación a parquet en Silver Layer
5. Unificación en DuckDB con vistas SQL

**Ejecutar para:** Reproducir el ETL desde cero o validar transformaciones

**Requisitos:**
```bash
pip install pandas geopandas duckdb shapely scikit-learn openpyxl pdfplumber
```

---

## 🗺️ Visualizaciones

El proyecto genera tres mapas interactivos (HTML con Leaflet):

### 1. `mapa_injusticia.html`
- **Capas:** Delitos por colonia, luminarias, cámaras C5
- **Interactivo:** Filtro por tipo de delito y período temporal
- **Uso:** Exploración de patrones de criminalidad

### 2. `justicia_espacial_cdmx.html`
- **Temático:** Índice normalizado de injusticia espacial (0.0–1.0)
- **Superposición:** Paradas de transporte + centros de salud + rutas
- **Uso:** Identificación de "puntos calientes" de vulnerabilidad

### 3. `main.html`
- **Resumen ejecutivo:** Gráficos de distribución por alcaldía
- **Estadísticas:** Cobertura de infraestructura por quintil de riesgo
- **Uso:** Dashboard para stakeholders

---

## 🔬 Metodología (En Desarrollo)

### Índice de Injusticia Espacial

**Fórmula propuesta:**

```
IJ_e(parada → hospital) = w₁ · φ(criminalidad en ruta)
                        + w₂ · φ(ausencia de luz)
                        + w₃ · φ(ausencia de vigilancia C5)
                        + w₄ · φ(tiempo de trayecto)
```

Donde:
- `φ()` = normalización 0.0–1.0
- `w_i` = pesos calibrados con encuestas de percepción ciudadana
- **Pendiente:** Definir pesos basados en consulta ciudadana

### Análisis de Última Milla

Para cada colonia:
1. Identificar centros de salud asignados por SEDESA
2. Calcular parada más cercana (GTFS)
3. Rutar caminata desde parada a hospital usando:
   - Malla vial OSM (OpenStreetMap)
   - Densidad de delitos por segmento
   - Densidad de luminarias (RI-6)
   - Presencia de cámaras C5
4. Generar "Senderos Seguros" alternativos

---

## 📈 Casos de Uso

### 👨‍⚖️ Para Autoridades
- **SEDESA:** Diseño de programas de "transporte seguro a consultas"
- **SEMOVI:** Justificación para nuevas paradas de Metrobús/RTP en "pasillos de salud"
- **SSC:** Priorización de vigilancia en horarios de máxima afluencia médica
- **ADIP:** Auditoría abierta de eficiencia del Estado en derechos sociales

### 👥 Para Ciudadanía
- **Comités vecinales:** Datos matemáticos para exigencia de infraestructura
- **Pacientes:** Información sobre rutas seguras a hospitales asignados
- **Académicos:** Base para investigación en justicia espacial y geografía política

### 📊 Para Analistas
- Base de datos limpia lista para modelado adicional
- Pipeline reproducible para sumar nuevas capas (alumbrado, CCTV, etc.)
- Formato abierto (parquet, SQL) para interoperabilidad

---

## 🚀 Próximos Pasos (Roadmap)

### Sprint 1: Limpieza Completada ✅
- [x] ETL de 4 datasets principales
- [x] Exportación a Silver + Gold layers
- [x] Normalización de alcaldías y geometría

### Sprint 2: Geocodificación de Unidades Médicas (En Progreso)
- [ ] Integración de DENUE (INEGI) para ubicación de hospitales
- [ ] Validación manual de direcciones conflictivas
- [ ] Asignación de colonia a cada unidad

### Sprint 3: Cálculo del Índice Primario (Pendiente)
- [ ] Join espacial: FGJ → polígonos de colonia RI-6
- [ ] Cálculo de densidad de delitos por colonia
- [ ] Normalización de indicadores (luz, vigilancia, crimen)
- [ ] Formulación del índice compuesto

### Sprint 4: Ruteado y Visualización (Pendiente)
- [ ] Integración con OpenStreetMap para malla vial
- [ ] Algoritmo de ruta "más segura" (no solo más rápida)
- [ ] Generación de mapas temáticos interactivos
- [ ] Dashboard ejecutivo

### Sprint 5: Validación Ciudadana (Pendiente)
- [ ] Encuestas de percepción de seguridad en paradas
- [ ] Grupos focales con usuarios del sistema público
- [ ] Calibración de pesos del índice con datos cualitativos

---

## 📚 Fuentes de Datos Abiertos

Todos los datos se obtienen de fuentes públicas oficiales:

- 🔗 [Portal de Datos Abiertos CDMX](https://datos.cdmx.gob.mx/)
- 🔗 [INEGI - Sistema de Información Estadística y Geográfica](https://www.inegi.org.mx/)
- 🔗 [SIEG - Sistema de Información Espacial del Gobierno CDMX](https://sieg.cdmx.gob.mx/)
- 🔗 [Google Transit (GTFS)](https://developers.google.com/transit/gtfs)
- 🔗 [OpenStreetMap](https://www.openstreetmap.org/)

---

## 💻 Stack Técnico

| Componente | Tecnología |
|-----------|-----------|
| **Análisis de datos** | Pandas, GeoPandas, NumPy |
| **Base de datos** | DuckDB (análisis), Parquet (almacenamiento) |
| **Geoespacial** | Shapely, Spatialite, UTM 14N (EPSG:32614) |
| **Visualización** | Folium, Leaflet.js, Plotly |
| **Cálculo científico** | SciPy, Scikit-learn (KDTree, clustering) |
| **Control de versiones** | Git |
| **Notebooks** | Jupyter / JupyterLab |

---

## 📄 Licencia y Atribución

**Datos:** Licencia abierta oficial de la CDMX (CC BY 4.0)  
**Código:** Disponible bajo licencia TBD  
**Proyecto:** Iniciativa independiente de análisis público

---

## 🤝 Contribuciones

Este proyecto está en construcción activa. Interesados en colaborar pueden:

1. Reportar errores en geometría o inconsistencias de datos
2. Sugerir mejoras en metodología del índice
3. Contribuir código para nuevas capas de análisis
4. Participar en consultas ciudadanas de validación

---

## ❓ Preguntas Frecuentes

### ¿Por qué "Vectors of Dignity"?
Porque los vectores son direcciones. Este proyecto vectoriza literalmente el derecho a la salud. Un "vector de dignidad" es la ruta donde el Estado protege, no castiga.

### ¿Por qué UTM 14N y no lat/lon?
Los cálculos espaciales (distancias, buffers, clustering) son matemáticamente exactos en proyección métrica, no en grados decimales. UTM 14N cubre exactamente la CDMX.

### ¿Qué significa "cifra negra 85%"?
Según INEGI ENSU, solo el ~15% de los delitos son reportados a autoridades. El dataset de FGJ registra esos 15%. Esta limitación se documenta para toda interpretación.

### ¿Por qué no incluyen encuestas de percepción ahora?
La fase actual prioriza datos objetivos reproductibles. La fase siguiente incorporará encuestas para calibrar pesos del índice.

---

## 📞 Contacto

**Proyecto:** Klaud (Justicia Espacial CDMX)  
**Repositorio:** `c:\Users\Teddy\Documents\Claude\Klaud`  
**Estado:** Alpha (limpieza de datos → análisis exploratorio)

---

**Última actualización:** Abril 2026  
**Versión de datos:** 2024 (FGJ, GTFS) / 2022 (RI-6, Colonias)
