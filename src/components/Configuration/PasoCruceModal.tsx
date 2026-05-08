import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowRight } from 'lucide-react';

interface PasoCruceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  processSources: string[];
  initialData?: any;
}

export const PasoCruceModal: React.FC<PasoCruceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  processSources,
  initialData 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    source1: '',
    source2: '',
    type: '1:1',
    criteria: [] as any[]
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          name: '',
          description: '',
          source1: processSources[0] || '',
          source2: processSources[1] || '',
          type: '1:1',
          criteria: [{ id: Date.now().toString(), field1: '', field2: '', comparisonType: 'Exacta' }]
        });
      }
    }
  }, [isOpen, initialData, processSources]);

  if (!isOpen) return null;

  const handleAddCriteria = () => {
    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, { id: Date.now().toString(), field1: '', field2: '', comparisonType: 'Exacta' }]
    }))
  };

  const handleRemoveCriteria = (id: string) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== id)
    }));
  };

  const updateCriteria = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  // Generar resultado esperado automáticamente
  const generateExpectedResult = () => {
    if (!formData.source1 || !formData.source2) return "Selecciona las fuentes a comparar para visualizar el resultado esperado.";
    if (formData.criteria.length === 0) return "Agrega al menos un criterio de coincidencia.";

    const campos = formData.criteria.map(c => c.field1 || '[Campo]').join(' + ');
    return `El motor cruzará un registro de ${formData.source1} contra ${formData.type === '1:1' ? 'un registro' : 'varios registros'} de ${formData.source2} cuando sus valores coincidan según los criterios definidos (${campos}).`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex justify-center sm:items-center items-end sm:p-6 p-0 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl sm:rounded-2xl rounded-t-2xl shadow-xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? 'Editar paso de cruce' : 'Agregar paso de cruce'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Info básica */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Información del paso</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Nombre del paso <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20"
                  placeholder="Ej. Cruce exacto Banco vs Municipio"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Descripción <span className="text-slate-400 font-normal">(Opcional)</span></label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20"
                  placeholder="Explica brevemente el propósito de este cruce..."
                />
              </div>
            </div>
          </div>

          {/* Configuración de Fuentes y Tipo */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Fuentes y tipo de cruce</h3>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Primera fuente <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.source1}
                  onChange={e => setFormData({...formData, source1: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20"
                >
                  <option value="">Seleccionar fuente...</option>
                  {processSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="hidden md:flex justify-center pt-6 text-slate-300">
                 <ArrowRight size={20} />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Segunda fuente <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.source2}
                  onChange={e => setFormData({...formData, source2: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20"
                >
                  <option value="">Seleccionar fuente...</option>
                  {processSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Tipo de cruce <span className="text-rose-500">*</span></label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full sm:w-1/2 px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20"
              >
                <option value="1:1">1:1 (Un registro de fuente 1 coincide con un registro de fuente 2)</option>
                <option value="1:N">1:N (Un registro consolida varios de la fuente 2)</option>
                <option value="N:1">N:1 (Varios registros de fuente 1 consolidan en la fuente 2)</option>
              </select>
            </div>
          </div>

          {/* Criterios de coincidencia */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
               <h3 className="text-sm font-bold text-slate-800">Criterios de coincidencia</h3>
               <button onClick={handleAddCriteria} className="text-[12px] font-semibold text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors flex items-center gap-1">
                 <Plus size={14} /> Agregar criterio
               </button>
            </div>
            
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {formData.criteria.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No hay criterios definidos. Agrega al menos uno para poder realizar el cruce.</p>
              ) : (
                formData.criteria.map((c, i) => (
                  <div key={c.id} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">{formData.source1 || 'Fuente 1'}</label>
                        <select 
                          value={c.field1}
                          onChange={e => updateCriteria(c.id, 'field1', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-[13px] bg-slate-50 focus:bg-white"
                        >
                          <option value="">Seleccionar campo...</option>
                          <option value="referencia_1">referencia_1 (Texto)</option>
                          <option value="monto">monto (Numérico)</option>
                          <option value="fecha_transaccion">fecha_transaccion (Fecha)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">TIPO COMPARACIÓN</label>
                        <select 
                          value={c.comparisonType}
                          onChange={e => updateCriteria(c.id, 'comparisonType', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-[13px] bg-slate-50 focus:bg-white"
                        >
                          <option value="Exacta">Coincidencia exacta</option>
                          <option value="Tolerancia Monto">Tolerancia de monto</option>
                          <option value="Rango Fecha">Tolerancia de días (fecha)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">{formData.source2 || 'Fuente 2'}</label>
                        <select 
                          value={c.field2}
                          onChange={e => updateCriteria(c.id, 'field2', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-[13px] bg-slate-50 focus:bg-white"
                        >
                          <option value="">Seleccionar campo...</option>
                          <option value="referencia_1">referencia_1 (Texto)</option>
                          <option value="monto">monto (Numérico)</option>
                          <option value="fecha_transaccion">fecha_transaccion (Fecha)</option>
                        </select>
                      </div>
                    </div>
                    {formData.criteria.length > 1 && (
                      <button 
                        onClick={() => handleRemoveCriteria(c.id)}
                        className="text-slate-300 hover:text-rose-500 p-1.5 mt-4 hover:bg-rose-50 rounded transition-colors"
                        title="Eliminar criterio"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resultado Esperado */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
            <h4 className="text-[12px] font-bold text-indigo-800 uppercase tracking-wider mb-2">Resultado esperado</h4>
            <p className="text-[13px] font-medium text-indigo-900/80 leading-relaxed">
              {generateExpectedResult()}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            Guardar paso
          </button>
        </div>
      </div>
    </div>
  );
};
