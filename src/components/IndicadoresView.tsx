import React from 'react';
import { AreaReport, MetricasGlobales } from '../types/municipal';
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock, AlertOctagon, HelpCircle } from 'lucide-react';

interface IndicadoresViewProps {
  reportes: AreaReport[];
  metricas: MetricasGlobales;
}

export const IndicadoresView: React.FC<IndicadoresViewProps> = ({ reportes, metricas }) => {
  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Métricas de Rendimiento y Carga Laboral</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Tablero Analítico de Indicadores Municipales
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
          Cálculo automatizado de ratios clave para la toma de decisiones: demanda por agente, eficiencia resolutiva de trámites, índice de retraso administrativo y demanda promedio semanal.
        </p>

        {/* 4 Cards de Promedios Globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Atendidos por Empleado (Global)</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {metricas.promedioAtendidosPorEmpleado}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">vecinos / agente</span>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Tasa Global de Resolución</span>
            <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
              {metricas.porcentajeResolucion}%
            </div>
            <span className="text-[10px] text-emerald-600 block mt-0.5">trámites resueltos</span>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-[11px] font-semibold text-amber-800 uppercase block">Tasa de Trámites en Curso</span>
            <div className="text-2xl font-bold font-mono text-amber-800 mt-1">
              {metricas.porcentajePendiente}%
            </div>
            <span className="text-[10px] text-amber-600 block mt-0.5">en tiempo reglamentario</span>
          </div>

          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-center">
            <span className="text-[11px] font-semibold text-rose-800 uppercase block">Tasa de Atraso Crítico</span>
            <div className="text-2xl font-bold font-mono text-rose-800 mt-1">
              {metricas.porcentajeAtraso}%
            </div>
            <span className="text-[10px] text-rose-600 block mt-0.5">fuera de plazo legal</span>
          </div>
        </div>
      </div>

      {/* Tabla Completa de Indicadores */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Matriz de Indicadores por Dependencia (Itá Ibaté)
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {reportes.length} dependencias relevadas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Dependencia</th>
                <th className="py-2.5 px-3 text-center">Empleados</th>
                <th className="py-2.5 px-3 text-center">Atendidos</th>
                <th className="py-2.5 px-3 text-center bg-emerald-50/60 text-emerald-900">
                  Vecinos / Empleado
                </th>
                <th className="py-2.5 px-3 text-center">Trámites Ingresados</th>
                <th className="py-2.5 px-3 text-center bg-emerald-50/60 text-emerald-900">
                  % Resolución
                </th>
                <th className="py-2.5 px-3 text-center bg-amber-50/60 text-amber-900">
                  % Pendientes
                </th>
                <th className="py-2.5 px-3 text-center bg-rose-50/60 text-rose-900">
                  % Atraso
                </th>
                <th className="py-2.5 px-3 text-center">
                  Demanda Prom. Diaria
                </th>
                <th className="py-2.5 px-3 text-center">
                  Semáforo Operativo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportes.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 text-xs">
                    No hay dependencias registradas en este período para calcular indicadores. Complete el Formulario Único para visualizar la comparativa analítica.
                  </td>
                </tr>
              ) : (
                reportes.map((rep) => {
                  const ind = rep.indicadores;
                  const isUrgente = ind.semaforoOperativo === 'URGENTE';
                  const isImportante = ind.semaforoOperativo === 'IMPORTANTE';

                  return (
                    <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{rep.nombreArea}</span>
                        <span className="text-slate-500 text-[11px]">{rep.responsable}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-700">
                        {rep.empleados}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-800 font-bold">
                        {rep.totalAtendidos}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-800 bg-emerald-50/20">
                        {ind.atendidosPorEmpleado}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-700">
                        {rep.tramitesIngresados}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/20">
                        {ind.tasaResolucionPct}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-700 bg-amber-50/20">
                        {ind.tasaPendientesPct}%
                      </td>
                      <td className={`py-3 px-3 text-center font-mono font-bold ${ind.tasaAtrasoPct >= 15 ? 'text-rose-700 bg-rose-50/50' : 'text-slate-700'}`}>
                        {ind.tasaAtrasoPct}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                        {ind.demandaPromedioDiaria}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isUrgente
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : isImportante
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}>
                          {isUrgente ? '🔴 URGENTE' : isImportante ? '🟠 IMPORTANTE' : '🔵 SEGUIMIENTO'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explicación de Fórmulas */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Fórmulas Matemáticas y Criterios de Semaforización</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <strong className="text-slate-800 block mb-1">Tasa de Resolución:</strong>
            <code>(Trámites Resueltos / Trámites Ingresados) × 100</code>
            <p className="mt-1 text-[11px] text-slate-500">Mide la eficacia de respuesta del área en el lapso semanal.</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <strong className="text-slate-800 block mb-1">Tasa de Atraso Crítico:</strong>
            <code>(Trámites Atrasados / Trámites Ingresados) × 100</code>
            <p className="mt-1 text-[11px] text-slate-500">Si supera el 30% o suma &gt; 15 trámites, activa automáticamente el Semáforo Rojo.</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <strong className="text-slate-800 block mb-1">Demanda Promedio Diaria:</strong>
            <code>(Lunes + Martes + Miércoles + Jueves + Viernes) / 5</code>
            <p className="mt-1 text-[11px] text-slate-500">Volumen medio diario de atención al vecino para dimensionar guardias y cajas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
