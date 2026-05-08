import React, { useState, useEffect } from 'react';
import { 
  X, PlayCircle, FileText, Database, CheckCircle2, 
  AlertTriangle, XCircle, Settings2, ChevronRight,
  ListFilter, LayoutGrid, Eye, LayoutList, RefreshCcw, Search, Table, Copy, Check
} from 'lucide-react';
import { ReglaPreparacion } from './PreparacionDatosSection';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewTestModalProps {
  onClose: () => void;
  reglas: ReglaPreparacion[];
}

type ViewMode = 'preparado' | 'original' | 'comparacion';
type ExecState = 'idle' | 'preparing' | 'validating' | 'normalizing' | 'transforming' | 'completed' | 'error';
type RowStatus = 'success' | 'warning' | 'error';

// Mock Data Interfaces
interface TestRow {
  id: string;
  original: any;
  prepared: any;
  status: RowStatus;
  validations: any[];
  normalizations: any[];
  transformations: any[];
}

export const PreviewTestModal: React.FC<PreviewTestModalProps> = ({ onClose, reglas }) => {
  const uniqueSources = Array.from(new Set(reglas.flatMap(r => Array.isArray(r.fuente) ? r.fuente : [r.fuente]))).filter(Boolean) as string[];

  const [selectedSource, setSelectedSource] = useState('Todas');
  const [testFile, setTestFile] = useState('temporal');
  const [execState, setExecState] = useState<ExecState>('idle');
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('preparado');
  const [selectedRow, setSelectedRow] = useState<TestRow | null>(null);
  const [activeTab, setActiveTab] = useState<'datos' | 'reglas'>('datos');

  // Mock Result Data
  const [testResults, setTestResults] = useState<{
    summary: any;
    rows: TestRow[];
  } | null>(null);

  const hasConfigErrors = reglas.some(r => r.status === 'error' || r.status === 'incompleto');
  const activeRules = reglas.filter(r => r.activa);

  const handleExecute = () => {
    if (hasConfigErrors) return;
    
    setExecState('preparing');
    setProgress(10);
    
    setTimeout(() => { setExecState('validating'); setProgress(30); }, 800);
    setTimeout(() => { setExecState('normalizing'); setProgress(60); }, 1600);
    setTimeout(() => { setExecState('transforming'); setProgress(85); }, 2400);
    setTimeout(() => { 
      setExecState('completed'); 
      setProgress(100); 
      
      // Generate some mock results
      setTestResults({
        summary: {
          evaluados: 50,
          validos: 41,
          observaciones: 6,
          rechazados: 3,
          reglasAplicadas: activeRules.length
        },
        rows: Array.from({ length: 50 }).map((_, i) => {
          const statusVal = Math.random();
          const status: RowStatus = statusVal > 0.85 ? 'error' : statusVal > 0.70 ? 'warning' : 'success';
          return {
            id: `row-${i+1}`,
            original: {
              fecha: '2023/12/31',
              monto: '1.200,50',
              descripcion: 'COMPRA SUPERMERCADO',
              cliente_id: 'CL-9912'
            },
            prepared: {
              fecha: '2023-12-31',
              monto: status === 'error' ? null : 1200.50,
              descripcion: 'Compra Supermercado',
              cliente_id: 'CL9912',
              categoria: 'Supermercado'
            },
            status,
            validations: [
              { name: 'Validar formato fecha', passed: status !== 'error', detail: status === 'error' ? 'No cumple el formato esperado' : 'Cumple' },
              { name: 'Monto mayor a cero', passed: true, detail: 'Cumple' }
            ],
            normalizations: [
              { name: 'Estandarizar fecha', applied: true, detail: 'Convertido a YYYY-MM-DD' },
              { name: 'Limpiar formato numérico', applied: true, detail: 'Separadores ajustados a miles(.) y decimales(,)' }
            ],
            transformations: [
              { name: 'Derivar categoría', applied: true, detail: 'Resultado: Supermercado' }
            ]
          };
        })
      });
    }, 3200);
  };

  const currentLoadingText = {
    idle: 'Listo para iniciar',
    preparing: 'Preparando muestra de datos...',
    validating: 'Aplicando reglas de validación...',
    normalizing: 'Aplicando normalizaciones...',
    transforming: 'Aplicando transformaciones y derivaciones...',
    completed: 'Prueba completada',
    error: 'Error durante la ejecución'
  }[execState];

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Eye size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Vista Previa y Prueba</h2>
            <p className="text-sm text-slate-500 font-medium">Ejecuta las reglas sobre una muestra de datos</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 group px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <ChevronRight size={16} className="rotate-180 text-slate-400 group-hover:text-slate-600 transition-colors" />
          Volver a Preparación de datos
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-[600px]">
        {/* Settings & Execution Bar */}
        <div className="bg-white border-b border-slate-200 p-6 shrink-0">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Fuente de datos a probar</label>
                <div className="relative">
                  <Database size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    value={selectedSource} 
                    onChange={e => setSelectedSource(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
                    disabled={execState !== 'idle' && execState !== 'completed'}
                  >
                    <option value="Todas">Todas las fuentes</option>
                    {uniqueSources.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Muestra de datos</label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    value={testFile} 
                    onChange={e => setTestFile(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
                    disabled={execState !== 'idle' && execState !== 'completed'}
                  >
                    <option value="temporal">Lote de prueba temporal (50 reg.)</option>
                    <option value="cargado_1">Carga previa: dataset_enero.csv</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-slate-200 pl-6 h-full">
              {execState === 'completed' && (
                <button 
                  onClick={() => { setExecState('idle'); setTestResults(null); setSelectedRow(null); }}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  title="Reiniciar prueba"
                >
                  <RefreshCcw size={20} />
                </button>
              )}
              
              <button
                onClick={handleExecute}
                disabled={hasConfigErrors || (execState !== 'idle' && execState !== 'completed')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all
                  ${hasConfigErrors ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
                    execState === 'completed' ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200' :
                    (execState !== 'idle' ? 'bg-primary text-white cursor-wait opacity-90' : 'bg-primary hover:bg-primary/90 text-white hover:shadow')}`}
              >
                {execState === 'completed' ? (
                  <><RefreshCcw size={18} /> Procesar nuevamente</>
                ) : execState !== 'idle' ? (
                  <><RefreshCcw size={18} className="animate-spin" /> Procesando...</>
                ) : (
                  <><PlayCircle size={18} /> Ejecutar Prueba</>
                )}
              </button>
            </div>
          </div>

          {hasConfigErrors && (
            <div className="max-w-5xl mx-auto mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 font-medium">No se puede ejecutar la prueba porque existen reglas incompletas o con error en la configuración. Revisa las otras pestañas.</p>
            </div>
          )}

          {/* Progress Indicator */}
          {execState !== 'idle' && execState !== 'completed' && execState !== 'error' && (
            <div className="max-w-2xl mx-auto mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">{currentLoadingText}</span>
                <span className="text-sm font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        {execState === 'completed' && testResults && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 p-6 animate-in fade-in zoom-in-95 duration-400">
            <div className="max-w-7xl w-full mx-auto flex gap-6 h-full">
              
              {/* Main Content */}
              <div className="flex-1 flex flex-col min-w-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                
                {/* Summary Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-100 border-b border-slate-100 shrink-0 bg-slate-50/50">
                  <div className="p-4 flex flex-col">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Evaluados</span>
                    <span className="text-2xl font-black text-slate-800">{testResults.summary.evaluados}</span>
                  </div>
                  <div className="p-4 flex flex-col">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Válidos</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-emerald-600">{testResults.summary.validos}</span>
                      <span className="text-sm font-medium text-emerald-600/70">{Math.round((testResults.summary.validos / testResults.summary.evaluados) * 100)}%</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">Observaciones</span>
                    <div className="flex items-baseline gap-2">
                       <span className="text-2xl font-black text-amber-600">{testResults.summary.observaciones}</span>
                       <span className="text-sm font-medium text-amber-600/70">{Math.round((testResults.summary.observaciones / testResults.summary.evaluados) * 100)}%</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col">
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Rechazados</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-rose-600">{testResults.summary.rechazados}</span>
                      <span className="text-sm font-medium text-rose-600/70">{Math.round((testResults.summary.rechazados / testResults.summary.evaluados) * 100)}%</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col">
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Reglas Aplicadas</span>
                    <span className="text-2xl font-black text-indigo-600">{testResults.summary.reglasAplicadas}</span>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex p-1 bg-slate-100 rounded-lg">
                    <button 
                      onClick={() => setActiveTab('datos')}
                      className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'datos' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Muestra de Datos
                    </button>
                    <button 
                      onClick={() => setActiveTab('reglas')}
                      className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'reglas' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Resumen de Reglas
                    </button>
                  </div>

                  {activeTab === 'datos' && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500 font-medium mr-2">Vista:</span>
                      <div className="flex rounded-lg overflow-hidden border border-slate-200">
                        <button 
                          onClick={() => setViewMode('original')}
                          className={`px-3 py-1.5 text-[13px] font-bold transition-colors ${viewMode === 'original' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                          Original
                        </button>
                        <button 
                          onClick={() => setViewMode('preparado')}
                          className={`px-3 py-1.5 text-[13px] font-bold transition-colors border-x border-slate-200 ${viewMode === 'preparado' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                          Preparado
                        </button>
                        <button 
                          onClick={() => setViewMode('comparacion')}
                          className={`px-3 py-1.5 text-[13px] font-bold transition-colors ${viewMode === 'comparacion' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                          Comparación
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-slate-50 relative">
                  {activeTab === 'datos' ? (
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
                        <tr>
                          <th className="w-12 px-4 py-3 text-center"></th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Id</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Monto</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Descripción</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Cliente ID</th>
                          {(viewMode === 'preparado' || viewMode === 'comparacion') && (
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase bg-indigo-50/50">Categoría (Derivada)</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {testResults.rows.map((row, i) => (
                          <tr 
                            key={row.id} 
                            onClick={() => setSelectedRow(row)}
                            className={`group cursor-pointer transition-colors ${selectedRow?.id === row.id ? 'bg-indigo-50/50' : 'hover:bg-slate-100/50 bg-white'}`}
                          >
                            <td className="px-4 py-3 w-12 text-center">
                              {row.status === 'success' ? <CheckCircle2 size={18} className="text-emerald-500 mx-auto" /> :
                               row.status === 'warning' ? <AlertTriangle size={18} className="text-amber-500 mx-auto" /> :
                               <XCircle size={18} className="text-rose-500 mx-auto" />}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-400">{i + 1}</td>
                            
                            <td className="px-4 py-3 text-sm">
                              {viewMode === 'original' && <span className="text-slate-600">{row.original.fecha}</span>}
                              {viewMode === 'preparado' && <span className="font-medium text-slate-800">{row.prepared.fecha}</span>}
                              {viewMode === 'comparacion' && (
                                <div className="flex flex-col">
                                  <span className="text-[11px] text-slate-400 line-through">{row.original.fecha}</span>
                                  <span className="font-medium text-slate-800">{row.prepared.fecha}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-right">
                              {viewMode === 'original' && <span className="text-slate-600">{row.original.monto}</span>}
                              {viewMode === 'preparado' && (
                                <span className={`font-semibold ${row.status === 'error' ? 'text-rose-500' : 'text-slate-800'}`}>
                                  {row.prepared.monto !== null ? row.prepared.monto : 'ERROR'}
                                </span>
                              )}
                              {viewMode === 'comparacion' && (
                                <div className="flex flex-col text-right">
                                  <span className="text-[11px] text-slate-400 line-through">{row.original.monto}</span>
                                  <span className={`font-semibold ${row.status === 'error' ? 'text-rose-500' : 'text-emerald-600'}`}>
                                    {row.prepared.monto !== null ? row.prepared.monto : 'ERROR'}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {viewMode === 'original' && <span className="text-slate-600 truncate block max-w-[200px]">{row.original.descripcion}</span>}
                              {viewMode === 'preparado' && <span className="font-medium text-slate-800 truncate block max-w-[200px]">{row.prepared.descripcion}</span>}
                              {viewMode === 'comparacion' && (
                                <div className="flex flex-col">
                                  <span className="text-[11px] text-slate-400 line-through truncate max-w-[200px]">{row.original.descripcion}</span>
                                  <span className="font-medium text-slate-800 truncate block max-w-[200px]">{row.prepared.descripcion}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {viewMode === 'original' ? row.original.cliente_id : row.prepared.cliente_id}
                            </td>
                            {(viewMode === 'preparado' || viewMode === 'comparacion') && (
                              <td className="px-4 py-3 text-sm bg-indigo-50/30">
                                {row.prepared.categoria && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700`}>
                                    {row.prepared.categoria}
                                  </span>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 max-w-4xl mx-auto space-y-6">
                       <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Reglas Aplicadas en esta Prueba</h3>
                       
                       <div className="grid grid-cols-3 gap-6">
                         <div className="bg-white border rounded-xl p-5 shadow-sm">
                           <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                             <CheckCircle2 size={24} />
                           </div>
                           <h4 className="font-bold text-slate-800 mb-1">Validaciones</h4>
                           <p className="text-3xl font-black text-slate-800 tracking-tight">{activeRules.filter(r => r.tipo === 'Validación').length}</p>
                           <p className="text-sm text-slate-500 mt-2">Filtros de control de calidad.</p>
                         </div>
                         <div className="bg-white border rounded-xl p-5 shadow-sm">
                           <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                             <LayoutList size={24} />
                           </div>
                           <h4 className="font-bold text-slate-800 mb-1">Normalizaciones</h4>
                           <p className="text-3xl font-black text-slate-800 tracking-tight">{activeRules.filter(r => r.tipo === 'Normalización').length}</p>
                           <p className="text-sm text-slate-500 mt-2">Ajustes de formato y limpieza.</p>
                         </div>
                         <div className="bg-white border rounded-xl p-5 shadow-sm">
                           <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-3">
                             <Table size={24} />
                           </div>
                           <h4 className="font-bold text-slate-800 mb-1">Transformaciones</h4>
                           <p className="text-3xl font-black text-slate-800 tracking-tight">{activeRules.filter(r => r.tipo === 'Transformación').length}</p>
                           <p className="text-sm text-slate-500 mt-2">Derivaciones y enriquecimiento.</p>
                         </div>
                       </div>
                       
                       <div className="mt-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Orden</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Regla</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Tipo</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Tasa de aplicación</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {activeRules.map((rule, idx) => (
                                <tr key={rule.id}>
                                  <td className="px-4 py-3 text-sm text-slate-500">{idx + 1}</td>
                                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{rule.nombre}</td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      rule.tipo === 'Validación' ? 'bg-emerald-100 text-emerald-700' :
                                      rule.tipo === 'Normalización' ? 'bg-blue-100 text-blue-700' :
                                      'bg-purple-100 text-purple-700'
                                    }`}>{rule.tipo}</span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-center font-semibold text-slate-600">
                                    {rule.tipo === 'Validación' ? '90% superaron' : '100% aplicado'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Side Panel for Detail */}
              <AnimatePresence>
                {selectedRow && activeTab === 'datos' && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 380, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="w-[380px] shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          selectedRow.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                          selectedRow.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                          'bg-rose-100 text-rose-600'
                        }`}>
                          {selectedRow.status === 'success' ? <CheckCircle2 size={20} /> :
                           selectedRow.status === 'warning' ? <AlertTriangle size={20} /> :
                           <XCircle size={20} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">Detalle de Registro</h3>
                          <p className="text-xs font-medium text-slate-500">Fila {selectedRow.id}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedRow(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg">
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                      
                      {/* Validations Section */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <div className="w-1 h-3 rounded-full bg-emerald-500"></div> Validaciones
                        </h4>
                        <div className="space-y-2">
                          {selectedRow.validations.map((v, i) => (
                            <div key={i} className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <div className="flex items-start gap-2.5">
                                {v.passed ? (
                                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                ) : (
                                  <XCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                                )}
                                <span className="text-[13px] font-medium text-slate-700 leading-tight">{v.name}</span>
                              </div>
                              <span className={`text-[12px] font-medium pl-6 block ${v.passed ? 'text-slate-500' : 'text-rose-600'}`}>
                                {v.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Normalizations Section */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <div className="w-1 h-3 rounded-full bg-blue-500"></div> Normalizaciones
                        </h4>
                        <div className="space-y-2">
                          {selectedRow.normalizations.map((n, i) => (
                            <div key={i} className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <div className="flex items-start gap-2.5">
                                <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-[13px] font-medium text-slate-700 leading-tight">{n.name}</span>
                              </div>
                              <span className="text-[12px] font-medium text-slate-500 pl-6 block">
                                {n.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Transformations Section */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <div className="w-1 h-3 rounded-full bg-purple-500"></div> Transformaciones
                        </h4>
                        <div className="space-y-2">
                          {selectedRow.transformations.map((t, i) => (
                            <div key={i} className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <div className="flex items-start gap-2.5">
                                <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                <span className="text-[13px] font-medium text-slate-700 leading-tight">{t.name}</span>
                              </div>
                              <span className="text-[12px] font-medium text-slate-500 pl-6 block">
                                {t.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        )}
        
        {/* Placeholder before execution */}
        {execState === 'idle' && (
          <div className="flex-1 flex items-center justify-center bg-slate-50/50 p-6">
            <div className="max-w-md text-center">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <Settings2 size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Listo para comprobar</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                Selecciona la fuente y la muestra de datos, y luego presiona "Ejecutar prueba" para ver cómo se aplican las reglas configuradas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
