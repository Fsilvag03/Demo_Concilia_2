import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, XCircle, 
  Lock, Clock, FileCheck, FileX, Filter, Search, ChevronDown, Download, Eye,
  Layers, ArrowRight, Activity, FileText, Database, GitMerge, AlertCircle
} from 'lucide-react';
import { 
  DetalleResultadoModal
} from './ResultadoConciliacionComponents';

interface ResultadoConciliacionViewProps {
  onClose: () => void;
  prepResult?: any;
}

export function ResultadoConciliacionView({ onClose, prepResult }: ResultadoConciliacionViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const estadoPrincipal: string = 'Conciliada con aprobaciones pendientes'; 


  const getStateIcon = (size = 16) => {
    switch (estadoPrincipal) {
      case 'Conciliada sin diferencias': return <CheckCircle2 size={size} />;
      case 'Conciliada con diferencias': return <AlertTriangle size={size} />;
      case 'Conciliada con aprobaciones pendientes': return <ShieldCheck size={size} />;
      case 'Conciliación con errores': return <XCircle size={size} />;
      case 'Pendiente de cierre': return <Clock size={size} />;
      case 'Cerrada': return <Lock size={size} />;
      default: return <Activity size={size} />;
    }
  };

  const getStateColor = () => {
     switch (estadoPrincipal) {
      case 'Conciliada sin diferencias': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Conciliada con diferencias': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Conciliada con aprobaciones pendientes': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Conciliación con errores': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Pendiente de cierre': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Cerrada': return 'text-slate-700 bg-slate-50 border-slate-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const mockData = Array.from({ length: 60 }).map((_, i) => {
    const types = [
      {
        estado: 'Pendiente Aprobación', nombre: 'Falta en Sistema POS', clave: `TRX-${99081 + i}`,
        fuenteR: 'Libro Mayor', montoR: null, fuenteC: 'Sistema POS', montoC: '1,500.00',
        paso: '-', tratamiento: 'Regularizar', aprobacion: 'Pendiente'
      },
      {
        estado: 'Diferencia', nombre: 'Diferencia de Monto', clave: `TRX-${11234 + i}`,
        fuenteR: 'Libro Mayor', montoR: '805.62', fuenteC: 'Cartola Bancaria', montoC: '815.62',
        paso: '1. Cruce exacto', tratamiento: 'Revisar', aprobacion: '-'
      },
      {
        estado: 'Conciliado', nombre: 'Cruce Exitoso', clave: `TRX-${99281 + i}`,
        fuenteR: 'Libro Mayor', montoR: '4,200.00', fuenteC: 'Cartola Bancaria', montoC: '4,200.00',
        paso: '2. Cruce tolerante', tratamiento: '-', aprobacion: '-'
      },
      {
        estado: 'Excluido', nombre: 'Fuera de Rango', clave: `TRX-Ex-${String(i+1).padStart(2, '0')}`,
        fuenteR: 'Sistema POS', montoR: '100.00', fuenteC: '-', montoC: '-',
        paso: 'Prep. Datos', tratamiento: 'Informativo', aprobacion: '-'
      }
    ];
    return types[i % 4];
  });

  const filteredData = mockData.filter(row => {
    const matchesFilter = activeFilter === 'Todos' || row.estado === activeFilter || (activeFilter === 'Conciliados' && row.estado === 'Conciliado') || (activeFilter === 'Diferencias' && row.estado === 'Diferencia') || (activeFilter === 'Excluidos' && row.estado === 'Excluido');
    const matchesSearch = row.clave.toLowerCase().includes(searchQuery.toLowerCase()) || row.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full relative z-10 animate-in fade-in duration-300 pb-8 flex flex-col font-sans gap-4">
      
      {/* Dense Metrics Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg shadow-inner overflow-hidden -mt-2">
                <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-slate-200/60">
                   {/* Evaluados */}
                   <div className="p-4 flex flex-col justify-center">
                     <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                       <Database size={13} />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Evaluados</span>
                     </div>
                     <span className="text-2xl font-bold text-slate-800 tracking-tight mb-1">5,823</span>
                     <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded self-start">
                       $47,000.00
                     </span>
                   </div>
                   
                   {/* Conciliados */}
                   <div className="p-4 flex flex-col justify-center relative bg-emerald-50/30">
                     <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                       <CheckCircle2 size={13} />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Conciliados</span>
                     </div>
                     <span className="text-2xl font-bold text-slate-800 tracking-tight mb-1">5,819</span>
                     <span className="text-[11px] font-mono text-emerald-700 bg-white border border-emerald-200 px-1.5 py-0.5 rounded self-start">
                       $45,230.00
                     </span>
                   </div>

                   {/* Con Diferencia */}
                   <div className="p-4 flex flex-col justify-center relative bg-amber-50/30">
                     <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                       <AlertCircle size={13} />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Diferencias</span>
                     </div>
                     <span className="text-2xl font-bold text-slate-800 tracking-tight mb-1">4</span>
                     <span className="text-[11px] font-mono text-amber-700 bg-white border border-amber-200 px-1.5 py-0.5 rounded self-start">
                       $1,705.62
                     </span>
                   </div>

                   {/* Pendiente Aprobación */}
                   <div className="p-4 flex flex-col justify-center relative bg-indigo-50/30">
                     <div className="flex items-center gap-1.5 text-indigo-600 mb-1">
                       <ShieldCheck size={13} />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Pend. Aprob.</span>
                     </div>
                     <span className="text-2xl font-bold text-slate-800 tracking-tight mb-1">2</span>
                     <span className="text-[11px] font-mono text-indigo-700 bg-white border border-indigo-200 px-1.5 py-0.5 rounded self-start">
                       $1,705.62
                     </span>
                   </div>

                   {/* Excluidos */}
                   <div className="p-4 flex flex-col justify-center">
                     <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                       <FileX size={13} />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Excluidos</span>
                     </div>
                     <span className="text-2xl font-bold text-slate-700 tracking-tight mb-1">15</span>
                     <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded self-start">
                       $64.38
                     </span>
                   </div>
                </div>
             </div>



          <div className="space-y-3 animate-in fade-in pt-8 mt-4 border-t-2 border-slate-200">
             <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center bg-slate-50/80 p-2 rounded-lg border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-3">
                   <h3 className="text-[13px] font-bold text-slate-800 shrink-0 hidden md:block">Consolidado de Resultados</h3>
                   <div className="h-4 w-px bg-slate-300 hidden md:block"></div>
                   <div className="relative w-full md:w-56">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input 
                        type="text" 
                        placeholder="Buscar por clave..." 
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-[12px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                   </div>
                 </div>
                 
                 {/* Quick Filters */}
                 <div className="flex overflow-x-auto w-full sm:w-auto hide-scrollbar gap-1 text-[11px] font-medium">
                    <button onClick={() => setActiveFilter('Todos')} className={`px-2.5 py-1.5 rounded whitespace-nowrap transition-colors border ${activeFilter === 'Todos' ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>Todos</button>
                    <button onClick={() => setActiveFilter('Conciliados')} className={`px-2.5 py-1.5 rounded whitespace-nowrap transition-colors border ${activeFilter === 'Conciliados' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}>Conciliados (15)</button>
                    <button onClick={() => setActiveFilter('Diferencias')} className={`px-2.5 py-1.5 rounded whitespace-nowrap transition-colors border ${activeFilter === 'Diferencias' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'}`}>Diferencias (15)</button>
                    <button onClick={() => setActiveFilter('Pendiente Aprobación')} className={`px-2.5 py-1.5 rounded whitespace-nowrap transition-colors border ${activeFilter === 'Pendiente Aprobación' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'}`}>Pend. Aprobación (15)</button>
                    <button onClick={() => setActiveFilter('Excluidos')} className={`px-2.5 py-1.5 rounded whitespace-nowrap transition-colors border ${activeFilter === 'Excluidos' ? 'bg-slate-200 text-slate-800 border-slate-400' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>Excluidos (15)</button>
                 </div>

                 <div className="flex items-center gap-2 w-full sm:w-auto shrinks-0">
                    <button className="flex-1 sm:flex-none px-2.5 py-1.5 border border-slate-300 bg-white rounded text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                      <Filter size={12} /> Más filtros
                    </button>
                    <button title="Exportar CSV" className="flex-1 sm:flex-none p-1.5 border border-slate-300 bg-white rounded text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center shadow-sm">
                      <Download size={14} />
                    </button>
                 </div>
             </div>

             <div className="bg-white border rounded-lg shadow-sm overflow-hidden overflow-x-auto">
               <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                 <thead className="bg-slate-100/60 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Detalle/Tratamiento</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campo Clave</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Principal (Monto)</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Contraparte (Monto)</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Paso Asignado</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aprobación</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredData.map((row, i) => (
                       <tr key={i} onClick={() => setSelectedRow(row)} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                          <td className="px-3 py-2.5">
                             <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                               row.estado === 'Conciliado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                               row.estado === 'Diferencia' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                               row.estado === 'Pendiente Aprobación' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                               'bg-slate-100 text-slate-600 border-slate-200'
                             }`}>
                               {row.estado}
                             </span>
                          </td>
                          <td className="px-3 py-2.5">
                             <div className="text-[12px] font-bold text-slate-800">{row.nombre}</div>
                             {row.tratamiento !== '-' && <div className="text-[10px] text-slate-500">[{row.tratamiento}]</div>}
                          </td>
                          <td className="px-3 py-2.5 text-[12px] font-mono text-slate-600">{row.clave}</td>
                          <td className="px-3 py-2.5 text-right">
                             {row.montoR ? (
                               <div className="font-mono text-[12px] font-medium text-slate-700">{row.montoR}</div>
                             ) : <span className="text-slate-400 font-mono text-[12px]">-</span>}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            {row.montoC ? (
                                <div className="font-mono text-[12px] font-medium text-slate-700">{row.montoC}</div>
                             ) : <span className="text-slate-400 font-mono text-[12px]">-</span>}
                          </td>
                          <td className="px-3 py-2.5 text-[11.5px] text-slate-500">{row.paso}</td>
                          <td className="px-3 py-2.5">
                             {row.aprobacion !== '-' ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-100 bg-indigo-50 text-indigo-600">
                                  {row.aprobacion}
                                </span>
                             ) : <span className="text-slate-400 text-[12px]">-</span>}
                          </td>
                       </tr>
                    ))}
                 </tbody>
               </table>
               <div className="px-3 py-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                 <span className="text-[11px] text-slate-500">Mostrando {filteredData.length > 0 ? 1 : 0} a {filteredData.length > 50 ? 50 : filteredData.length} de {filteredData.length} resultados</span>
                 <div className="flex items-center gap-1">
                   {/* simulated pagination controls */}
                   <select className="border border-slate-200 rounded text-[11px] px-2 py-1 items-center bg-white mr-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20">
                     <option>50 por página</option>
                     <option>100 por página</option>
                     <option>200 por página</option>
                   </select>
                   <button className="px-2 py-1 rounded border border-slate-200 bg-white text-[11px] font-medium text-slate-400 cursor-not-allowed hidden sm:block">Anterior</button>
                   <button className="px-2 py-1 rounded border border-slate-200 bg-primary text-white text-[11px] font-bold">1</button>
                   <button className="px-2 py-1 rounded border border-slate-200 bg-white text-[11px] font-medium text-slate-600 hover:bg-slate-50">2</button>
                   <button className="px-2 py-1 rounded border border-slate-200 bg-white text-[11px] font-medium text-slate-600 hover:bg-slate-50 hidden sm:block">3</button>
                   <span className="text-[11px] text-slate-400 px-1 hidden sm:block">...</span>
                   <button className="px-2 py-1 rounded border border-slate-200 bg-white text-[11px] font-medium text-slate-600 hover:bg-slate-50">117</button>
                   <button className="px-2 py-1 rounded border border-slate-200 bg-white text-[11px] font-medium text-slate-600 hover:bg-slate-50">Siguiente</button>
                 </div>
               </div>
             </div>
          </div>
          
          <DetalleResultadoModal data={selectedRow} onClose={() => setSelectedRow(null)} />
    </div>
  );
}
