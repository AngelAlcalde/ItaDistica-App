import React, { useState } from 'react';
import { AreaReport, EstadoDecision, NivelSemaforo } from '../types/municipal';
import { Scale, CheckCircle2, Clock, AlertTriangle, Send, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface RecursosDecisionesViewProps {
  reportes: AreaReport[];
  onUpdateReport: (rep: AreaReport) => void;
}

export const RecursosDecisionesView: React.FC<RecursosDecisionesViewProps> = ({
  reportes,
  onUpdateReport
}) => {
  const [filtroSemaforo, setFiltroSemaforo] = useState<'TODOS' | NivelSemaforo>('TODOS');

  const reportesFiltrados = reportes.filter((r) => {
    if (!r.problemaDescripcion && (!r.recursosUrgentes || r.recursosUrgentes.length === 0)) return false;
    if (filtroSemaforo !== 'TODOS' && r.nivelPrioridad !== filtroSemaforo) return false;
    return true;
  });

  const cambiarEstado = (rep: AreaReport, nuevoEstado: EstadoDecision) => {
    const actualizado = {
      ...rep,
      estadoDecision: nuevoEstado
    };
    onUpdateReport(actualizado);
  };

  if (reportes.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Scale className="w-7 h-7 text-rose-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Bandeja de Decisiones Vacía
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          No existen solicitudes de intervención ni reclamos de recursos urgentes cargados por las dependencias municipales en este período. A medida que las áreas completen su Formulario Único, aquí se gestionarán los dictámenes y semáforos de prioridad.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-1">
              <Scale className="w-4 h-4" />
              <span>Despacho de Secretaría General</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Recursos y Decisiones Requeridas a Secretaría General
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Bandeja de decisiones estratégicas, autorizaciones presupuestarias de emergencia y compras directas elevadas por los directores y coordinadores de Itá Ibaté.
            </p>
          </div>

          {/* Filtro Semáforo */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filtrar:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(['TODOS', 'URGENTE', 'IMPORTANTE', 'SEGUIMIENTO'] as const).map((sem) => (
                <button
                  key={sem}
                  onClick={() => setFiltroSemaforo(sem)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    filtroSemaforo === sem
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sem === 'TODOS' ? 'Todos' : sem === 'URGENTE' ? '🔴 Urgente' : sem === 'IMPORTANTE' ? '🟠 Importante' : '🔵 Seguimiento'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen de Estado */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Casos en Mesa</span>
            <span className="text-lg font-bold font-mono text-slate-900">{reportes.length}</span>
          </div>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-center">
            <span className="text-[11px] font-semibold text-rose-700 uppercase block">Pendientes de Firma</span>
            <span className="text-lg font-bold font-mono text-rose-800">
              {reportes.filter(r => r.estadoDecision === 'Pendiente').length}
            </span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <span className="text-[11px] font-semibold text-amber-700 uppercase block">En Análisis Técnico</span>
            <span className="text-lg font-bold font-mono text-amber-800">
              {reportes.filter(r => r.estadoDecision === 'En Análisis').length}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Aprobados / Con Resolución</span>
            <span className="text-lg font-bold font-mono text-emerald-800">
              {reportes.filter(r => r.estadoDecision === 'Aprobado').length}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Decisiones */}
      <div className="space-y-4">
        {reportesFiltrados.map((rep) => {
          const isUrgente = rep.nivelPrioridad === 'URGENTE';
          const isImportante = rep.nivelPrioridad === 'IMPORTANTE';

          return (
            <div
              key={rep.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-shadow hover:shadow-md ${
                isUrgente ? 'border-rose-300' : isImportante ? 'border-amber-300' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{rep.nombreArea}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-medium">{rep.responsable}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Problema Planteado:
                  </h3>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    {rep.problemaDescripcion || 'Sin descripción detallada de problema.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start shrink-0">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    isUrgente
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : isImportante
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-sky-100 text-sky-800 border-sky-200'
                  }`}>
                    {isUrgente ? '🔴 URGENTE' : isImportante ? '🟠 IMPORTANTE' : '🔵 SEGUIMIENTO'}
                  </span>
                </div>
              </div>

              {/* Intervención y Recursos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-1">
                    Intervención Solicitada al Secretario General:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {rep.intervencionSecretariaGeneral || 'No se especificó acción concreta.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-1">
                    Recursos Requeridos con Urgencia:
                  </span>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {rep.recursosUrgentes.map((rec, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] text-slate-700">
                        {rec}
                      </span>
                    ))}
                  </div>
                  {rep.detalleRecursos && (
                    <p className="text-[11px] text-slate-600 italic">
                      "{rep.detalleRecursos}"
                    </p>
                  )}
                </div>
              </div>

              {/* Estado de Decisión del Secretario General */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Estado del Trámite en Secretaría:</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    rep.estadoDecision === 'Aprobado' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : rep.estadoDecision === 'En Análisis'
                      ? 'bg-amber-100 text-amber-800'
                      : rep.estadoDecision === 'Derivado a Intendencia'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {rep.estadoDecision}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 mr-1">Cambiar resolución:</span>
                  {(['Pendiente', 'En Análisis', 'Aprobado', 'Derivado a Intendencia'] as const).map((estado) => (
                    <button
                      key={estado}
                      onClick={() => cambiarEstado(rep, estado)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
                        rep.estadoDecision === estado
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
