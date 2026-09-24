import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialise server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Resumen Ejecutivo Automatizado con Inteligencia Artificial
app.post('/api/ai/resumen-ejecutivo', async (req: Request, res: Response) => {
  try {
    const { periodo, reportes, metricasGlobales, problemasTransversales, decisionesPendientes } = req.body;

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

    res.json({
      success: true,
      informe: response.text || 'No se pudo generar el informe ejecutivo.',
      fechaGeneracion: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generando resumen ejecutivo:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor al procesar la solicitud con IA.',
    });
  }
});

// Endpoint: Detección Avanzada de Problemas Transversales con IA
app.post('/api/ai/analisis-transversal', async (req: Request, res: Response) => {
  try {
    const { reportes } = req.body;

    const prompt = `
Analiza la siguiente lista de reportes de áreas de la Municipalidad de Itá Ibaté:
${JSON.stringify(reportes, null, 2)}

Identifica y extrae problemas transversales: necesidades de recursos, cuellos de botella, quejas vecinales o trabas operativas que se repiten o coinciden entre DOS O MÁS dependencias (por ejemplo: falta de combustible o vehículos compartidos entre Tránsito y Obras Públicas; falta de computadoras o fallas de internet entre Hacienda y Bromatología; falta de espacio físico en mesa de entradas).

Devuelve EXCLUSIVAMENTE un arreglo JSON válido con el siguiente formato para cada problema transversal encontrado:
[
  {
    "categoria": "Vehículos y Movilidad | Conectividad y Sistemas | Espacio Físico | Personal | Insumos Operativos",
    "titulo": "Título conciso del problema común",
    "areasAfectadas": ["Área 1", "Área 2"],
    "descripcion": "Explicación breve de cómo impacta a cada área involucrada",
    "nivelUrgencia": "URGENTE" | "IMPORTANTE" | "SEGUIMIENTO",
    "accionRecomendada": "Acción unificada recomendada que debe instruir Secretaría General"
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let items = [];
    try {
      items = JSON.parse(response.text?.trim() || '[]');
    } catch (parseErr) {
      console.warn('Error parsing JSON from Gemini, returning fallback array', parseErr);
    }

    res.json({
      success: true,
      problemasTransversales: items,
    });
  } catch (error: any) {
    console.error('Error analizando problemas transversales:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al analizar problemas transversales',
    });
  }
});

// Endpoint: Estado del servicio
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    sistema: 'Sistema de Información y Seguimiento Municipal - Itá Ibaté',
    secretaria: 'Secretaría General',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Itá Ibaté Municipalidad] Servidor activo en http://0.0.0.0:${port}`);
  });
}

startServer();
