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
    const { reportes } = req.body || {};

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

    return res.status(200).json({
      success: true,
      problemasTransversales: items,
    });
  } catch (error: any) {
    console.error('Error analizando problemas transversales:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al analizar problemas transversales',
    });
  }
}
