# Estructura y calidad de datos CSV (FGJ CDMX)

## Archivos analizados
- carpetasFGJ_acumulado_2025_01.csv
- victimasFGJ_acumulado_2024_09.csv

## 1) Perfil estructural

### carpetasFGJ_acumulado_2025_01.csv
- Filas: 2,098,743
- Columnas: 21
- Columnas principales:
  anio_inicio, mes_inicio, fecha_inicio, hora_inicio,
  anio_hecho, mes_hecho, fecha_hecho, hora_hecho,
  delito, categoria_delito, competencia,
  fiscalia, agencia, unidad_investigacion,
  colonia_hecho, colonia_catalogo,
  alcaldia_hecho, alcaldia_catalogo,
  municipio_hecho, latitud, longitud.

### victimasFGJ_acumulado_2024_09.csv
- Filas: 1,415,763
- Columnas: 22
- Diferencia clave frente a carpetas: agrega atributos de victima (sexo, edad, tipo_persona, calidad_juridica).

## 2) Cobertura temporal y espacial

### carpetas
- Rango fecha_hecho (detectado): 1906-06-02 a 2025-01-31 22:20:00.
- Latitud: 19.09535 a 19.58333.
- Longitud: -100.232489101509 a -98.94686.

### victimas
- Rango fecha_hecho (detectado): 1917-09-01 a 2024-09-30.
- Latitud: 19.1263606169432 a 19.5833332975088.
- Longitud: -99.4231796300006 a -98.946349780798.

## 3) Calidad de datos (hallazgos)

### carpetas
- Nulos en latitud/longitud: 101,207 (4.82%).
- Nulos en colonia_hecho: 102,124 (4.87%).
- competencia vacia: 1,064,018 (50.70%).
- Fechas problematicas:
  - fecha_hecho invalida o vacia: 560.
  - fecha_inicio invalida o vacia: 57,406.
- Registros fuera de bounding box amplio CDMX: 1.
- Valor atipico de alcaldia observado: nan (24,896).

### victimas
- Nulos en latitud/longitud: 74,769 (5.28%).
- Nulos en colonia_hecho: 74,967 (5.30%).
- Nulos en sexo: 247,704 (17.50%).
- Nulos en edad: 484,710 (34.24%).
- Fechas invalidas detectadas por parser: 0 (solo algunos NA puntuales en profiling basico).
- Categoria de alcaldia indeterminada presente: CDMX (indeterminada) con 17,509 registros.

## 4) Distribucion relevante para seguridad de rutas

### Alcaldias con mayor volumen total (carpetas)
1. CUAUHTEMOC: 318,787
2. IZTAPALAPA: 304,367
3. GUSTAVO A. MADERO: 209,034
4. BENITO JUAREZ: 164,576
5. COYOACAN: 142,074

### Delitos/categorias de alto interes para movilidad
- Robo a transeunte (patron delito): 150,286
- Robo de vehiculo (patron delito): 84,155
- Robo a pasajero (patron delito): 62,156
- Homicidio (patron delito): 17,501

### Horas con mayor volumen absoluto (carpetas)
- 12:00 (266,208)
- 10:00 (144,778)
- 11:00 (113,992)
- 14:00 (109,197)
- 15:00 (108,461)

Nota: estos picos deben interpretarse con cuidado por posibles sesgos de registro (hora de denuncia vs hora exacta del hecho en algunos casos).

## 5) Recomendacion de uso para el MVP
- Usar carpetasFGJ como base principal de riesgo territorial (evento delictivo georreferenciado).
- Usar victimasFGJ como capa complementaria para analitica social (edad/sexo/tipo de persona), no como unica fuente de riesgo.
- Aplicar normalizacion de categorias (por ejemplo HECHO NO DELICTIVO vs HECHOS NO DELICTIVOS) antes de modelado.
