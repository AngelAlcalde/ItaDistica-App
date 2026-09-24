export type NivelSemaforo = 'URGENTE' | 'IMPORTANTE' | 'SEGUIMIENTO';

export type EstadoDecision = 'Pendiente' | 'En Análisis' | 'Aprobado' | 'Derivado a Intendencia';

export type Suficiencia = 'Suficiente' | 'Parcial' | 'Insuficiente';

export type Tendencia = 'En Alza' | 'Estable' | 'En Baja';

export type TipoArea = 'Secretaría' | 'Dirección' | 'Coordinación' | 'Área Operativa' | 'Mesa de Entrada';

export interface AreaMunicipal {
  id: string;
  nombre: string;
  tipo: TipoArea;
  responsableDefault: string;
  cargoDefault: string;
  empleadosDefault: number;
  horarioDefault: string;
  telefonoDefault: string;
  activo: boolean;
}

export interface DesgloseDiario {
  lunes: number;
  martes: number;
  miercoles: number;
  jueves: number;
  viernes: number;
}

export interface AreaReport {
  id: string;
  periodo: string; // e.g. "Semana 38 - Septiembre 2026"
  fechaRegistro: string;
  
  // 1. Identificación del Área
  nombreArea: string;
  responsable: string;
  cargoResponsable: string;
  empleados: number;
  horarioAtencion: string;
  telefonoInterno: string;

  // 2. Cantidad de Personas Atendidas
  atendidosPresencial: number;
  atendidosTelefonica: number;
  atendidosWhatsapp: number;
  atendidosRedesSociales: number;
  atendidosOtros: number;
  totalAtendidos: number;
  desgloseDiario: DesgloseDiario;

  // 3. Motivo de la Atención
  motivos: {
    tramites: number;
    informacion: number;
    reclamos: number;
    asistencia: number;
    servicios: number;
    notas: number;
    denuncias: number;
    proyectos: number;
    otros: number;
  };
  consultaMasFrecuente: string;

  // 4. Trámites y Respuesta
  tramitesIngresados: number;
  tramitesResueltos: number;
  tramitesPendientes: number;
  tramitesDerivados: number;
  tramitesSecretariaGeneral: number; // Remitidos a SG para dictamen o resolución
  tramitesAtrasados: number;
  causasPrincipalesAtraso: string;

  // 5. Demanda de Trabajo
  diaMayorDemanda: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  horarioPico: string; // ej: "08:30 - 11:30 hs"
  recordDiario: number;
  tendenciaAnual: Tendencia;

  // 6. Capacidad y Necesidades del Área
  suficienciaPersonal: Suficiencia;
  suficienciaEspacio: Suficiencia;
  suficienciaEquipamiento: Suficiencia;
  suficienciaSistemas: Suficiencia;
  recursosUrgentes: string[]; // ['Vehículos/Movilidad', 'Equipamiento Informático', 'Personal', etc.]
  detalleRecursos: string;

  // 7. Problemas que Requieren Decisión
  problemaDescripcion: string;
  intervencionSecretariaGeneral: string;
  nivelPrioridad: NivelSemaforo;
  estadoDecision: EstadoDecision;

  // 8. Información Ejecutiva
  logrosPeriodo: string;
  problemasPrincipales: string;
  propuestasMejora: string;

  // Indicadores Calculados
  indicadores: {
    atendidosPorEmpleado: number;
    tasaResolucionPct: number;
    tasaPendientesPct: number;
    tasaAtrasoPct: number;
    demandaPromedioDiaria: number;
    semaforoOperativo: NivelSemaforo;
  };
}

export interface ProblemaTransversal {
  id: string;
  categoria: string;
  titulo: string;
  areasAfectadas: string[];
  descripcion: string;
  nivelUrgencia: NivelSemaforo;
  accionRecomendada: string;
  coincidenciaRecurso: string;
}

export interface MetricasGlobales {
  totalAreas: number;
  totalAtendidos: number;
  totalEmpleados: number;
  promedioAtendidosPorEmpleado: number;
  tramitesIngresados: number;
  tramitesResueltos: number;
  tramitesPendientes: number;
  tramitesAtrasados: number;
  tramitesSecretariaGeneral: number;
  porcentajeResolucion: number;
  porcentajePendiente: number;
  porcentajeAtraso: number;
  promedioDiario: number;
  alertasUrgentes: number;
  alertasImportantes: number;
  alertasSeguimiento: number;
}
