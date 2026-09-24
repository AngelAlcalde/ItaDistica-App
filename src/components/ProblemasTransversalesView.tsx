import React, { useState } from 'react';
import { AreaReport, ProblemaTransversal } from '../types/municipal';
import { 
  Network, 
  Layers, 
  Sparkles, 
  Car, 
  Laptop, 
  Building, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface ProblemasTransversalesViewProps {
  problemas: ProblemaTransversal[];
  reportes: AreaReport[];
}

export const ProblemasTransversalesView: React.FC<ProblemasTransversalesViewProps> = ({
  problemas: problemasIniciales,
  reportes
}) => {
  const [problemas, setProblemas] = useState<ProblemaTransversal[]>(problemasIniciales);
  const [isAnalizandoIA, setIsAnalizandoIA] = useState<boolean>(false);
  const [mensajeIA, setMensajeIA] = useState<string | null>(null);

  React.useEffect(() => {
    setProblemas(problemasIniciales);
  }, [problemasIniciales]);

  if (reportes.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <Network className="w-7 h-7 text-teal-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Sin Problemas Transversales Detectados
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Para que el motor algorítmico y la IA de Gemini agrupen demandas comunes (ej: solicitudes de vehículos, informática o reformas compartidas), es necesario registrar los informes de al menos dos dependencias municipales en el período activo.
        </p>
      </div>
    );
  }

  const ejecutarAnalisisTransversalIA = async () => {
    setIsAnalizandoIA(true);
    setMensajeIA(null);
    try {
      const response = await fetch('/api/ai/analisis-transversal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportes })
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.problemasTransversales) && data.problemasTransversales.length > 0) {
        setProblemas(data.problemasTransversales);
        setMensajeIA(`¡Análisis profundo con Gemini completado! Se consolidaron ${data.problemasTransversales.length} problemas transversales.`);
      } else {
        setMensajeIA('No se detectaron nuevos problemas adicionales fuera de los ya agrupados.');
      }
    } catch (err: any) {
      console.error('Error al analizar problemas con IA:', err);
      setMensajeIA('No se pudo conectar con el servidor de IA; mostrando detección algorítmica.');
    } finally {
      setIsAnalizandoIA(false);
    }
  };

  const getCategoriaIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('veh') || c.includes('móvil') || c.includes('automotor')) return Car;
    if (c.includes('tec') || c.includes('infor') || c.includes('conect')) return Laptop;
    if (c.includes('edific') || c.includes('espacio') || c.includes('infra')) return Building;
    if (c.includes('humano') || c.includes('personal') || c.includes('agente')) return Users;
    return Network;
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 mb-1">
              <Network className="w-4 h-4" />
              <span>Matriz de Coordinación Inter-Áreas</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Detección de Problemas y Necesidades Transversales
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
              Algoritmo de agrupamiento que identifica demandas idénticas o cuellos de botella compartidos entre 2 o más secretarías de Itá Ibaté, permitiendo a la Secretaría General resolver con compras unificadas o directivas compartidas en vez de parches aislados.
            </p>
          </div>

          <button
            onClick={ejecutarAnalisisTransversalIA}
            disabled={isAnalizandoIA}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-700 text-white rounded-lg text-xs font-semibold hover:bg-purple-800 disabled:opacity-50 cursor-pointer transition-colors shrink-0 shadow-xs"
          >
            {isAnalizandoIA ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analizando con IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Profundizar con IA (Gemini)</span>
              </>
            )}
          </button>
        </div>

        {mensajeIA && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{mensajeIA}</span>
          </div>
        )}
      </div>

      {/* Lista de Problemas Transversales Detectados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problemas.map((item, index) => {
          const Icon = getCategoriaIcon(item.categoria);
          const isUrgente = item.nivelUrgencia === 'URGENTE';
          const isImportante = item.nivelUrgencia === 'IMPORTANTE';

          return (
            <div
              key={item.id || index}
              className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
                isUrgente 
                  ? 'border-rose-300' 
                  : isImportante 
                  ? 'border-amber-300' 
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header de la tarjeta */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {item.categoria}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {item.titulo}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                    isUrgente 
                      ? 'bg-rose-50 text-rose-800 border-rose-200' 
                      : isImportante 
                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                      : 'bg-sky-50 text-sky-800 border-sky-200'
                  }`}>
                    {isUrgente ? '🔴 URGENTE' : isImportante ? '🟠 IMPORTANTE' : '🔵 SEGUIMIENTO'}
                  </span>
                </div>

                {/* Áreas afectadas */}
                <div className="py-2.5">
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Dependencias Municipales Coincidentes ({item.areasAfectadas.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.areasAfectadas.map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                <div className="py-2 text-xs text-slate-600 leading-relaxed">
                  {item.descripcion}
                </div>
              </div>

              {/* Acción Recomendada de Secretaría General */}
              <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-5 -mb-5 p-4 rounded-b-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block mb-1">
                  Acción Centralizada para Secretaría General:
                </span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {item.accionRecomendada}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
