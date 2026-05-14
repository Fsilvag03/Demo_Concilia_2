import React, { useState } from 'react';
import { Process } from './ProcessCard';
import { 
  Rocket, CheckCircle2, AlertTriangle, XCircle, ArrowRight,
  ShieldCheck, History, Info, Play, FileText, Check, UploadCloud,
  FileCheck2, ListChecks, ArrowUpRight
} from 'lucide-react';

interface PublicacionSectionProps {
  process: Process;
  onNavigate: (sectionId: string) => void;
  onPublish?: () => void;
}

export const PublicacionSection: React.FC<PublicacionSectionProps> = ({ process, onNavigate, onPublish }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(process.status === 'active');
  const [showConfirm, setShowConfirm] = useState(false);

  // Simulated validation logic based on process data
  const hasSources = process.sources && process.sources.length > 0;
  const hasRector = !!process.rectorSource;
  
  const checklist = [
    { id: 'datos', label: 'Datos del proceso completos', status: 'success' as const },
    { 
      id: 'fuentes', 
      label: 'Fuentes y campos configurados', 
      status: hasSources ? 'success' as const : 'error' as const,
      message: hasSources ? undefined : 'No hay fuentes definidas.'
    },
    { id: 'preparacion', label: 'Preparación de datos completa', status: 'warning' as const, message: 'Controles de consistencia con advertencias' },
    { 
      id: 'estrategia', 
      label: 'Estrategia de conciliación', 
      status: hasRector ? 'success' as const : 'error' as const,
      message: hasRector ? undefined : 'Falta definir fuente rectora.'
    },
    { id: 'diferencias', label: 'Diferencias y reglas completas', status: 'success' as const },
    { id: 'resultados', label: 'Resultados y salidas configurados', status: 'warning' as const, message: 'No hay reporte activo configurado.' }
  ];

  const hasErrors = checklist.some(item => item.status === 'error');
  const hasWarnings = checklist.some(item => item.status === 'warning');

  const handlePublishClick = () => {
    if (hasErrors) return;
    if (hasWarnings) {
      setShowConfirm(true);
    } else {
      executePublish();
    }
  };

  const executePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setShowConfirm(false);
      setIsPublished(true);
      if (onPublish) onPublish();
    }, 1500);
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main checklist & Validation) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bloque 1: Estado de publicación */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-1.5 h-full ${isPublished ? 'bg-emerald-500' : hasErrors ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
             <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[15px] font-bold text-slate-800 mb-1">Estado de publicación</h4>
                  <div className="flex items-center gap-2 mt-2">
                     {isPublished ? (
                       <span className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                         <CheckCircle2 size={16} /> Publicado y Activo
                       </span>
                     ) : hasErrors ? (
                       <span className="flex items-center gap-1.5 text-[13px] font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                         <XCircle size={16} /> Bloqueado por errores
                       </span>
                     ) : (
                       <span className="flex items-center gap-1.5 text-[13px] font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                         <AlertTriangle size={16} /> Borrador con pendientes
                       </span>
                     )}
                  </div>
                </div>
                <div className="text-right text-[12.5px] text-slate-500 space-y-1">
                   <div className="flex items-center justify-end gap-2">
                     <span>Última versión publicada:</span>
                     <span className="font-bold text-slate-700">v2</span>
                   </div>
                   <div className="flex items-center justify-end gap-2">
                     <span>Borrador actual:</span>
                     <span className="font-medium text-amber-600">4 cambios pendientes</span>
                   </div>
                   <div className="flex items-center justify-end gap-2">
                     <span>Última validación:</span>
                     <span className={`font-medium ${hasErrors ? 'text-rose-600' : hasWarnings ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {hasErrors ? 'Con errores' : hasWarnings ? 'Con observaciones' : 'Exitosa'}
                     </span>
                   </div>
                </div>
             </div>
          </div>

          {/* Bloque 2: Checklist */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
             <div className="flex items-center justify-between mb-5">
               <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                 <ListChecks size={18} className="text-primary" />
                 Checklist de publicación
               </h4>
               <button className="text-[12.5px] font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5">
                 <ShieldCheck size={14} /> Validar ahora
               </button>
             </div>

             <div className="space-y-3">
               {checklist.map((item, index) => (
                 <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-2">
                    <div className="flex items-start gap-2.5">
                       <div className="mt-0.5 shrink-0">
                         {item.status === 'success' && <CheckCircle2 size={16} className="text-emerald-500" />}
                         {item.status === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                         {item.status === 'error' && <XCircle size={16} className="text-rose-500" />}
                       </div>
                       <div>
                         <span className={`text-[13px] font-bold tracking-tight block leading-snug ${
                           item.status === 'error' ? 'text-rose-700' : 'text-slate-700'
                         }`}>
                           {item.label}
                         </span>
                         {item.message && (
                           <span className={`text-[11.5px] mt-0.5 block ${
                             item.status === 'error' ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'
                           }`}>
                             {item.message}
                           </span>
                         )}
                       </div>
                    </div>
                    {item.status !== 'success' && (
                       <button 
                         onClick={() => onNavigate(item.id)}
                         className={`shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                           item.status === 'error' 
                             ? 'text-rose-700 bg-rose-100 hover:bg-rose-200' 
                             : 'text-amber-700 bg-amber-100 hover:bg-amber-200'
                         }`}
                       >
                         {item.status === 'error' ? 'Ir a corregir' : 'Revisar'}
                         <ArrowUpRight size={13} />
                       </button>
                    )}
                 </div>
               ))}
             </div>
             
             {hasErrors && (
               <div className="mt-5 p-3 rounded-lg bg-rose-50 border border-rose-100 flex items-start gap-3">
                  <XCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[12.5px] text-rose-700 leading-relaxed font-medium">
                    Existen errores bloqueantes. Corrige los elementos marcados en rojo para poder publicar.
                  </p>
               </div>
             )}
          </div>
        </div>

        {/* Right Column (Summary, Versioning, Action) */}
        <div className="space-y-6">
          
          {/* Bloque 4: Resumen de impacto */}
          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5">
             <h4 className="text-[14px] font-bold text-slate-800 flex items-center gap-2 mb-4">
               <FileCheck2 size={16} className="text-slate-400" />
               Impacto de configuración
             </h4>
             <p className="text-[12.5px] text-slate-600 mb-4 leading-relaxed">
               Se publicará la configuración del proceso <strong className="text-slate-800">{process.name}</strong>. Incluye:
             </p>
             <ul className="space-y-2.5">
               <li className="flex items-center justify-between text-[13px] border-b border-slate-200/60 pb-2">
                 <span className="text-slate-500 font-medium">Fuentes involucradas</span>
                 <span className="font-bold text-slate-700">{Math.max(process.sources.length, 1)} activas</span>
               </li>
               <li className="flex items-center justify-between text-[13px] border-b border-slate-200/60 pb-2">
                 <span className="text-slate-500 font-medium">Campos mapeados</span>
                 <span className="font-bold text-slate-700">12 campos</span>
               </li>
               <li className="flex items-center justify-between text-[13px] border-b border-slate-200/60 pb-2">
                 <span className="text-slate-500 font-medium">Reglas preparación</span>
                 <span className="font-bold text-slate-700">8 reglas</span>
               </li>
               <li className="flex items-center justify-between text-[13px] border-b border-slate-200/60 pb-2">
                 <span className="text-slate-500 font-medium">Controles de consistencia</span>
                 <span className="font-bold text-slate-700">2 controles</span>
               </li>
               <li className="flex items-center justify-between text-[13px] border-b border-slate-200/60 pb-2">
                 <span className="text-slate-500 font-medium">Pasos de cruce</span>
                 <span className="font-bold text-slate-700">3 definidos</span>
               </li>
               <li className="flex items-center justify-between text-[13px] border-b border-slate-200/60 pb-2">
                 <span className="text-slate-500 font-medium">Tratamientos de diferencias</span>
                 <span className="font-bold text-slate-700">6 definidos</span>
               </li>
               <li className="flex items-center justify-between text-[13px] border-b border-slate-200/60 pb-2">
                 <span className="text-slate-500 font-medium">Reglas de aprobación</span>
                 <span className="font-bold text-slate-700">3 definidas</span>
               </li>
               <li className="flex items-center justify-between text-[13px]">
                 <span className="text-slate-500 font-medium">Salidas / Reportes</span>
                 <span className="font-bold text-slate-700">2 activos</span>
               </li>
             </ul>
          </div>

          {/* Bloque 5: Versionado */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
             <h4 className="text-[14px] font-bold text-slate-800 flex items-center gap-2 mb-4">
               <History size={16} className="text-slate-400" />
               Historial reciente
             </h4>
             <div className="space-y-4">
               <div className="relative pl-5">
                 <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10"></div>
                 <div className="absolute left-1 top-3.5 w-0.5 h-10 bg-slate-100"></div>
                 <div className="flex items-center justify-between">
                   <span className="text-[13px] font-bold text-slate-700">Versión 3 (Borrador)</span>
                 </div>
                 <span className="text-[11.5px] text-slate-500">Actual - Pendiente de publicar</span>
               </div>
               
               <div className="relative pl-5">
                 <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-slate-300"></div>
                 <div className="flex flex-col">
                   <span className="text-[13px] font-bold text-slate-700">Versión 2</span>
                   <span className="text-[11.5px] text-slate-500 mt-0.5">Juan Pérez • 28 Abr 2026</span>
                   <span className="text-[11.5px] text-slate-400 italic mt-1">Ajuste en reglas rectificadas.</span>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
