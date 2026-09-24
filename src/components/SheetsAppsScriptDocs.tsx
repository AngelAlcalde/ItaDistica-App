import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  BookOpen, 
  ExternalLink,
  Table,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SheetsAppsScriptDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'esquema' | 'script' | 'ia_script' | 'guia'>('esquema');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const downloadTextFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const schemaColumns = [
    { col: 'A', name: 'Marca temporal (Timestamp)', tipo: 'Fecha/Hora', desc: 'Generado automáticamente por Google Forms.' },
    { col: 'B', name: 'Período Evaluado', tipo: 'Texto / Menú', desc: 'Ej: Semana 38 - Septiembre 2026' },
    { col: 'C', name: 'Nombre del Área / Dependencia', tipo: 'Texto / Menú', desc: 'Obras Públicas, Tránsito, Acción Social, etc.' },
    { col: 'D', name: 'Responsable / Titular', tipo: 'Texto', desc: 'Nombre, apellido y cargo del firmante.' },
    { col: 'E', name: 'Cantidad de Empleados', tipo: 'Número entero', desc: 'Personal asignado al área en el período.' },
    { col: 'F', name: 'Horario de Atención', tipo: 'Texto', desc: 'Franja horaria y turnos rotativos.' },
    { col: 'G', name: 'Atendidos: Presencial', tipo: 'Número entero', desc: 'Personas atendidas en ventanilla/mostrador.' },
    { col: 'H', name: 'Atendidos: Telefónico', tipo: 'Número entero', desc: 'Llamadas recibidas y gestionadas.' },
    { col: 'I', name: 'Atendidos: WhatsApp Municipal', tipo: 'Número entero', desc: 'Mensajes y consultas canalizadas.' },
    { col: 'J', name: 'Atendidos: Redes Sociales', tipo: 'Número entero', desc: 'Interacciones Facebook / Instagram oficial.' },
    { col: 'K', name: 'Atendidos: Otros Canales', tipo: 'Número entero', desc: 'Correo electrónico, audiencias, etc.' },
    { col: 'L', name: 'Total Personas Atendidas', tipo: 'Fórmula', desc: '=SUM(G2:K2)' },
    { col: 'M', name: 'Demanda Lunes', tipo: 'Número entero', desc: 'Cantidad de vecinos atendidos el lunes.' },
    { col: 'N', name: 'Demanda Martes', tipo: 'Número entero', desc: 'Cantidad de vecinos atendidos el martes.' },
    { col: 'O', name: 'Demanda Miércoles', tipo: 'Número entero', desc: 'Cantidad de vecinos atendidos el miércoles.' },
    { col: 'P', name: 'Demanda Jueves', tipo: 'Número entero', desc: 'Cantidad de vecinos atendidos el jueves.' },
    { col: 'Q', name: 'Demanda Viernes', tipo: 'Número entero', desc: 'Cantidad de vecinos atendidos el viernes.' },
    { col: 'R', name: 'Motivo: Trámites', tipo: 'Número entero', desc: 'Expedientes, licencias, habilitaciones.' },
    { col: 'S', name: 'Motivo: Información', tipo: 'Número entero', desc: 'Orientación, guías, requisitos.' },
    { col: 'T', name: 'Motivo: Reclamos', tipo: 'Número entero', desc: 'Luminarias, baches, ruidos, pérdidas.' },
    { col: 'U', name: 'Motivo: Asistencia Social', tipo: 'Número entero', desc: 'Módulos, traslados, medicamentos.' },
    { col: 'V', name: 'Motivo: Servicios', tipo: 'Número entero', desc: 'Castraciones, desmalezado, desagote.' },
    { col: 'W', name: 'Motivo: Notas y Denuncias', tipo: 'Número entero', desc: 'Notas formales y denuncias vecinales.' },
    { col: 'X', name: 'Consulta Más Frecuente', tipo: 'Texto largo', desc: 'La pregunta o inquietud más repetida en la semana.' },
    { col: 'Y', name: 'Trámites Ingresados', tipo: 'Número entero', desc: 'Total trámites entrantes en la semana.' },
    { col: 'Z', name: 'Trámites Resueltos', tipo: 'Número entero', desc: 'Trámites concluidos con resolución favorable o dictamen.' },
    { col: 'AA', name: 'Trámites Pendientes', tipo: 'Número entero', desc: 'En curso dentro de los plazos reglamentarios.' },
    { col: 'AB', name: 'Trámites Derivados', tipo: 'Número entero', desc: 'Pases a otras áreas o dependencias provinciales.' },
    { col: 'AC', name: 'Trámites a Secretaría General', tipo: 'Número entero', desc: 'Expedientes que requieren firma o dictamen del Sec. General.' },
    { col: 'AD', name: 'Trámites Atrasados', tipo: 'Número entero', desc: 'Vencidos o demorados fuera de término.' },
    { col: 'AE', name: 'Causas de Atraso', tipo: 'Texto largo', desc: 'Falta de móviles, repuestos, insumos o sistema.' },
    { col: 'AF', name: 'Día de Mayor Demanda', tipo: 'Menú', desc: 'Lunes / Martes / Miércoles / Jueves / Viernes' },
    { col: 'AG', name: 'Horario Pico', tipo: 'Texto', desc: 'Ej: 08:30 - 11:30 hs' },
    { col: 'AH', name: 'Récord Diario de Vecinos', tipo: 'Número entero', desc: 'Máximo registro de personas en un solo día.' },
    { col: 'AI', name: 'Tendencia Anual', tipo: 'Menú', desc: 'En Alza / Estable / En Baja' },
    { col: 'AJ', name: 'Suficiencia Personal', tipo: 'Menú', desc: 'Suficiente / Parcial / Insuficiente' },
    { col: 'AK', name: 'Suficiencia Espacio Físico', tipo: 'Menú', desc: 'Suficiente / Parcial / Insuficiente' },
    { col: 'AL', name: 'Suficiencia Equipamiento', tipo: 'Menú', desc: 'Suficiente / Parcial / Insuficiente' },
    { col: 'AM', name: 'Suficiencia Sistemas', tipo: 'Menú', desc: 'Suficiente / Parcial / Insuficiente' },
    { col: 'AN', name: 'Recursos Requeridos con Urgencia', tipo: 'Casillas múltiples', desc: 'Vehículos, Informática, Personal, Espacio, etc.' },
    { col: 'AO', name: 'Detalle de Recursos Solicitados', tipo: 'Texto largo', desc: 'Especificaciones concretas (ej: repuestos, PC, toner).' },
    { col: 'AP', name: 'Problema que Requiere Decisión', tipo: 'Texto largo', desc: 'Traba u obstáculo que escapa a la potestad del área.' },
    { col: 'AQ', name: 'Intervención de Secretaría General', tipo: 'Texto largo', desc: 'Qué resolución, decreto o compra se solicita a SG.' },
    { col: 'AR', name: 'Nivel de Prioridad (Semáforo)', tipo: 'Menú', desc: '🔴 URGENTE / 🟠 IMPORTANTE / 🔵 SEGUIMIENTO' },
    { col: 'AS', name: 'Logros Principales del Período', tipo: 'Texto largo', desc: 'Objetivos cumplidos, metros ejecutados, trámites cerrados.' },
    { col: 'AT', name: 'Problemas Principales', tipo: 'Texto largo', desc: 'Obstáculos operativos cotidianos.' },
    { col: 'AU', name: 'Propuestas de Mejora', tipo: 'Texto largo', desc: 'Iniciativas sugeridas por el equipo de trabajo.' },
  ];

  const codeScript = `/**
 * @fileoverview Sistema de Información y Seguimiento Municipal
 * Municipalidad de Itá Ibaté - Secretaría General
 * Automatización de Indicadores, Semáforos y Detección de Problemas Transversales
 */

const NOMBRES_PESTANAS = {
  RESPUESTAS: 'RESPUESTAS',
  TABLERO: 'TABLERO GENERAL',
  TRAMITES: 'TRÁMITES y PENDIENTES',
  TRANSVERSALES: 'PROBLEMAS TRANSVERSALES',
  RECURSOS: 'RECURSOS y DECISIONES',
  INDICADORES: 'INDICADORES',
  RESUMEN: 'RESUMEN EJECUTIVO'
};

/**
 * Disparador automático que se ejecuta cuando ingresa un nuevo formulario
 */
function onFormSubmit(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  recalcularIndicadores(ss);
  actualizarProblemasTransversales(ss);
  actualizarSemaforosTablero(ss);
}

/**
 * Menú personalizado en Google Sheets para los funcionarios de Secretaría General
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🏛️ Gestión Itá Ibaté')
    .addItem('🔄 Recalcular Todos los Indicadores', 'ejecutarRecalculoManual')
    .addItem('🔍 Detectar Problemas Transversales', 'ejecutarDeteccionTransversal')
    .addSeparator()
    .addItem('🤖 Generar Resumen Ejecutivo con IA (Gemini)', 'generarResumenEjecutivoConGemini')
    .addToUi();
}

function ejecutarRecalculoManual() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  recalcularIndicadores(ss);
  SpreadsheetApp.getUi().alert('✅ Indicadores y porcentajes recalculados con éxito.');
}

function ejecutarDeteccionTransversal() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  actualizarProblemasTransversales(ss);
  SpreadsheetApp.getUi().alert('✅ Matriz de problemas transversales actualizada.');
}

/**
 * Calcula métricas e indicadores de gestión en la pestaña INDICADORES
 */
function recalcularIndicadores(ss) {
  const sheetResp = ss.getSheetByName(NOMBRES_PESTANAS.RESPUESTAS);
  let sheetInd = ss.getSheetByName(NOMBRES_PESTANAS.INDICADORES);
  
  if (!sheetResp || !sheetInd) return;

  const lastRow = sheetResp.getLastRow();
  if (lastRow < 2) return;

  const data = sheetResp.getRange(2, 1, lastRow - 1, 47).getValues();
  
  // Encabezados de la pestaña INDICADORES
  const headers = [
    ['Área', 'Responsable', 'Empleados', 'Atendidos', 'Atendidos x Empleado',
     'Tasa Resolución %', 'Tasa Pendientes %', 'Tasa Atraso %', 'Demanda Prom. Diaria', 'Semáforo Operativo']
  ];
  
  sheetInd.clear();
  sheetInd.getRange(1, 1, 1, headers[0].length).setValues(headers)
    .setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');

  const rows = [];
  const backgrounds = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const area = row[2]; // Col C
    const resp = row[3]; // Col D
    const empleados = Number(row[4]) || 1; // Col E
    const atendidos = Number(row[11]) || 0; // Col L (Total Atendidos)
    const ingresados = Number(row[24]) || 0; // Col Y (Trámites Ingresados)
    const resueltos = Number(row[25]) || 0; // Col Z (Resueltos)
    const pendientes = Number(row[26]) || 0; // Col AA (Pendientes)
    const atrasados = Number(row[29]) || 0; // Col AD (Atrasados)
    const prioridad = String(row[43]).toUpperCase(); // Col AR (Nivel Prioridad)

    // Desglose semanal (Lunes a Viernes: M a Q)
    const dias = [Number(row[12])||0, Number(row[13])||0, Number(row[14])||0, Number(row[15])||0, Number(row[16])||0];
    const demandaPromDiaria = (dias.reduce((a,b)=>a+b,0) / 5).toFixed(1);

    const atendidosPorEmpleado = (atendidos / empleados).toFixed(1);
    const tasaResolucion = ingresados > 0 ? ((resueltos / ingresados) * 100).toFixed(1) : '0.0';
    const tasaPendientes = ingresados > 0 ? ((pendientes / ingresados) * 100).toFixed(1) : '0.0';
    const tasaAtraso = ingresados > 0 ? ((atrasados / ingresados) * 100).toFixed(1) : '0.0';

    // Lógica de semáforo operativo
    let semaforo = '🔵 SEGUIMIENTO';
    let colorFondo = '#e0f2fe'; // Azul claro

    if (prioridad.indexOf('URGENTE') !== -1 || Number(tasaAtraso) >= 30 || atrasados >= 15) {
      semaforo = '🔴 URGENTE';
      colorFondo = '#fee2e2'; // Rojo claro
    } else if (prioridad.indexOf('IMPORTANTE') !== -1 || Number(tasaAtraso) >= 15 || pendientes >= 20) {
      semaforo = '🟠 IMPORTANTE';
      colorFondo = '#ffedd5'; // Naranja claro
    }

    rows.push([
      area, resp, empleados, atendidos, atendidosPorEmpleado,
      tasaResolucion + '%', tasaPendientes + '%', tasaAtraso + '%', demandaPromDiaria, semaforo
    ]);
    backgrounds.push([
      '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff',
      '#ffffff', '#ffffff', '#ffffff', '#ffffff', colorFondo
    ]);
  }

  if (rows.length > 0) {
    sheetInd.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    sheetInd.getRange(2, 1, rows.length, rows[0].length).setBackgrounds(backgrounds);
    sheetInd.autoResizeColumns(1, headers[0].length);
  }
}

/**
 * Detecta automáticamente problemas compartidos o repetidos entre distintas áreas
 */
function actualizarProblemasTransversales(ss) {
  const sheetResp = ss.getSheetByName(NOMBRES_PESTANAS.RESPUESTAS);
  let sheetTrans = ss.getSheetByName(NOMBRES_PESTANAS.TRANSVERSALES);
  
  if (!sheetResp || !sheetTrans) return;
  const lastRow = sheetResp.getLastRow();
  if (lastRow < 2) return;

  const data = sheetResp.getRange(2, 1, lastRow - 1, 47).getValues();

  // Mapear recursos y áreas que los solicitan (Col AN = Col 39)
  const mapaRecursos = {};

  for (let i = 0; i < data.length; i++) {
    const area = data[i][2];
    const recursosRaw = String(data[i][39] || '');
    const tokens = recursosRaw.split(/[,;\n]/).map(t => t.trim()).filter(Boolean);

    tokens.forEach(rec => {
      if (!mapaRecursos[rec]) {
        mapaRecursos[rec] = [];
      }
      if (!mapaRecursos[rec].includes(area)) {
        mapaRecursos[rec].push(area);
      }
    });
  }

  sheetTrans.clear();
  sheetTrans.getRange(1, 1, 1, 5).setValues([
    ['Recurso / Categoría', 'N° Áreas Coincidentes', 'Dependencias Solicitantes', 'Impacto Municipal', 'Acción Sugerida a Secretaría General']
  ]).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');

  const filasTransversales = [];

  for (const recurso in mapaRecursos) {
    const areas = mapaRecursos[recurso];
    if (areas.length >= 2) {
      let accion = 'Evaluar adquisición conjunta para optimizar presupuesto.';
      let impacto = 'Afecta operatividad en múltiples secretarías simultáneamente.';

      if (recurso.toLowerCase().includes('vehículo') || recurso.toLowerCase().includes('móvil') || recurso.toLowerCase().includes('combustible')) {
        accion = 'Centralizar parque automotor: emitir cronograma semanal compartido y autorizar reparación de flota pesada.';
        impacto = 'Detiene arreglos de calles, traslados de salud a Corrientes y patrullajes de tránsito.';
      } else if (recurso.toLowerCase().includes('informát') || recurso.toLowerCase().includes('computad') || recurso.toLowerCase().includes('impresor')) {
        accion = 'Licitación o compra agrupada de 4 PCs e impresoras multifunción con tóner de alto rendimiento.';
        impacto = 'Colas y lentitud en emisión de licencias y cobro de tasas.';
      } else if (recurso.toLowerCase().includes('sistema') || recurso.toLowerCase().includes('software')) {
        accion = 'Establecer sistema digital único de expedientes bajo directiva de Secretaría General.';
        impacto = 'Pérdida de trazabilidad de expedientes y reclamos vecinales.';
      }

      filasTransversales.push([
        recurso,
        areas.length,
        areas.join(', '),
        impacto,
        accion
      ]);
    }
  }

  if (filasTransversales.length > 0) {
    sheetTrans.getRange(2, 1, filasTransversales.length, 5).setValues(filasTransversales);
    sheetTrans.autoResizeColumns(1, 5);
  }
}
`;

  const codeGeminiScript = `/**
 * @fileoverview Módulo de Inteligencia Artificial para Secretaría General
 * Municipalidad de Itá Ibaté - Generación Automática del Informe Ejecutivo
 * Utiliza Google Gemini API desde Google Apps Script (UrlFetchApp)
 */

// Configure su clave de Gemini API en: Archivo > Propiedades del proyecto > Propiedades de la secuencia de comandos
// Nombre: GEMINI_API_KEY
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY') || 'SU_API_KEY_AQUI';

/**
 * Función que lee los datos consolidados y genera el Resumen Ejecutivo con IA
 */
function generarResumenEjecutivoConGemini() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetInd = ss.getSheetByName('INDICADORES');
  const sheetTrans = ss.getSheetByName('PROBLEMAS TRANSVERSALES');
  const sheetResp = ss.getSheetByName('RESPUESTAS');
  let sheetResumen = ss.getSheetByName('RESUMEN EJECUTIVO');

  if (!sheetResumen) {
    sheetResumen = ss.insertSheet('RESUMEN EJECUTIVO');
  }

  if (!sheetInd || !sheetResp) {
    SpreadsheetApp.getUi().alert('❌ Error: Asegúrese de tener las pestañas RESPUESTAS e INDICADORES con datos.');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  ui.alert('⏳ Conectando con Google Gemini API... Por favor espere unos segundos.');

  // Recopilar indicadores
  const indValues = sheetInd.getDataRange().getValues();
  // Recopilar problemas transversales
  const transValues = sheetTrans ? sheetTrans.getDataRange().getValues() : [];
  
  // Construir prompt estructurado
  const prompt = \`
Actúa como Asesor Técnico Principal de la Secretaría General de la Municipalidad de Itá Ibaté (Corrientes, Argentina).
Redacta el "INFORME EJECUTIVO DE GESTIÓN MUNICIPAL" formal y riguroso a partir de los datos consolidados de esta semana:

DATOS CONSOLIDADOS POR ÁREA:
\${JSON.stringify(indValues, null, 2)}

PROBLEMAS TRANSVERSALES DETECTADOS:
\${JSON.stringify(transValues, null, 2)}

ESTRUCTURA EXIGIDA DEL INFORME:
1. **DIAGNÓSTICO Y RENDIMIENTO OPERATIVO GENERAL** (Evaluación sintética de atención al vecino, trámites resueltos vs atrasos).
2. **SEMÁFORO DE ALERTAS Y URGENCIAS OPERATIVAS** (🔴 Urgente, 🟠 Importante, 🔵 Seguimiento).
3. **PROBLEMAS TRANSVERSALES DE COORDINACIÓN MUNICIPAL** (Necesidades comunes entre áreas: parque automotor, insumos, sistemas y qué directiva unificada se debe aplicar).
4. **DECISIONES REQUERIDAS DE SECRETARÍA GENERAL** (Autorizaciones, compras de emergencia, decretos o circulares que el Secretario General debe firmar de inmediato).
5. **PLAN DE ACCIÓN RECOMENDADO PARA LA PRÓXIMA SEMANA**.

Tono: Institucional, preciso, directo y enfocado en la resolución de problemas para el Intendente y el Secretario General.
\`;

  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.95
      }
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());

    if (json.error) {
      ui.alert('❌ Error de Gemini API: ' + json.error.message);
      return;
    }

    const textoGenerado = json.candidates[0].content.parts[0].text;

    // Escribir en la pestaña RESUMEN EJECUTIVO
    sheetResumen.clear();
    sheetResumen.getRange('A1').setValue('MUNICIPALIDAD DE ITÁ IBATÉ - SECRETARÍA GENERAL')
      .setFontSize(14).setFontWeight('bold').setFontColor('#0f172a');
    sheetResumen.getRange('A2').setValue('INFORME EJECUTIVO DE GESTIÓN MUNICIPAL - GENERADO CON IA')
      .setFontSize(12).setFontWeight('bold').setFontColor('#0284c7');
    sheetResumen.getRange('A3').setValue('Fecha de Emisión: ' + new Date().toLocaleString())
      .setFontSize(10).setFontColor('#64748b');

    sheetResumen.getRange('A5').setValue(textoGenerado)
      .setWrap(true).setFontSize(11);

    sheetResumen.setColumnWidth(1, 850);
    SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheetResumen);

    ui.alert('✅ ¡Informe Ejecutivo generado exitosamente en la pestaña RESUMEN EJECUTIVO!');
  } catch (err) {
    ui.alert('❌ Error al procesar el informe: ' + err.toString());
  }
}
`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Arquitectura Google Workspace & Google Apps Script</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Estructura Técnica, Fórmulas y Código Automatizado
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Diseño integral de la base de datos en Google Sheets, fórmulas matriciales de indicadores, algoritmo de detección de problemas transversales y script de Google Apps Script con IA para la Secretaría General de Itá Ibaté.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => downloadTextFile('Sistema_Municipal_Ita_Ibate_AppsScript.gs', codeScript + '\n\n' + codeGeminiScript)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .gs Completo</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-200 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('esquema')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'esquema'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>1. Esquema de Columnas (Google Sheets)</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'script'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>2. Google Apps Script (Automatizaciones & Semáforo)</span>
          </button>

          <button
            onClick={() => setActiveTab('ia_script')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'ia_script'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Script IA de Informe Ejecutivo (Gemini)</span>
          </button>

          <button
            onClick={() => setActiveTab('guia')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'guia'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>4. Guía de Despliegue en el Municipio</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Esquema de Columnas */}
      {activeTab === 'esquema' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Esquema de Columnas de la Pestaña "RESPUESTAS"
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Estructura canónica de 47 columnas vinculadas al Formulario Único de Carga de Itá Ibaté.
                </p>
              </div>

              <button
                onClick={() => {
                  const csvHeaders = schemaColumns.map(c => `"${c.col}","${c.name}","${c.tipo}","${c.desc}"`).join('\n');
                  downloadTextFile('Diccionario_Datos_Municipalidad_Ita_Ibate.csv', `"Columna","Nombre del Campo","Tipo de Dato","Descripción"\n` + csvHeaders);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Diccionario en CSV</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-16 text-center">Col</th>
                    <th className="py-2.5 px-3">Campo / Pregunta del Formulario</th>
                    <th className="py-2.5 px-3 w-32">Tipo / Validación</th>
                    <th className="py-2.5 px-3">Regla Operativa / Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {schemaColumns.map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 text-center font-mono font-bold text-emerald-800 bg-emerald-50/40">
                        {col.col}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {col.name}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {col.tipo}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {col.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fórmulas directas de Sheets */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Fórmulas Matriciales Directas en Google Sheets
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Puede incorporar estas fórmulas en las cabeceras de cada pestaña sin depender exclusivamente de scripts:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  1. Cálculo Automático de Total Atendidos (Col L)
                </span>
                <code className="text-[11px] font-mono text-emerald-700 bg-white p-1.5 border border-slate-200 rounded block overflow-x-auto">
                  =ARRAYFORMULA(IF(ROW(G:G)=1, "Total Atendidos", IF(G:G="", "", G:G + H:H + I:I + J:J + K:K)))
                </code>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  2. Tasa de Resolución de Trámites
                </span>
                <code className="text-[11px] font-mono text-emerald-700 bg-white p-1.5 border border-slate-200 rounded block overflow-x-auto">
                  =IF(Y2&gt;0, Z2/Y2, 0)  // Formato Porcentaje %
                </code>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  3. Semáforo Operativo Condicional
                </span>
                <code className="text-[11px] font-mono text-emerald-700 bg-white p-1.5 border border-slate-200 rounded block overflow-x-auto">
                  =IF(OR(AR2="URGENTE", AD2/Y2&gt;=0.35), "🔴 URGENTE", IF(OR(AR2="IMPORTANTE", AD2/Y2&gt;=0.18), "🟠 IMPORTANTE", "🔵 SEGUIMIENTO"))
                </code>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  4. Extracción de Trámites Atrasados en Pestaña Específica
                </span>
                <code className="text-[11px] font-mono text-emerald-700 bg-white p-1.5 border border-slate-200 rounded block overflow-x-auto">
                  =QUERY(RESPUESTAS!A2:AU, "SELECT C, D, Y, Z, AA, AD, AE, AR WHERE AD &gt; 0 ORDER BY AD DESC", 0)
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Apps Script (Automatizaciones) */}
      {activeTab === 'script' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Codigo.gs
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Google Apps Script: Cálculos, Semáforo y Detección Transversal
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Copie este código en <strong className="text-slate-800">Extensiones &gt; Apps Script</strong> en su Google Sheet municipal.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(codeScript, 'script')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
            >
              {copiedKey === 'script' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Codigo.gs</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="bg-slate-950 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed border border-slate-800">
              <code>{codeScript}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Script IA de Informe Ejecutivo */}
      {activeTab === 'ia_script' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  IA_ResumenEjecutivo.gs
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Google Apps Script + Gemini API: Redacción Automatizada del Informe
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Lee los datos de las pestañas <strong className="text-slate-800">INDICADORES</strong> y <strong className="text-slate-800">PROBLEMAS TRANSVERSALES</strong>, llama a Gemini y vuelca el informe institucional listo para firmar.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(codeGeminiScript, 'ia_script')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-900 text-white rounded-lg text-xs font-medium hover:bg-purple-800 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
            >
              {copiedKey === 'ia_script' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar IA_ResumenEjecutivo.gs</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 mb-4 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Configuración de Seguridad de la API Key:</strong>
              <p className="mt-0.5">
                Para no dejar su clave de Google Gemini visible en el código, guarde su API Key en: <code className="font-mono bg-white px-1 py-0.5 border border-amber-200 rounded text-amber-800">Configuración del Proyecto &gt; Propiedades de la secuencia de comandos</code> con el nombre de propiedad <code className="font-mono bg-white px-1 py-0.5 border border-amber-200 rounded text-amber-800">GEMINI_API_KEY</code>.
              </p>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-slate-950 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed border border-slate-800">
              <code>{codeGeminiScript}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Guía de Despliegue en el Municipio */}
      {activeTab === 'guia' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Guía de Implementación Paso a Paso en la Municipalidad de Itá Ibaté
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Instrucciones claras para el personal de Cómputos, Mesa de Entradas y Secretaría General.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Creación del Formulario en Google Forms
                </h4>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Cree un nuevo Google Form titulado: <strong className="text-slate-800">"Sistema de Información Municipal - Itá Ibaté"</strong>.</li>
                <li>Agregue las secciones ordenadas tal como figuran en el esquema de 47 campos.</li>
                <li>Configure el campo "Nombre del Área" como lista desplegable con las áreas oficiales predefinidas.</li>
                <li>Haga clic en la pestaña <strong className="text-slate-800">Respuestas &gt; Vincular con Hojas de cálculo</strong> y cree una planilla nueva llamada <strong className="text-slate-800">"SISTEMA_SEGUIMIENTO_MUNICIPAL_ITA_IBATE"</strong>.</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Estructuración de las 7 Pestañas de la Planilla
                </h4>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Renombre la primera pestaña a: <code className="font-mono text-emerald-700 bg-white px-1 rounded border border-slate-200">RESPUESTAS</code>.</li>
                <li>Cree las pestañas secundarias con los nombres exactos:
                  <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 mt-1 space-y-0.5">
                    <div>• TABLERO GENERAL</div>
                    <div>• TRÁMITES y PENDIENTES</div>
                    <div>• PROBLEMAS TRANSVERSALES</div>
                    <div>• RECURSOS y DECISIONES</div>
                    <div>• INDICADORES</div>
                    <div>• RESUMEN EJECUTIVO</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Pegar el Código en Google Apps Script
                </h4>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>En la planilla de Sheets, vaya al menú superior: <strong className="text-slate-800">Extensiones &gt; Apps Script</strong>.</li>
                <li>Borre cualquier código existente en <code className="font-mono text-slate-800">Código.gs</code> y pegue el código del Tab 2.</li>
                <li>Cree un segundo archivo llamado <code className="font-mono text-slate-800">IA_ResumenEjecutivo.gs</code> y pegue el código del Tab 3.</li>
                <li>Haga clic en el icono del disquete <strong className="text-slate-800">Guardar</strong>.</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Configurar Activador Automático (Trigger)
                </h4>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>En Apps Script, en el menú lateral izquierdo, haga clic en el ícono del reloj <strong className="text-slate-800">(Activadores)</strong>.</li>
                <li>Haga clic en <strong className="text-slate-800">+ Añadir activador</strong>.</li>
                <li>Seleccione la función a ejecutar: <code className="font-mono text-slate-800">onFormSubmit</code>.</li>
                <li>Seleccione la fuente del evento: <strong className="text-slate-800">Desde la hoja de cálculo</strong>.</li>
                <li>Seleccione el tipo de evento: <strong className="text-slate-800">Al enviarse el formulario</strong>.</li>
                <li>Guarde y acepte los permisos de Google. ¡El sistema ya es 100% autónomo!</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="text-xs text-emerald-900">
              <strong className="font-bold">Resultado Operativo:</strong> Cada vez que un Director o Secretario municipal de Itá Ibaté complete el formulario semanal, la planilla recalculará los indicadores, actualizará los semáforos 🔴/🟠/🔵, agrupará los problemas transversales automáticamente y permitirá generar el resumen con IA con un solo clic.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
