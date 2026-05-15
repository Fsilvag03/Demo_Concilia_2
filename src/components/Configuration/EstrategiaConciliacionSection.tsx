import React, { useState } from 'react';
import { 
  GitMerge, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Copy, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle,
  Power,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  GitBranch
} from 'lucide-react';
import type { Process } from './ProcessCard';
import { PasoCruceModal } from './PasoCruceModal';

interface EstrategiaConciliacionSectionProps {
  process: Process;
  onChange: () => void;
}

type StepStatus = 'Completo' | 'Incompleto' | 'Con error';

interface CruceStep {
  id: string;
  order: number;
  name: string;
  active: boolean;
  status: StepStatus;
  sources: string;
  type: string;
  criteria: string;
  errorMsg?: string;
  configData?: any;
}

export const EstrategiaConciliacionSection: React.FC<EstrategiaConciliacionSectionProps> = ({ process, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'Todas' | 'Activas' | 'Inactivas' | 'Incompletas' | 'Con error'>('Todas');

  const [steps, setSteps] = useState<CruceStep[]>(() => {
    const s1 = process.sources[0] || 'Fuente 1';
    const s2 = process.sources[1] || 'Fuente 2';
    const s3 = process.sources.length > 2 ? process.sources[2] : (process.sources[0] || 'Fuente 3');

    return [
      {
        id: 'step1',
        order: 1,
        name: `Cruce ${s1} vs ${s2}`,
        active: true,
        status: 'Completo',
        sources: `${s1} vs ${s2}`,
        type: '1:1',
        criteria: 'predio/título + monto → coincidencia exacta',
        configData: {
          source1: s1, source2: s2, type: '1:1',
          criteria: [
            { id: 'c1', field1: 'predio/título', comparisonType: 'Exacta', field2: 'predio/título' },
            { id: 'c2', field1: 'monto', comparisonType: 'Exacta', field2: 'monto' }
          ]
        }
      },
      {
        id: 'step2',
        order: 2,
        name: `Cruce ${s3} vs ${s2}`,
        active: true,
        status: 'Completo',
        sources: `${s3} vs ${s2}`,
        type: '1:1',
        criteria: 'código documento + monto → coincidencia exacta',
        configData: {
          source1: s3, source2: s2, type: '1:1',
          criteria: [
            { id: 'c1', field1: 'código documento', comparisonType: 'Exacta', field2: 'código documento' },
            { id: 'c2', field1: 'monto', comparisonType: 'Exacta', field2: 'monto' }
          ]
        }
      },
      {
        id: 'step3',
        order: 3,
        name: 'Cruce por acumulación',
        active: false,
        status: 'Completo',
        sources: `${s1} vs ${s3}`,
        type: '1:N',
        criteria: 'referencia + fecha → suma de montos',
        configData: {
          source1: s1, source2: s3, type: '1:N',
          criteria: [
            { id: 'c1', field1: 'referencia', comparisonType: 'Exacta', field2: 'referencia' },
            { id: 'c2', field1: 'fecha', comparisonType: 'Exacta', field2: 'fecha' }
          ]
        }
      },
      {
        id: 'step4',
        order: 4,
        name: 'Cruce alternativo por monto',
        active: true,
        status: 'Incompleto',
        sources: `${s2} vs ${s1}`,
        type: '1:1',
        criteria: 'falta definir campo de comparación',
        errorMsg: 'falta definir campo de comparación',
        configData: {
          source1: s2, source2: s1, type: '1:1',
          criteria: [
            { id: 'c1', field1: 'monto', comparisonType: 'Exacta', field2: '' }
          ]
        }
      }
    ];
  });

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStepData, setEditingStepData] = useState<any>(null);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const closeMenu = () => setOpenMenuId(null);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    if (direction === 'up' && index > 0) {
      [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    } else if (direction === 'down' && index < newSteps.length - 1) {
      [newSteps[index + 1], newSteps[index]] = [newSteps[index], newSteps[index + 1]];
    }
    
    // Update orders
    const updatedSteps = newSteps.map((step, i) => ({ ...step, order: i + 1 }));
    setSteps(updatedSteps);
    onChange();
  };

  const toggleActive = (id: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, active: !s.active } : s));
    onChange();
  };

  const handleAddStep = () => {
    setEditingStepData(null);
    setIsModalOpen(true);
  };

  const handleEditStep = (step: CruceStep) => {
    // If we have saved config data, use it, otherwise fallback
    const sourcesArr = step.sources.split(' vs ');
    const modalData = step.configData || {
      id: step.id,
      name: step.name,
      description: '',
      source1: sourcesArr[0] || '',
      source2: sourcesArr[1] || '',
      type: step.type,
      criteria: [
         { id: '1', field1: step.criteria, field2: '', comparisonType: 'Exacta' }
      ]
    };
    setEditingStepData(modalData);
    setIsModalOpen(true);
  };

  const handleSaveStep = (modalData: any) => {
    const validCriteria = modalData.criteria.filter((c: any) => c.field1 && c.field2);
    const criteriaSummary = validCriteria.length > 0 
      ? validCriteria.map((c: any) => {
          let field1 = c.field1.replace(/_/g, ' ');
          let field2 = c.field2.replace(/_/g, ' ');
          let comp = 'exacta';
          if (c.comparisonType === 'Tolerancia Monto') comp = `tol. ±${c.param || '?'}`;
          else if (c.comparisonType === 'Rango Fecha') comp = `rango ±${c.param || '?'}d`;
          return `${field1} ↔ ${field2} (${comp})`;
        }).join(' • ')
      : 'Sin criterios válidos';

    const newStep: CruceStep = {
      id: modalData.id || `step${Date.now()}`,
      order: steps.length + 1,
      name: modalData.name,
      active: true,
      status: validCriteria.length > 0 ? 'Completo' : 'Incompleto',
      sources: `${modalData.source1} vs ${modalData.source2}`,
      type: modalData.type,
      criteria: criteriaSummary,
      configData: modalData
    };

    if (modalData.id) {
      setSteps(steps.map(s => s.id === modalData.id ? { ...s, ...newStep, order: s.order } : s));
    } else {
      setSteps([...steps, newStep]);
    }
    onChange();
  };

  const activeStepsCount = steps.filter(s => s.active).length;
  const incompleteCount = steps.filter(s => s.status !== 'Completo').length;

  const filteredSteps = steps.filter(step => {
    if (filter === 'Activas' && !step.active) return false;
    if (filter === 'Inactivas' && step.active) return false;
    if (filter === 'Incompletas' && step.status !== 'Incompleto') return false;
    if (filter === 'Con error' && step.status !== 'Con error') return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return step.name.toLowerCase().includes(query) || step.sources.toLowerCase().includes(query) || step.criteria.toLowerCase().includes(query);
    }
    
    return true;
  });

  const renderStatusBadge = (status: StepStatus) => {
    switch(status) {
      case 'Completo':
        return null;
      case 'Incompleto':
        return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">Incompleta</span>;
      case 'Con error':
        return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100" title="Error de configuración"><AlertTriangle size={10} /> Con error</span>;
    }
  };

  const renderCriteria = (step: CruceStep) => {
    if (step.configData?.criteria && step.configData.criteria.length > 0) {
      const validCriteria = step.configData.criteria.filter((c: any) => c.field1 && c.field2);
      if (validCriteria.length === 0) return <span className="text-slate-400 italic">Sin criterios válidos</span>;

      return (
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-0.5">
          {validCriteria.map((c: any, i: number) => {
            const f1 = c.field1.replace(/_/g, ' ');
            const f2 = c.field2.replace(/_/g, ' ');
            return (
               <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 md:py-1 rounded-md text-[11px] text-slate-700 font-medium whitespace-nowrap shadow-sm">
                 <span>{f1}</span>
                 <ArrowLeftRight size={10} className="text-slate-400 shrink-0" />
                 <span>{f2}</span>
                 {c.comparisonType !== 'Exacta' && (
                   <>
                     <span className="text-slate-300 select-none mx-0.5 md:mx-1">•</span>
                     {c.comparisonType === 'Tolerancia Monto' && <span className="text-amber-600 font-bold tracking-tight">±{c.param || '?'}</span>}
                     {c.comparisonType === 'Rango Fecha' && <span className="text-indigo-600 font-bold tracking-tight">±{c.param || '?'}d</span>}
                   </>
                 )}
               </div>
            );
          })}
        </div>
      );
    }

    return <span className={step.status !== 'Completo' ? 'text-slate-400 italic' : 'text-slate-600'}>{step.criteria}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300 pb-12" onClick={closeMenu}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-end gap-4">
        <button 
          onClick={handleAddStep}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-[13px] font-bold rounded-xl shadow-sm transition-colors shrink-0"
        >
          <Plus size={16} />
          {steps.length > 0 ? 'Agregar paso' : 'Agregar primer paso'}
        </button>
      </div>

      {steps.length > 0 ? (
        <div className="space-y-6">
          {/* Configuración Mínima */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden mb-6">
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 shrink-0 mt-0.5">
                  <GitMerge size={20} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-slate-800 mb-1.5">Conciliación secuencial por pasos</h4>
                  
                  <div className="flex items-center text-[12px] text-slate-500 flex-wrap gap-x-2 gap-y-1">
                    <span className="font-semibold text-slate-600">{steps.length} pasos configurados</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{activeStepsCount} activos</span>
                    {incompleteCount > 0 && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <AlertTriangle size={11} className="shrink-0"/>
                          {incompleteCount} requiere{incompleteCount !== 1 ? 'n' : ''} revisión
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2 text-[13px] sm:pl-4 sm:border-l sm:border-slate-100 shrink-0 min-w-fit">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1.5">
                    <GitBranch size={13} className="text-slate-400" />
                    Fuente Principal:
                  </span>
                  {process.sources.length === 0 ? (
                    <span className="text-[13px] text-slate-400 italic">Configura al menos una...</span>
                  ) : (
                    <span className="text-[13px] font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 inline-block min-w-[120px] shadow-sm">
                      {process.mainSource || <span className="text-slate-400 font-normal italic">No configurada</span>}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* List Wrapper */}
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
              <div className="relative w-full sm:w-auto">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar paso, fuente..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-72 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {(['Todas', 'Activas', 'Inactivas', 'Incompletas', 'Con error'] as const).map(f => {
                  let count = 0;
                  if (f === 'Todas') count = steps.length;
                  if (f === 'Activas') count = steps.filter(s => s.active).length;
                  if (f === 'Inactivas') count = steps.filter(s => !s.active).length;
                  if (f === 'Incompletas') count = steps.filter(s => s.status === 'Incompleto').length;
                  if (f === 'Con error') count = steps.filter(s => s.status === 'Con error').length;
                  
                  return (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {f} <span className={`ml-1 text-[10px] ${filter === f ? 'text-slate-300' : 'text-slate-400'}`}>({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Steps List */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100 mb-6">
              {filteredSteps.length > 0 ? filteredSteps.map((step, index) => (
                <div key={step.id} className={`relative flex items-start p-4 md:p-5 hover:bg-slate-50 transition-colors ${!step.active ? 'opacity-75 bg-slate-50/50' : ''} ${openMenuId === step.id ? 'z-50' : 'z-10'}`}>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                       <span className="text-[13px] font-bold text-slate-400">#{String(step.order).padStart(2, '0')}</span>
                       <h4 className={`text-[14px] font-bold ${!step.active ? 'text-slate-600' : 'text-slate-800'}`}>
                         {step.name}
                       </h4>
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${step.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                         {step.active ? 'Activo' : 'Inactivo'}
                       </span>
                       {renderStatusBadge(step.status)}
                    </div>
                    <div className="flex items-center text-[13px] text-slate-500 flex-wrap gap-y-2 gap-x-3">
                      <span className="font-medium text-slate-700 flex items-center gap-1.5">
                        {step.sources.split(' vs ')[0]}
                        <ArrowLeftRight size={14} className="text-slate-400" />
                        {step.sources.split(' vs ')[1] || ''}
                      </span>
                      <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">{step.type}</span>
                      {renderCriteria(step)}
                    </div>
                  </div>

                  <div className="relative ml-auto flex items-center gap-1">
                    <div className="flex items-center text-slate-400 mr-1 border-r border-slate-200 pr-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveStep(index, 'up'); }}
                        disabled={index === 0}
                        className="p-1.5 rounded-md hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                        title="Mover arriba"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveStep(index, 'down'); }}
                        disabled={index === steps.length - 1}
                        className="p-1.5 rounded-md hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                        title="Mover abajo"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditStep(step); }}
                      className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                      title="Editar paso"
                    >
                      <Edit2 size={16} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={(e) => toggleMenu(step.id, e)}
                        className={`p-2 rounded-lg transition-colors ${openMenuId === step.id ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-800'}`}
                        title="Más opciones"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {openMenuId === step.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-[100] py-1">
                          <button 
                            className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); toggleActive(step.id); closeMenu(); }}
                          >
                            <Power size={14} />
                            {step.active ? 'Inactivar paso' : 'Activar paso'}
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); closeMenu(); }}
                          >
                            <Copy size={14} />
                            Duplicar paso
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2"></div>
                          <button 
                            className="w-full text-left px-4 py-2 text-[13px] text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); closeMenu(); }}
                          >
                            <Trash2 size={14} />
                            Eliminar paso
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No se encontraron pasos de cruce que coincidan con los filtros.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border text-center border-slate-200 border-dashed rounded-2xl py-16 px-6 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 border border-primary/10">
            <GitMerge size={24} className="text-primary" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">No hay pasos de cruce configurados</h4>
          <p className="text-slate-500 text-[13px] max-w-sm mx-auto mb-8">
            Comienza a configurar tu estrategia definiendo cómo se conectarán y compararán las fuentes de información.
          </p>
          <button 
            onClick={handleAddStep}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-[13px] font-bold rounded-xl shadow-sm transition-colors hover:shadow-md"
          >
            <Plus size={18} />
            Agregar primer paso de cruce
          </button>
        </div>
      )}

      <PasoCruceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStep}
        processSources={process.sources}
        initialData={editingStepData}
      />
    </div>
  );
};
