export const DEFAULT_CENTER = [19.4326, -99.1332]

export const ALCALDIAS = [
  'Iztapalapa',
  'Gustavo A. Madero',
  'Cuauhtemoc',
  'Benito Juarez',
  'Miguel Hidalgo',
  'Coyoacan',
  'Tlalpan',
  'Azcapotzalco',
  'Alvaro Obregon',
  'Iztacalco',
  'Venustiano Carranza',
  'Xochimilco',
  'Tlahuac',
  'Magdalena Contreras',
  'Cuajimalpa de Morelos',
  'Milpa Alta',
]

export const TEMAS = [
  'ALUMBRADO',
  'MANTENIMIENTO VIA PUBLICA',
  'SOLICITUD DE VIGILANCIA',
  'FALTA DE AGUA',
  'BACHEO',
  'SEMAFOROS',
  'DESAZOLVE',
]

export const STATUS_COLORS = {
  pendiente: '#c0392b',
  cerrado: '#276749',
  atendido: '#0e7490',
}

const STATUS_POOL = [
  'pendiente',
  'pendiente',
  'pendiente',
  'cerrado',
  'cerrado',
  'atendido',
]

const TEMA_POOL = [
  'ALUMBRADO',
  'ALUMBRADO',
  'MANTENIMIENTO VIA PUBLICA',
  'MANTENIMIENTO VIA PUBLICA',
  'SOLICITUD DE VIGILANCIA',
  'FALTA DE AGUA',
  'BACHEO',
  'SEMAFOROS',
  'DESAZOLVE',
]

function seeded(index) {
  const raw = Math.sin(index * 997.13) * 10000
  return raw - Math.floor(raw)
}

function pointAroundCDMX(index, latSpread = 0.36, lonSpread = 0.46) {
  const latOffset = (seeded(index + 17) - 0.5) * latSpread
  const lonOffset = (seeded(index + 89) - 0.5) * lonSpread

  return [DEFAULT_CENTER[0] + latOffset, DEFAULT_CENTER[1] + lonOffset]
}

export const COMPLAINTS = Array.from({ length: 560 }, (_, index) => {
  const [lat, lon] = pointAroundCDMX(index)
  const tema = TEMA_POOL[Math.floor(seeded(index + 31) * TEMA_POOL.length)]
  const alc = ALCALDIAS[Math.floor(seeded(index + 53) * ALCALDIAS.length)]
  const status = STATUS_POOL[Math.floor(seeded(index + 71) * STATUS_POOL.length)]

  return {
    id: `Q-${String(index + 1).padStart(4, '0')}`,
    lat,
    lon,
    tema,
    alc,
    status,
    week: (index % 8) + 1,
    descripcion: `${tema} reportado en ${alc}`,
  }
})

export const WIFI_POINTS = Array.from({ length: 260 }, (_, index) => {
  const [lat, lon] = pointAroundCDMX(index + 900, 0.34, 0.44)
  return {
    id: `W-${index + 1}`,
    lat,
    lon,
    alc: ALCALDIAS[Math.floor(seeded(index + 303) * ALCALDIAS.length)],
  }
})

export const HEAT_POINTS = Array.from({ length: 320 }, (_, index) => {
  const source = COMPLAINTS[index]
  const lat = source.lat + (seeded(index + 401) - 0.5) * 0.02
  const lon = source.lon + (seeded(index + 611) - 0.5) * 0.02
  const intensity = 0.32 + seeded(index + 733) * 0.68

  return [lat, lon, intensity]
})

// Datos reales: pasos-seguros-cdmx.csv (109 cruces viales seguros)
export const SAFE_CROSSINGS = [
  { id: 0, name: 'Eje 2 Ote y Eje 2 Nte', lat: 19.450028, lon: -99.115806 },
  { id: 1, name: 'Eje 6 sur', lat: 19.3645188619, lon: -99.0676213772 },
  { id: 2, name: 'Guelatao', lat: 19.3614300232, lon: -99.0403980681 },
  { id: 3, name: 'Vicente Guerrero', lat: 19.3589496962, lon: -99.0273139507 },
  { id: 4, name: 'Fray Servando y Circunvalacion', lat: 19.422974, lon: -99.126068 },
  { id: 5, name: 'Fray Servando y Circunvalacion', lat: 19.4256312022, lon: -99.1511646897 },
  { id: 6, name: 'Fray Servando y Circunvalacion', lat: 19.4241468404, lon: -99.1375471815 },
  { id: 7, name: 'Fray Servando y Circunvalacion', lat: 19.4232595289, lon: -99.1291706483 },
  { id: 8, name: 'Las bombas', lat: 19.3065766353, lon: -99.1003217112 },
  { id: 9, name: 'Marina Nacional y Lago Bolsena', lat: 19.445171, lon: -99.179936 },
  { id: 10, name: 'Eje 2 Ote y Eje 8 Sur', lat: 19.357545, lon: -99.122022 },
  { id: 11, name: 'Eje 8 Sur y Los Reyes', lat: 19.356144, lon: -99.100532 },
  { id: 12, name: 'Eje 8 Sur y Puente Titla', lat: 19.356547, lon: -99.098374 },
  { id: 13, name: 'Lago Trasimeno', lat: 19.4474120932, lon: -99.1824488364 },
  { id: 14, name: 'Nezahualcoyotl', lat: 19.4249721654, lon: -99.1332230902 },
  { id: 15, name: 'Tezontle', lat: 19.3877213995, lon: -99.1083961074 },
  { id: 16, name: 'Via Lactea y Ermita Iztapalapa', lat: 19.358442, lon: -99.130107 },
  { id: 17, name: 'Eje 8 Sur y Av. Palmitas', lat: 19.344827, lon: -99.02532 },
  { id: 18, name: 'Eje 8 Sur y Av. de las Minas', lat: 19.345423, lon: -99.020904 },
  { id: 19, name: 'Las bombas', lat: 19.3117361873, lon: -99.1149453898 },
  { id: 20, name: 'Tezontle', lat: 19.3869741019, lon: -99.1054828075 },
  { id: 21, name: 'Tezontle', lat: 19.3864952303, lon: -99.103681584 },
  { id: 22, name: 'Eje 1 y J. M. Agreda y Sanchez', lat: 19.415538, lon: -99.128 },
  { id: 23, name: 'Eje 2 Ote y Aluminio', lat: 19.451386, lon: -99.115472 },
  { id: 24, name: 'Eje 6 sur', lat: 19.3689760654, lon: -99.1011393189 },
  { id: 25, name: 'Eje 6 sur', lat: 19.3669218911, lon: -99.0919721296 },
  { id: 26, name: 'Carlos L Gracida', lat: 19.3622359698, lon: -99.0489852305 },
  { id: 27, name: 'Eje 8 Sur y Gral. Anaya', lat: 19.355819, lon: -99.102273 },
  { id: 28, name: 'San Antonio Abad y Tlaxcoaque', lat: 19.422613, lon: -99.133527 },
  { id: 29, name: 'Eje 2 Ote y Viaducto', lat: 19.405021, lon: -99.122279 },
  { id: 30, name: 'Eje 6 sur', lat: 19.3668517549, lon: -99.0891100587 },
  { id: 31, name: 'Eje 6 sur', lat: 19.3657311972, lon: -99.0702101165 },
  { id: 32, name: 'Eje 8 Sur y Eje 6 Sur', lat: 19.352375, lon: -99.015294 },
  { id: 33, name: 'Las bombas', lat: 19.3093511142, lon: -99.1059071772 },
  { id: 34, name: 'Mariano Escobedo y Mexico Tacuba', lat: 19.456411, lon: -99.180365 },
  { id: 35, name: 'Tezontle', lat: 19.3861862948, lon: -99.102248326 },
  { id: 36, name: 'Tezontle', lat: 19.3839466, lon: -99.0928993575 },
  { id: 37, name: 'Eje 1 y Zoquipan', lat: 19.418697, lon: -99.127502 },
  { id: 38, name: 'Miramontes y Calz. Del Hueso', lat: 19.304097, lon: -99.124907 },
  { id: 39, name: 'Plan de Ayala', lat: 19.3603078609, lon: -99.0316095995 },
  { id: 40, name: 'Las bombas', lat: 19.3082871825, lon: -99.1346490291 },
  { id: 41, name: 'Mariano Escobedo y F. Carrillo Puerto', lat: 19.451091, lon: -99.181818 },
  { id: 42, name: 'Eje 1 y Boturini', lat: 19.41739, lon: -99.127714 },
  { id: 43, name: 'M Cuevas', lat: 19.3637919361, lon: -99.0630632785 },
  { id: 44, name: 'Eje 8 Sur y Reforma Aeronautica', lat: 19.344278, lon: -99.027962 },
  { id: 45, name: 'Eje 8 Sur y Estrella', lat: 19.358665, lon: -99.089916 },
  { id: 46, name: 'Eje 8 Sur y F. Sarabia', lat: 19.35586, lon: -99.085783 },
  { id: 47, name: 'Las bombas', lat: 19.3086287313, lon: -99.1332836437 },
  { id: 48, name: 'Las bombas', lat: 19.3072833385, lon: -99.1325068804 },
  { id: 49, name: 'Marina Nacional y Laguna de Mayran', lat: 19.440721, lon: -99.1762 },
  { id: 50, name: 'Tezontle', lat: 19.3857235868, lon: -99.1004432983 },
  { id: 51, name: 'Eje 6 sur', lat: 19.3683331517, lon: -99.0747497569 },
  { id: 52, name: 'Combate de Leon', lat: 19.3635568741, lon: -99.0610706881 },
  { id: 53, name: 'Fundicion', lat: 19.3525337072, lon: -99.0785641637 },
  { id: 54, name: 'Eje 8 y E. Corona', lat: 19.357747, lon: -99.093403 },
  { id: 55, name: 'Eje 8 Sur y Ayuntamiento', lat: 19.358111, lon: -99.092069 },
  { id: 56, name: 'Las bombas', lat: 19.3102089605, lon: -99.1079755169 },
  { id: 57, name: 'Marina Nacional y Lago Garda', lat: 19.449383, lon: -99.182086 },
  { id: 58, name: 'Tezontle', lat: 19.3851274446, lon: -99.0980392447 },
  { id: 59, name: 'Eje 2 Ote y Agustin Yanez', lat: 19.366088, lon: -99.12233 },
  { id: 60, name: 'Eje 6 sur', lat: 19.3674972009, lon: -99.0733835783 },
  { id: 61, name: 'Fray Servando y Circunvalacion', lat: 19.4199561927, lon: -99.1120700694 },
  { id: 62, name: 'Las bombas', lat: 19.3097941077, lon: -99.1290883432 },
  { id: 63, name: 'Las bombas', lat: 19.3092573005, lon: -99.1311113552 },
  { id: 64, name: 'Marina Nacional y Mariano Escobedo', lat: 19.448535, lon: -99.182403 },
  { id: 65, name: 'Tezontle', lat: 19.3879363581, lon: -99.1094015261 },
  { id: 66, name: 'Sidar y Rovirosa', lat: 19.4277353348, lon: -99.1196316499 },
  { id: 67, name: 'Fray Servando y Circunvalacion', lat: 19.4235388631, lon: -99.130964322 },
  { id: 68, name: 'Mariano Escobedo y Lago Bolsena', lat: 19.44552, lon: -99.182671 },
  { id: 69, name: 'Marina Nacional y Ferrocarril de Cuernavaca', lat: 19.447244, lon: -99.181365 },
  { id: 70, name: 'San Antonio Abad y Fray Servando', lat: 19.423651, lon: -99.133383 },
  { id: 71, name: 'Eje 2 Ote y Cto. Interior', lat: 19.36923, lon: -99.122462 },
  { id: 72, name: 'Eje 2 Ote y Eje 3 Sur', lat: 19.40918, lon: -99.121626 },
  { id: 73, name: 'Eje 6 sur', lat: 19.3718194081, lon: -99.1029203384 },
  { id: 74, name: 'Eje 6 sur', lat: 19.3695304264, lon: -99.0769827902 },
  { id: 75, name: 'Campana del Ebano', lat: 19.3627157507, lon: -99.0534951378 },
  { id: 76, name: 'Mexico', lat: 19.3567250043, lon: -99.0230257265 },
  { id: 77, name: 'Eje 8 Sur y San Felipe/San Lorenzo', lat: 19.3506200489, lon: -99.073859169 },
  { id: 78, name: 'Mariano Escobedo y Lago Alberto', lat: 19.439771, lon: -99.183511 },
  { id: 79, name: 'Eje 2 Ote y Rodolfo Usigli', lat: 19.363697, lon: -99.122092 },
  { id: 80, name: 'Eje 2 Ote y Peluqueros', lat: 19.446476, lon: -99.1167 },
  { id: 81, name: 'Fray Servando y Circunvalacion', lat: 19.4243932522, lon: -99.1397588317 },
  { id: 82, name: 'Tezontle', lat: 19.3847076757, lon: -99.0960136782 },
  { id: 83, name: 'Eje 1 y Av. Del Taller', lat: 19.413418, lon: -99.128254 },
  { id: 84, name: 'Eje 2 Ote y Alfonso del Toro', lat: 19.368044, lon: -99.122203 },
  { id: 85, name: 'Eje 6 sur', lat: 19.3676845223, lon: -99.0981692499 },
  { id: 86, name: 'Eje 6 sur', lat: 19.3672907854, lon: -99.0967973242 },
  { id: 87, name: 'Eje 6 sur', lat: 19.3715832727, lon: -99.0802642247 },
  { id: 88, name: 'Eje 6 sur', lat: 19.3664962806, lon: -99.0715952176 },
  { id: 89, name: 'Eje 8 Sur Pascual Garcia', lat: 19.357084, lon: -99.095852 },
  { id: 90, name: 'Fray Servando y Circunvalacion', lat: 19.4231609136, lon: -99.1282651049 },
  { id: 91, name: 'Las bombas', lat: 19.3116353624, lon: -99.1200122171 },
  { id: 92, name: 'Las bombas', lat: 19.3111629213, lon: -99.1240160107 },
  { id: 93, name: 'Mariano Escobedo y Mar Negro', lat: 19.455175, lon: -99.181098 },
  { id: 94, name: 'San Antonio Abad y Chimalpopoca', lat: 19.422252, lon: -99.133765 },
  { id: 95, name: 'Eje 2 Ote y Circunvalacion', lat: 19.444283, lon: -99.11748 },
  { id: 96, name: 'Eje 6 sur', lat: 19.3668630751, lon: -99.0869313863 },
  { id: 97, name: 'Eje 8 Sur y Primavera', lat: 19.349952, lon: -99.01764 },
  { id: 98, name: 'Fray Servando y Circunvalacion', lat: 19.4254936409, lon: -99.149284757 },
  { id: 99, name: 'Laguna de Mayran', lat: 19.4416323484, lon: -99.1833253698 },
  { id: 100, name: 'Mariano Escobedo y Laguna de Termino', lat: 19.443611, lon: -99.182948 },
  { id: 101, name: 'San Antonio Abad e Izazaga', lat: 19.425953, lon: -99.133068 },
  { id: 102, name: 'Eje 2 Ote y Guillermo Prieto', lat: 19.406886, lon: -99.121583 },
  { id: 103, name: 'Deportivo Cuitlahuac', lat: 19.3614773343, lon: -99.0449935542 },
  { id: 104, name: 'Cuauhtemoc', lat: 19.3541612701, lon: -99.0183135422 },
  { id: 105, name: 'Eje 8 Sur y Rojo Gomez', lat: 19.356597, lon: -99.086482 },
  { id: 106, name: 'Las bombas', lat: 19.3071513338, lon: -99.1013777378 },
  { id: 107, name: 'Las bombas', lat: 19.3107509861, lon: -99.1253958309 },
  { id: 108, name: 'Marina Nacional y Laguna de Terminos', lat: 19.442924, lon: -99.177825 },
]

// Datos reales: ubicacion_c5_c2.csv (5 centros C2 + 1 C5)
export const C5_C2_LOCATIONS = [
  { id: 0, nombre: 'C2 Centro', lat: 19.43177, lon: -99.14669, alcaldia: 'Cuauhtémoc', region: 'Centro' },
  { id: 1, nombre: 'C2 Sur', lat: 19.37073, lon: -99.1602, alcaldia: 'Benito Juárez', region: 'Sur' },
  { id: 2, nombre: 'C2 Norte', lat: 19.483154, lon: -99.117016, alcaldia: 'Gustavo A. Madero', region: 'Norte' },
  { id: 3, nombre: 'C2 Poniente', lat: 19.39094, lon: -99.19933, alcaldia: 'Miguel Hidalgo', region: 'Poniente' },
  { id: 4, nombre: 'C2 Oriente', lat: 19.31301, lon: -99.0651, alcaldia: 'Iztapalapa', region: 'Oriente' },
  { id: 5, nombre: 'C5', lat: 19.42523, lon: -99.11805, alcaldia: 'Venustiano Carranza', region: 'Norte' },
]
