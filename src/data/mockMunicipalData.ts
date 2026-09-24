import { AreaReport, ProblemaTransversal, MetricasGlobales, NivelSemaforo, AreaMunicipal } from '../types/municipal';

export const RECURSOS_OPCIONES = [
  'Vehículos / Movilidad y Combustible',
  'Equipamiento Informático y Computadoras',
  'Conectividad / Internet Estable',
  'Personal Administrativo de Apoyo',
  'Personal Operativo / Cuadrilla de Calle',
  'Espacio Físico / Depósito / Oficinas',
  'Insumos de Oficina y Toner',
  'Herramientas y Equipamiento de Seguridad',
  'Capacitación en Procedimientos y Normativa',
  'Sistemas de Gestión / Software Digital',
];

export const AREAS_MUNICIPALES_DEFAULT: AreaMunicipal[] = [
  {
    id: 'area-01',
    nombre: 'Secretaría de Obras y Servicios Públicos',
    tipo: 'Secretaría',
    responsableDefault: 'Ing. Roberto Valenzuela',
    cargoDefault: 'Secretario de Obras Públicas',
    empleadosDefault: 24,
    horarioDefault: '06:30 a 13:00 hs (Cuadrilla hasta 18:00 hs)',
    telefonoDefault: 'Int. 104',
    activo: true,
  },
  {
    id: 'area-02',
    nombre: 'Dirección de Acción Social y Desarrollo Humano',
    tipo: 'Dirección',
    responsableDefault: 'Lic. María Elena Duarte',
    cargoDefault: 'Directora de Acción Social',
    empleadosDefault: 8,
    horarioDefault: '07:00 a 13:00 hs',
    telefonoDefault: 'Int. 108',
    activo: true,
  },
  {
    id: 'area-03',
    nombre: 'Dirección de Tránsito, Seguridad Vial y Transporte',
    tipo: 'Dirección',
    responsableDefault: 'Of. Carlos Benítez',
    cargoDefault: 'Director de Tránsito',
    empleadosDefault: 14,
    horarioDefault: '07:00 a 13:00 hs (Guardias 24hs)',
    telefonoDefault: 'Int. 112',
    activo: true,
  },
  {
    id: 'area-04',
    nombre: 'Dirección de Bromatología, Comercio e Higiene Ambiental',
    tipo: 'Dirección',
    responsableDefault: 'Vet. Andrea Almirón',
    cargoDefault: 'Directora de Bromatología',
    empleadosDefault: 6,
    horarioDefault: '07:00 a 13:00 hs',
    telefonoDefault: 'Int. 115',
    activo: true,
  },
  {
    id: 'area-05',
    nombre: 'Secretaría de Hacienda, Finanzas y Rentas',
    tipo: 'Secretaría',
    responsableDefault: 'C.P. Gustavo Romero',
    cargoDefault: 'Secretario de Hacienda',
    empleadosDefault: 7,
    horarioDefault: '07:00 a 13:00 hs',
    telefonoDefault: 'Int. 102',
    activo: true,
  },
  {
    id: 'area-06',
    nombre: 'Dirección de Turismo, Cultura y Deportes',
    tipo: 'Dirección',
    responsableDefault: 'Prof. Lucas Morales',
    cargoDefault: 'Director de Turismo y Cultura',
    empleadosDefault: 5,
    horarioDefault: '08:00 a 13:00 y 16:00 a 20:00 hs',
    telefonoDefault: 'Int. 120',
    activo: true,
  },
  {
    id: 'area-07',
    nombre: 'Mesa General de Entradas y Atención Ciudadana',
    tipo: 'Mesa de Entrada',
    responsableDefault: 'Sra. Patricia Gómez',
    cargoDefault: 'Jefa de Mesa de Entradas',
    empleadosDefault: 4,
    horarioDefault: '07:00 a 13:00 hs',
    telefonoDefault: 'Int. 100',
    activo: true,
  },
];

export const AREAS_PREDEFINIDAS = AREAS_MUNICIPALES_DEFAULT.map(a => a.nombre);

export function calcularIndicadoresReporte(data: Partial<AreaReport>): AreaReport['indicadores'] {
  const totalAtendidos = (data.atendidosPresencial || 0) +
    (data.atendidosTelefonica || 0) +
    (data.atendidosWhatsapp || 0) +
    (data.atendidosRedesSociales || 0) +
    (data.atendidosOtros || 0);

  const empleados = Math.max(1, data.empleados || 1);
  const atendidosPorEmpleado = Number((totalAtendidos / empleados).toFixed(1));

  const ingresados = data.tramitesIngresados || 0;
  const resueltos = data.tramitesResueltos || 0;
  const pendientes = data.tramitesPendientes || 0;
  const atrasados = data.tramitesAtrasados || 0;

  const tasaResolucionPct = ingresados > 0 ? Number(((resueltos / ingresados) * 100).toFixed(1)) : 0;
  const tasaPendientesPct = ingresados > 0 ? Number(((pendientes / ingresados) * 100).toFixed(1)) : 0;
  const tasaAtrasoPct = ingresados > 0 ? Number(((atrasados / ingresados) * 100).toFixed(1)) : 0;

  const dias = data.desgloseDiario || { lunes: 0, martes: 0, miercoles: 0, jueves: 0, viernes: 0 };
  const sumaDias = (dias.lunes || 0) + (dias.martes || 0) + (dias.miercoles || 0) + (dias.jueves || 0) + (dias.viernes || 0);
  const demandaPromedioDiaria = Number((sumaDias / 5).toFixed(1));

  // Cálculo de Semáforo Operativo
  let semaforoOperativo: NivelSemaforo = 'SEGUIMIENTO';
  if (data.nivelPrioridad === 'URGENTE' || tasaAtrasoPct >= 35 || atrasados >= 15) {
    semaforoOperativo = 'URGENTE';
  } else if (data.nivelPrioridad === 'IMPORTANTE' || tasaAtrasoPct >= 18 || pendientes >= 20) {
    semaforoOperativo = 'IMPORTANTE';
  }

  return {
    atendidosPorEmpleado,
    tasaResolucionPct,
    tasaPendientesPct,
    tasaAtrasoPct,
    demandaPromedioDiaria,
    semaforoOperativo,
  };
}

export const REPORTES_INICIALES: AreaReport[] = [
  {
    id: 'rep-01',
    periodo: 'Semana 38 - Septiembre 2026',
    fechaRegistro: '2026-09-21',
    nombreArea: 'Secretaría de Obras y Servicios Públicos',
    responsable: 'Ing. Roberto Valenzuela',
    cargoResponsable: 'Secretario de Obras Públicas',
    empleados: 24,
    horarioAtencion: '06:30 a 13:00 hs (Cuadrilla hasta 18:00 hs)',
    telefonoInterno: 'Int. 104',
    atendidosPresencial: 145,
    atendidosTelefonica: 68,
    atendidosWhatsapp: 92,
    atendidosRedesSociales: 18,
    atendidosOtros: 7,
    totalAtendidos: 330,
    desgloseDiario: { lunes: 85, martes: 72, miercoles: 64, jueves: 58, viernes: 51 },
    motivos: {
      tramites: 60,
      informacion: 45,
      reclamos: 110,
      asistencia: 20,
      servicios: 75,
      notas: 12,
      denuncias: 8,
      proyectos: 0,
      otros: 0,
    },
    consultaMasFrecuente: 'Reclamos por alumbrado público en Barrio San Antonio y perfilado de calles de arena tras lluvias.',
    tramitesIngresados: 110,
    tramitesResueltos: 68,
    tramitesPendientes: 42,
    tramitesDerivados: 10,
    tramitesSecretariaGeneral: 8,
    tramitesAtrasados: 22,
    causasPrincipalesAtraso: 'Desperfecto mecánico en motoniveladora municipal y camión volcador en taller; falta de repuestos hidráulicos importados.',
    diaMayorDemanda: 'Lunes',
    horarioPico: '07:30 - 10:30 hs',
    recordDiario: 85,
    tendenciaAnual: 'En Alza',
    suficienciaPersonal: 'Parcial',
    suficienciaEspacio: 'Suficiente',
    suficienciaEquipamiento: 'Insuficiente',
    suficienciaSistemas: 'Parcial',
    recursosUrgentes: [
      'Vehículos / Movilidad y Combustible',
      'Herramientas y Equipamiento de Seguridad',
      'Personal Operativo / Cuadrilla de Calle',
    ],
    detalleRecursos: 'Se requiere autorización de fondo para reparación urgente de la motoniveladora y provisión de 40 luminarias LED para el acceso principal.',
    problemaDescripcion: 'Falta de maquinaria pesada operativa paraliza el cronograma de arreglo de caminos vecinales y accesos ribereños antes del torneo de pesca.',
    intervencionSecretariaGeneral: 'Dictamen de compra directa de repuestos de emergencia o contratación de servicio tercerizado de maquinaria pesada.',
    nivelPrioridad: 'URGENTE',
    estadoDecision: 'Pendiente',
    logrosPeriodo: 'Se completaron 1.200 metros de zanjeo y colocación de tubos de alcantarillado en Barrio Chino y se repusieron 28 artefactos lumínicos.',
    problemasPrincipales: 'Parque automotor disminuido en un 40% por roturas mecánicas simultáneas.',
    propuestasMejora: 'Crear un plan preventivo mensual de mantenimiento vehicular con asignación fija de mecánico oficial.',
    indicadores: {
      atendidosPorEmpleado: 13.8,
      tasaResolucionPct: 61.8,
      tasaPendientesPct: 38.2,
      tasaAtrasoPct: 20.0,
      demandaPromedioDiaria: 66.0,
      semaforoOperativo: 'URGENTE',
    },
  },
  {
    id: 'rep-02',
    periodo: 'Semana 38 - Septiembre 2026',
    fechaRegistro: '2026-09-21',
    nombreArea: 'Dirección de Tránsito, Seguridad Vial y Transporte',
    responsable: 'Of. Mayor Javier Benítez',
    cargoResponsable: 'Director de Tránsito',
    empleados: 12,
    horarioAtencion: '07:00 a 13:00 hs y operativos 18:00 a 02:00 hs',
    telefonoInterno: 'Int. 112',
    atendidosPresencial: 180,
    atendidosTelefonica: 35,
    atendidosWhatsapp: 54,
    atendidosRedesSociales: 10,
    atendidosOtros: 5,
    totalAtendidos: 284,
    desgloseDiario: { lunes: 68, martes: 62, miercoles: 55, jueves: 50, viernes: 49 },
    motivos: {
      tramites: 165,
      informacion: 50,
      reclamos: 28,
      asistencia: 15,
      servicios: 12,
      notas: 6,
      denuncias: 8,
      proyectos: 0,
      otros: 0,
    },
    consultaMasFrecuente: 'Emisión y renovación de Licencia Nacional de Conducir (SINALIC) y libre deuda municipal de tránsito.',
    tramitesIngresados: 94,
    tramitesResueltos: 81,
    tramitesPendientes: 13,
    tramitesDerivados: 4,
    tramitesSecretariaGeneral: 3,
    tramitesAtrasados: 6,
    causasPrincipalesAtraso: 'Caídas intermitentes del enlace provincial con la base de datos de antecedentes penales y SINALIC.',
    diaMayorDemanda: 'Lunes',
    horarioPico: '08:00 - 11:30 hs',
    recordDiario: 68,
    tendenciaAnual: 'En Alza',
    suficienciaPersonal: 'Insuficiente',
    suficienciaEspacio: 'Parcial',
    suficienciaEquipamiento: 'Insuficiente',
    suficienciaSistemas: 'Suficiente',
    recursosUrgentes: [
      'Vehículos / Movilidad y Combustible',
      'Equipamiento Informático y Computadoras',
      'Personal Operativo / Cuadrilla de Calle',
    ],
    detalleRecursos: 'Solo 1 motocicleta en servicio para 3 turnos. Se solicita reparación de 2 motos de patrulla y compra de 1 PC para impresión de tarjetas plásticas.',
    problemaDescripcion: 'Imposibilidad de cubrir simultáneamente control en Costanera ribereña y entrada sobre Ruta Nacional 12 por falta de móviles.',
    intervencionSecretariaGeneral: 'Coordinación con Obras Públicas y Secretaría de Gobierno para asignación de una camioneta de apoyo durante operativos de fin de semana.',
    nivelPrioridad: 'IMPORTANTE',
    estadoDecision: 'En Análisis',
    logrosPeriodo: '81 licencias emitidas en tiempo y forma; se impartieron charlas de seguridad vial en el Colegio Secundario de Itá Ibaté con 140 alumnos.',
    problemasPrincipales: 'Falta de móviles propios para patrullaje nocturno y escasez de chalecos reflectarios homologados.',
    propuestasMejora: 'Habilitar turnero digital para evitar aglomeraciones los días lunes por la mañana.',
    indicadores: {
      atendidosPorEmpleado: 23.7,
      tasaResolucionPct: 86.2,
      tasaPendientesPct: 13.8,
      tasaAtrasoPct: 6.4,
      demandaPromedioDiaria: 56.8,
      semaforoOperativo: 'IMPORTANTE',
    },
  },
  {
    id: 'rep-03',
    periodo: 'Semana 38 - Septiembre 2026',
    fechaRegistro: '2026-09-22',
    nombreArea: 'Dirección de Acción Social y Desarrollo Humano',
    responsable: 'Lic. Carmen Almirón',
    cargoResponsable: 'Directora de Acción Social',
    empleados: 9,
    horarioAtencion: '07:00 a 13:00 hs',
    telefonoInterno: 'Int. 108',
    atendidosPresencial: 210,
    atendidosTelefonica: 42,
    atendidosWhatsapp: 115,
    atendidosRedesSociales: 22,
    atendidosOtros: 12,
    totalAtendidos: 401,
    desgloseDiario: { lunes: 95, martes: 88, miercoles: 80, jueves: 74, viernes: 64 },
    motivos: {
      tramites: 80,
      informacion: 65,
      reclamos: 18,
      asistencia: 195,
      servicios: 25,
      notas: 10,
      denuncias: 4,
      proyectos: 4,
      otros: 0,
    },
    consultaMasFrecuente: 'Solicitud de módulos alimentarios, asistencia con medicamentos crónicos y turnos para especialistas en Corrientes Capital.',
    tramitesIngresados: 125,
    tramitesResueltos: 96,
    tramitesPendientes: 29,
    tramitesDerivados: 15,
    tramitesSecretariaGeneral: 12,
    tramitesAtrasados: 18,
    causasPrincipalesAtraso: 'Retraso en remesa de fondos para compra de medicamentos oncológicos y coordinación de transporte sanitario a Capital.',
    diaMayorDemanda: 'Lunes',
    horarioPico: '07:30 - 11:00 hs',
    recordDiario: 95,
    tendenciaAnual: 'En Alza',
    suficienciaPersonal: 'Parcial',
    suficienciaEspacio: 'Insuficiente',
    suficienciaEquipamiento: 'Parcial',
    suficienciaSistemas: 'Insuficiente',
    recursosUrgentes: [
      'Vehículos / Movilidad y Combustible',
      'Espacio Físico / Depósito / Oficinas',
      'Sistemas de Gestión / Software Digital',
    ],
    detalleRecursos: 'Furgón de traslados sanitarios requiere cambio urgente de cubiertas y service. Oficina actual no garantiza privacidad para entrevistas de violencia o menores.',
    problemaDescripcion: 'Cinco pacientes de diálisis y oncología con traslados programados a Corrientes Capital en riesgo si el utilitario no se repara esta semana.',
    intervencionSecretariaGeneral: 'Autorización urgente de partida extraordinaria de combustible y neumáticos para la combi municipal de salud.',
    nivelPrioridad: 'URGENTE',
    estadoDecision: 'Aprobado',
    logrosPeriodo: 'Entrega de 160 módulos alimentarios a familias vulnerables; 18 traslados sanitarios exitosos a centros de mayor complejidad.',
    problemasPrincipales: 'Espacio de atención saturado y falta de base de datos digital unificada de beneficiarios sociales (se lleva en planillas físicas).',
    propuestasMejora: 'Implementar ficha social digital centralizada vinculada a DNI para evitar duplicidad de ayudas.',
    indicadores: {
      atendidosPorEmpleado: 44.6,
      tasaResolucionPct: 76.8,
      tasaPendientesPct: 23.2,
      tasaAtrasoPct: 14.4,
      demandaPromedioDiaria: 80.2,
      semaforoOperativo: 'URGENTE',
    },
  },
  {
    id: 'rep-04',
    periodo: 'Semana 38 - Septiembre 2026',
    fechaRegistro: '2026-09-22',
    nombreArea: 'Dirección de Bromatología, Comercio e Higiene Ambiental',
    responsable: 'Dra. Silvina Romero',
    cargoResponsable: 'Directora de Bromatología y Comercio',
    empleados: 7,
    horarioAtencion: '07:00 a 12:30 hs y fiscalizaciones vespertinas',
    telefonoInterno: 'Int. 115',
    atendidosPresencial: 85,
    atendidosTelefonica: 26,
    atendidosWhatsapp: 45,
    atendidosRedesSociales: 8,
    atendidosOtros: 4,
    totalAtendidos: 168,
    desgloseDiario: { lunes: 42, martes: 36, miercoles: 34, jueves: 30, viernes: 26 },
    motivos: {
      tramites: 75,
      informacion: 30,
      reclamos: 14,
      asistencia: 5,
      servicios: 20,
      notas: 8,
      denuncias: 12,
      proyectos: 4,
      otros: 0,
    },
    consultaMasFrecuente: 'Habilitación de cabañas de pesca, carnet de manipulador de alimentos y análisis triquinoscópico de carnes.',
    tramitesIngresados: 52,
    tramitesResueltos: 44,
    tramitesPendientes: 8,
    tramitesDerivados: 3,
    tramitesSecretariaGeneral: 2,
    tramitesAtrasados: 4,
    causasPrincipalesAtraso: 'Inspecciones pendientes en cabañas alejadas del ejido urbano por falta de disponibilidad de móvil.',
    diaMayorDemanda: 'Lunes',
    horarioPico: '08:30 - 11:30 hs',
    recordDiario: 42,
    tendenciaAnual: 'Estable',
    suficienciaPersonal: 'Suficiente',
    suficienciaEspacio: 'Suficiente',
    suficienciaEquipamiento: 'Parcial',
    suficienciaSistemas: 'Parcial',
    recursosUrgentes: [
      'Vehículos / Movilidad y Combustible',
      'Equipamiento Informático y Computadoras',
      'Insumos de Oficina y Toner',
    ],
    detalleRecursos: 'Solicitud de 2 días a la semana de vehículo con chofer para fiscalización en zona ribereña y reactivos para laboratorio bromatológico.',
    problemaDescripcion: 'Comercios de temporada de pesca inician actividades sin inspección final si no se accede a las cabañas en camino costero.',
    intervencionSecretariaGeneral: 'Disposición conjunta con Secretaría General para unificar cronograma de inspecciones con Rentas y Tránsito compartiendo camioneta.',
    nivelPrioridad: 'IMPORTANTE',
    estadoDecision: 'En Análisis',
    logrosPeriodo: '44 certificados de manipulación de alimentos emitidos; decomiso de 60 kg de mercadería vencida en minimercado sin incidentes.',
    problemasPrincipales: 'Dependencia de vehículos prestados por otras secretarías para realizar trabajo de campo.',
    propuestasMejora: 'Crear operativos integrados los días miércoles (Bromatología + Comercio + Rentas) con 1 solo vehículo asignado.',
    indicadores: {
      atendidosPorEmpleado: 24.0,
      tasaResolucionPct: 84.6,
      tasaPendientesPct: 15.4,
      tasaAtrasoPct: 7.7,
      demandaPromedioDiaria: 33.6,
      semaforoOperativo: 'IMPORTANTE',
    },
  },
  {
    id: 'rep-05',
    periodo: 'Semana 38 - Septiembre 2026',
    fechaRegistro: '2026-09-23',
    nombreArea: 'Secretaría de Hacienda, Finanzas y Rentas',
    responsable: 'Cdor. Marcelo Gómez',
    cargoResponsable: 'Secretario de Hacienda',
    empleados: 11,
    horarioAtencion: '07:00 a 13:00 hs',
    telefonoInterno: 'Int. 102',
    atendidosPresencial: 230,
    atendidosTelefonica: 40,
    atendidosWhatsapp: 78,
    atendidosRedesSociales: 5,
    atendidosOtros: 10,
    totalAtendidos: 363,
    desgloseDiario: { lunes: 88, martes: 82, miercoles: 70, jueves: 65, viernes: 58 },
    motivos: {
      tramites: 210,
      informacion: 80,
      reclamos: 15,
      asistencia: 10,
      servicios: 25,
      notas: 15,
      denuncias: 2,
      proyectos: 6,
      otros: 0,
    },
    consultaMasFrecuente: 'Planes de pago moratoria tasas inmobiliarias y patente automotor 2026; emisión de libre deuda para venta de inmuebles.',
    tramitesIngresados: 140,
    tramitesResueltos: 128,
    tramitesPendientes: 12,
    tramitesDerivados: 2,
    tramitesSecretariaGeneral: 5,
    tramitesAtrasados: 5,
    causasPrincipalesAtraso: 'Expedientes de exenciones impositivas a jubilados esperando informe socioeconómico de Acción Social.',
    diaMayorDemanda: 'Lunes',
    horarioPico: '08:00 - 12:00 hs',
    recordDiario: 88,
    tendenciaAnual: 'En Alza',
    suficienciaPersonal: 'Suficiente',
    suficienciaEspacio: 'Suficiente',
    suficienciaEquipamiento: 'Parcial',
    suficienciaSistemas: 'Suficiente',
    recursosUrgentes: [
      'Equipamiento Informático y Computadoras',
      'Conectividad / Internet Estable',
      'Insumos de Oficina y Toner',
    ],
    detalleRecursos: '2 impresoras fiscales con cabezal defectuoso generando demoras en caja; se requiere tóner para 3 puestos de recaudación.',
    problemaDescripcion: 'Fallas periódicas en la conexión de fibra óptica local dejan sin sistema cobro de Banco de Corrientes y QR en horarios pico.',
    intervencionSecretariaGeneral: 'Instruir al área de Cómputos para contratación de enlace secundario de respaldo (Starlink o 4G dedicado) para cajas municipales.',
    nivelPrioridad: 'IMPORTANTE',
    estadoDecision: 'En Análisis',
    logrosPeriodo: 'Recaudación semanal superó en un 14% la meta presupuestada gracias al plan especial de regularización tributaria.',
    problemasPrincipales: 'Colas en vereda en días de vencimiento por lentitud en impresión de tickets de caja.',
    propuestasMejora: 'Habilitar botón de pago Macro Click / Mercado Pago en el portal web municipal para que los vecinos paguen desde el celular.',
    indicadores: {
      atendidosPorEmpleado: 33.0,
      tasaResolucionPct: 91.4,
      tasaPendientesPct: 8.6,
      tasaAtrasoPct: 3.6,
      demandaPromedioDiaria: 72.6,
      semaforoOperativo: 'SEGUIMIENTO',
    },
  },
  {
    id: 'rep-06',
    periodo: 'Semana 38 - Septiembre 2026',
    fechaRegistro: '2026-09-23',
    nombreArea: 'Mesa General de Entradas y Atención Ciudadana',
    responsable: 'Clara Duarte',
    cargoResponsable: 'Jefa de Mesa de Entradas',
    empleados: 5,
    horarioAtencion: '06:30 a 13:00 hs',
    telefonoInterno: 'Int. 101',
    atendidosPresencial: 310,
    atendidosTelefonica: 85,
    atendidosWhatsapp: 140,
    atendidosRedesSociales: 35,
    atendidosOtros: 15,
    totalAtendidos: 585,
    desgloseDiario: { lunes: 140, martes: 125, miercoles: 115, jueves: 105, viernes: 100 },
    motivos: {
      tramites: 260,
      informacion: 175,
      reclamos: 65,
      asistencia: 25,
      servicios: 20,
      notas: 30,
      denuncias: 10,
      proyectos: 0,
      otros: 0,
    },
    consultaMasFrecuente: 'Recepción de notas oficiales, seguimiento de números de expediente y consultas generales de derivación.',
    tramitesIngresados: 195,
    tramitesResueltos: 170,
    tramitesPendientes: 25,
    tramitesDerivados: 160,
    tramitesSecretariaGeneral: 35,
    tramitesAtrasados: 8,
    causasPrincipalesAtraso: 'Demora de otras secretarías en acusar recibo y firmar pases de expedientes en papel.',
    diaMayorDemanda: 'Lunes',
    horarioPico: '07:30 - 11:00 hs',
    recordDiario: 140,
    tendenciaAnual: 'En Alza',
    suficienciaPersonal: 'Insuficiente',
    suficienciaEspacio: 'Insuficiente',
    suficienciaEquipamiento: 'Parcial',
    suficienciaSistemas: 'Insuficiente',
    recursosUrgentes: [
      'Personal Administrativo de Apoyo',
      'Equipamiento Informático y Computadoras',
      'Sistemas de Gestión / Software Digital',
    ],
    detalleRecursos: 'Se requiere 1 agente de apoyo para digitalización de expedientes y 1 escáner de alta velocidad para sustitución paulatina del papel.',
    problemaDescripcion: 'Pérdida de trazabilidad de expedientes cuando salen a secretarías externas; vecinos reclaman en Mesa de Entradas sin respuesta inmediata.',
    intervencionSecretariaGeneral: 'Circular obligatoria de Secretaría General estableciendo plazo perentorio de 48 hs para confirmar recepción de expedientes en libro de pases.',
    nivelPrioridad: 'IMPORTANTE',
    estadoDecision: 'Aprobado',
    logrosPeriodo: '195 trámites ingresados y clasificados en menos de 24 horas; atención sin incidentes a casi 600 vecinos en el hall central.',
    problemasPrincipales: 'Espacio físico reducido en el mostrador principal generando aglomeraciones que bloquean el ingreso al Palacio Municipal.',
    propuestasMejora: 'Instalar totem o turnero digital en el hall y habilitar mesa de entrada virtual por correo electrónico institucional.',
    indicadores: {
      atendidosPorEmpleado: 117.0,
      tasaResolucionPct: 87.2,
      tasaPendientesPct: 12.8,
      tasaAtrasoPct: 4.1,
      demandaPromedioDiaria: 117.0,
      semaforoOperativo: 'SEGUIMIENTO',
    },
  },
];

export function calcularMetricasGlobales(reportes: AreaReport[]): MetricasGlobales {
  if (!reportes || reportes.length === 0) {
    return {
      totalAreas: 0,
      totalAtendidos: 0,
      totalEmpleados: 0,
      promedioAtendidosPorEmpleado: 0,
      tramitesIngresados: 0,
      tramitesResueltos: 0,
      tramitesPendientes: 0,
      tramitesAtrasados: 0,
      tramitesSecretariaGeneral: 0,
      porcentajeResolucion: 0,
      porcentajePendiente: 0,
      porcentajeAtraso: 0,
      promedioDiario: 0,
      alertasUrgentes: 0,
      alertasImportantes: 0,
      alertasSeguimiento: 0,
    };
  }

  const totalAreas = reportes.length;
  const totalAtendidos = reportes.reduce((acc, r) => acc + (r.totalAtendidos || 0), 0);
  const totalEmpleados = reportes.reduce((acc, r) => acc + (r.empleados || 0), 0);
  const promedioAtendidosPorEmpleado = totalEmpleados > 0 ? Number((totalAtendidos / totalEmpleados).toFixed(1)) : 0;

  const tramitesIngresados = reportes.reduce((acc, r) => acc + (r.tramitesIngresados || 0), 0);
  const tramitesResueltos = reportes.reduce((acc, r) => acc + (r.tramitesResueltos || 0), 0);
  const tramitesPendientes = reportes.reduce((acc, r) => acc + (r.tramitesPendientes || 0), 0);
  const tramitesAtrasados = reportes.reduce((acc, r) => acc + (r.tramitesAtrasados || 0), 0);
  const tramitesSecretariaGeneral = reportes.reduce((acc, r) => acc + (r.tramitesSecretariaGeneral || 0), 0);

  const porcentajeResolucion = tramitesIngresados > 0 ? Number(((tramitesResueltos / tramitesIngresados) * 100).toFixed(1)) : 0;
  const porcentajePendiente = tramitesIngresados > 0 ? Number(((tramitesPendientes / tramitesIngresados) * 100).toFixed(1)) : 0;
  const porcentajeAtraso = tramitesIngresados > 0 ? Number(((tramitesAtrasados / tramitesIngresados) * 100).toFixed(1)) : 0;

  const totalDias = reportes.reduce((acc, r) => {
    const d = r.desgloseDiario || { lunes: 0, martes: 0, miercoles: 0, jueves: 0, viernes: 0 };
    return acc + ((d.lunes || 0) + (d.martes || 0) + (d.miercoles || 0) + (d.jueves || 0) + (d.viernes || 0));
  }, 0);
  const promedioDiario = Number((totalDias / 5).toFixed(1));

  const alertasUrgentes = reportes.filter((r) => r.indicadores?.semaforoOperativo === 'URGENTE').length;
  const alertasImportantes = reportes.filter((r) => r.indicadores?.semaforoOperativo === 'IMPORTANTE').length;
  const alertasSeguimiento = reportes.filter((r) => r.indicadores?.semaforoOperativo === 'SEGUIMIENTO').length;

  return {
    totalAreas,
    totalAtendidos,
    totalEmpleados,
    promedioAtendidosPorEmpleado,
    tramitesIngresados,
    tramitesResueltos,
    tramitesPendientes,
    tramitesAtrasados,
    tramitesSecretariaGeneral,
    porcentajeResolucion,
    porcentajePendiente,
    porcentajeAtraso,
    promedioDiario,
    alertasUrgentes,
    alertasImportantes,
    alertasSeguimiento,
  };
}

export function detectarProblemasTransversalesAlgoritmico(reportes: AreaReport[]): ProblemaTransversal[] {
  const recursosMap = new Map<string, string[]>();

  reportes.forEach((rep) => {
    rep.recursosUrgentes.forEach((rec) => {
      const list = recursosMap.get(rec) || [];
      if (!list.includes(rep.nombreArea)) {
        list.push(rep.nombreArea);
      }
      recursosMap.set(rec, list);
    });
  });

  const problemas: ProblemaTransversal[] = [];

  // 1. Detección de Vehículos / Movilidad
  const areasVehiculos = recursosMap.get('Vehículos / Movilidad y Combustible') || [];
  if (areasVehiculos.length >= 2) {
    problemas.push({
      id: 'pt-vehiculos',
      categoria: 'Movilidad y Parque Automotor',
      titulo: 'Crisis de Parque Automotor y Traslados Operativos',
      areasAfectadas: areasVehiculos,
      descripcion: `Coincidencia crítica entre ${areasVehiculos.length} áreas (${areasVehiculos.join(', ')}). Obras Públicas tiene maquinaria detenida, Tránsito carece de motos para patrullas, y Acción Social reporta urgencias de traslados sanitarios a Corrientes Capital.`,
      nivelUrgencia: 'URGENTE',
      accionRecomendada: 'Centralizar desde Secretaría General el parque automotor: emitir cronograma semanal unificado de camionetas compartidas y tramitar fondo de emergencia para mecánica pesada.',
      coincidenciaRecurso: 'Vehículos / Movilidad y Combustible',
    });
  }

  // 2. Detección de Equipamiento Informático / Digitalización
  const areasInformatica = recursosMap.get('Equipamiento Informático y Computadoras') || [];
  if (areasInformatica.length >= 2) {
    problemas.push({
      id: 'pt-informatica',
      categoria: 'Tecnología y Conectividad',
      titulo: 'Obsolescencia de Equipamiento Informático e Impresoras',
      areasAfectadas: areasInformatica,
      descripcion: `Las áreas de ${areasInformatica.join(', ')} manifiestan cuellos de botella en atención por impresoras con fallas mecánicas, falta de escáneres y PCs antiguas que ralentizan la liquidación y la emisión de licencias.`,
      nivelUrgencia: 'IMPORTANTE',
      accionRecomendada: 'Realizar compra agrupada municipal de 4 impresoras multifunción con sistema continuo y 2 escáneres, optimizando costos por volumen en vez de compras fraccionadas.',
      coincidenciaRecurso: 'Equipamiento Informático y Computadoras',
    });
  }

  // 3. Detección de Sistemas / Software de Gestión
  const areasSistemas = recursosMap.get('Sistemas de Gestión / Software Digital') || [];
  if (areasSistemas.length >= 2) {
    problemas.push({
      id: 'pt-sistemas',
      categoria: 'Modernización Administrativa',
      titulo: 'Fragmentación de Registros y Falta de Trazabilidad Digital',
      areasAfectadas: areasSistemas,
      descripcion: `Mesa de Entradas y Acción Social operan con planillas físicas o desconectadas, provocando pérdida de trazabilidad de reclamos y expedientes entre oficinas.`,
      nivelUrgencia: 'IMPORTANTE',
      accionRecomendada: 'Implementar el Sistema Municipal Único de Expedientes y Ficha Social Digital bajo directiva de Secretaría General.',
      coincidenciaRecurso: 'Sistemas de Gestión / Software Digital',
    });
  }

  // 4. Detección de Espacio Físico
  const areasEspacio = recursosMap.get('Espacio Físico / Depósito / Oficinas') || [];
  if (areasEspacio.length >= 2) {
    problemas.push({
      id: 'pt-espacio',
      categoria: 'Infraestructura Edilicia',
      titulo: 'Saturación de Espacios de Atención y Falta de Privacidad',
      areasAfectadas: areasEspacio,
      descripcion: `Mesa de Entradas y Acción Social sufren saturación en el hall central. Se vulnera la privacidad vecinal en casos sensibles y se generan filas en la vereda.`,
      nivelUrgencia: 'IMPORTANTE',
      accionRecomendada: 'Readecuar boxes de atención ciudadana y crear sala reservada para gabinete de acción social y mediación comunitaria.',
      coincidenciaRecurso: 'Espacio Físico / Depósito / Oficinas',
    });
  }

  // 5. Personal de Apoyo
  const areasPersonal = recursosMap.get('Personal Administrativo de Apoyo') || [];
  if (areasPersonal.length >= 2) {
    problemas.push({
      id: 'pt-personal',
      categoria: 'Recursos Humanos',
      titulo: 'Sobrecarga de Agentes en Mesa de Atención y Carga de Datos',
      areasAfectadas: areasPersonal,
      descripcion: `La atención directa supera los 100 vecinos por empleado en Mesa de Entradas, generando demoras en carga digital y desgaste del personal.`,
      nivelUrgencia: 'SEGUIMIENTO',
      accionRecomendada: 'Disponer rotación temporal de 2 agentes administrativos desde áreas con menor afluencia hacia Mesa de Entradas en horarios pico (08:00 a 11:30).',
      coincidenciaRecurso: 'Personal Administrativo de Apoyo',
    });
  }

  return problemas;
}
