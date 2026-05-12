import React, { useState } from 'react';
import { Process } from './ProcessCard';
import { 
  FileText, LayoutGrid, CheckSquare, Square, 
  Settings2, Plus, FileSpreadsheet, FileOutput, FileCode2,
  Trash2, Edit2, Play, Circle, CircleDashed, Filter, ArrowRight,
  MonitorPlay, FileBox, Database, LayoutTemplate, X, Save, GripVertical,
  CheckCircle2, AlertTriangle, MoreVertical, Copy, UploadCloud, Download
} from 'lucide-react';

interface ResultadosSalidasSectionProps {
  process: Process;
  onChange: () => void;
}

export const ResultadosSalidasSection: React.FC<ResultadosSalidasSectionProps> = ({ process, onChange }) => {
  const [montoPrincipal, setMontoPrincipal] = useState<string>('');
  const [mostrarExcluidos, setMostrarExcluidos] = useState(false);
  const [mostrarControles, setMostrarControles] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const [outputs, setOutputs] = useState([
    { id: '1', name: 'Reporte de diferencias', format: 'Excel', content: 'Diferencias', filter: 'Solo pendientes', fields: 15, active: true, configStatus: 'Completa' },
    { id: '2', name: 'Resumen de conciliación', format: 'Excel', content: 'Resumen de conciliación', filter: 'Sin filtros', fields: 8, active: true, configStatus: 'Completa' },
    { id: '3', name: 'Archivo operativo TXT', format: 'TXT', content: 'Registros a regularizar', filter: 'Solo bloqueantes', fields: 5, active: false, configStatus: 'Incompleta' }
  ]);

  const [editingOutput, setEditingOutput] = useState<any>(null);

  const handleEdit = (outId: string) => {
    const out = outputs.find(o => o.id === outId);
    if (out) {
      setEditingOutput({
        ...out,
        sheetName: 'Reporte',
        csvSeparator: ',',
        csvHeaders: true,
        txtSeparator: '|',
        txtHeaders: true,
      });
    }
  };

  const [editColumns, setEditColumns] = useState([
    { id: '1', lbl: 'Fecha operación', field: 'fecha_operativa', type: 'Fecha', fmt: 'Día-mes-año: 19-03-2026' },
    { id: '2', lbl: 'Referencia', field: 'campo_clave', type: 'Texto', fmt: 'Tal como está' },
    { id: '3', lbl: 'Monto', field: 'monto_conciliado', type: 'Moneda / Monto', fmt: 'Monto con 2 decimales: 1234.50' },
    { id: '4', lbl: 'Tipo diferencia', field: 'tipo_diferencia', type: 'Texto', fmt: 'Tal como está' },
    { id: '5', lbl: 'Estado atención', field: 'estado_diferencia', type: 'Catálogo / Estado', fmt: 'Solo nombre: Requiere revisión' }
  ]);

  const formatIcon = (format: string) => {
    switch (format) {
      case 'Excel': return <FileSpreadsheet size={16} className="text-emerald-500" />;
      case 'CSV': return <FileCode2 size={16} className="text-blue-500" />;
      case 'TXT': return <FileText size={16} className="text-slate-500" />;
      default: return <FileOutput size={16} className="text-slate-500" />;
    }
  };

  const currentEditingOutput = outputs.find(o => o.id === editingOutput);

  return (
    <div className="max-w-[900px] mx-auto space-y-8 pb-12">
      <div className="mb-6">
        <h3 className="text-[22px] font-bold text-slate-800 mb-2">Resultados y salidas</h3>
        <p className="text-[13.5px] text-slate-500 max-w-3xl leading-relaxed">
          Configura los resúmenes, reportes y archivos que se generarán después de conciliar. Define qué verá el usuario en pantalla y qué archivos quedarán disponibles extraídos del sistema.
        </p>
      </div>

      {!editingOutput ? (
        <>
          {/* Bloque 1: Resumen de conciliación */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div className="mb-5">
              <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2 mb-1">
                <MonitorPlay size={18} className="text-primary" />
                Resumen de conciliación
              </h4>
              <p className="text-[13px] text-slate-500">
                Define el campo de monto principal y qué información adicional se mostrará en el resumen.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-700">Campo de monto principal</label>
                <select 
                  value={montoPrincipal}
                  onChange={(e) => { setMontoPrincipal(e.target.value); onChange(); }}
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-3 h-[46px] focus:border-primary outline-none bg-white"
                >
                  <option value="">Seleccionar campo monetario...</option>
                  <option value="monto_operacion">Monto de Operación</option>
                  <option value="monto_liquidado">Monto Liquidado</option>
                  <option value="importe">Importe</option>
                </select>
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="block text-[13px] font-bold text-slate-700">Información adicional</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => { setMostrarExcluidos(!mostrarExcluidos); onChange(); }}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-colors ${
                      mostrarExcluidos 
                        ? 'border-primary/30 bg-primary/5 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`shrink-0 flex items-center justify-center w-4 h-4 rounded text-white ${
                      mostrarExcluidos ? 'bg-primary' : 'bg-slate-200'
                    }`}>
                      {mostrarExcluidos && <CheckSquare size={16} />}
                    </div>
                    <span className={`text-[13px] font-medium ${mostrarExcluidos ? 'text-slate-800' : 'text-slate-600'}`}>
                      Mostrar registros excluidos
                    </span>
                  </button>

                  <button
                    onClick={() => { setMostrarControles(!mostrarControles); onChange(); }}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-colors ${
                      mostrarControles 
                        ? 'border-primary/30 bg-primary/5 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`shrink-0 flex items-center justify-center w-4 h-4 rounded text-white ${
                      mostrarControles ? 'bg-primary' : 'bg-slate-200'
                    }`}>
                      {mostrarControles && <CheckSquare size={16} />}
                    </div>
                    <span className={`text-[13px] font-medium ${mostrarControles ? 'text-slate-800' : 'text-slate-600'}`}>
                      Mostrar controles de consistencia
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-5 p-3.5 bg-slate-50 border border-slate-100 rounded-lg flex gap-3">
              <div className="text-[12px] text-slate-500 leading-relaxed font-medium">
                <span className="font-bold text-slate-700">Nota:</span> El resumen siempre mostrará registros evaluados, conciliados, no conciliados, diferencias por tipo y montos principales.
              </div>
            </div>
          </div>

          {/* Bloque 2: Archivos de salida */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <FileBox size={18} className="text-primary" />
                  Archivos de salida
                </h4>
                <p className="text-[13px] text-slate-500">
                  Configura qué documentos y archivos se pueden generar tras la conciliación.
                </p>
              </div>
              <button 
                onClick={() => { /* Create new output mock */ }}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-colors shrink-0"
              >
                <Plus size={14} />
                Agregar salida
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {outputs.map(out => (
                <div key={out.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded-xl transition-all ${out.active ? 'border-slate-200 shadow-sm hover:border-primary/30' : 'border-slate-200 bg-slate-50/50 opacity-80'}`}>
                  
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                      {formatIcon(out.format)}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[14px] font-bold truncate ${out.active ? 'text-slate-800' : 'text-slate-500'}`}>
                          {out.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {out.format}
                        </div>
                        {out.configStatus === 'Completa' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            <CheckCircle2 size={10} /> Completa
                          </span>
                        ) : out.configStatus === 'Incompleta' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                            <AlertTriangle size={10} /> Incompleta
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                            <AlertTriangle size={10} /> Con error
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 flex-wrap">
                        <span className="truncate" title={out.content}><b>Contenido:</b> {out.content}</span>
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <span className="truncate" title={out.filter}><b>Filtros:</b> {out.filter}</span>
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <span className="whitespace-nowrap"><b>Columnas:</b> {out.fields}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-5 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0 justify-between sm:justify-start">
                    <div className="flex items-center gap-2">
                       <span className={`text-[12px] font-bold ${out.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                         {out.active ? 'Activa' : 'Inactiva'}
                       </span>
                       <button
                         onClick={() => {
                           setOutputs(outputs.map(o => o.id === out.id ? { ...o, active: !o.active } : o));
                           onChange();
                         }}
                         className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${out.active ? 'bg-primary' : 'bg-slate-200'}`}
                       >
                         <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${out.active ? 'translate-x-4' : 'translate-x-0'}`} />
                       </button>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setDropdownOpen(dropdownOpen === out.id ? null : out.id)}
                        className={`p-1.5 rounded-md transition-colors ${dropdownOpen === out.id ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {dropdownOpen === out.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(null)}></div>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 shadow-lg rounded-lg py-1 z-20 text-[12.5px] overflow-hidden">
                            <button 
                              onClick={() => { handleEdit(out.id); setDropdownOpen(null); }} 
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium transition-colors"
                            >
                              <Settings2 size={14} className="text-slate-400" /> Configurar
                            </button>
                            <button 
                              onClick={() => setDropdownOpen(null)} 
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium transition-colors"
                            >
                              <Copy size={14} className="text-slate-400" /> Duplicar
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button 
                              onClick={() => setDropdownOpen(null)} 
                              className="w-full text-left px-4 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium transition-colors"
                            >
                              <Trash2 size={14} className="text-rose-400" /> Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </>
      ) : (
        /* Bloque 3: Configuración de columnas (Detalle de Salida) */
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                {formatIcon(editingOutput?.format || 'Excel')}
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-800 leading-tight">Configurar salida: {editingOutput?.name}</h4>
                <p className="text-[12px] text-slate-500">Configura el formato, filtros y columnas del archivo.</p>
              </div>
            </div>
            <button 
              onClick={() => setEditingOutput(null)}
              className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 hover:shadow-sm"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-100">
             <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Información general</label>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11.5px] font-semibold text-slate-600 mb-1.5 block">Nombre del archivo o reporte</span>
                    <input type="text" className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 focus:border-primary outline-none bg-white" value={editingOutput?.name || ''} onChange={(e) => setEditingOutput({...editingOutput, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11.5px] font-semibold text-slate-600 mb-1.5 block">Formato</span>
                      <select className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 focus:border-primary outline-none bg-white font-medium" value={editingOutput?.format || 'Excel'} onChange={(e) => setEditingOutput({...editingOutput, format: e.target.value})}>
                        <option value="Excel">Excel</option>
                        <option value="CSV">CSV</option>
                        <option value="TXT">TXT</option>
                      </select>
                    </div>
                  </div>
                  
                  {editingOutput?.format === 'Excel' && (
                    <div>
                      <span className="text-[11.5px] font-semibold text-slate-600 mb-1.5 block">Nombre de hoja</span>
                      <input type="text" placeholder="Ej: Reporte 1" className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 focus:border-primary outline-none bg-white" value={editingOutput?.sheetName || ''} onChange={(e) => setEditingOutput({...editingOutput, sheetName: e.target.value})} />
                    </div>
                  )}
                  {editingOutput?.format === 'CSV' && (
                    <div className="grid grid-cols-2 gap-3 pb-1">
                       <div>
                          <span className="text-[11.5px] font-semibold text-slate-600 mb-1.5 block">Separador</span>
                          <select className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 focus:border-primary outline-none bg-white" value={editingOutput?.csvSeparator || ','} onChange={(e) => setEditingOutput({...editingOutput, csvSeparator: e.target.value})}>
                            <option value=",">Coma (,)</option>
                            <option value=";">Punto y coma (;)</option>
                          </select>
                       </div>
                       <div>
                          <span className="text-[11.5px] font-semibold text-slate-600 mb-1.5 block">Encabezados</span>
                          <label className="flex items-center gap-2 mt-3 cursor-pointer">
                             <input type="checkbox" checked={editingOutput?.csvHeaders || false} onChange={(e) => setEditingOutput({...editingOutput, csvHeaders: e.target.checked})} className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary/20" />
                             <span className="text-[13px] text-slate-600">Incluir encabezados</span>
                          </label>
                       </div>
                    </div>
                  )}
                  {editingOutput?.format === 'TXT' && (
                    <div className="grid grid-cols-2 gap-3 pb-1">
                       <div>
                          <span className="text-[11.5px] font-semibold text-slate-600 mb-1.5 block">Separador</span>
                          <select className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 focus:border-primary outline-none bg-white" value={editingOutput?.txtSeparator || '|'} onChange={(e) => setEditingOutput({...editingOutput, txtSeparator: e.target.value})}>
                            <option value="|">Pipe (|)</option>
                            <option value="	">Tabulación</option>
                            <option value=";">Punto y coma (;)</option>
                          </select>
                       </div>
                       <div>
                          <span className="text-[11.5px] font-semibold text-slate-600 mb-1.5 block">Encabezados</span>
                          <label className="flex items-center gap-2 mt-3 cursor-pointer">
                             <input type="checkbox" checked={editingOutput?.txtHeaders || false} onChange={(e) => setEditingOutput({...editingOutput, txtHeaders: e.target.checked})} className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary/20" />
                             <span className="text-[13px] text-slate-600">Incluir encabezados</span>
                          </label>
                       </div>
                    </div>
                  )}
                </div>
             </div>
             
             <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-6">
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Contenido y filtros</label>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11.5px] font-semibold text-slate-600 mb-1.5 block">Información a incluir (Elegir 1)</span>
                    <select className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 focus:border-primary outline-none bg-white font-medium" value={editingOutput?.content || 'Diferencias'} onChange={(e) => setEditingOutput({...editingOutput, content: e.target.value})}>
                      <option value="Resumen de conciliación">Resumen de conciliación</option>
                      <option value="Diferencias">Diferencias</option>
                      <option value="Registros conciliados">Registros conciliados</option>
                      <option value="Registros excluidos">Registros excluidos</option>
                      <option value="Controles de consistencia">Controles de consistencia</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                    <span className="text-[11.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2"><Filter size={14} className="text-slate-400" /> Filtros aplicables</span>
                    
                    {editingOutput?.content === 'Resumen de conciliación' && (
                       <p className="text-[12.5px] text-slate-500 italic bg-white p-3 rounded border border-slate-200 shadow-sm">No se requieren filtros. El resumen incluirá la totalidad de la información conciliada en el proceso.</p>
                    )}

                    {editingOutput?.content === 'Diferencias' && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Tipo de diferencia</span><input type="text" placeholder="Selección múltiple (Todos)" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" /></div>
                          <div><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Estado de atención</span><input type="text" placeholder="Selección múltiple (Todos)" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" /></div>
                          <div><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Severidad</span><select className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none"><option>Todos</option><option>Bloqueante</option><option>Requiere aprobación</option></select></div>
                          <div><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Requiere aprobación</span><select className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none"><option>Todos</option><option>Sí</option><option>No</option></select></div>
                          <div className="sm:col-span-2"><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Fuente asociada</span><input type="text" placeholder="Selección múltiple (Todas)" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" /></div>
                       </div>
                    )}

                    {editingOutput?.content === 'Registros conciliados' && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2"><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Fuente asociada</span><input type="text" placeholder="Selección múltiple (Todas)" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" /></div>
                          <div><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Paso de cruce</span><input type="text" placeholder="Selección múltiple (Todos)" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" /></div>
                          <div>
                            <span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Rango de monto (Opcional)</span>
                            <div className="flex gap-2">
                               <input type="number" placeholder="Mínimo" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" />
                               <input type="number" placeholder="Máximo" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" />
                            </div>
                          </div>
                       </div>
                    )}

                    {editingOutput?.content === 'Registros excluidos' && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2"><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Fuente asociada</span><input type="text" placeholder="Selección múltiple (Todas)" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" /></div>
                          <div><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Motivo de exclusión</span><input type="text" placeholder="Selección múltiple (Todos)" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" /></div>
                          <div><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Regla que lo excluyó</span><input type="text" placeholder="Selección múltiple (Todas)" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" /></div>
                       </div>
                    )}

                    {editingOutput?.content === 'Controles de consistencia' && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2"><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Fuente asociada</span><input type="text" placeholder="Selección múltiple (Todas)" className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none" /></div>
                          <div><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Resultado del control</span><select className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none"><option>Todos</option><option>Exitoso</option><option>Con advertencia</option><option>Fallido</option></select></div>
                          <div><span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Severidad</span><select className="w-full text-[12.5px] border border-slate-200 bg-white rounded-md px-2 py-1.5 outline-none"><option>Todos</option><option>Bloqueante</option><option>Advertencia</option></select></div>
                       </div>
                    )}
                  </div>
                </div>
             </div>
          </div>

          <div className="p-6 bg-slate-50/50">
             <div className="flex items-center justify-between mb-4">
                <label className="block text-[13px] font-bold text-slate-800 uppercase tracking-wider">Definición de columnas</label>
                <button className="flex items-center gap-1.5 text-[12.5px] font-bold text-primary hover:text-primary-dark transition-colors">
                   <Plus size={14} /> Agregar columna
                </button>
             </div>
             
             <div className="bg-white border text-[13px] border-slate-200 rounded-lg shadow-sm">
                <div className="grid grid-cols-12 gap-3 px-4 py-2 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-1"></div>
                  <div className="col-span-3">Dato seleccionado</div>
                  <div className="col-span-3">Nombre de la columna</div>
                  <div className="col-span-4 pl-2">Formato</div>
                  <div className="col-span-1 text-right pr-2"></div>
                </div>
                
                {editColumns.map((col, idx) => (
                   <div key={col.id} className="grid grid-cols-12 gap-3 px-4 py-2.5 border-b border-slate-100 last:border-0 items-center bg-white hover:bg-slate-50/50 transition-colors">
                      <div className="col-span-1 text-slate-300 flex justify-center cursor-grab hover:text-slate-500">
                        <GripVertical size={16} />
                      </div>
                      <div className="col-span-3">
                         <select value={col.type} onChange={(e) => { const nc = [...editColumns]; nc[idx].type = e.target.value; setEditColumns(nc); }} className="w-full border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white bg-slate-50/50 font-medium rounded px-2 py-1.5 outline-none text-[12px] text-slate-700 transition-colors">
                            <optgroup label="Campos preparados">
                               <option value="Fecha">fecha_operativa</option>
                               <option value="Moneda / Monto">monto_origen</option>
                            </optgroup>
                            <optgroup label="Campos derivados">
                               <option value="Entero">id_transaccion_num</option>
                               <option value="Texto">referencia_limpia</option>
                            </optgroup>
                            <optgroup label="Datos del sistema">
                               <option value="Texto">tipo_diferencia</option>
                               <option value="Catálogo / Estado">estado_diferencia</option>
                               <option value="Moneda / Monto">monto_conciliado</option>
                            </optgroup>
                         </select>
                      </div>
                      <div className="col-span-3">
                         <input type="text" value={col.lbl} onChange={(e) => { const nc = [...editColumns]; nc[idx].lbl = e.target.value; setEditColumns(nc); }} className="w-full border border-slate-200 focus:border-primary focus:bg-white bg-white rounded px-3 py-1.5 outline-none text-[12.5px] text-slate-800 transition-colors shadow-sm" />
                      </div>
                      <div className="col-span-4 pl-2">
                         <select value={col.fmt} onChange={(e) => { const nc = [...editColumns]; nc[idx].fmt = e.target.value; setEditColumns(nc); }} className="w-full border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white bg-slate-50/50 rounded px-2 py-1.5 outline-none text-[12.5px] text-slate-600 transition-colors">
                            {col.type === 'Texto' && (
                               <>
                                 <option>Tal como está</option>
                                 <option>Convertir a MAYÚSCULAS</option>
                                 <option>Convertir a minúsculas</option>
                               </>
                            )}
                            {col.type === 'Decimal' && (
                               <>
                                 <option>Decimal con 2 decimales: 1234.50</option>
                                 <option>Decimal con miles: 1,234.50</option>
                                 <option>Sin decimales: 1234</option>
                                 <option>Personalizado por decimales</option>
                               </>
                            )}
                            {col.type === 'Moneda / Monto' && (
                               <>
                                 <option>Monto con 2 decimales: 1234.50</option>
                                 <option>Monto con miles: 1,234.50</option>
                                 <option>Monto con símbolo: $1,234.50</option>
                                 <option>Negativo con signo: -1,234.50</option>
                                 <option>Negativo entre paréntesis: (1,234.50)</option>
                               </>
                            )}
                            {col.type === 'Fecha' && (
                               <>
                                 <option>Día-mes-año: 19-03-2026</option>
                                 <option>Año-mes-día: 2026-03-19</option>
                                 <option>Día/mes/año: 19/03/2026</option>
                                 <option>Año/mes/día: 2026/03/19</option>
                                 <option>Día-mes-año corto: 19-03-26</option>
                                 <option>Día/mes/año corto: 19/03/26</option>
                               </>
                            )}
                            {col.type === 'Fecha y hora' && (
                               <>
                                 <option>Día-mes-año hora:minuto: 19-03-2026 14:35</option>
                                 <option>Año-mes-día hora:minuto: 2026-03-19 14:35</option>
                                 <option>Día/mes/año hora:minuto: 19/03/2026 14:35</option>
                                 <option>Año-mes-día hora:minuto:segundo: 2026-03-19 14:35:20</option>
                               </>
                            )}
                            {col.type === 'Entero' && (
                               <>
                                 <option>Sin separador de miles: 1200</option>
                                 <option>Con separador de miles: 1,200</option>
                               </>
                            )}
                            {col.type === 'Porcentaje' && (
                               <>
                                 <option>Sin decimales: 98%</option>
                                 <option>Con 2 decimales: 98.25%</option>
                               </>
                            )}
                            {col.type === 'Sí / No' && (
                               <>
                                 <option>Sí / No</option>
                                 <option>S / N</option>
                                 <option>1 / 0</option>
                               </>
                            )}
                            {col.type === 'Catálogo / Estado' && (
                               <>
                                 <option>Solo nombre: Requiere revisión</option>
                                 <option>Código y nombre: REQ_REV - Requiere revisión</option>
                               </>
                            )}
                         </select>
                      </div>
                      <div className="col-span-1 flex justify-end pr-2">
                         <button onClick={() => setEditColumns(editColumns.filter(c => c.id !== col.id))} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-colors">
                           <Trash2 size={15} />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
          
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
             <button onClick={() => setEditingOutput(null)} className="px-5 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors">
               Cancelar
             </button>
             <button onClick={() => setEditingOutput(null)} className="px-5 py-2 text-[13px] font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors flex items-center gap-2 shadow-sm">
               <Save size={16} />
               Guardar salida
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
