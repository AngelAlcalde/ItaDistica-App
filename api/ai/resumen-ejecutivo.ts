import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido. Utilice POST.' });
  }

  try {
    const { periodo, reportes, metricasGlobales, problemasTransversales, decisionesPendientes } = req.body || {};

    const prompt = `
Actúa como un Asesor Técnico Senior en Gestión Pública y Secretaría General de la Municipalidad de Itá Ibaté (Provincia de Corrientes).
Tu tarea es generar el "INFORME EJECUTIVO DE GESTIÓN MUNICIPAL" correspondiente al período: "${periodo}".

DATOS CONSOLIDADOS DEL PERÍODO:
1. Métricas Globales:
   - Total Personas Atendidas: ${metricasGlobales?.totalAtendidos ?? 'N/D'}
   - Total Empleados Reportados: ${metricasGlobales?.totalEmpleados ?? 'N/D'}
   - Demanda Promedio Diaria: ${metricasGlobales?.promedioDiario ?? 'N/D'}
   - Trámites Ingresados: ${metricasGlobales?.tramitesIngresados ?? 'N/D'}
   - Trámites Resueltos: ${metricasGlobales?.tramitesResueltos ?? 'N/D'} (${metricasGlobales?.porcentajeResolucion ?? '0'}%)
   - Trámites Pendientes: ${metricasGlobales?.tramitesPendientes ?? 'N/D'} (${metricasGlobales?.porcentajePendiente ?? '0'}%)
   - Trámites Atrasados: ${metricasGlobales?.tramitesAtrasados ?? 'N/D'} (${metricasGlobales?.porcentajeAtraso ?? '0'}%)
   - Situaciones en Semáforo 🔴 URGENTE: ${metricasGlobales?.alertasUrgentes ?? 0}
   - Situaciones en Semáforo 🟠 IMPORTANTE: ${metricasGlobales?.alertasImportantes ?? 0}
   - Situaciones en Semáforo 🔵 SEGUIMIENTO: ${metricasGlobales?.alertasSeguimiento ?? 0}

2. Problemas Transversales Detectados en el Consolidado:
${JSON.stringify(problemasTransversales, null, 2)}

3. Decisiones y Recursos Urgentes Requeridos a Secretaría General:
${JSON.stringify(decisionesPendientes, null, 2)}

4. Desglose y Reportes por Área Municipal:
${JSON.stringify(reportes, null, 2)}

INSTRUCCIONES DE FORMATO Y ESTILO:
Genera un informe institucional, riguroso, directo y ejecutivo en español, listo para elevar al Secretario General y al Intendente Municipal de Itá Ibaté.
Estructura obligatoria con las siguientes secciones:

1. **ENCABEZADO INSTITUCIONAL Y SÍNTESIS DE GESTIÓN**
   - Resumen de 2 párrafos con el diagnóstico general del funcionamiento municipal durante el período.
   - Rendimiento operativo general (% resolución de trámites vs atrasos).

2. **SEMÁFORO DE ALERTAS OPERATIVAS (INTERVENCIÓN INMEDIATA)**
   - 🔴 **CASOS URGENTES**: Lista concreta de áreas, problema específico, impacto vecinal y por qué requiere resolución en 24-48 horas.
   - 🟠 **CASOS IMPORTANTES**: Puntos de atención prioritaria de la semana que deben ser monitoreados.
   - 🔵 **SEGUIMIENTO**: Procesos estables con observaciones de control.

3. **ANÁLISIS DE PROBLEMAS TRANSVERSALES**
   - Agrupación de necesidades que se repiten en 2 o más áreas (ej. solicitud de vehículos/traslados, insumos informáticos o conectividad, adecuación edilicia, insumos de cuadrilla).
   - Diagnóstico del origen común y propuesta de solución centralizada desde Secretaría General (compras unificadas, rotación de recursos, convenios o directivas).

4. **MATRIZ DE DECISIONES Y ASIGNACIÓN DE RECURSOS PARA SECRETARÍA GENERAL**
   - Cuadro o listado estructurado de qué debe firmar, autorizar o instruir la Secretaría General esta semana.
   - Dictamen técnico sobre las solicitudes de personal y presupuesto.

5. **PROPUESTAS Y LINEAMIENTOS ESTRATÉGICOS PARA LA PRÓXIMA SEMANA**
   - 3 a 5 recomendaciones prácticas de mejora continua y optimización de la atención al vecino de Itá Ibaté.

Usa un tono formal, claro y constructivo para la función pública.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      informe: response.text || 'No se pudo generar el informe ejecutivo.',
      fechaGeneracion: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generando resumen ejecutivo:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno al procesar con IA.',
    });
  }
}
