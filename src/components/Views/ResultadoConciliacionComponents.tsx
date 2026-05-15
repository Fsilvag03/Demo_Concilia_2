import React from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, XCircle, 
  Lock, Clock, FileCheck, FileX, Filter, Search, ChevronDown, Download, Eye,
  Layers, ArrowRight, Activity, FileText, Database, GitMerge, AlertCircle, Info, FileBarChart, Check, Zap, Play, X, Paperclip
} from 'lucide-react';

import { createPortal } from 'react-dom';

export function DetalleResultadoModal({ data, onClose }: { data: any, onClose: () => void }) {
  if (!data) return null;

  const isDiferencia = data.estado === 'Con diferencia';
  const isConciliado = data.estado === 'Conciliado';
  const isExcluido = data.estado === 'Excluido';
  const isPendiente = data.aprobacion === 'Pendiente';

  const StateIcon = isConciliado ? CheckCircle2 :
                    isDiferencia ? AlertTriangle :
                    isPendiente ? ShieldCheck :
                    FileX;
  
  const iconColor = isConciliado ? 'text-emerald-500 bg-emerald-50' :
                    isDiferencia ? 'text-amber-500 bg-amber-50' :
                    isPendiente ? 'text-indigo-500 bg-indigo-50' :
                    'text-slate-500 bg-slate-100';

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 md:px-8 py-6 border-b border-slate-100 relative">
          <div className="flex gap-4 items-center">
             <div className={`p-3 rounded-full ${iconColor} shrink-0`}>
                <StateIcon size={24} strokeWidth={2} />
             </div>
             <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                  Detalle de Registro
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{data.clave}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{data.nombre}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:px-8 md:py-8 overflow-y-auto hide-scrollbar flex-1">
          
          <div className="flex flex-col gap-8">
            
            {!isExcluido && (
              <>
                {/* Valores */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Database size={16} className="text-slate-400" />
                    Comparación
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div className={`p-4 rounded-xl border relative group transition-all shadow-sm ${data.direccionDiferencia === 'mayor_r' ? 'bg-amber-50/50 border-amber-100' : data.direccionDiferencia === 'menor_r' ? 'bg-rose-50/50 border-rose-100' : 'bg-white border-slate-200'}`}>
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3 line-clamp-1" title={data.fuenteR}>{data.fuenteR} <span className="text-[10px] font-normal lowercase ml-1">(Principal)</span></span>
                       <div className="text-2xl lg:text-3xl font-mono text-slate-800 font-medium">{data.montoR || '-'}</div>
                     </div>
                     <div className={`p-4 rounded-xl border relative group transition-all shadow-sm ${data.direccionDiferencia === 'menor_r' ? 'bg-amber-50/50 border-amber-100' : data.direccionDiferencia === 'mayor_r' ? 'bg-rose-50/50 border-rose-100' : 'bg-white border-slate-200'}`}>
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3 line-clamp-1" title={data.fuenteC && data.fuenteC !== '-' ? data.fuenteC : 'Contraparte'}>{data.fuenteC && data.fuenteC !== '-' ? data.fuenteC : 'Contraparte'}</span>
                       <div className="text-2xl lg:text-3xl font-mono text-slate-800 font-medium">{data.montoC || '-'}</div>
                     </div>
                  </div>
                  {data.diferencia !== '-' && data.diferencia !== '0.00' && (
                     <div className={`flex items-center justify-between p-4 rounded-xl border ${data.direccionDiferencia === 'mayor_r' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        <span className="text-sm font-bold uppercase tracking-wider block">Diferencia</span>
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">
                             {data.direccionDiferencia === 'mayor_r' ? `${data.fuenteR} es mayor` : `${data.fuenteR} es menor`}
                           </span>
                           <span className="text-xl font-mono font-medium">{data.diferencia}</span>
                        </div>
                     </div>
                  )}
                </div>

                <div className="h-px bg-slate-100 w-full line-clamp-none" />

                {/* Trazabilidad y Evaluación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <GitMerge size={16} className="text-slate-400" />
                        Trazabilidad
                      </h4>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Clasificación Asignada</span>
                          <span className="text-sm font-bold text-slate-800">{data.clasificacion || '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Paso o Estrategia</span>
                          <span className="text-sm font-medium text-slate-700">{data.paso}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Estado Final</span>
                          <div>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold tracking-wide uppercase ${
                               isConciliado ? 'bg-emerald-100 text-emerald-700' :
                               isDiferencia ? 'bg-amber-100 text-amber-700' :
                               'bg-slate-100 text-slate-600'
                            }`}>
                              {data.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <FileCheck size={16} className="text-slate-400" />
                        Criterios Evaluados
                      </h4>
                      {data.evaluaciones && data.evaluaciones.length > 0 ? (
                        <div className="space-y-2">
                           {data.evaluaciones.map((req: any, i: number) => (
                              <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg border shadow-sm ${req.estado === 'pass' ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-rose-50/50 border-rose-100/50'}`}>
                                {req.estado === 'pass' ? <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" /> : <XCircle size={15} className="text-rose-500 mt-0.5 shrink-0" />}
                                <div>
                                   <span className={`text-[12px] font-bold block ${req.estado === 'pass' ? 'text-emerald-900' : 'text-rose-900'}`}>{req.criterio}</span>
                                </div>
                              </div>
                           ))}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500 italic">No se encontraron evaluaciones detalladas.</span>
                      )}
                   </div>
                </div>

                <div className="h-px bg-slate-100 w-full line-clamp-none" />

                {/* Info Operativa y Aprobación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Activity size={16} className="text-slate-400" />
                        Acción y Resolución
                      </h4>
                      <div className="space-y-3">
                         <div className="flex flex-col gap-1">
                           <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Tratamiento Sugerido</span>
                           <span className="text-sm font-bold text-slate-800">{data.tratamiento !== '-' ? data.tratamiento : 'Ninguna'}</span>
                         </div>
                         <div className="flex gap-6 mt-3">
                           <div className="flex flex-col gap-1">
                             <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Bloquea Cierre</span>
                             <span className={`text-sm font-bold ${data.bloqueaCierre ? 'text-rose-600' : 'text-slate-600'}`}>{data.bloqueaCierre ? 'Sí' : 'No'}</span>
                           </div>
                           <div className="flex flex-col gap-1">
                             <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">SLA</span>
                             <span className="text-sm font-bold text-slate-600">{data.sla || '-'}</span>
                           </div>
                         </div>
                         <div className="flex flex-col gap-1 mt-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Sustento Obligatorio</span>
                            <div className="flex items-center gap-2 flex-wrap">
                               {data.sustento && data.sustento.length > 0 ? data.sustento.map((s: string, idx: number) => (
                                 <span key={idx} className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm flex items-center gap-1.5"><Paperclip size={12} className="text-slate-400" /> {s}</span>
                               )) : <span className="text-sm text-slate-500 font-medium">Ninguno</span>}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={16} className="text-slate-400" />
                        Estado de Aprobación
                      </h4>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
                        <div className="flex flex-col gap-1">
                           <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Estado Actual</span>
                           <div className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                             {data.aprobacion === 'Pendiente' ? <Clock size={16} className="text-amber-500" /> : 
                              data.aprobacion === 'Aprobada' ? <CheckCircle2 size={16} className="text-emerald-500" /> : 
                              data.aprobacion === 'Rechazada' ? <XCircle size={16} className="text-rose-500" /> : 
                              <Info size={16} className="text-slate-400" />} 
                             <span className={`font-bold ${data.aprobacion === 'Pendiente' ? 'text-amber-700' : data.aprobacion === 'Aprobada' ? 'text-emerald-700' : data.aprobacion === 'Rechazada' ? 'text-rose-700' : 'text-slate-600'}`}>{data.aprobacion}</span>
                           </div>
                        </div>

                        {data.aprobacionDetalle && (
                          <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2.5">
                             <div className="flex justify-between items-center text-[12px]">
                               <span className="text-slate-500 font-semibold uppercase tracking-wider">Origen</span>
                               <span className="font-bold text-slate-700">{data.aprobacionDetalle.origen}</span>
                             </div>
                             <div className="flex justify-between items-center text-[12px] border-t border-slate-100 pt-2.5">
                               <span className="text-slate-500 font-semibold uppercase tracking-wider">Regla Aplicada</span>
                               <span className="font-bold text-slate-700">{data.aprobacionDetalle.regla}</span>
                             </div>
                             <div className="flex justify-between items-center text-[12px] border-t border-slate-100 pt-2.5">
                               <span className="text-slate-500 font-semibold uppercase tracking-wider">Condición Evaluada</span>
                               <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">{data.aprobacionDetalle.condicion}</span>
                             </div>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              </>
            )}

            {isExcluido && (
               <div className="space-y-6">
                 <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <div className="mx-auto w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-slate-400">
                      <Filter size={24} />
                    </div>
                    <h5 className="text-lg font-bold text-slate-800 mb-2">Registro Excluido</h5>
                    <p className="text-sm text-slate-500">
                      Este registro fue excluido durante la preparación porque no cumplió con los criterios necesarios para ingresar a las reglas de conciliación.
                    </p>
                 </div>
                 
                 <div className="flex gap-4">
                    <div className="flex-1 p-4 rounded-xl border border-slate-100 bg-slate-50">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Fuente</span>
                       <span className="text-base font-medium text-slate-800">{data.fuenteR}</span>
                    </div>
                    <div className="flex-1 p-4 rounded-xl border border-slate-100 bg-slate-50">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Regla</span>
                       <span className="text-base font-medium text-slate-800">Monto {'<='} 0</span>
                    </div>
                 </div>
               </div>
            )}
            
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
           <button onClick={onClose} className="px-6 py-2.5 bg-slate-800 text-white text-[13px] font-bold rounded-lg hover:bg-slate-900 transition-colors shadow-sm focus:ring-4 focus:ring-slate-900/10 outline-none">
              Aceptar
           </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export function BlockControlesConsistencia() {
  return (
    <div className="space-y-3 animate-in fade-in pt-4 mt-6 border-t border-slate-100">
      <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
        <Activity size={16} className="text-indigo-500" />
        Controles de Consistencia
      </h3>
      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Nombre del Control</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Fuente Asoc.</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Resultado</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Calculado</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Comparado</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Diferencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
               <td className="px-4 py-2.5 text-[12px] font-semibold text-slate-700">Total Suma Partidas vs Control</td>
               <td className="px-4 py-2.5 text-[12px] text-slate-600">Libro Mayor</td>
               <td className="px-4 py-2.5 text-center">
                 <span className="inline-flex items-center justify-center p-1 rounded-full bg-emerald-100 text-emerald-600"><Check size={12} /></span>
               </td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">$47,000.00</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">$47,000.00</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-400 text-right">-</td>
            </tr>
            <tr className="hover:bg-slate-50">
               <td className="px-4 py-2.5 text-[12px] font-semibold text-slate-700">Cantidad Registros Totales</td>
               <td className="px-4 py-2.5 text-[12px] text-slate-600">Sistema POS</td>
               <td className="px-4 py-2.5 text-center">
                 <span className="inline-flex items-center justify-center p-1 rounded-full bg-emerald-100 text-emerald-600"><Check size={12} /></span>
               </td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">1323</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">1323</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-400 text-right">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BlockDiferenciasGeneradas() {
  return (
    <div className="space-y-3 animate-in fade-in pt-4 mt-6 border-t border-slate-100">
      <div className="flex justify-between items-end mb-1">
        <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-500" />
          Diferencias Generadas
        </h3>
        <button className="text-[12px] font-bold text-primary hover:text-primary-dark flex items-center gap-1">
          Ir a Bandeja de Diferencias <ArrowRight size={14} />
        </button>
      </div>
      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap min-w-[900px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Tratamiento / Agrupación</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Cantidad</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Monto Asoc.</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Tratamiento</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Bloquea Cierre</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Aprobación</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">SLA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
               <td className="px-4 py-2.5 text-[12px] font-bold text-slate-800">Diferencia de Monto (Comisión)</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">3</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">$205.62</td>
               <td className="px-4 py-2.5 text-center">
                 <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Revisar</span>
               </td>
               <td className="px-4 py-2.5 text-center">
                  <span className="inline-flex items-center justify-center p-1 rounded-full bg-rose-100 text-rose-600" title="Sí Bloquea"><Lock size={12} /></span>
               </td>
               <td className="px-4 py-2.5 text-center"><span className="text-slate-400 text-[11px]">-</span></td>
               <td className="px-4 py-2.5 text-[11px] font-mono text-slate-500 text-center">24h</td>
            </tr>
            <tr className="hover:bg-slate-50">
               <td className="px-4 py-2.5 text-[12px] font-bold text-slate-800">Falta en Sistema POS</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">1</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">$1,500.00</td>
               <td className="px-4 py-2.5 text-center">
                 <span className="text-[11px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Regularizar</span>
               </td>
               <td className="px-4 py-2.5 text-center">
                  <span className="inline-flex items-center justify-center p-1 rounded-full bg-rose-100 text-rose-600" title="Sí Bloquea"><Lock size={12} /></span>
               </td>
               <td className="px-4 py-2.5 text-center text-[11px] text-slate-600 font-medium flex justify-center items-center gap-1"><ShieldCheck size={12} className="text-indigo-500"/> Si</td>
               <td className="px-4 py-2.5 text-[11px] font-mono text-slate-500 text-center">48h</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BlockAprobacionesGeneradas() {
  return (
    <div className="space-y-3 animate-in fade-in pt-4 mt-6 border-t border-slate-100">
      <div className="flex justify-between items-end mb-1">
        <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck size={16} className="text-indigo-500" />
          Aprobaciones Generadas
        </h3>
        <button className="text-[12px] font-bold text-primary hover:text-primary-dark flex items-center gap-1">
          Ir a Bandeja de Aprobaciones <ArrowRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Diferencias pend. */}
        <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col">
           <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">Diferencias Pentientes de Aprob.</span>
           <div className="flex justify-between items-end mt-1">
             <span className="text-2xl font-bold text-slate-800">1</span>
             <span className="text-[10px] uppercase font-bold text-slate-400">CASOS</span>
           </div>
           <div className="mt-3 pt-3 border-t border-slate-100 text-[12px] text-slate-600">
             <span className="font-semibold block mb-1">Motivo / Regla originaria:</span>
             <ul className="list-disc pl-4 space-y-1">
               <li>Aprobación por tratamiento "Regularizar"</li>
             </ul>
           </div>
        </div>
        {/* Conciliados pend. */}
        <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col">
           <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">Conciliados (Requieren Aprob.)</span>
           <div className="flex justify-between items-end mt-1">
             <span className="text-2xl font-bold text-slate-800">1</span>
             <span className="text-[10px] uppercase font-bold text-slate-400">CASOS</span>
           </div>
           <div className="mt-3 pt-3 border-t border-slate-100 text-[12px] text-slate-600">
             <span className="font-semibold block mb-1">Regla de Aprobación Aplicada:</span>
             <ul className="list-disc pl-4 space-y-1">
               <li>Monto Mayor a Tolerancia Directiva ($4,000)</li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

export function BlockRegistrosExcluidos() {
  return (
    <div className="space-y-3 animate-in fade-in pt-4 mt-6 border-t border-slate-100">
      <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
        <FileX size={16} className="text-slate-400" />
        Registros Excluidos (15)
      </h3>
      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Fuente Asoc.</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Clave Original</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Monto</th>
              <th className="px-4 py-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Motivo Exclusión / Regla</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
               <td className="px-4 py-2.5 text-[12px] text-slate-700 font-semibold">Sistema POS</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600">TRX-0991</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">$0.00</td>
               <td className="px-4 py-2.5 text-[12px] text-slate-600">
                 Filtro de Preparación: <span className="font-mono text-[10px] ml-1 bg-slate-100 px-1 py-0.5 rounded">Monto == 0</span>
               </td>
            </tr>
            <tr className="hover:bg-slate-50">
               <td className="px-4 py-2.5 text-[12px] text-slate-700 font-semibold">Cartola Bancaria</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600">20240101-011</td>
               <td className="px-4 py-2.5 text-[12px] font-mono text-slate-600 text-right">$100.00</td>
               <td className="px-4 py-2.5 text-[12px] text-slate-600">
                 Dato basura (No fecha válida)
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BlockSalidasDisponibles() {
  return (
    <div className="space-y-3 animate-in fade-in pt-4 mt-6 border-t border-slate-100">
      <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
        <FileText size={16} className="text-secondary" />
        Salidas Disponibles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map((s) => (
          <div key={s} className="bg-white border rounded-lg border-slate-200 p-4 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Database size={48} />
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{s===1?'CSV':s===2?'Excel':'TXT'}</span>
            <h4 className="text-[13px] font-bold text-slate-800">{s===1?'Registros Conciliados':s===2?'Resumen de Diferencias':'Export Contable'}</h4>
            <div className="mt-3 flex items-center gap-2">
               <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${s===3?'bg-amber-50 text-amber-600':'bg-emerald-50 text-emerald-600'}`}>
                 {s===3?'Pendiente':'Generado'}
               </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
               {s!==3 ? (
                 <button className="text-[12px] font-bold text-primary flex items-center gap-1.5 hover:text-primary-dark">
                   <Download size={14} /> Descargar
                 </button>
               ) : (
                 <button className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5 hover:text-slate-800">
                   <Play size={14} /> Generar
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlockCondicionCierre({ onClose }: {onClose:()=>void}) {
  return (
    <div className="mt-8 pt-6 border-t-2 border-slate-200 pb-16">
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
         <div>
            <h3 className="text-[16px] font-bold text-rose-800 flex items-center gap-2 mb-1">
              <Lock size={18} />
              Cierre de Conciliación Bloqueado
            </h3>
            <p className="text-[13px] text-rose-600 max-w-2xl">
              No es posible cerrar la conciliación porque existen bloqueos pendientes. El cierre congela el resultado y evita modificaciones técnicas.
            </p>
            <ul className="mt-3 space-y-1 text-[12px] font-medium text-rose-700 list-disc pl-4">
              <li>Existen diferencias con tratamiento que bloquea cierre.</li>
              <li>Existen 2 casos pendientes de aprobación superior.</li>
            </ul>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button onClick={onClose} className="flex-1 md:flex-none px-4 py-2 border bg-white border-slate-300 text-slate-700 text-[13px] font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              Volver a Bandeja
            </button>
            <button className="flex-1 md:flex-none px-4 py-2 bg-slate-300 text-slate-500 text-[13px] font-bold rounded-lg cursor-not-allowed">
              Cerrar Conciliación
            </button>
         </div>
      </div>
    </div>
  );
}
