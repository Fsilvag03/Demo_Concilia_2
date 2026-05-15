import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, XCircle, 
  Lock, Clock, FileCheck, FileX, Filter, Search, ChevronDown, Download, Eye,
  Layers, ArrowRight, Activity, FileText, Database, GitMerge, AlertCircle,
  TrendingUp, TrendingDown
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

  const mockData = [
    { estado: 'Conciliado', nombre: 'Cruce Exitoso', clave: 'TRX-99281', fuenteR: 'Libro Mayor', montoR: '4,200.00', fuenteC: 'Cartola Bancaria', montoC: '4,200.00', diferencia: '0.00', direccionDiferencia: 'igual', paso: '2. Cruce tolerante', tratamiento: '-', aprobacion: 'No requiere', clasificacion: 'Coincidencia Exacta', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [{ criterio: 'Mismos montos', estado: 'pass' }, { criterio: 'Mismas fechas', estado: 'pass' }] },
    { estado: 'Conciliado', nombre: 'Cruce Exitoso', clave: 'TRX-99285', fuenteR: 'Sistema POS', montoR: '1,500.50', fuenteC: 'Libro Mayor', montoC: '1,500.50', diferencia: '0.00', direccionDiferencia: 'igual', paso: '1. Cruce exacto', tratamiento: '-', aprobacion: 'No requiere', clasificacion: 'Coincidencia Exacta', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [{ criterio: 'Mismos montos', estado: 'pass' }] },
    { estado: 'Conciliado', nombre: 'Cruce Agrupado', clave: 'TRX-10332', fuenteR: 'Libro Mayor', montoR: '3,800.00', fuenteC: 'Pasarela Pagos', montoC: '3,800.00', diferencia: '0.00', direccionDiferencia: 'igual', paso: '3. Cruce uno a muchos', tratamiento: '-', aprobacion: 'No requiere', clasificacion: 'Cruce Agrupado 1 a N', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [{ criterio: 'Monto agrupado coincide', estado: 'pass' }] },
    { estado: 'Conciliado', nombre: 'Cruce Tolerante', clave: 'TRX-11200', fuenteR: 'Libro Mayor', montoR: '950.00', fuenteC: 'Cartola Bancaria', montoC: '950.00', diferencia: '0.00', direccionDiferencia: 'igual', paso: '2. Cruce tolerante', tratamiento: '-', aprobacion: 'No requiere', clasificacion: 'Tolerancia de Fecha', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [{ criterio: 'Mismos montos', estado: 'pass' }, { criterio: 'Fecha +1 día', estado: 'pass' }] },
    { estado: 'Conciliado', nombre: 'Cruce Exitoso', clave: 'TRX-44210', fuenteR: 'Pasarela Pagos', montoR: '7,120.25', fuenteC: 'Cartola', montoC: '7,120.25', diferencia: '0.00', direccionDiferencia: 'igual', paso: '1. Cruce exacto', tratamiento: '-', aprobacion: 'No requiere', clasificacion: 'Coincidencia Exacta', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [{ criterio: 'Mismos montos', estado: 'pass' }] },
    { estado: 'Conciliado', nombre: 'Cruce Exitoso', clave: 'TRX-09882', fuenteR: 'Libro Mayor', montoR: '250.00', fuenteC: 'Sistema POS', montoC: '250.00', diferencia: '0.00', direccionDiferencia: 'igual', paso: '1. Cruce exacto', tratamiento: '-', aprobacion: 'Aprobada', aprobacionDetalle: { origen: 'Regla de Aprobación', regla: 'Monto mínimo conc.', condicion: 'Monto < 500' }, clasificacion: 'Aprobado Manualmente', sla: '12 horas', bloqueaCierre: false, sustento: ['Observación'], evaluaciones: [{ criterio: 'Aprobación requerida por regla', estado: 'pass' }] },
    { estado: 'Conciliado', nombre: 'Cruce Manual', clave: 'TRX-77312', fuenteR: 'Cartola Bancaria', montoR: '5,000.00', fuenteC: 'Libro Mayor', montoC: '5,000.00', diferencia: '0.00', direccionDiferencia: 'igual', paso: 'Manual', tratamiento: '-', aprobacion: 'Aprobada', aprobacionDetalle: { origen: 'Tratamiento Manual', regla: 'Forzar Conciliación', condicion: 'Acción Manual' }, clasificacion: 'Cruce Manual', sla: 'Sistema', bloqueaCierre: false, sustento: ['Adjunto'], evaluaciones: [{ criterio: 'Cruce manual', estado: 'pass' }] },
    { estado: 'Conciliado', nombre: 'Cruce Exitoso', clave: 'TRX-88123', fuenteR: 'Libro Mayor', montoR: '1,120.80', fuenteC: 'Pasarela Pagos', montoC: '1,120.80', diferencia: '0.00', direccionDiferencia: 'igual', paso: '1. Cruce exacto', tratamiento: '-', aprobacion: 'No requiere', clasificacion: 'Coincidencia Exacta', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [{ criterio: 'Mismos montos', estado: 'pass' }] },
    { estado: 'Conciliado', nombre: 'Cruce Exitoso', clave: 'TRX-99010', fuenteR: 'Sistema POS', montoR: '10,500.00', fuenteC: 'Libro Mayor', montoC: '10,500.00', diferencia: '0.00', direccionDiferencia: 'igual', paso: '1. Cruce exacto', tratamiento: '-', aprobacion: 'No requiere', clasificacion: 'Coincidencia Exacta', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [{ criterio: 'Mismos montos', estado: 'pass' }] },
    { estado: 'Conciliado', nombre: 'Cruce Exitoso', clave: 'TRX-33011', fuenteR: 'Libro Mayor', montoR: '7,558.45', fuenteC: 'Cartola Bancaria', montoC: '7,558.45', diferencia: '0.00', direccionDiferencia: 'igual', paso: '2. Cruce tolerante', tratamiento: '-', aprobacion: 'No requiere', clasificacion: 'Tolerancia de Fecha', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [{ criterio: 'Mismos montos', estado: 'pass' }, { criterio: 'Fecha -1 día', estado: 'pass' }] },
    
    { estado: 'Con diferencia', nombre: 'Falta en Sistema POS', clave: 'TRX-10111', fuenteR: 'Libro Mayor', montoR: '1,200.00', fuenteC: 'Sistema POS', montoC: '-', diferencia: '1,200.00', direccionDiferencia: 'mayor_r', paso: '-', tratamiento: 'Regularizar', aprobacion: 'Pendiente', aprobacionDetalle: { origen: 'Regla de Aprobación', regla: 'Falta contraparte', condicion: 'Contraparte nula' }, clasificacion: 'Sin Contraparte', sla: '24 horas', bloqueaCierre: true, sustento: ['Adjunto', 'Observación'], evaluaciones: [{ criterio: 'Registro principal existe', estado: 'pass' }, { criterio: 'Contraparte existe', estado: 'fail' }] },
    { estado: 'Con diferencia', nombre: 'Diferencia de Monto', clave: 'TRX-11234', fuenteR: 'Libro Mayor', montoR: '805.62', fuenteC: 'Cartola Bancaria', montoC: '815.62', diferencia: '10.00', direccionDiferencia: 'menor_r', paso: '1. Cruce exacto', tratamiento: 'Revisar', aprobacion: 'Pendiente', aprobacionDetalle: { origen: 'Tratamiento', regla: 'Ajuste contable', condicion: 'Diferencia < 15.00' }, clasificacion: 'Monto Diferente', sla: '48 horas', bloqueaCierre: true, sustento: ['Observación'], evaluaciones: [{ criterio: 'Ambos registros existen', estado: 'pass' }, { criterio: 'Mismos montos', estado: 'fail' }] },
    { estado: 'Con diferencia', nombre: 'Falta Contraparte', clave: 'TRX-20455', fuenteR: 'Pasarela Pagos', montoR: '411.24', fuenteC: 'Libro Mayor', montoC: '-', diferencia: '411.24', direccionDiferencia: 'mayor_r', paso: '-', tratamiento: 'Revisar', aprobacion: 'Rechazada', aprobacionDetalle: { origen: 'Regla y Trat.', regla: 'Monto Huérfano', condicion: 'Monto > 0 sin LM' }, clasificacion: 'Sin Contraparte', sla: '72 horas', bloqueaCierre: true, sustento: [], evaluaciones: [{ criterio: 'Contraparte existe', estado: 'fail' }] },
    { estado: 'Con diferencia', nombre: 'Diferencia de Monto', clave: 'TRX-55312', fuenteR: 'Libro Mayor', montoR: '3,000.00', fuenteC: 'Sistema POS', montoC: '2,900.00', diferencia: '100.00', direccionDiferencia: 'mayor_r', paso: '2. Cruce tolerante', tratamiento: 'Investigar', aprobacion: 'No requiere', clasificacion: 'Monto Diferente', sla: '24 horas', bloqueaCierre: true, sustento: ['Adjunto'], evaluaciones: [{ criterio: 'Mismos montos', estado: 'fail' }, { criterio: 'Tolerancia 5%', estado: 'fail' }] },
    { estado: 'Con diferencia', nombre: 'Doble Registro', clave: 'TRX-99812', fuenteR: 'Cartola Bancaria', montoR: '1,500.00', fuenteC: 'Libro Mayor', montoC: '3,000.00', diferencia: '1,500.00', direccionDiferencia: 'menor_r', paso: '1. Cruce exacto', tratamiento: 'Regularizar', aprobacion: 'No requiere', clasificacion: 'Doble Registro', sla: '12 horas', bloqueaCierre: true, sustento: ['Observación'], evaluaciones: [{ criterio: 'Mismos montos', estado: 'fail' }] },
    { estado: 'Con diferencia', nombre: 'Transacción Parcial', clave: 'TRX-82111', fuenteR: 'Libro Mayor', montoR: '900.00', fuenteC: 'Pasarela Pagos', montoC: '500.00', diferencia: '400.00', direccionDiferencia: 'mayor_r', paso: '3. Cruce uno a muchos', tratamiento: 'Ajuste', aprobacion: 'No requiere', clasificacion: 'Monto Parcial', sla: '48 horas', bloqueaCierre: true, sustento: ['Adjunto', 'Observación'], evaluaciones: [{ criterio: 'Sumatoria coincidente', estado: 'fail' }] },

    { estado: 'Excluido', nombre: 'Fuera de Rango (Fecha)', clave: 'TRX-EX-01', fuenteR: 'Sistema POS', montoR: '150.00', fuenteC: '-', montoC: '-', diferencia: '-', direccionDiferencia: 'none', paso: '-', tratamiento: 'Informativo', aprobacion: 'No requiere', clasificacion: 'Fecha Inválida', reglaApli: 'Fecha < Período', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [] },
    { estado: 'Excluido', nombre: 'Monto Cero', clave: 'TRX-EX-02', fuenteR: 'Libro Mayor', montoR: '0.00', fuenteC: '-', montoC: '-', diferencia: '-', direccionDiferencia: 'none', paso: '-', tratamiento: 'Descarte', aprobacion: 'No requiere', clasificacion: 'Monto Cero', reglaApli: 'Monto == 0', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [] },
    { estado: 'Excluido', nombre: 'Registro Duplicado', clave: 'TRX-EX-03', fuenteR: 'Cartola Bancaria', montoR: '250.00', fuenteC: '-', montoC: '-', diferencia: '-', direccionDiferencia: 'none', paso: '-', tratamiento: 'Informativo', aprobacion: 'No requiere', clasificacion: 'Duplicidad', reglaApli: 'Hash Duplicado', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [] },
    { estado: 'Excluido', nombre: 'Moneda Foránea', clave: 'TRX-EX-04', fuenteR: 'Pasarela Pagos', montoR: '1,200.00', fuenteC: '-', montoC: '-', diferencia: '-', direccionDiferencia: 'none', paso: '-', tratamiento: 'Manual', aprobacion: 'No requiere', clasificacion: 'Divisa Extranjera', reglaApli: 'Moneda != Local', sla: '-', bloqueaCierre: false, sustento: [], evaluaciones: [] }
  ];

  const filteredData = mockData.filter(row => {
    const matchesFilter = activeFilter === 'Todos' || row.estado === activeFilter;
    const matchesSearch = row.clave.toLowerCase().includes(searchQuery.toLowerCase()) || row.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full relative z-10 animate-in fade-in duration-300 pb-8 flex flex-col font-sans gap-4">
      
      {/* Dense Metrics Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded shadow-sm overflow-hidden flex items-center mb-1">
          <div className="flex flex-1 divide-x divide-slate-200/60 overflow-x-auto hide-scrollbar text-[13px] font-medium">
             <div className="flex-1 px-4 py-3 flex items-center justify-center gap-2.5 whitespace-nowrap">
               <Database size={15} className="text-slate-400" />
               <span className="text-slate-600">Evaluados: <strong className="text-slate-800">20</strong></span>
               <span className="text-[12px] font-mono font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                 $47,233.72
               </span>
             </div>
             
             <div className="flex-1 px-4 py-3 flex items-center justify-center gap-2.5 whitespace-nowrap bg-emerald-50/70">
               <CheckCircle2 size={15} className="text-emerald-500" />
               <span className="text-emerald-700">Conciliados: <strong className="text-emerald-800">10</strong></span>
               <span className="text-[12px] font-mono font-semibold text-emerald-700 bg-white border border-emerald-200 px-1.5 py-0.5 rounded shadow-sm">
                 $42,000.00
               </span>
             </div>

             <div className="flex-1 px-4 py-3 flex items-center justify-center gap-2.5 whitespace-nowrap bg-amber-50/70">
               <AlertCircle size={15} className="text-amber-500" />
               <span className="text-amber-700">Con diferencia: <strong className="text-amber-800">6</strong></span>
               <span className="text-[12px] font-mono font-semibold text-amber-700 bg-white border border-amber-200 px-1.5 py-0.5 rounded shadow-sm">
                 $4,833.72
               </span>
             </div>

             <div className="flex-1 px-4 py-3 flex items-center justify-center gap-2.5 whitespace-nowrap bg-indigo-50/70">
               <ShieldCheck size={15} className="text-indigo-500" />
               <span className="text-indigo-700">Aprob. pendientes: <strong className="text-indigo-800">2</strong></span>
               <span className="text-[12px] font-mono font-semibold text-indigo-700 bg-white border border-indigo-200 px-1.5 py-0.5 rounded shadow-sm">
                 $1,611.24
               </span>
             </div>

             <div className="flex-1 px-4 py-3 flex items-center justify-center gap-2.5 whitespace-nowrap">
               <FileX size={15} className="text-slate-400" />
               <span className="text-slate-600">Excluidos: <strong className="text-slate-800">4</strong></span>
               <span className="text-[12px] font-mono font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                 $400.00
               </span>
             </div>
          </div>
      </div>



          <div className="space-y-3 animate-in fade-in pt-6 mt-4 border-t border-slate-200/50">
             <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center px-1">
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                   <h3 className="text-sm font-bold text-slate-800 shrink-0 hidden md:block">Consolidado de Resultados</h3>
                   <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
                   <div className="relative w-full md:w-64 group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={14} />
                      <input 
                        type="text" 
                        placeholder="Buscar registro..." 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-primary/30 rounded-lg text-sm text-slate-700 placeholder:text-slate-500 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                   </div>
                 </div>
                 
                 {/* Quick Filters */}
                 <div className="flex overflow-x-auto w-full sm:w-auto hide-scrollbar gap-1.5 text-xs font-semibold">
                    <button onClick={() => setActiveFilter('Todos')} className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${activeFilter === 'Todos' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Todos (20)</button>
                    <button onClick={() => setActiveFilter('Conciliado')} className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${activeFilter === 'Conciliado' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>Conciliados (10)</button>
                    <button onClick={() => setActiveFilter('Con diferencia')} className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${activeFilter === 'Con diferencia' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>Diferencias (6)</button>
                    <button onClick={() => setActiveFilter('Excluido')} className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${activeFilter === 'Excluido' ? 'bg-slate-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Excluidos (4)</button>
                 </div>

                 <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button className="flex-1 sm:flex-none p-2 bg-white text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg transition-all shadow-sm flex items-center justify-center">
                      <Filter size={16} />

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
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resultado</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campo Clave</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Monto Principal</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Monto Contraparte</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Diferencia</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Paso de Cruce</th>
                      <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aprobación</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredData.map((row, i) => (
                       <tr key={i} onClick={() => setSelectedRow(row)} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                          <td className="px-3 py-2.5">
                             <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                               row.estado === 'Conciliado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                               row.estado === 'Con diferencia' ? 'bg-amber-50 text-amber-700 border-amber-200' :
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
                          <td className="px-3 py-2.5 text-right w-32">
                            {row.diferencia !== '-' ? (
                              <div className={`font-mono text-[12px] font-medium flex items-center justify-end gap-1.5 ${row.diferencia === '0.00' ? 'text-slate-500' : row.direccionDiferencia === 'mayor_r' ? 'text-amber-600' : 'text-rose-600'}`}>
                                {row.direccionDiferencia === 'mayor_r' && <TrendingUp size={14} className="text-amber-500" title={`${row.fuenteR} es mayor`} />}
                                {row.direccionDiferencia === 'menor_r' && <TrendingDown size={14} className="text-rose-500" title={`${row.fuenteR} es menor`} />}
                                {row.diferencia}
                              </div>
                            ) : <span className="text-slate-400 font-mono text-[12px]">-</span>}
                          </td>
                          <td className="px-3 py-2.5 text-[11.5px] text-slate-500">{row.paso}</td>
                          <td className="px-3 py-2.5">
                             {row.aprobacion !== '-' && row.aprobacion !== 'No requiere' ? (
                                <span className={`text-[11.5px] font-semibold flex items-center gap-1.5 w-max ${
                                  row.aprobacion === 'Pendiente' ? 'text-amber-600' :
                                  row.aprobacion === 'Aprobada' ? 'text-emerald-600' :
                                  row.aprobacion === 'Rechazada' ? 'text-rose-600' :
                                  'text-slate-600'
                                }`}>
                                   {row.aprobacion === 'Pendiente' && <Clock size={13} className="text-amber-500" />}
                                   {row.aprobacion === 'Aprobada' && <CheckCircle2 size={13} className="text-emerald-500" />}
                                   {row.aprobacion === 'Rechazada' && <XCircle size={13} className="text-rose-500" />}
                                   {row.aprobacion}
                                </span>
                             ) : <span className="text-slate-400 text-[11.5px]">-</span>}
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
