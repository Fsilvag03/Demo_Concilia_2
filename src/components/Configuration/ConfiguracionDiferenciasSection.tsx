import React, { useState } from 'react';
import { 
  FileWarning, Info, AlertTriangle, ShieldAlert, GitBranch, Key, Activity, Clock, Plus, Edit2, Hexagon, Trash2, ArrowRight, Eye, ShieldCheck, Power, Search, FileText, CheckCircle2, Wrench, RefreshCcw
} from 'lucide-react';
import type { Process } from './ProcessCard';

interface ConfiguracionDiferenciasSectionProps {
  process: Process;
  onChange: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const ConfiguracionDiferenciasSection: React.FC<ConfiguracionDiferenciasSectionProps> = ({ process, onChange, onNavigate }) => {
  const isRectorSet = !!process.rectorSource;

  const [typeConfig, setTypeConfig] = useState([
    { id: '1', name: 'Faltante', active: true, severity: 'Bloqueante', requiresApproval: true },
    { id: '2', name: 'Sobrante', active: true, severity: 'Requiere revisión', requiresApproval: true },
    { id: '3', name: 'Diferencia de monto', active: true, severity: 'Bloqueante', requiresApproval: true },
    { id: '4', name: 'Diferencia de fecha', active: true, severity: 'Requiere revisión', requiresApproval: false },
    { id: '5', name: 'Diferencia de campo clave', active: true, severity: 'Requiere revisión', requiresApproval: false },
    { id: '6', name: 'Coincidencia parcial', active: true, severity: 'Requiere revisión', requiresApproval: false },
    { id: '7', name: 'Pendiente de análisis', active: true, severity: 'Requiere revisión', requiresApproval: false },
  ]);

  const [rulesConfig, setRulesConfig] = useState([
    { id: '1', condition: 'Solo en fuente rectora', description: 'Registro existe en la fuente rectora, pero no tiene contraparte.', type: 'Faltante' },
    { id: '2', condition: 'Solo en fuente comparada', description: 'Registro existe en la otra fuente, pero no aparece en la rectora.', type: 'Sobrante' },
    { id: '3', condition: 'Diferencia de monto', description: 'Los registros se relacionan, pero el valor monetario no coincide.', type: 'Diferencia de monto' },
    { id: '4', condition: 'Diferencia de fecha', description: 'Los registros se relacionan, pero la fecha no cumple el criterio.', type: 'Diferencia de fecha' },
    { id: '5', condition: 'Diferencia de campo clave', description: 'Los registros se relacionan, pero no coincide un dato clave.', type: 'Diferencia de campo clave' },
    { id: '6', condition: 'Coincidencia parcial', description: 'Cumple algunos criterios, pero no los suficientes para conciliar.', type: 'Coincidencia parcial' },
    { id: '7', condition: 'Sin clasificación clara', description: 'El sistema no pudo determinar una causa específica.', type: 'Pendiente de análisis' }
  ]);

  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [editingTypeName, setEditingTypeName] = useState('');

  const handleRuleTypeChange = (id: string, newType: string) => {
    setRulesConfig(rulesConfig.map(r => r.id === id ? { ...r, type: newType } : r));
    onChange();
  };

  const handleTypeChange = (id: string, field: string, value: any) => {
    setTypeConfig(typeConfig.map(t => t.id === id ? { ...t, [field]: value } : t));
    onChange();
  };

  const handleDeleteType = (id: string) => {
    setTypeConfig(typeConfig.filter(t => t.id !== id));
    onChange();
  };

  const handleAddType = () => {
    const newId = String(Date.now());
    setTypeConfig([...typeConfig, { id: newId, name: 'Nuevo tipo', active: true, severity: 'Requiere revisión', requiresApproval: false }]);
    onChange();
  };

  const startEditingType = (id: string, name: string) => {
    setEditingTypeId(id);
    setEditingTypeName(name);
  };

  const commitEditingType = () => {
    if (editingTypeId && editingTypeName.trim()) {
      handleTypeChange(editingTypeId, 'name', editingTypeName.trim());
    }
    setEditingTypeId(null);
  };

  const approvalCount = typeConfig.filter(t => t.requiresApproval).length;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">Configuración de diferencias</h3>
        <p className="text-slate-500 text-sm max-w-2xl">
          Define cómo se clasificarán, priorizarán y atenderán las diferencias generadas por la conciliación.
        </p>
      </div>

      <div className="space-y-6">
        {/* Resumen Superior */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          {isRectorSet ? (
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[13px] font-medium flex items-center gap-1.5"><GitBranch size={16} className="text-slate-400" /> Fuente rectora:</span>
                <span className="text-[13px] font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">{process.rectorSource}</span>
              </div>
              {onNavigate && (
                <button 
                  onClick={() => onNavigate('estrategia')}
                  className="text-[11.5px] font-medium text-slate-400 hover:text-primary hover:underline self-start ml-6 transition-colors"
                >
                  Cambiar en Estrategia de conciliación
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-amber-600">
                 Fuente rectora no definida
              </div>
              <p className="text-[12.5px] text-slate-500">
                Para clasificar correctamente las diferencias, selecciona una fuente rectora en Estrategia de conciliación.
              </p>
              {onNavigate && (
                <button 
                  onClick={() => onNavigate('estrategia')}
                  className="text-[12.5px] font-bold text-primary hover:underline self-start mt-0.5"
                >
                  Ir a Estrategia de conciliación
                </button>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 shrink-0">
             {isRectorSet ? (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  COMPLETO
                </span>
             ) : (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  INCOMPLETO
                </span>
             )}
          </div>
        </div>

        {/* 1. Clasificación automática */}
        <div>
          <div className="mb-4">
            <h4 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              Clasificación automática
            </h4>
            <p className="text-[13px] text-slate-500 mt-1">Define cómo el sistema interpreta los patrones y resultados del cruce para asignarles un tipo de diferencia funcional.</p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3 w-1/2">Resultado detectado</th>
                  <th className="px-5 py-3 w-1/2">Asignar como Tipo de diferencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rulesConfig.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3.5 align-middle">
                      <span className="text-[13px] font-bold text-slate-800 block mb-0.5">{rule.condition}</span>
                      <span className="text-[11.5px] text-slate-500 leading-snug block">{rule.description}</span>
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 group-hover:bg-primary/10 transition-colors shrink-0">
                          <ArrowRight size={13} className="text-slate-400 group-hover:text-primary" />
                        </div>
                        <select 
                          value={rule.type}
                          onChange={(e) => handleRuleTypeChange(rule.id, e.target.value)}
                          className="flex-1 w-full pl-3 pr-8 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[13px] font-bold rounded-lg outline-none transition-colors appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 shadow-sm"
                          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
                        >
                          <option value="" disabled>Seleccionar tipo...</option>
                          {typeConfig.filter(t => t.active !== false).map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Tipos de diferencia */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden mt-8">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                  <FileWarning size={16} className="text-slate-400" />
                  Tipos de diferencia
                </h4>
                <p className="text-[12px] text-slate-500 mt-1">Catálogo de tipos, prioridad de atención y flujos de aprobación.</p>
              </div>
            </div>
          </div>
          <div className="p-0 overflow-x-auto">
             <table className="w-full text-left text-[13px]">
               <thead>
                 <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider bg-white">
                   <th className="px-5 py-3 font-semibold w-full">Tipo</th>
                   <th className="px-5 py-3 font-semibold text-center whitespace-nowrap">Severidad</th>
                   <th className="px-5 py-3 font-semibold text-center whitespace-nowrap">Aprobación</th>
                   <th className="px-5 py-3 font-semibold text-right w-24"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 bg-white">
                  {typeConfig.map((type) => (
                    <tr key={type.id} className={`hover:bg-slate-50/50 transition-colors group ${!type.active ? 'opacity-60 bg-slate-50/30' : ''}`}>
                      <td className="px-5 py-3 align-middle w-full">
                        {editingTypeId === type.id ? (
                           <input
                             autoFocus
                             className="px-2 py-1 border border-primary/40 rounded-md text-[12.5px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 w-48"
                             value={editingTypeName}
                             onChange={e => setEditingTypeName(e.target.value)}
                             onBlur={commitEditingType}
                             onKeyDown={e => {
                               if (e.key === 'Enter') commitEditingType();
                               if (e.key === 'Escape') setEditingTypeId(null);
                             }}
                           />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${!type.active ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}`}>{type.name}</span>
                            <button 
                              onClick={() => startEditingType(type.id, type.name)}
                              className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-md"
                              title="Editar nombre"
                            >
                              <Edit2 size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-2 align-middle text-center whitespace-nowrap">
                         <button 
                           onClick={(e) => {
                             const next = type.severity === 'Bloqueante' ? 'Requiere revisión' : 'Bloqueante';
                             handleTypeChange(type.id, 'severity', next);
                           }}
                           className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${
                              type.severity === 'Bloqueante' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' :
                              'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                           }`}
                         >
                            {type.severity === 'Bloqueante' && <ShieldAlert size={12} className="text-rose-600" />}
                            {type.severity === 'Requiere revisión' && <Eye size={12} className="text-sky-600" />}
                            <span className="text-[11px] font-bold leading-tight">{type.severity}</span>
                         </button>
                      </td>
                      <td className="px-5 py-2 align-middle text-center whitespace-nowrap">
                        <button 
                          onClick={() => handleTypeChange(type.id, 'requiresApproval', !type.requiresApproval)}
                          className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${type.requiresApproval ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                        >
                          <ShieldCheck size={12} className={type.requiresApproval ? "text-indigo-600" : "text-slate-400"} />
                          <span className="text-[11px] font-bold leading-tight">{type.requiresApproval ? 'Con aprobación' : 'Sin aprobación'}</span>
                        </button>
                      </td>
                      <td className="px-5 py-2 align-middle text-right">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                               onClick={() => handleTypeChange(type.id, 'active', !type.active)}
                               className={`p-1.5 rounded-md transition-colors ${type.active ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                               title={type.active ? "Desactivar" : "Activar"}
                            >
                              <Power size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteType(type.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 hover:bg-transparent rounded-md" 
                              title="Eliminar tipo"
                            >
                              <Trash2 size={14} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
             <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/30">
               <button 
                 onClick={handleAddType}
                 className="text-[12px] font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5"
               >
                  <Plus size={14} /> Agregar tipo
               </button>
             </div>
          </div>
        </div>

        {/* 3. Estados de diferencia */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 relative overflow-hidden mt-8">
           <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 opacity-50"></div>
           <div className="mb-8">
             <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                <RefreshCcw size={18} className="text-primary" />
                Ciclo de vida de atención
             </h4>
             <p className="text-[13px] text-slate-500 mt-1">
               Ruta de gestión y tratamiento que sigue una diferencia desde su detección hasta el cierre.
             </p>
           </div>
           
           <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
             <div className="flex items-start justify-between min-w-[700px] relative px-6">
               {/* Connecting Line */}
               <div className="absolute top-5 left-16 right-16 h-[2px] bg-slate-100 z-0"></div>

               {/* Step 1 */}
               <div className="flex flex-col items-center relative z-10 w-32 group">
                 <div className="w-10 h-10 rounded-full bg-white border-[3px] border-amber-300 group-hover:border-amber-400 group-hover:bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm mb-3 transition-colors">
                   <Clock size={16} strokeWidth={2.5} />
                 </div>
                 <span className="text-[12.5px] font-bold text-slate-700 tracking-wide text-center">Pendiente</span>
                 <span className="text-[11px] text-slate-400 text-center mt-1 leading-tight px-1">Diferencia detectada en el cruce</span>
               </div>

               {/* Step 2 */}
               <div className="flex flex-col items-center relative z-10 w-32 group">
                 <div className="w-10 h-10 rounded-full bg-white border-[3px] border-indigo-300 group-hover:border-indigo-400 group-hover:bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm mb-3 transition-colors">
                   <Search size={16} strokeWidth={2.5} />
                 </div>
                 <span className="text-[12.5px] font-bold text-slate-700 tracking-wide text-center">En revisión</span>
                 <span className="text-[11px] text-slate-400 text-center mt-1 leading-tight px-1">Análisis y búsqueda de causas</span>
               </div>

               {/* Step 3 */}
               <div className="flex flex-col items-center relative z-10 w-32 group">
                 <div className="w-10 h-10 rounded-full bg-white border-[3px] border-slate-300 group-hover:border-slate-400 group-hover:bg-slate-50 flex items-center justify-center text-slate-500 shadow-sm mb-3 transition-colors">
                   <FileText size={16} strokeWidth={2.5} />
                 </div>
                 <span className="text-[12.5px] font-bold text-slate-700 tracking-wide text-center">Justificada</span>
                 <span className="text-[11px] text-slate-400 text-center mt-1 leading-tight px-1">Explicada temporalmente</span>
               </div>

               {/* Step 4 */}
               <div className="flex flex-col items-center relative z-10 w-32 group">
                 <div className="w-10 h-10 rounded-full bg-white border-[3px] border-emerald-300 group-hover:border-emerald-400 group-hover:bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm mb-3 transition-colors">
                   <Wrench size={16} strokeWidth={2.5} />
                 </div>
                 <span className="text-[12.5px] font-bold text-slate-700 tracking-wide text-center">Regularizada</span>
                 <span className="text-[11px] text-slate-400 text-center mt-1 leading-tight px-1">Corrección aplicada en origen</span>
               </div>

               {/* Step 5 */}
               <div className="flex flex-col items-center relative z-10 w-32 group">
                 <div className="w-10 h-10 rounded-full bg-slate-50 border-[3px] border-slate-200 group-hover:border-slate-300 flex items-center justify-center text-slate-400 shadow-sm mb-3 transition-colors">
                   <CheckCircle2 size={16} strokeWidth={2.5} />
                 </div>
                 <span className="text-[12.5px] font-bold text-slate-400 tracking-wide text-center">Cerrada</span>
                 <span className="text-[11px] text-slate-400 text-center mt-1 leading-tight px-1">Conciliada satisfactoriamente</span>
               </div>

             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
