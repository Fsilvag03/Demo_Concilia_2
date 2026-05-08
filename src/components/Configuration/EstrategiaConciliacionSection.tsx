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
  AlertTriangle
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
        criteria: 'predio/título + monto → coincidencia exacta'
      },
      {
        id: 'step2',
        order: 2,
        name: `Cruce ${s3} vs ${s2}`,
        active: true,
        status: 'Completo',
        sources: `${s3} vs ${s2}`,
        type: '1:1',
        criteria: 'código documento + monto → coincidencia exacta'
      },
      {
        id: 'step3',
        order: 3,
        name: 'Cruce por acumulación',
        active: false,
        status: 'Completo',
        sources: `${s1} vs ${s3}`,
        type: '1:N',
        criteria: 'referencia + fecha → suma de montos'
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
        errorMsg: 'falta definir campo de comparación'
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
    // Parse step data into modal format
    const sourcesArr = step.sources.split(' vs ');
    const modalData = {
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
    const newStep: CruceStep = {
      id: modalData.id || `step${Date.now()}`,
      order: steps.length + 1,
      name: modalData.name,
      active: true,
      status: 'Completo',
      sources: `${modalData.source1} vs ${modalData.source2}`,
      type: modalData.type,
      criteria: modalData.criteria.map((c: any) => c.field1).join(' + ') + ' → Coincidencia ' + modalData.criteria[0]?.comparisonType,
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

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300 pb-12" onClick={closeMenu}>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-primary mb-2">Estrategia de conciliación</h3>
          <p className="text-slate-500 text-sm max-w-2xl">
            Define el orden y los criterios con los que se cruzarán las fuentes.
          </p>
        </div>
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
          {/* Estrategia Activa Summary */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                  <GitMerge size={20} className="text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-[14px] font-bold text-slate-800">Conciliación secuencial</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      ESTRATEGIA ACTIVA
                    </span>
                  </div>
                  <div className="flex items-center text-[12.5px] text-slate-500 flex-wrap gap-x-2 gap-y-1">
                    <span className="text-slate-600">Fuente rectora: </span>
                    <span className="font-semibold text-slate-700">{process.rectorSource || <span className="text-amber-600 font-bold">No definida</span>}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-600">{activeStepsCount} pasos activos</span>
                    {incompleteCount > 0 && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-600 font-bold flex items-center gap-1.5"><AlertTriangle size={12} className="shrink-0"/> {incompleteCount} incompleto{incompleteCount !== 1 ? 's' : ''}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button className="text-[13px] font-bold text-slate-600 hover:text-primary hover:bg-primary/5 transition-colors px-4 py-2 rounded-lg border border-slate-200 shrink-0 bg-white shadow-sm">
                Editar estrategia
              </button>
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
                    <div className="flex items-center text-[13px] text-slate-500 flex-wrap gap-y-1">
                      <span className="font-medium text-slate-700">{step.sources}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="font-medium">{step.type}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      <span className={step.status !== 'Completo' ? 'text-slate-400 italic' : ''}>
                        {step.criteria}
                      </span>
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
