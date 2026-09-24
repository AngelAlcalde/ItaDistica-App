import React, { useState, useEffect } from 'react';
import { 
  AreaReport, 
  NivelSemaforo, 
  Suficiencia, 
  Tendencia, 
  EstadoDecision,
  AreaMunicipal 
} from '../types/municipal';
import { 
  AREAS_PREDEFINIDAS, 
  RECURSOS_OPCIONES, 
  calcularIndicadoresReporte 
} from '../data/mockMunicipalData';
import { 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Building2, 
  Users, 
  MessageSquare, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Settings,
  PlusCircle
} from 'lucide-react';

interface FormularioUnicoProps {
  onSaveReport: (report: AreaReport) => void;
  reporteParaEditar?: AreaReport | null;
  periodoActivo: string;
  areasDisponibles?: AreaMunicipal[];
  onOpenGestionAreas?: () => void;
  areaSeleccionadaInicial?: string;
}

export const FormularioUnico: React.FC<FormularioUnicoProps> = ({
  onSaveReport,
  reporteParaEditar,
  periodoActivo,
  areasDisponibles = [],
  onOpenGestionAreas,
  areaSeleccionadaInicial
}) => {
  const [pasoActivo, setPasoActivo] = useState<number>(1);
  const [mensajeGuardado, setMensajeGuardado] = useState(false);

  // Estado del Formulario
  const [formData, setFormData] = useState<Partial<AreaReport>>(() => {
    if (reporteParaEditar) {
      return { ...reporteParaEditar };
    }

    const areaInicial = areaSeleccionadaInicial || (areasDisponibles[0]?.nombre) || AREAS_PREDEFINIDAS[0] || 'Secretaría de Obras y Servicios Públicos';
    const areaData = areasDisponibles.find(a => a.nombre === areaInicial);

    return {
      periodo: periodoActivo,
      nombreArea: areaInicial,
      responsable: areaData?.responsableDefault || '',
      cargoResponsable: areaData?.cargoDefault || '',
      empleados: areaData?.empleadosDefault || 5,
      horarioAtencion: areaData?.horarioDefault || '07:00 a 13:00 hs',
      telefonoInterno: areaData?.telefonoDefault || 'Int. 100',

      atendidosPresencial: 0,
      atendidosTelefonica: 0,
      atendidosWhatsapp: 0,
      atendidosRedesSociales: 0,
      atendidosOtros: 0,
      totalAtendidos: 0,
      desgloseDiario: { lunes: 0, martes: 0, miercoles: 0, jueves: 0, viernes: 0 },

      motivos: {
        tramites: 0,
        informacion: 0,
        reclamos: 0,
        asistencia: 0,
        servicios: 0,
        notas: 0,
        denuncias: 0,
        proyectos: 0,
        otros: 0
      },
      consultaMasFrecuente: '',

      tramitesIngresados: 0,
      tramitesResueltos: 0,
      tramitesPendientes: 0,
      tramitesDerivados: 0,
      tramitesSecretariaGeneral: 0,
      tramitesAtrasados: 0,
      causasPrincipalesAtraso: '',

      diaMayorDemanda: 'Lunes',
      horarioPico: '08:00 - 11:30 hs',
      recordDiario: 0,
      tendenciaAnual: 'Estable',

      suficienciaPersonal: 'Suficiente',
      suficienciaEspacio: 'Suficiente',
      suficienciaEquipamiento: 'Suficiente',
      suficienciaSistemas: 'Suficiente',
      recursosUrgentes: [],
      detalleRecursos: '',

      problemaDescripcion: '',
      intervencionSecretariaGeneral: '',
      nivelPrioridad: 'SEGUIMIENTO',
      estadoDecision: 'Pendiente',

      logrosPeriodo: '',
      problemasPrincipales: '',
      propuestasMejora: '',
    };
  });

  // Si cambia areaSeleccionadaInicial desde el exterior
  useEffect(() => {
    if (areaSeleccionadaInicial && !reporteParaEditar) {
      handleAreaChange(areaSeleccionadaInicial);
    }
  }, [areaSeleccionadaInicial]);

  const handleAreaChange = (nombre: string) => {
    const areaEncontrada = areasDisponibles.find(a => a.nombre === nombre);
    if (areaEncontrada) {
      setFormData(prev => ({
        ...prev,
        nombreArea: nombre,
        responsable: areaEncontrada.responsableDefault || prev.responsable || '',
        cargoResponsable: areaEncontrada.cargoDefault || prev.cargoResponsable || '',
        empleados: areaEncontrada.empleadosDefault || prev.empleados || 5,
        horarioAtencion: areaEncontrada.horarioDefault || prev.horarioAtencion || '07:00 a 13:00 hs',
        telefonoInterno: areaEncontrada.telefonoDefault || prev.telefonoInterno || 'Int. 100',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        nombreArea: nombre
      }));
    }
  };

  // Calculo en tiempo real de totales
  const totalCanales = (formData.atendidosPresencial || 0) +
    (formData.atendidosTelefonica || 0) +
    (formData.atendidosWhatsapp || 0) +
    (formData.atendidosRedesSociales || 0) +
    (formData.atendidosOtros || 0);

  const totalDias = ((formData.desgloseDiario?.lunes || 0) +
    (formData.desgloseDiario?.martes || 0) +
    (formData.desgloseDiario?.miercoles || 0) +
    (formData.desgloseDiario?.jueves || 0) +
    (formData.desgloseDiario?.viernes || 0));

  const tasaResolucionCalc = (formData.tramitesIngresados || 0) > 0 
    ? (((formData.tramitesResueltos || 0) / (formData.tramitesIngresados || 1)) * 100).toFixed(1)
    : '0';

  const tasaAtrasoCalc = (formData.tramitesIngresados || 0) > 0
    ? (((formData.tramitesAtrasados || 0) / (formData.tramitesIngresados || 1)) * 100).toFixed(1)
    : '0';

  const toggleRecursoUrgente = (recurso: string) => {
    const list = formData.recursosUrgentes || [];
    if (list.includes(recurso)) {
      setFormData({ ...formData, recursosUrgentes: list.filter(r => r !== recurso) });
    } else {
      setFormData({ ...formData, recursosUrgentes: [...list, recurso] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const indicadores = calcularIndicadoresReporte({
      ...formData,
      totalAtendidos: totalCanales || totalDias,
    });

    const reportCompleto: AreaReport = {
      id: formData.id || `rep-${Date.now()}`,
      periodo: formData.periodo || periodoActivo,
      fechaRegistro: formData.fechaRegistro || new Date().toISOString().split('T')[0],
      nombreArea: formData.nombreArea || AREAS_PREDEFINIDAS[0],
      responsable: formData.responsable || 'Responsable de Área',
      cargoResponsable: formData.cargoResponsable || 'Funcionario Municipal',
      empleados: Number(formData.empleados) || 1,
      horarioAtencion: formData.horarioAtencion || '07:00 a 13:00 hs',
      telefonoInterno: formData.telefonoInterno || 'Int. 100',

      atendidosPresencial: Number(formData.atendidosPresencial) || 0,
      atendidosTelefonica: Number(formData.atendidosTelefonica) || 0,
      atendidosWhatsapp: Number(formData.atendidosWhatsapp) || 0,
      atendidosRedesSociales: Number(formData.atendidosRedesSociales) || 0,
      atendidosOtros: Number(formData.atendidosOtros) || 0,
      totalAtendidos: totalCanales || totalDias,
      desgloseDiario: formData.desgloseDiario || { lunes: 0, martes: 0, miercoles: 0, jueves: 0, viernes: 0 },

      motivos: formData.motivos || {
        tramites: 0, informacion: 0, reclamos: 0, asistencia: 0, servicios: 0, notas: 0, denuncias: 0, proyectos: 0, otros: 0
      },
      consultaMasFrecuente: formData.consultaMasFrecuente || 'Sin registrar',

      tramitesIngresados: Number(formData.tramitesIngresados) || 0,
      tramitesResueltos: Number(formData.tramitesResueltos) || 0,
      tramitesPendientes: Number(formData.tramitesPendientes) || 0,
      tramitesDerivados: Number(formData.tramitesDerivados) || 0,
      tramitesSecretariaGeneral: Number(formData.tramitesSecretariaGeneral) || 0,
      tramitesAtrasados: Number(formData.tramitesAtrasados) || 0,
      causasPrincipalesAtraso: formData.causasPrincipalesAtraso || '',

      diaMayorDemanda: formData.diaMayorDemanda || 'Lunes',
      horarioPico: formData.horarioPico || '08:00 - 11:30 hs',
      recordDiario: Number(formData.recordDiario) || 0,
      tendenciaAnual: formData.tendenciaAnual || 'Estable',

      suficienciaPersonal: formData.suficienciaPersonal || 'Suficiente',
      suficienciaEspacio: formData.suficienciaEspacio || 'Suficiente',
      suficienciaEquipamiento: formData.suficienciaEquipamiento || 'Suficiente',
      suficienciaSistemas: formData.suficienciaSistemas || 'Suficiente',
      recursosUrgentes: formData.recursosUrgentes || [],
      detalleRecursos: formData.detalleRecursos || '',

      problemaDescripcion: formData.problemaDescripcion || '',
      intervencionSecretariaGeneral: formData.intervencionSecretariaGeneral || '',
      nivelPrioridad: formData.nivelPrioridad || 'SEGUIMIENTO',
      estadoDecision: formData.estadoDecision || 'Pendiente',

      logrosPeriodo: formData.logrosPeriodo || '',
      problemasPrincipales: formData.problemasPrincipales || '',
      propuestasMejora: formData.propuestasMejora || '',

      indicadores
    };

    onSaveReport(reportCompleto);
    setMensajeGuardado(true);
    setTimeout(() => setMensajeGuardado(false), 3000);
  };

  const pasos = [
    { num: 1, title: '1. Identificación', icon: Building2 },
    { num: 2, title: '2. Atención Vecinal', icon: Users },
    { num: 3, title: '3. Motivos & Consultas', icon: MessageSquare },
    { num: 4, title: '4. Trámites & Plazos', icon: Clock },
    { num: 5, title: '5. Demanda Semanal', icon: Clock },
    { num: 6, title: '6. Capacidad & Recursos', icon: ShieldAlert },
    { num: 7, title: '7. Problemas & Decisión SG', icon: ShieldAlert },
    { num: 8, title: '8. Información Ejecutiva', icon: Sparkles },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            <span>Formulario Único de Carga Municipal</span>
            <span>·</span>
            <span>Itá Ibaté</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {reporteParaEditar ? `Editar Reporte: ${formData.nombreArea}` : 'Registro Periódico de Área Municipal'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Período: <strong className="text-slate-700">{periodoActivo}</strong>. Complete las 8 secciones para consolidar métricas operativas.
          </p>
        </div>

        {/* Indicador de cálculo en vivo */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg self-start md:self-auto text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Atendidos</span>
            <span className="font-bold text-slate-900 font-mono text-sm">{totalCanales}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Tasa Resolución</span>
            <span className="font-bold text-emerald-700 font-mono text-sm">{tasaResolucionCalc}%</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Tasa Atraso</span>
            <span className="font-bold text-rose-700 font-mono text-sm">{tasaAtrasoCalc}%</span>
          </div>
        </div>
      </div>

      {/* Selector de Pasos */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-slate-100">
        {pasos.map((p) => {
          const Icon = p.icon;
          const isActive = pasoActivo === p.num;
          return (
            <button
              key={p.num}
              type="button"
              onClick={() => setPasoActivo(p.num)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{p.title}</span>
            </button>
          );
        })}
      </div>

      {mensajeGuardado && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>¡Reporte del área guardado exitosamente en el sistema consolidado de Itá Ibaté!</span>
        </div>
      )}

      {/* Formulario Body */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* SECCIÓN 1: Identificación del Área */}
        {pasoActivo === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>1. Identificación de la Dependencia Municipal</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Nombre del Área / Dependencia *
                  </label>
                  {onOpenGestionAreas && (
                    <button
                      type="button"
                      onClick={onOpenGestionAreas}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center gap-1"
                      title="Agregar nueva secretaría o dirección, o modificar las existentes"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Administrar Dependencias</span>
                    </button>
                  )}
                </div>
                <select
                  value={formData.nombreArea}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                >
                  {areasDisponibles.length > 0 ? (
                    areasDisponibles.filter(a => a.activo).map((a) => (
                      <option key={a.id} value={a.nombre}>
                        [{a.tipo}] {a.nombre}
                      </option>
                    ))
                  ) : (
                    AREAS_PREDEFINIDAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))
                  )}
                  <option value="Otra Área Municipal">Otra Dependencia Municipal...</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Responsable / Titular a Cargo *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lic. Carmen Almirón"
                  value={formData.responsable || ''}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cargo Institucional
                </label>
                <input
                  type="text"
                  placeholder="Ej: Directora de Acción Social"
                  value={formData.cargoResponsable || ''}
                  onChange={(e) => setFormData({ ...formData, cargoResponsable: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cantidad de Empleados *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.empleados || 1}
                    onChange={(e) => setFormData({ ...formData, empleados: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono / Interno
                  </label>
                  <input
                    type="text"
                    value={formData.telefonoInterno || ''}
                    onChange={(e) => setFormData({ ...formData, telefonoInterno: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Int. 104"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Horarios de Atención y Modalidad Operativa
                </label>
                <input
                  type="text"
                  placeholder="Ej: 07:00 a 13:00 hs (Guardias los fines de semana)"
                  value={formData.horarioAtencion || ''}
                  onChange={(e) => setFormData({ ...formData, horarioAtencion: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: Cantidad de Personas Atendidas */}
        {pasoActivo === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>2. Cantidad de Personas Atendidas (Por Canal y Por Día)</span>
            </h3>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs font-bold text-slate-800 block mb-2">Desglose por Canal de Atención</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Presencial (Ventanilla)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.atendidosPresencial || 0}
                    onChange={(e) => setFormData({ ...formData, atendidosPresencial: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Telefónica</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.atendidosTelefonica || 0}
                    onChange={(e) => setFormData({ ...formData, atendidosTelefonica: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">WhatsApp Municipal</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.atendidosWhatsapp || 0}
                    onChange={(e) => setFormData({ ...formData, atendidosWhatsapp: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Redes Sociales</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.atendidosRedesSociales || 0}
                    onChange={(e) => setFormData({ ...formData, atendidosRedesSociales: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Otros Canales</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.atendidosOtros || 0}
                    onChange={(e) => setFormData({ ...formData, atendidosOtros: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>
              <div className="mt-2 text-right text-xs font-semibold text-slate-700">
                Suma por canales: <span className="font-mono text-emerald-800 font-bold">{totalCanales}</span> vecinos
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs font-bold text-slate-800 block mb-2">Desglose Diario (Lunes a Viernes)</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].map((dia) => (
                  <div key={dia}>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1 capitalize">{dia}</label>
                    <input
                      type="number"
                      min="0"
                      value={(formData.desgloseDiario as any)?.[dia] || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setFormData({
                          ...formData,
                          desgloseDiario: {
                            ...(formData.desgloseDiario || { lunes: 0, martes: 0, miercoles: 0, jueves: 0, viernes: 0 }),
                            [dia]: val
                          }
                        });
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right text-xs font-semibold text-slate-700">
                Suma semanal por días: <span className="font-mono text-emerald-800 font-bold">{totalDias}</span> vecinos
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: Motivo de la Atención */}
        {pasoActivo === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>3. Motivo de la Atención y Consultas Frecuentes</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { key: 'tramites', label: 'Trámites / Expedientes' },
                { key: 'informacion', label: 'Información / Orientación' },
                { key: 'reclamos', label: 'Reclamos Vecinales' },
                { key: 'asistencia', label: 'Asistencia Social / Salud' },
                { key: 'servicios', label: 'Servicios Municipales' },
                { key: 'notas', label: 'Notas Formales Recibidas' },
                { key: 'denuncias', label: 'Denuncias' },
                { key: 'proyectos', label: 'Proyectos / Audiencias' },
              ].map((m) => (
                <div key={m.key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">{m.label}</label>
                  <input
                    type="number"
                    min="0"
                    value={(formData.motivos as any)?.[m.key] || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        motivos: {
                          ...(formData.motivos || { tramites: 0, informacion: 0, reclamos: 0, asistencia: 0, servicios: 0, notas: 0, denuncias: 0, proyectos: 0, otros: 0 }),
                          [m.key]: val
                        }
                      });
                    }}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consulta Más Frecuente del Período *
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Solicitud de renovación de licencias de conducir para transporte pesado y dudas sobre la nueva ordenanza de habilitaciones comerciales..."
                value={formData.consultaMasFrecuente || ''}
                onChange={(e) => setFormData({ ...formData, consultaMasFrecuente: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* SECCIÓN 4: Trámites y Respuesta */}
        {pasoActivo === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>4. Flujo de Trámites, Resoluciones y Atrasos</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Ingresados *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.tramitesIngresados || 0}
                  onChange={(e) => setFormData({ ...formData, tramitesIngresados: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono font-bold"
                  required
                />
              </div>

              <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
                <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Resueltos *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.tramitesResueltos || 0}
                  onChange={(e) => setFormData({ ...formData, tramitesResueltos: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-emerald-300 rounded text-xs font-mono text-emerald-800 font-bold"
                  required
                />
              </div>

              <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">Pendientes</label>
                <input
                  type="number"
                  min="0"
                  value={formData.tramitesPendientes || 0}
                  onChange={(e) => setFormData({ ...formData, tramitesPendientes: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-amber-300 rounded text-xs font-mono text-amber-800 font-bold"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Derivados</label>
                <input
                  type="number"
                  min="0"
                  value={formData.tramitesDerivados || 0}
                  onChange={(e) => setFormData({ ...formData, tramitesDerivados: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                />
              </div>

              <div className="bg-sky-50/50 p-2.5 rounded-lg border border-sky-200">
                <label className="block text-[11px] font-semibold text-sky-900 mb-1">A Secretaría General</label>
                <input
                  type="number"
                  min="0"
                  value={formData.tramitesSecretariaGeneral || 0}
                  onChange={(e) => setFormData({ ...formData, tramitesSecretariaGeneral: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-sky-300 rounded text-xs font-mono text-sky-800 font-bold"
                />
              </div>

              <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-200">
                <label className="block text-[11px] font-semibold text-rose-900 mb-1">Atrasados Críticos</label>
                <input
                  type="number"
                  min="0"
                  value={formData.tramitesAtrasados || 0}
                  onChange={(e) => setFormData({ ...formData, tramitesAtrasados: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-rose-300 rounded text-xs font-mono text-rose-800 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Causas Principales de Atraso o Cuellos de Botella
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Falta de conexión con el servidor provincial durante 48 hs, o falta de repuestos para maquinaria..."
                value={formData.causasPrincipalesAtraso || ''}
                onChange={(e) => setFormData({ ...formData, causasPrincipalesAtraso: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* SECCIÓN 5: Demanda de Trabajo */}
        {pasoActivo === 5 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>5. Patrones de Demanda y Horarios Pico</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Día de Mayor Demanda</label>
                <select
                  value={formData.diaMayorDemanda}
                  onChange={(e) => setFormData({ ...formData, diaMayorDemanda: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Horario Pico</label>
                <input
                  type="text"
                  placeholder="08:00 - 11:30 hs"
                  value={formData.horarioPico || ''}
                  onChange={(e) => setFormData({ ...formData, horarioPico: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Récord Diario de Vecinos</label>
                <input
                  type="number"
                  min="0"
                  value={formData.recordDiario || 0}
                  onChange={(e) => setFormData({ ...formData, recordDiario: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tendencia Anual</label>
                <select
                  value={formData.tendenciaAnual}
                  onChange={(e) => setFormData({ ...formData, tendenciaAnual: e.target.value as Tendencia })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  <option value="En Alza">En Alza (Crecimiento sostenido)</option>
                  <option value="Estable">Estable</option>
                  <option value="En Baja">En Baja</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 6: Capacidad y Necesidades */}
        {pasoActivo === 6 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              <span>6. Capacidad Operativa y Recursos Urgentes Requeridos</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'suficienciaPersonal', label: 'Personal Asignado' },
                { key: 'suficienciaEspacio', label: 'Espacio Físico' },
                { key: 'suficienciaEquipamiento', label: 'Equipamiento' },
                { key: 'suficienciaSistemas', label: 'Sistemas / Conectividad' },
              ].map((s) => (
                <div key={s.key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">{s.label}</label>
                  <select
                    value={(formData as any)[s.key]}
                    onChange={(e) => setFormData({ ...formData, [s.key]: e.target.value as Suficiencia })}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    <option value="Suficiente">Suficiente</option>
                    <option value="Parcial">Parcial / Ajustado</option>
                    <option value="Insuficiente">Insuficiente / Crítico</option>
                  </select>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Selección de Recursos Requeridos con Urgencia (Impacta en Detección Transversal):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {RECURSOS_OPCIONES.map((rec) => {
                  const isChecked = (formData.recursosUrgentes || []).includes(rec);
                  return (
                    <label
                      key={rec}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-medium'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRecursoUrgente(rec)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{rec}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detalle y Justificación de los Recursos Solicitados
              </label>
              <textarea
                rows={2}
                placeholder="Describa marca, modelo, urgencia, si afecta a otras áreas o si es compra directa..."
                value={formData.detalleRecursos || ''}
                onChange={(e) => setFormData({ ...formData, detalleRecursos: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* SECCIÓN 7: Problemas que Requieren Decisión */}
        {pasoActivo === 7 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              <span>7. Problemas que Requieren Decisión y Semáforo Operativo</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nivel de Prioridad del Área (Semáforo Operativo) *
                </label>
                <select
                  value={formData.nivelPrioridad}
                  onChange={(e) => setFormData({ ...formData, nivelPrioridad: e.target.value as NivelSemaforo })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="URGENTE" className="text-rose-700">🔴 URGENTE: Intervención o decisión inmediata (&lt; 48 hs)</option>
                  <option value="IMPORTANTE" className="text-amber-700">🟠 IMPORTANTE: Atención prioritaria sin inmediatez absoluta</option>
                  <option value="SEGUIMIENTO" className="text-sky-700">🔵 SEGUIMIENTO: Situación controlada bajo monitoreo regular</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estado de la Decisión en Secretaría General
                </label>
                <select
                  value={formData.estadoDecision}
                  onChange={(e) => setFormData({ ...formData, estadoDecision: e.target.value as EstadoDecision })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  <option value="Pendiente">Pendiente de Revisión</option>
                  <option value="En Análisis">En Análisis Técnico/Jurídico</option>
                  <option value="Aprobado">Aprobado / Resolución Emitida</option>
                  <option value="Derivado a Intendencia">Elevado al Intendente Municipal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción del Problema o Traba Operativa *
              </label>
              <textarea
                rows={2}
                placeholder="Describa el conflicto que excede la autoridad directa de la dirección..."
                value={formData.problemaDescripcion || ''}
                onChange={(e) => setFormData({ ...formData, problemaDescripcion: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Intervención Requerida a Secretaría General *
              </label>
              <textarea
                rows={2}
                placeholder="Qué acto administrativo se solicita: Resolución de compra, circular unificatoria, mediación con otra área, etc."
                value={formData.intervencionSecretariaGeneral || ''}
                onChange={(e) => setFormData({ ...formData, intervencionSecretariaGeneral: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* SECCIÓN 8: Información Ejecutiva */}
        {pasoActivo === 8 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>8. Información Ejecutiva (Balance del Período)</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Logros Destacados del Período
              </label>
              <textarea
                rows={2}
                placeholder="Hitos cumplidos, metros pavimentados, licencias entregadas, cursos concluidos..."
                value={formData.logrosPeriodo || ''}
                onChange={(e) => setFormData({ ...formData, logrosPeriodo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Problemas Principales Experimentados
              </label>
              <textarea
                rows={2}
                placeholder="Dificultades internas o con vecinos durante la semana..."
                value={formData.problemasPrincipales || ''}
                onChange={(e) => setFormData({ ...formData, problemasPrincipales: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Propuestas de Mejora Continua
              </label>
              <textarea
                rows={2}
                placeholder="Ideas del personal para agilizar la gestión o reducir costos..."
                value={formData.propuestasMejora || ''}
                onChange={(e) => setFormData({ ...formData, propuestasMejora: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Botones de Navegación del Wizard & Guardado */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setPasoActivo(Math.max(1, pasoActivo - 1))}
            disabled={pasoActivo === 1}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Paso Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            {pasoActivo < 8 ? (
              <button
                type="button"
                onClick={() => setPasoActivo(Math.min(8, pasoActivo + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer transition-colors shadow-xs"
              >
                <span>Siguiente Paso</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Guardar en el Consolidado Municipal</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
