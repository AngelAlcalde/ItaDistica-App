import React, { useState } from 'react';
import { AreaReport } from '../types/municipal';
import { Clock, AlertOctagon, CheckCircle2, Search, Filter, AlertTriangle, ArrowRight } from 'lucide-react';

interface TramitesPendientesViewProps {
  reportes: AreaReport[];
}

export const TramitesPendientesView: React.FC<TramitesPendientesViewProps> = ({ reportes }) => {
  const [filtroArea, setFiltroArea] = useState<string>('TODAS');
  const [soloAtrasados, setSoloAtrasados] = useState<boolean>(false);

  const reportesFiltrados = reportes.filter((r) => {
    if (filtroArea !== 'TODAS' && r.nombreArea !== filtroArea) return false;
    if (soloAtrasados && r.tramitesAtrasados === 0) return false;
    return true;
  });

  const totalIngresados = reportes.reduce((acc, r) => acc + r.tramitesIngresados, 0);
  const totalResueltos = reportes.reduce((acc, r) => acc + r.tramitesResueltos, 0);
  const totalPendientes = reportes.reduce((acc, r) => acc + r.tramitesPendientes, 0);
  const totalAtrasados = reportes.reduce((acc, r) => acc + r.tramitesAtrasados, 0);
  const totalSecretariaGeneral = reportes.reduce((acc, r) => acc + (r.tramitesSecretariaGeneral || 0), 0);

  if (reportes.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Sin Trámites ni Expedientes Registrados
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          El sistema se encuentra en blanco para este período. Cuando las Secretarías y Direcciones completen sus reportes semanales, este módulo consolidará automáticamente el volumen de trámites resueltos, los expedientes pendientes y el análisis de demoras administrativas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen Superior */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
              <Clock className="w-4 h-4" />
              <span>Flujo de Trámites y Cuellos de Botella</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Control de Expedientes, Resoluciones y Atrasos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Supervisión de plazos administrativos, expedientes derivados y causas de demora reportadas por cada dirección de Itá Ibaté.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filtroArea}
              onChange={(e) => setFiltroArea(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white"
            >
              <option value="TODAS">Todas las Dependencias</option>
              {reportes.map((r) => (
                <option key={r.id} value={r.nombreArea}>{r.nombreArea}</option>
              ))}
            </select>

            <button
              onClick={() => setSoloAtrasados(!soloAtrasados)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                soloAtrasados 
                  ? 'bg-rose-700 text-white border-rose-700' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {soloAtrasados ? 'Mostrando Solo Atrasados' : 'Filtrar Solo Atrasados'}
            </button>
          </div>
        </div>

        {/* 4 Métricas de Flujo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block">Total Ingresos</span>
            <span className="text-xl font-bold font-mono text-slate-900">{totalIngresados}</span>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-center">
            <span className="text-[11px] font-semibold uppercase text-emerald-800 block">Resueltos</span>
            <span className="text-xl font-bold font-mono text-emerald-800">{totalResueltos}</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              {((totalResueltos / Math.max(1, totalIngresados)) * 100).toFixed(1)}% tasa global
            </span>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 text-center">
            <span className="text-[11px] font-semibold uppercase text-amber-800 block">Pendientes en Curso</span>
            <span className="text-xl font-bold font-mono text-amber-800">{totalPendientes}</span>
            <span className="text-[10px] text-amber-600 block mt-0.5">Dentro de término</span>
          </div>

          <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-200 text-center">
            <span className="text-[11px] font-semibold uppercase text-rose-800 block">Atrasados Críticos</span>
            <span className="text-xl font-bold font-mono text-rose-800">{totalAtrasados}</span>
            <span className="text-[10px] text-rose-600 block mt-0.5">
              {((totalAtrasados / Math.max(1, totalIngresados)) * 100).toFixed(1)}% tasa atraso
            </span>
          </div>
        </div>
      </div>

      {/* Tabla Detallada por Dependencia */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Detalle por Dependencia y Análisis de Demoras
          </h3>
          <span className="text-xs text-slate-500">
            {reportesFiltrados.length} áreas listadas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Dependencia</th>
                <th className="py-2.5 px-3 text-center">Ingresados</th>
                <th className="py-2.5 px-3 text-center">Resueltos</th>
                <th className="py-2.5 px-3 text-center">Pendientes</th>
                <th className="py-2.5 px-3 text-center">Derivados</th>
                <th className="py-2.5 px-3 text-center">A Sec. Gral</th>
                <th className="py-2.5 px-3 text-center">Atrasados</th>
                <th className="py-2.5 px-3">Causas Principales de Atraso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportesFiltrados.map((rep) => {
                const esCritico = rep.tramitesAtrasados > 10;
                return (
                  <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{rep.nombreArea}</span>
                      <span className="text-slate-500 text-[11px]">{rep.responsable}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                      {rep.tramitesIngresados}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/30">
                      {rep.tramitesResueltos}
                      <span className="block text-[10px] text-emerald-600 font-normal">
                        {rep.indicadores.tasaResolucionPct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-700 bg-amber-50/30">
                      {rep.tramitesPendientes}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">
                      {rep.tramitesDerivados}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-sky-700 bg-sky-50/30">
                      {rep.tramitesSecretariaGeneral}
                    </td>
                    <td className={`py-3 px-3 text-center font-mono font-bold ${esCritico ? 'text-rose-700 bg-rose-50' : 'text-slate-700'}`}>
                      {rep.tramitesAtrasados}
                      {rep.tramitesAtrasados > 0 && (
                        <span className="block text-[10px] text-rose-600 font-normal">
                          {rep.indicadores.tasaAtrasoPct}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-xs">
                      {rep.causasPrincipalesAtraso ? (
                        <span className="line-clamp-2 italic text-slate-600">
                          {rep.causasPrincipalesAtraso}
                        </span>
                      ) : (
                        <span className="text-slate-400">Sin atrasos reportados.</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
