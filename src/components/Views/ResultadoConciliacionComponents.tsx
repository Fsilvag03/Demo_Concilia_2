import React from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, XCircle, 
  Lock, Clock, FileCheck, FileX, Filter, Search, ChevronDown, Download, Eye,
  Layers, ArrowRight, Activity, FileText, Database, GitMerge, AlertCircle, Info, FileBarChart, Check, Zap, Play, X, Paperclip
} from 'lucide-react';

import { createPortal } from 'react-dom';

export function DetalleResultadoModal({ data, onClose }: { data: any, onClose: () => void }) {
  if (!data) return null;

  const isDiferencia = data.estado === 'Diferencia';
  const isConciliado = data.estado === 'Conciliado';
  const isPendiente = data.estado === 'Pendiente Aprobación';
  const isExcluido = data.estado === 'Excluido';

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex gap-4 items-center">
            <div className={`p-3 rounded-lg ${
                isConciliado ? 'bg-emerald-100 text-emerald-600' :
                isDiferencia ? 'bg-amber-100 text-amber-600' :
                isPendiente ? 'bg-indigo-100 text-indigo-600' :
                'bg-slate-200 text-slate-600'
              }`}>
              {isConciliado ? <CheckCircle2 size={24} /> :
               isDiferencia ? <AlertTriangle size={24} /> :
               isPendiente ? <ShieldCheck size={24} /> :
               <FileX size={24} />}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 block">
                Análisis de Transacción
              </span>
              <h3 className="text-xl font-bold text-slate-800">{data.clave}</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">{data.nombre}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-slate-50/50">
          
          <div className="flex flex-col gap-6">
            
            {/* Top Area: Values & Criteria Side-by-Side */}
            {!isExcluido && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Comparación de Valores */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">
                    <Database size={16} className="text-slate-400" />
                    Comparación de Valores
                  </h4>
                  
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                         <tr>
                           <th className="px-4 py-3 border-b border-r border-slate-200 w-1/3">Campo de Datos</th>
                           <th className="px-4 py-3 border-b border-r border-slate-200 w-1/3 text-slate-700">{data.fuenteR} <span className="text-[10px] font-normal text-slate-400 ml-1">(Principal)</span></th>
                           <th className="px-4 py-3 border-b border-slate-200 w-1/3 text-slate-700">{data.fuenteC && data.fuenteC !== '-' ? data.fuenteC : 'Contraparte'}</th>
                         </tr>
                       </thead>
                       <tbody className="text-[13px] divide-y divide-slate-100">
                         <tr className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-4 py-3 font-semibold text-slate-700 border-r border-slate-100 flex items-center gap-2">
                             <Layers size={14} className="text-slate-400" />
                             Clave de Referencia
                           </td>
                           <td className="px-4 py-3 font-mono text-slate-600 border-r border-slate-100">{data.clave}</td>
                           <td className="px-4 py-3 font-mono text-slate-600">{data.clave}</td>
                         </tr>
                         <tr className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-4 py-3 font-semibold text-slate-700 border-r border-slate-100 flex items-center gap-2">
                             <Activity size={14} className="text-slate-400" />
                             Monto Total
                           </td>
                           <td className="px-4 py-4 border-r border-slate-100">
                             <span className="text-lg font-mono font-medium text-slate-800">{data.montoR || '-'}</span>
                           </td>
                           <td className="px-4 py-4">
                             <span className="text-lg font-mono font-medium text-slate-800">{data.montoC || '-'}</span>
                           </td>
                         </tr>
                       </tbody>
                    </table>
                  </div>
                  
                  {/* Trazabilidad (Paso) */}
                  <div className="pt-2">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                      <GitMerge size={16} className="text-slate-400" />
                      Trazabilidad del Cruce
                    </h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4 shadow-sm">
                       <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm mt-0.5">
                         {data.paso === '1. Cruce exacto' ? '1' : data.paso === '2. Cruce tolerante' ? '2' : '-'}
                       </div>
                       <div>
                         <span className="text-sm font-bold text-slate-800 block mb-1">{data.paso}</span>
                         <span className="text-[13px] text-slate-500 leading-relaxed block">
                           El motor de conciliación procesó este registro durante el <strong>paso {data.paso === '1. Cruce exacto' ? '1' : data.paso === '2. Cruce tolerante' ? '2' : ''}</strong> de la estrategia actual, 
                           y se determinó que su estado final es <span className={`font-semibold inline-block px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wider ${
                             isConciliado ? 'bg-emerald-100 text-emerald-700' :
                             isDiferencia ? 'bg-amber-100 text-amber-700' :
                             isPendiente ? 'bg-indigo-100 text-indigo-700' :
                             'bg-slate-200 text-slate-700'
                           }`}>{data.estado}</span>.
                         </span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Criterios */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">
                    <CheckCircle2 size={16} className="text-slate-400" />
                    Criterios Evaluados
                  </h4>
                  <div className="space-y-2.5">
                     <div className="flex items-start gap-3 p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[13px] font-bold text-slate-800 block">Coincidencia de Clave</span>
                          <span className="text-[12px] text-slate-500 mt-0.5 block leading-relaxed">Ambos registros comparten la id de referencia.</span>
                        </div>
                     </div>
                     {isDiferencia && (
                       <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-100 shadow-sm rounded-xl">
                          <XCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[13px] font-bold text-rose-900 block">Diferencia de Monto</span>
                            <span className="text-[12px] text-rose-700 mt-0.5 block leading-relaxed">Diferencia nominal mayor al límite permitido.</span>
                          </div>
                       </div>
                     )}
                     {isConciliado && (
                       <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-100 shadow-sm rounded-xl">
                          <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[13px] font-bold text-emerald-900 block">Monto dentro de rango</span>
                            <span className="text-[12px] text-emerald-700 mt-0.5 block leading-relaxed">Satisface las reglas y el par de tolerancia.</span>
                          </div>
                       </div>
                     )}
                     {data.nombre === 'Falta en Sistema POS' && (
                       <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-100 shadow-sm rounded-xl">
                          <XCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[13px] font-bold text-rose-900 block">Sin Contraparte</span>
                            <span className="text-[12px] text-rose-700 mt-0.5 block leading-relaxed">No se detectó el registro equivalente en POS.</span>
                          </div>
                       </div>
                     )}
                  </div>
                </div>

              </div>
            )}
            
            {/* Excluido View */}
            {isExcluido && (
              <div className="max-w-2xl mx-auto w-full space-y-4 py-8">
                <h4 className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">
                  <FileX size={16} className="text-slate-400" />
                  Motivo de Exclusión
                </h4>
                <div className="bg-white border border-slate-200 p-6 rounded-xl text-center shadow-sm">
                  <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Filter size={24} className="text-slate-400" />
                  </div>
                  <h5 className="text-base font-bold text-slate-800 mb-2">Descartado en preparación</h5>
                  <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                    El registro no cumplió con las reglas de preparación de datos configuradas para la fuente, por lo que fue descartado antes de la conciliación.
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col gap-3 text-left max-w-sm mx-auto">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Fuente de Origen</span>
                      <span className="text-sm font-bold text-slate-700">{data.fuenteR}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Regla Aplicada</span>
                      <span className="font-mono text-rose-700 font-bold text-xs bg-rose-50 border border-rose-100 px-2 py-1.5 rounded shadow-sm">Monto == 0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Area: Operativa & Aprobaciones */}
            {!isExcluido && (isDiferencia || isPendiente || data.tratamiento !== '-') && (
              <div className="pt-2 border-t border-slate-200 mt-2">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 pb-4">
                  <Activity size={16} className="text-slate-400" />
                  Gestión Operativa del Registro
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Atención */}
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100 text-[13px] font-medium">
                           <tr>
                              <td className="py-3 px-5 text-slate-500 bg-slate-50/50">Modo de Atención</td>
                              <td className="py-3 px-5 text-right w-1/2">
                                <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                                  data.tratamiento === 'Regularizar' ? 'bg-rose-100 text-rose-700 border border-rose-200 w-full text-center' :
                                  data.tratamiento === 'Revisar' ? 'bg-amber-100 text-amber-700 border border-amber-200 w-full text-center' :
                                  'bg-slate-100 text-slate-700 border border-slate-200 w-full text-center'
                                }`}>{data.tratamiento}</span>
                              </td>
                           </tr>
                           <tr>
                              <td className="py-3 px-5 text-slate-500 bg-slate-50/50 flex items-center gap-2"><Lock size={14} className="text-slate-400"/> Bloquea Cierre</td>
                              <td className="py-3 px-5 text-right font-bold text-slate-800">
                                {data.tratamiento === 'Regularizar' || data.tratamiento === 'Revisar' ? <span className="text-rose-600">Sí</span> : 'No'}
                              </td>
                           </tr>
                           <tr>
                              <td className="py-3 px-5 text-slate-500 bg-slate-50/50 flex items-center gap-2"><Clock size={14} className="text-slate-400"/> SLA de Resolución</td>
                              <td className="py-3 px-5 text-right font-bold text-slate-800">24 horas</td>
                           </tr>
                           <tr>
                              <td className="py-3 px-5 text-slate-500 bg-slate-50/50 flex items-center gap-2">Sustento Obligatorio</td>
                              <td className="py-3 px-5 text-right flex justify-end gap-2 flex-wrap">
                                 <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5 shadow-sm"><FileText size={12} className="text-slate-400"/> Observación</span>
                                 <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5 shadow-sm"><Paperclip size={12} className="text-slate-400"/> Adjunto</span>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  {/* Aprobación */}
                  {(isPendiente || data.aprobacion !== '-') ? (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 relative overflow-hidden">
                      <div className="absolute -right-6 -top-6 text-indigo-100/50 rotate-12">
                        <ShieldCheck size={120} strokeWidth={1} />
                      </div>
                      <div className="relative z-10 space-y-4">
                         <div className="flex items-center gap-3 text-indigo-600">
                           <ShieldCheck size={20} />
                           <span className="font-bold text-sm tracking-wide">Aprobación Requerida</span>
                         </div>
                         <div className="bg-white border border-indigo-100/60 rounded-lg p-4 text-[13px] space-y-3 shadow-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium">Regla desencadenada</span>
                              <span className="font-bold text-slate-800">Revisión de montos altos</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium">Condición</span>
                              <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[12px] font-bold min-w-[70px] text-center">Monto {'>'} 1,000</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1">
                              <span className="text-slate-500 font-medium">Valor evaluado</span>
                              <span className="font-mono text-slate-800 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[12px]">{data.montoR || data.montoC || '$1,500'}</span>
                            </div>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center">
                      <ShieldCheck size={24} className="text-slate-300 mb-2" />
                      <span className="text-sm font-bold text-slate-400">Sin reglas de aprobación</span>
                      <span className="text-[12px] text-slate-400 mt-1 max-w-[200px]">Este registro no cumple las condiciones para requerir aprobación.</span>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
          
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
           <button onClick={onClose} className="px-6 py-2.5 bg-slate-800 text-white text-[13px] font-bold rounded-lg hover:bg-slate-900 transition-colors shadow-sm focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 outline-none">
              Cerrar Detalle
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
