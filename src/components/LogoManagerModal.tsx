import React, { useState } from 'react';
import { Image, Upload, RotateCcw, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl: string;
  onUpdateLogoUrl: (url: string) => void;
}

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl,
  onUpdateLogoUrl,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentLogoUrl);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen válido (PNG, JPG, SVG o WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPreviewUrl(result);
          onUpdateLogoUrl(result);
          setMensajeExito('¡Logo municipal actualizado con éxito!');
          setTimeout(() => setMensajeExito(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetOficial = () => {
    const defaultUrl = '/muni-logo.png';
    setPreviewUrl(defaultUrl);
    onUpdateLogoUrl(defaultUrl);
    setMensajeExito('Se restableció el escudo oficial municipal de Itá Ibaté.');
    setTimeout(() => setMensajeExito(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Image className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Logo Institucional Municipal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {mensajeExito && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{mensajeExito}</span>
            </div>
          )}

          {/* Vista Previa del Logo Actual */}
          <div className="text-center p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[11px] font-semibold uppercase text-slate-500 mb-3">
              Vista previa actual del membrete
            </span>
            <div className="w-24 h-24 p-2 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden">
              <img
                src={previewUrl}
                alt="Logo Municipalidad de Itá Ibaté"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/muni-logo.png';
                }}
              />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2">
              Municipalidad de Itá Ibaté
            </span>
            <span className="text-[11px] text-slate-500">
              Secretaría General · Corrientes
            </span>
          </div>

          {/* Opciones de Carga */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors text-center">
              <Upload className="w-4 h-4" />
              <span>Subir Imagen de Logo desde mi Computadora</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetOficial}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Restablecer Escudo Oficial por Defecto</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            El logo seleccionado se reflejará automáticamente en la cabecera del sistema, en los resúmenes ejecutivos oficiales y en las impresiones.
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
