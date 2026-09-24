export default function handler(_req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    sistema: 'Sistema de Información y Seguimiento Municipal - Itá Ibaté',
    secretaria: 'Secretaría General',
    timestamp: new Date().toISOString(),
  });
}
