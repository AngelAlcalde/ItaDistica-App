import React, { useState } from 'react';
import { AreaMunicipal, TipoArea, AreaReport } from '../types/municipal';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle,
  Layers,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { AREAS_MUNICIPALES_DEFAULT } from '../data/mockMunicipalData';

interface GestionAreasProps {
  areas: AreaMunicipal[];
  onSaveArea: (area: AreaMunicipal, previousName?: string) => void;
  onDeleteArea: (areaId: string, areaName: string) => void;
  onResetAreas: () => void;
  reportes: AreaReport[];
  onSelectAreaForNewReport?: (areaName: string) => void;
}

export const GestionAreas: React.FC<GestionAreasProps> = ({
  areas,
  onSaveArea,
  onDeleteArea,
  onResetAreas,
  reportes,
  onSelectAreaForNewReport
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [areaEnEdicion, setAreaEnEdicion] = useState<AreaMunicipal | null>(null);
  const [areaParaEliminar, setAreaParaEliminar] = useState<AreaMunicipal | null>(null);
  const [actualizarHistoricos, setActualizarHistoricos] = useState(true);

  // Form State
  const [formNombre, setFormNombre] = useState('');
  const [formTipo, setFormTipo] = useState<TipoArea>('Dirección');
  const [formResponsable, setFormResponsable] = useState('');
  const [formCargo, setFormCargo] = useState('');
  const [formEmpleados, setFormEmpleados] = useState<number>(5);
  const [formHorario, setFormHorario] = useState('07:00 a 13:00 hs');
  const [formTelefono, setFormTelefono] = useState('Int. 100');
  const [formActivo, setFormActivo] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const abrirModalNuevo = () => {
    setAreaEnEdicion(null);
    setFormNombre('');
    setFormTipo('Dirección');
    setFormResponsable('');
    setFormCargo('');
    setFormEmpleados(5);
    setFormHorario('07:00 a 13:00 hs');
    setFormTelefono('Int. 100');
    setFormActivo(true);
    setFormError(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (area: AreaMunicipal) => {
    setAreaEnEdicion(area);
    setFormNombre(area.nombre);
    setFormTipo(area.tipo);
    setFormResponsable(area.responsableDefault);
    setFormCargo(area.cargoDefault);
    setFormEmpleados(area.empleadosDefault);
    setFormHorario(area.horarioDefault);
    setFormTelefono(area.telefonoDefault);
    setFormActivo(area.activo);
    setFormError(null);
    setModalAbierto(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) {
      setFormError('El nombre de la dependencia es obligatorio.');
      return;
    }

    // Verificar nombre duplicado (excluyendo el actual)
    const duplicado = areas.find(
      (a) => a.nombre.trim().toLowerCase() === formNombre.trim().toLowerCase() && a.id !== areaEnEdicion?.id
    );
    if (duplicado) {
      setFormError('Ya existe una dependencia con este nombre exacto.');
      return;
    }

    const previousName = areaEnEdicion && areaEnEdicion.nombre !== formNombre.trim() && actualizarHistoricos 
      ? areaEnEdicion.nombre 
      : undefined;

    const nuevaArea: AreaMunicipal = {
      id: areaEnEdicion ? areaEnEdicion.id : `area-${Date.now()}`,
      nombre: formNombre.trim(),
      tipo: formTipo,
      responsableDefault: formResponsable.trim() || 'A designar',
      cargoDefault: formCargo.trim() || `${formTipo} a cargo`,
      empleadosDefault: Math.max(1, Number(formEmpleados) || 1),
      horarioDefault: formHorario.trim() || '07:00 a 13:00 hs',
      telefonoDefault: formTelefono.trim() || 'Mesa Central',
      activo: formActivo
    };

    onSaveArea(nuevaArea, previousName);
    setModalAbierto(false);
  };

  const handleConfirmarEliminar = () => {
    if (areaParaEliminar) {
      onDeleteArea(areaParaEliminar.id, areaParaEliminar.nombre);
      setAreaParaEliminar(null);
    }
  };

  // Filtrado de áreas
  const areasFiltradas = areas.filter((a) => {
    const matchBusqueda = 
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.responsableDefault.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.cargoDefault.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.telefonoDefault.toLowerCase().includes(busqueda.toLowerCase());

    const matchTipo = filtroTipo === 'TODOS' || a.tipo === filtroTipo;
    return matchBusqueda && matchTipo;
  });

  const getTipoBadgeClass = (tipo: TipoArea) => {
    switch (tipo) {
      case 'Secretaría':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Dirección':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Coordinación':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Área Operativa':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Mesa de Entrada':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Conteo por tipo
  const totalSecretarias = areas.filter((a) => a.tipo === 'Secretaría').length;
  const totalDirecciones = areas.filter((a) => a.tipo === 'Dirección').length;
  const totalCoordinaciones = areas.filter((a) => a.tipo === 'Coordinación').length;
  const totalPersonalEstimado = areas.reduce((acc, a) => acc + (a.activo ? a.empleadosDefault : 0), 0);

  return (
    <div className="space-y-6">
      {/* Cabecera Principal */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
              <Building2 className="w-4 h-4" />
              <span>Estructura Municipal · Itá Ibaté</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Gestión de Secretarías, Direcciones y Dependencias
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Administre el organigrama municipal: agregue nuevas áreas, actualice funcionarios a cargo, cargos y teléfonos internos, o dé de baja dependencias. Las áreas configuradas aquí se sincronizan automáticamente con el Formulario Único y el Tablero General.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onResetAreas}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-300"
              title="Restablecer a las 7 dependencias oficiales por defecto"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>Restablecer Oficiales</span>
            </button>

            <button
              onClick={abrirModalNuevo}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva Dependencia</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Resumen del Organigrama */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Dependencias</span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{areas.length}</div>
            <span className="text-[11px] text-emerald-700 font-medium">{areas.filter(a => a.activo).length} activas</span>
          </div>

          <div className="p-3 bg-purple-50/50 border border-purple-200/80 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Secretarías</span>
            <div className="text-2xl font-bold text-purple-900 font-mono mt-0.5">{totalSecretarias}</div>
            <span className="text-[11px] text-purple-700">Nivel de gabinete</span>
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-200/80 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Direcciones</span>
            <div className="text-2xl font-bold text-blue-900 font-mono mt-0.5">{totalDirecciones}</div>
            <span className="text-[11px] text-blue-700">Áreas de gestión</span>
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Plantel Registrado</span>
            <div className="text-2xl font-bold text-emerald-900 font-mono mt-0.5">{totalPersonalEstimado}</div>
            <span className="text-[11px] text-emerald-700">Agentes en servicio</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por área, responsable o cargo..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-600 font-medium">Tipo:</span>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="TODOS">Todos los tipos ({areas.length})</option>
            <option value="Secretaría">Secretarías</option>
            <option value="Dirección">Direcciones</option>
            <option value="Coordinación">Coordinaciones</option>
            <option value="Área Operativa">Áreas Operativas</option>
            <option value="Mesa de Entrada">Mesa de Entrada</option>
          </select>
        </div>
      </div>

      {/* Listado de Áreas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areasFiltradas.map((area) => {
          const reportesDelArea = reportes.filter((r) => r.nombreArea === area.nombre);

          return (
            <div
              key={area.id}
              className={`bg-white border rounded-xl p-4.5 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between ${
                area.activo ? 'border-slate-200' : 'border-dashed border-slate-300 bg-slate-50/60 opacity-80'
              }`}
            >
              <div>
                {/* Cabecera de la tarjeta */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getTipoBadgeClass(area.tipo)}`}>
                    {area.tipo}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {area.activo ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <XCircle className="w-3 h-3" />
                        Inactiva
                      </span>
                    )}
                  </div>
                </div>

                {/* Nombre y Responsable */}
                <div className="mt-3">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {area.nombre}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-1.5 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{area.responsableDefault}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-5">
                    {area.cargoDefault}
                  </p>
                </div>

                {/* Datos Operativos */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Agentes habituales:
                    </span>
                    <span className="font-semibold text-slate-800">{area.empleadosDefault} personas</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Horario:
                    </span>
                    <span className="font-medium text-slate-700 text-[11px] text-right truncate max-w-[170px]" title={area.horarioDefault}>
                      {area.horarioDefault}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Contacto / Interno:
                    </span>
                    <span className="font-semibold text-slate-800 text-[11px]">{area.telefonoDefault}</span>
                  </div>
                </div>

                {/* Estado de Informes */}
                <div className="mt-3 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Informes cargados:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {reportesDelArea.length} en este período
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => abrirModalEditar(area)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-slate-600" />
                    <span>Modificar</span>
                  </button>

                  <button
                    onClick={() => setAreaParaEliminar(area)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-md text-xs font-medium transition-colors cursor-pointer"
                    title="Eliminar dependencia"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Eliminar</span>
                  </button>
                </div>

                {onSelectAreaForNewReport && (
                  <button
                    onClick={() => onSelectAreaForNewReport(area.nombre)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <span>Cargar Informe</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {areasFiltradas.length === 0 && (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800">No se encontraron dependencias</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No hay áreas que coincidan con el término "{busqueda}". Puede crear una nueva dependencia municipal haciendo clic en el botón superior.
          </p>
          <button
            onClick={abrirModalNuevo}
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear Dependencia</span>
          </button>
        </div>
      )}

      {/* Modal de Crear / Modificar Dependencia */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  {areaEnEdicion ? 'Modificar Dependencia Municipal' : 'Nueva Dependencia Municipal'}
                </h3>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardar} className="mt-4 space-y-4">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Oficial de la Dependencia <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej: Dirección de Medio Ambiente y Espacios Verdes"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              {/* Tipo y Estado */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Dependencia
                  </label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as TipoArea)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Secretaría">Secretaría</option>
                    <option value="Dirección">Dirección</option>
                    <option value="Coordinación">Coordinación</option>
                    <option value="Área Operativa">Área Operativa</option>
                    <option value="Mesa de Entrada">Mesa de Entrada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estado Operativo
                  </label>
                  <select
                    value={formActivo ? 'true' : 'false'}
                    onChange={(e) => setFormActivo(e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="true">Activa (Disponible)</option>
                    <option value="false">Inactiva (Oculta)</option>
                  </select>
                </div>
              </div>

              {/* Responsable y Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Funcionario / Responsable
                  </label>
                  <input
                    type="text"
                    value={formResponsable}
                    onChange={(e) => setFormResponsable(e.target.value)}
                    placeholder="Ej: Lic. Martín González"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cargo Institucional
                  </label>
                  <input
                    type="text"
                    value={formCargo}
                    onChange={(e) => setFormCargo(e.target.value)}
                    placeholder="Ej: Director de Medio Ambiente"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Empleados, Horario y Teléfono */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Empleados
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formEmpleados}
                    onChange={(e) => setFormEmpleados(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Horario
                  </label>
                  <input
                    type="text"
                    value={formHorario}
                    onChange={(e) => setFormHorario(e.target.value)}
                    placeholder="07:00 a 13:00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Interno / Tel
                  </label>
                  <input
                    type="text"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    placeholder="Int. 110"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Si se está editando el nombre y hay reportes asociados */}
              {areaEnEdicion && areaEnEdicion.nombre !== formNombre.trim() && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={actualizarHistoricos}
                      onChange={(e) => setActualizarHistoricos(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      Actualizar también automáticamente los informes ya cargados que usaban "{areaEnEdicion.nombre}" con el nuevo nombre.
                    </span>
                  </label>
                </div>
              )}

              {/* Botones del Modal */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {areaEnEdicion ? 'Guardar Modificaciones' : 'Crear Dependencia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación de Eliminación */}
      {areaParaEliminar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200">
            <div className="flex items-center gap-3 text-rose-700 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                ¿Eliminar dependencia municipal?
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Está a punto de eliminar <strong className="text-slate-900">{areaParaEliminar.nombre}</strong> del registro de dependencias activas de Itá Ibaté.
            </p>

            {reportes.some(r => r.nombreArea === areaParaEliminar.nombre) && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                ⚠️ Atención: Existen informes cargados en el sistema asociados a esta área. Si elimina la dependencia, los informes históricos se conservarán pero no podrá seleccionar esta área en el formulario único salvo que la vuelva a registrar.
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-slate-200">
              <button
                onClick={() => setAreaParaEliminar(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEliminar}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Sí, Eliminar Dependencia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
