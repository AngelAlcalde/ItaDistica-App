/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  AreaReport, 
  NivelSemaforo, 
  ProblemaTransversal,
  AreaMunicipal 
} from './types/municipal';
import { 
  REPORTES_INICIALES, 
  AREAS_MUNICIPALES_DEFAULT,
  calcularMetricasGlobales, 
  detectarProblemasTransversalesAlgoritmico 
} from './data/mockMunicipalData';
import { TableroGeneral } from './components/TableroGeneral';
import { FormularioUnico } from './components/FormularioUnico';
import { GestionAreas } from './components/GestionAreas';
import { TramitesPendientesView } from './components/TramitesPendientesView';
import { ProblemasTransversalesView } from './components/ProblemasTransversalesView';
import { RecursosDecisionesView } from './components/RecursosDecisionesView';
import { IndicadoresView } from './components/IndicadoresView';
import { ResumenEjecutivoIA } from './components/ResumenEjecutivoIA';
import { SheetsAppsScriptDocs } from './components/SheetsAppsScriptDocs';
import { LogoManagerModal } from './components/LogoManagerModal';
import { 
  LayoutDashboard, 
  ClipboardEdit, 
  Clock, 
  Network, 
  Scale, 
  BarChart3, 
  Sparkles, 
  FileSpreadsheet, 
  Download, 
  RotateCcw, 
  Building2, 
  CheckCircle2, 
  Calendar,
  Layers,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

export default function App() {
  // 1. Estado de Reportes: En blanco por defecto para cargar desde cero como solicitó el usuario
  const [reportes, setReportes] = useState<AreaReport[]>(() => {
    const saved = localStorage.getItem('ita_ibate_reportes_v2');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error cargando reportes guardados:', e);
      }
    }
    // Estado inicial en blanco
    return [];
  });

  // 2. Estado de Dependencias / Áreas Municipales (Permite agregar, editar, eliminar)
  const [areas, setAreas] = useState<AreaMunicipal[]>(() => {
    const saved = localStorage.getItem('ita_ibate_areas_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error cargando áreas:', e);
      }
    }
    return AREAS_MUNICIPALES_DEFAULT;
  });

  // 3. Estado de Logo Municipal
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem('ita_ibate_logo_url') || '/muni-logo.png';
  });
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const [periodoActivo, setPeriodoActivo] = useState<string>('Semana 38 - Septiembre 2026');
  const [tabActiva, setTabActiva] = useState<
    'tablero' | 'formulario' | 'areas' | 'tramites' | 'transversales' | 'decisiones' | 'indicadores' | 'resumen' | 'docs'
  >('tablero');
  const [reporteParaEditar, setReporteParaEditar] = useState<AreaReport | null>(null);
  const [areaSeleccionadaParaFormulario, setAreaSeleccionadaParaFormulario] = useState<string | undefined>(undefined);

  // Guardar reportes en localStorage
  const guardarReportesEnEstado = (nuevosReportes: AreaReport[]) => {
    setReportes(nuevosReportes);
    localStorage.setItem('ita_ibate_reportes_v2', JSON.stringify(nuevosReportes));
  };

  // Guardar áreas en localStorage
  const guardarAreasEnEstado = (nuevasAreas: AreaMunicipal[]) => {
    setAreas(nuevasAreas);
    localStorage.setItem('ita_ibate_areas_v1', JSON.stringify(nuevasAreas));
  };

  // Guardar logo en localStorage
  const handleUpdateLogoUrl = (url: string) => {
    setLogoUrl(url);
    localStorage.setItem('ita_ibate_logo_url', url);
  };

  // Manejo de áreas (CRUD)
  const handleSaveArea = (areaActualizada: AreaMunicipal, previousName?: string) => {
    const existe = areas.some((a) => a.id === areaActualizada.id);
    let nuevasAreas: AreaMunicipal[];
    if (existe) {
      nuevasAreas = areas.map((a) => (a.id === areaActualizada.id ? areaActualizada : a));
    } else {
      nuevasAreas = [...areas, areaActualizada];
    }
    guardarAreasEnEstado(nuevasAreas);

    // Si cambió el nombre y el usuario optó por actualizar los reportes existentes
    if (previousName && previousName !== areaActualizada.nombre) {
      const reportesActualizados = reportes.map((r) =>
        r.nombreArea === previousName ? { ...r, nombreArea: areaActualizada.nombre } : r
      );
      guardarReportesEnEstado(reportesActualizados);
    }
  };

  const handleDeleteArea = (areaId: string) => {
    const nuevasAreas = areas.filter((a) => a.id !== areaId);
    guardarAreasEnEstado(nuevasAreas);
  };

  const handleResetAreas = () => {
    if (window.confirm('¿Desea restablecer el listado de dependencias a las 7 oficiales originales de Itá Ibaté?')) {
      guardarAreasEnEstado(AREAS_MUNICIPALES_DEFAULT);
    }
  };

  // Guardar reporte creado o modificado desde el Formulario Único
  const handleSaveReport = (nuevoReporte: AreaReport) => {
    const existe = reportes.some((r) => r.id === nuevoReporte.id);
    let actualizados: AreaReport[];
    if (existe) {
      actualizados = reportes.map((r) => (r.id === nuevoReporte.id ? nuevoReporte : r));
    } else {
      actualizados = [nuevoReporte, ...reportes];
    }
    guardarReportesEnEstado(actualizados);
    setReporteParaEditar(null);
    setAreaSeleccionadaParaFormulario(undefined);
    setTabActiva('tablero');
  };

  // Actualizar un reporte individual (ej: cambio de estado en Decisiones SG)
  const handleUpdateReport = (repActualizado: AreaReport) => {
    const actualizados = reportes.map((r) => (r.id === repActualizado.id ? repActualizado : r));
    guardarReportesEnEstado(actualizados);
  };

  const handleSelectAreaParaEditar = (rep: AreaReport) => {
    setReporteParaEditar(rep);
    setAreaSeleccionadaParaFormulario(rep.nombreArea);
    setTabActiva('formulario');
  };

  const handleNavigateToFormForArea = (areaName?: string) => {
    setReporteParaEditar(null);
    setAreaSeleccionadaParaFormulario(areaName);
    setTabActiva('formulario');
  };

  // Acción: Cargar datos de prueba (Demo)
  const handleCargarDatosDemo = () => {
    if (reportes.length > 0 && !window.confirm('¿Desea reemplazar los informes actuales con los datos de muestra oficiales de Itá Ibaté?')) {
      return;
    }
    guardarReportesEnEstado(REPORTES_INICIALES);
    setReporteParaEditar(null);
    setTabActiva('tablero');
  };

  // Acción: Dejar todo en blanco para carga real
  const handleVaciarTodoEnBlanco = () => {
    if (window.confirm('¿Confirma que desea vaciar todos los reportes y dejar la aplicación completamente en blanco para iniciar la carga desde cero?')) {
      guardarReportesEnEstado([]);
      setReporteParaEditar(null);
    }
  };

  // Exportar consolidado a formato CSV
  const exportarCSV = () => {
    const headers = [
      'ID', 'Periodo', 'Area', 'Responsable', 'Cargo', 'Empleados', 'Horarios',
      'Presencial', 'Telefonica', 'WhatsApp', 'Redes', 'Otros', 'Total Atendidos',
      'Tramites Ingresados', 'Tramites Resueltos', 'Tramites Pendientes', 'Atrasados',
      'Semaforo Operativo', 'Prioridad', 'Estado Decision SG', 'Problema Reportado'
    ];

    const rows = reportes.map(r => [
      `"${r.id}"`,
      `"${r.periodo}"`,
      `"${r.nombreArea}"`,
      `"${r.responsable}"`,
      `"${r.cargoResponsable}"`,
      r.empleados,
      `"${r.horarioAtencion}"`,
      r.atendidosPresencial,
      r.atendidosTelefonica,
      r.atendidosWhatsapp,
      r.atendidosRedesSociales,
      r.atendidosOtros,
      r.totalAtendidos,
      r.tramitesIngresados,
      r.tramitesResueltos,
      r.tramitesPendientes,
      r.tramitesAtrasados,
      `"${r.indicadores?.semaforoOperativo || 'SEGUIMIENTO'}"`,
      `"${r.nivelPrioridad}"`,
      `"${r.estadoDecision}"`,
      `"${(r.problemaDescripcion || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Consolidado_Municipal_Ita_Ibate_${periodoActivo.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Métricas y problemas transversales calculados en tiempo real
  const metricas = useMemo(() => calcularMetricasGlobales(reportes), [reportes]);
  const problemasTransversales = useMemo(() => detectarProblemasTransversalesAlgoritmico(reportes), [reportes]);

  interface NavItem {
    id: 'tablero' | 'formulario' | 'areas' | 'tramites' | 'transversales' | 'decisiones' | 'indicadores' | 'resumen' | 'docs';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }

  const navItems: NavItem[] = [
    { id: 'tablero', label: 'Tablero General', icon: LayoutDashboard },
    { id: 'formulario', label: 'Formulario Único (Carga)', icon: ClipboardEdit },
    { id: 'areas', label: 'Gestión de Áreas', icon: Building2, badge: areas.length },
    { id: 'tramites', label: 'Trámites y Pendientes', icon: Clock },
    { id: 'transversales', label: 'Problemas Transversales', icon: Network, badge: problemasTransversales.length > 0 ? problemasTransversales.length : undefined },
    { id: 'decisiones', label: 'Decisiones SG', icon: Scale, badge: metricas.alertasUrgentes > 0 ? `🔴 ${metricas.alertasUrgentes}` : undefined },
    { id: 'indicadores', label: 'Indicadores', icon: BarChart3 },
    { id: 'resumen', label: 'Resumen con IA (Gemini)', icon: Sparkles },
    { id: 'docs', label: 'Sheets & Apps Script', icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Barra Superior Institucional */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            {/* Logo e Identidad Municipal con Modal de Cambio */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLogoModalOpen(true)}
                title="Haga clic para ver o cambiar el Logo Municipal de Itá Ibaté"
                className="relative group cursor-pointer focus:outline-none shrink-0"
              >
                <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-700 shadow-xs group-hover:ring-2 group-hover:ring-emerald-400 transition-all overflow-hidden">
                  <img
                    src={logoUrl}
                    alt="Logo Municipalidad de Itá Ibaté"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/muni-logo.png';
                    }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs" title="Administrar Logo">
                  <ImageIcon className="w-2.5 h-2.5" />
                </span>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                    Municipalidad de Itá Ibaté · Corrientes
                  </span>
                  <span className="text-slate-500 text-xs">·</span>
                  <span className="text-[11px] text-slate-300 font-medium">Secretaría General</span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Sistema de Información y Seguimiento Municipal
                </h1>
              </div>
            </div>

            {/* Controles de Período y Acciones Rápidas */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Selector de Período */}
              <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <select
                  value={periodoActivo}
                  onChange={(e) => setPeriodoActivo(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Semana 38 - Septiembre 2026" className="bg-slate-900">Semana 38 - Septiembre 2026</option>
                  <option value="Semana 39 - Septiembre 2026" className="bg-slate-900">Semana 39 - Septiembre 2026</option>
                  <option value="Semana 40 - Octubre 2026" className="bg-slate-900">Semana 40 - Octubre 2026</option>
                  <option value="Mes de Septiembre 2026" className="bg-slate-900">Mes de Septiembre 2026 (Consolidado)</option>
                </select>
              </div>

              {/* Botón Logo */}
              <button
                onClick={() => setIsLogoModalOpen(true)}
                title="Ver o cambiar Logo Municipal"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline text-[11px]">Logo</span>
              </button>

              {/* Botón Cargar Datos Demo */}
              <button
                onClick={handleCargarDatosDemo}
                title="Cargar datos de muestra oficiales de Itá Ibaté para probar todas las funciones"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Cargar Demo</span>
              </button>

              {/* Botón Vaciar Todo (Iniciar en Blanco) */}
              {reportes.length > 0 && (
                <button
                  onClick={handleVaciarTodoEnBlanco}
                  title="Vaciar todos los reportes y dejar en blanco para carga real"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[11px]">Vaciar (Blanco)</span>
                </button>
              )}

              {/* Botón Exportar CSV */}
              <button
                onClick={exportarCSV}
                title="Exportar consolidado a archivo CSV"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Exportar CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Navegación de Vistas (Tabs) */}
        <div className="bg-slate-950/70 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = tabActiva === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'formulario' && !reporteParaEditar) {
                        setReporteParaEditar(null);
                      }
                      setTabActiva(item.id);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-emerald-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tabActiva === 'tablero' && (
          <TableroGeneral
            reportes={reportes}
            metricas={metricas}
            areas={areas}
            periodoActivo={periodoActivo}
            onSelectAreaParaEditar={handleSelectAreaParaEditar}
            onNavigateToForm={handleNavigateToFormForArea}
            onNavigateToAreas={() => setTabActiva('areas')}
            onCargarDatosDemo={handleCargarDatosDemo}
          />
        )}

        {tabActiva === 'formulario' && (
          <FormularioUnico
            onSaveReport={handleSaveReport}
            reporteParaEditar={reporteParaEditar}
            periodoActivo={periodoActivo}
            areasDisponibles={areas}
            onOpenGestionAreas={() => setTabActiva('areas')}
            areaSeleccionadaInicial={areaSeleccionadaParaFormulario}
          />
        )}

        {tabActiva === 'areas' && (
          <GestionAreas
            areas={areas}
            onSaveArea={handleSaveArea}
            onDeleteArea={handleDeleteArea}
            onResetAreas={handleResetAreas}
            reportes={reportes}
            onSelectAreaForNewReport={(nombre) => {
              setAreaSeleccionadaParaFormulario(nombre);
              setReporteParaEditar(null);
              setTabActiva('formulario');
            }}
          />
        )}

        {tabActiva === 'tramites' && (
          <TramitesPendientesView reportes={reportes} />
        )}

        {tabActiva === 'transversales' && (
          <ProblemasTransversalesView
            problemas={problemasTransversales}
            reportes={reportes}
          />
        )}

        {tabActiva === 'decisiones' && (
          <RecursosDecisionesView
            reportes={reportes}
            onUpdateReport={handleUpdateReport}
          />
        )}

        {tabActiva === 'indicadores' && (
          <IndicadoresView reportes={reportes} metricas={metricas} />
        )}

        {tabActiva === 'resumen' && (
          <ResumenEjecutivoIA
            reportes={reportes}
            metricas={metricas}
            problemasTransversales={problemasTransversales}
            periodoActivo={periodoActivo}
            logoUrl={logoUrl}
          />
        )}

        {tabActiva === 'docs' && (
          <SheetsAppsScriptDocs />
        )}
      </main>

      {/* Modal de Administración de Logo */}
      <LogoManagerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogoUrl={logoUrl}
        onUpdateLogoUrl={handleUpdateLogoUrl}
      />

      {/* Pie de Página Institucional */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={logoUrl}
              alt="Itá Ibaté Logo"
              className="w-5 h-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/muni-logo.png';
              }}
            />
            <span className="font-semibold text-slate-800">
              Municipalidad de Itá Ibaté
            </span>
            <span>·</span>
            <span>Secretaría General</span>
            <span>·</span>
            <span>Provincia de Corrientes, República Argentina</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>Sistema de Información y Seguimiento Municipal</span>
            <span>·</span>
            <button
              onClick={() => setTabActiva('docs')}
              className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline"
            >
              Manual Google Workspace & Código Apps Script
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
