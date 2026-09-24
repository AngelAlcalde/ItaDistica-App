import React from 'react';
import { AreaReport, MetricasGlobales, AreaMunicipal } from '../types/municipal';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  ArrowUpRight, 
  FileText,
  TrendingUp,
  ShieldAlert,
  Plus,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

interface TableroGeneralProps {
  reportes: AreaReport[];
  metricas: MetricasGlobales;
  areas?: AreaMunicipal[];
  onSelectAreaParaEditar: (rep: AreaReport) => void;
  onNavigateToForm: (areaName?: string) => void;
  onNavigateToAreas?: () => void;
  onCargarDatosDemo?: () => void;
  periodoActivo?: string;
}

export const TableroGeneral: React.FC<TableroGeneralProps> = ({
  reportes,
  metricas,
  areas = [],
  onSelectAreaParaEditar,
  onNavigateToForm,
  onNavigateToAreas,
  onCargarDatosDemo,
  periodoActivo = 'Período Activo'
}) => {
  const tieneReportes = reportes.length > 0;

  return (
    <div className="space-y-6">
      {/* 1. KPIs Globales en la cabecera */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Atendidos */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Atendidos Total</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {metricas.totalAtendidos.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Promedio: <span className="font-semibold text-slate-700">{metricas.promedioAtendidosPorEmpleado}</span> / emp.
          </div>
        </div>

        {/* Trámites Resueltos */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Resueltos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {metricas.tramitesResueltos}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tasa: <span className="font-semibold text-emerald-800">{metricas.porcentajeResolucion}%</span> del ingreso
          </div>
        </div>

        {/* Trámites Pendientes */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">En Trámite</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700">
            {metricas.tramitesPendientes}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tasa: <span className="font-semibold text-amber-800">{metricas.porcentajePendiente}%</span> en curso
          </div>
        </div>

        {/* Atrasados Críticos */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Atrasados</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700">
            {metricas.tramitesAtrasados}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tasa: <span className="font-semibold text-rose-800">{metricas.porcentajeAtraso}%</span> fuera de término
          </div>
        </div>

        {/* Trámites Remitidos a SG */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">A Sec. General</span>
            <ShieldAlert className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-800">
            {metricas.tramitesSecretariaGeneral}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Expedientes elevados
          </div>
        </div>

        {/* Semáforo Consolidado */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Semáforo Operativo</span>
            <span className="text-xs">🚦</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span title="Rojo Urgente" className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-xs">
              🔴 {metricas.alertasUrgentes}
            </span>
            <span title="Naranja Importante" className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-xs">
              🟠 {metricas.alertasImportantes}
            </span>
            <span title="Azul Seguimiento" className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-xs">
              🔵 {metricas.alertasSeguimiento}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5">
            {metricas.totalAreas} áreas relevadas
          </div>
        </div>
      </div>

      {/* Banner de Acción Rápida para Secretaría General cuando hay alertas */}
      {metricas.alertasUrgentes > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs uppercase font-bold tracking-wider text-rose-800">
                Alerta de Intervención Prioritaria:
              </strong>
              <p className="text-xs mt-0.5">
                Existen <strong className="font-bold">{metricas.alertasUrgentes} áreas en Semáforo Rojo</strong> que requieren resolución, compras de emergencia o dictamen de Secretaría General dentro de las próximas 48 horas.
              </p>
            </div>
          </div>
          <div className="text-xs text-rose-800 font-semibold self-end sm:self-auto shrink-0">
            Revisar Pestaña "Decisiones SG" →
          </div>
        </div>
      )}

      {/* ESTADO EN BLANCO: Si no hay reportes cargados aún */}
      {!tieneReportes && (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-8 sm:p-10 shadow-xs text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <ClipboardList className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Sistema en Blanco · Listo para la Carga Oficial
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No hay informes cargados para el período <strong className="text-slate-800">{periodoActivo}</strong>. Comience registrando las atenciones de cada Secretaría y Dirección a través del <strong className="text-emerald-700">Formulario Único</strong>, o configure las dependencias municipales.
            </p>
          </div>

          {/* Botones de Acción Inicial */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToForm()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Cargar Primer Informe de Área</span>
            </button>

            {onNavigateToAreas && (
              <button
                onClick={onNavigateToAreas}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-slate-300"
              >
                <Building2 className="w-4 h-4 text-slate-600" />
                <span>Gestionar Secretarías & Direcciones</span>
              </button>
            )}

            {onCargarDatosDemo && (
              <button
                onClick={onCargarDatosDemo}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-slate-200"
                title="Rellenar el tablero con datos reales de muestra de Itá Ibaté para evaluación"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Cargar Datos de Muestra (Demo)</span>
              </button>
            )}
          </div>

          {/* Checklist de Áreas Pendientes de Carga */}
          {areas.length > 0 && (
            <div className="pt-6 border-t border-slate-200 text-left max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Dependencias Municipales Registradas ({areas.filter(a => a.activo).length} activas)
                </span>
                <span className="text-xs text-amber-700 font-medium">Pendientes de entrega del período</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {areas.filter(a => a.activo).map((area) => (
                  <div
                    key={area.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-200 text-slate-700 shrink-0">
                          {area.tipo}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 leading-snug truncate">
                          {area.nombre}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {area.responsableDefault} ({area.cargoDefault})
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigateToForm(area.nombre)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-semibold shrink-0 cursor-pointer"
                    >
                      <span>Cargar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Comparativa por Área (Tarjetas Operativas cuando hay datos) */}
      {tieneReportes && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Desglose Operativo por Dependencia Municipal
              </h3>
              <p className="text-xs text-slate-500">
                Monitoreo comparativo de demanda vecinal, atrasos e intervenciones solicitadas a la Secretaría General.
              </p>
            </div>

            <button
              onClick={() => onNavigateToForm()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <span>+ Cargar / Actualizar Área</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportes.map((rep) => {
              const semaforo = rep.indicadores?.semaforoOperativo || 'SEGUIMIENTO';
              const semaforoColor = 
                semaforo === 'URGENTE' 
                  ? 'border-rose-300 bg-rose-50/20' 
                  : semaforo === 'IMPORTANTE' 
                  ? 'border-amber-300 bg-amber-50/20' 
                  : 'border-slate-200 bg-white';

              return (
                <div
                  key={rep.id}
                  className={`border rounded-xl p-4 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between ${semaforoColor}`}
                >
                  <div>
                    {/* Encabezado de la tarjeta */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200/80">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rep.telefonoInterno}</span>
                          <span>·</span>
                          <span>{rep.empleados} empleados</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {rep.nombreArea}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {rep.responsable} <span className="text-slate-400">({rep.cargoResponsable})</span>
                        </p>
                      </div>

                      <div className="shrink-0">
                        {semaforo === 'URGENTE' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            🔴 URGENTE
                          </span>
                        )}
                        {semaforo === 'IMPORTANTE' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            🟠 IMPORTANTE
                          </span>
                        )}
                        {semaforo === 'SEGUIMIENTO' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                            🔵 SEGUIMIENTO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Métricas clave del área */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-200/80 text-center">
                      <div>
                        <span className="block text-[10px] uppercase font-semibold text-slate-500">Atendidos</span>
                        <span className="text-sm font-bold font-mono text-slate-900">{rep.totalAtendidos}</span>
                        <span className="block text-[10px] text-slate-400">{rep.indicadores?.atendidosPorEmpleado || 0}/agente</span>
                      </div>

                      <div>
                        <span className="block text-[10px] uppercase font-semibold text-slate-500">% Resolución</span>
                        <span className="text-sm font-bold font-mono text-emerald-700">
                          {rep.indicadores?.tasaResolucionPct || 0}%
                        </span>
                        <span className="block text-[10px] text-slate-400">{rep.tramitesResueltos} de {rep.tramitesIngresados}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] uppercase font-semibold text-slate-500">Atrasados</span>
                        <span className={`text-sm font-bold font-mono ${rep.tramitesAtrasados > 10 ? 'text-rose-700' : 'text-slate-700'}`}>
                          {rep.tramitesAtrasados}
                        </span>
                        <span className="block text-[10px] text-slate-400">{rep.indicadores?.tasaAtrasoPct || 0}% atraso</span>
                      </div>
                    </div>

                    {/* Consulta más frecuente */}
                    <div className="py-2.5 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900 block text-[11px] mb-0.5">Demanda Principal:</span>
                      <p className="line-clamp-2 italic text-slate-600">
                        "{rep.consultaMasFrecuente || 'Sin detalle de demanda principal'}"
                      </p>
                    </div>

                    {/* Problema / Necesidad */}
                    {rep.problemaDescripcion && (
                      <div className="p-2.5 bg-slate-50 rounded-lg text-xs mt-1 border border-slate-200">
                        <span className="font-semibold text-slate-900 block text-[11px] mb-0.5">
                          Intervención Solicitada a Secretaría General:
                        </span>
                        <p className="text-slate-700 line-clamp-2">
                          {rep.intervencionSecretariaGeneral || rep.problemaDescripcion}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer de la tarjeta con botón de edición */}
                  <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      Día pico: <strong className="text-slate-700">{rep.diaMayorDemanda}</strong> ({rep.horarioPico})
                    </span>
                    <button
                      onClick={() => onSelectAreaParaEditar(rep)}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <span>Detalles / Editar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
