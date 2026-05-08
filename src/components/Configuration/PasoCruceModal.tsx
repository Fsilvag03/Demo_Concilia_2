import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowLeftRight, Check } from 'lucide-react';
import { FieldSelect, FieldOption } from './FieldSelect';

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

  // Check if fields represent a type mismatch (mock check based on naming logic)
  const isTypeMismatch = (f1: string, f2: string) => {
    if (!f1 || !f2) return false;
    const isAmount1 = f1.includes('monto') || f1.includes('credito');
    const isAmount2 = f2.includes('monto') || f2.includes('credito');
    const isDate1 = f1.includes('fecha');
    const isDate2 = f2.includes('fecha');
    
    if (isAmount1 !== isAmount2) return true;
    if (isDate1 !== isDate2) return true;
    return false;
  };

  // Generar resultado esperado automáticamente
  const generateExpectedResult = () => {
    if (!formData.source1 || !formData.source2) return "Selecciona las fuentes a comparar para visualizar el resultado esperado.";
    
    let baseText = `Se conciliará ${formData.source1} contra ${formData.source2} en relación ${formData.type}`;
    
    const validCriteria = formData.criteria.filter(c => c.field1 && c.field2 && !isTypeMismatch(c.field1, c.field2));
    if (validCriteria.length > 0) {
       const criteriosText = validCriteria.map(c => {
         let field1Name = c.field1.replace(/_/g, ' ');
         let field2Name = c.field2.replace(/_/g, ' ');
         
         let comparisonText = 'coincidencia exacta';
         if (c.comparisonType === 'Tolerancia Monto') comparisonText = `monto con tolerancia (±${c.param || '?'})`;
         else if (c.comparisonType === 'Rango Fecha') comparisonText = `rango de fechas (±${c.param || '?'} días)`;

         return `${field1Name} con ${field2Name} mediante ${comparisonText}`;
       }).join(', y ');
       
       baseText += `, comparando ${criteriosText}.`;
    } else {
       baseText += `.`;
    }
    
    return baseText;
  };

  const showSourceWarning = !formData.source1 || !formData.source2;
  const showSameSourceWarning = formData.source1 && formData.source2 && formData.source1 === formData.source2;

  const fieldOptions = [
    { value: "referencia_1", label: "Referencia", type: "Fuente" },
    { value: "referencia_extraida", label: "Referencia extraída", type: "Derivado" },
    { value: "credito", label: "Crédito", type: "Fuente" },
    { value: "monto_preparado", label: "Monto preparado", type: "Normalizado" },
    { value: "fecha_transaccion", label: "Fecha transacción", type: "Fuente" },
  ];

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
          {showSourceWarning ? (
             <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in">
               Selecciona ambas fuentes para continuar.
             </div>
          ) : showSameSourceWarning ? (
             <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in">
               La Fuente A y Fuente B deben ser distintas.
             </div>
          ) : null}

          {/* Info básica */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Nombre del paso <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20"
                  placeholder="Ej. Cruce de ventas contra abonos"
                />
              </div>
            </div>
          </div>

          {/* Configuración de Fuentes y Tipo */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Fuentes y tipo de cruce</h3>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Fuente A <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.source1}
                  onChange={e => setFormData({...formData, source1: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20 ${!formData.source1 ? 'border-amber-300 text-slate-400' : 'border-slate-200 text-slate-800'}`}
                >
                  <option value="">Seleccionar fuente...</option>
                  {processSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="hidden md:flex justify-center pt-6 text-slate-300">
                 <ArrowLeftRight size={20} />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Fuente B <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.source2}
                  onChange={e => setFormData({...formData, source2: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20 ${!formData.source2 || showSameSourceWarning ? 'border-rose-300 text-slate-400' : 'border-slate-200 text-slate-800'}`}
                >
                  <option value="">Seleccionar fuente...</option>
                  {processSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            
            <div className="pt-2">
              <label className="block text-[13px] font-medium text-slate-700 mb-2">Tipo de cruce <span className="text-rose-500">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: '1:1', title: '1:1', desc: 'Una transacción contra una transacción' },
                  { id: '1:N', title: '1:N', desc: 'Una transacción contra varias' },
                  { id: 'N:1', title: 'N:1', desc: 'Varias transacciones contra una' },
                ].map(t => (
                  <label key={t.id} className={`flex flex-col p-3 border rounded-xl cursor-pointer transition-all relative overflow-hidden ${formData.type === t.id ? 'border-primary/50 bg-primary/[0.03] shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'}`}>
                    <input type="radio" className="sr-only" checked={formData.type === t.id} onChange={() => setFormData({...formData, type: t.id})} />
                    
                    <div className="flex items-center mb-1">
                      <span className={`text-[14px] font-bold ${formData.type === t.id ? 'text-primary' : 'text-slate-700'}`}>{t.title}</span>
                      {formData.type === t.id && (
                        <span className="ml-auto w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in">
                          <Check size={10} className="text-primary" />
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] font-medium leading-snug ${formData.type === t.id ? 'text-slate-600' : 'text-slate-500'}`}>{t.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Criterios de coincidencia */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
               <div className="flex flex-col">
                 <h3 className="text-sm font-bold text-slate-800">Criterios de coincidencia</h3>
                 <span className="text-[12px] font-medium text-slate-500 mt-1">Para considerar una coincidencia, deben cumplirse todos los criterios configurados.</span>
               </div>
               <button onClick={handleAddCriteria} className="text-[12px] font-semibold text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors flex items-center gap-1 shrink-0">
                 <Plus size={14} /> Agregar criterio
               </button>
            </div>
            
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {formData.criteria.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No hay criterios definidos. Agrega al menos uno para poder realizar el cruce.</p>
              ) : (
                formData.criteria.map((c, i) => {
                  const hasMismatch = isTypeMismatch(c.field1, c.field2);
                  const isDerivadaIncompleta = c.field1 === 'referencia_extraida' || c.field2 === 'referencia_extraida'; // Simulando check

                  return (
                    <div key={c.id} className="flex flex-col bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
                        <div className="md:col-span-4 min-w-0">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 leading-none">Campo de {formData.source1 || 'Fuente A'}</label>
                          <FieldSelect
                            value={c.field1}
                            onChange={(val) => updateCriteria(c.id, 'field1', val)}
                            options={fieldOptions}
                            hasError={isDerivadaIncompleta && c.field1 === 'referencia_extraida'}
                            placeholder="Seleccionar..."
                          />
                          {isDerivadaIncompleta && c.field1 === 'referencia_extraida' && (
                            <p className="text-[11px] font-medium text-amber-600 mt-1.5 animate-in fade-in">
                              Transformación incompleta
                            </p>
                          )}
                        </div>
                        
                        <div className="md:col-span-4 min-w-0">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 leading-none">Comparación</label>
                          <div className="flex gap-2">
                            <select 
                              value={c.comparisonType}
                              onChange={e => {
                                updateCriteria(c.id, 'comparisonType', e.target.value);
                                if (e.target.value === 'Exacta') updateCriteria(c.id, 'param', '');
                              }}
                              className="flex-1 min-w-0 px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-slate-50 hover:bg-white focus:bg-white transition-colors outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary text-slate-800"
                            >
                              <option value="Exacta">Coincidencia exacta</option>
                              <option value="Tolerancia Monto">Monto con tolerancia</option>
                              <option value="Rango Fecha">Fecha con rango</option>
                            </select>
                            
                            {(c.comparisonType === 'Tolerancia Monto' || c.comparisonType === 'Rango Fecha') && (
                              <div className="w-20 shrink-0 min-w-0 animate-in fade-in slide-in-from-right-2">
                                <input 
                                  type="number"
                                  placeholder={c.comparisonType === 'Tolerancia Monto' ? "± 0.0" : "± Días"}
                                  value={c.param || ''}
                                  onChange={e => updateCriteria(c.id, 'param', e.target.value)}
                                  className={`w-full px-2 py-2 border rounded-lg text-[13px] text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 ${!c.param ? 'border-orange-300 bg-orange-50/30' : 'border-slate-200'}`}
                                />
                              </div>
                            )}
                          </div>
                          {(c.comparisonType === 'Tolerancia Monto' || c.comparisonType === 'Rango Fecha') && !c.param && (
                            <p className="text-[11px] font-medium text-orange-500 mt-1.5 animate-in fade-in">
                              {c.comparisonType === 'Tolerancia Monto' ? 'Ingresa la tolerancia' : 'Ingresa los días'}
                            </p>
                          )}
                        </div>
                        
                        <div className="md:col-span-4 min-w-0">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 leading-none">Campo de {formData.source2 || 'Fuente B'}</label>
                          <div className="flex gap-2 items-start">
                            <div className="flex-1 min-w-0">
                              <FieldSelect
                                value={c.field2}
                                onChange={(val) => updateCriteria(c.id, 'field2', val)}
                                options={fieldOptions}
                                hasError={isDerivadaIncompleta && c.field2 === 'referencia_extraida'}
                                placeholder="Seleccionar..."
                              />
                            </div>
                            {formData.criteria.length > 1 && (
                              <button 
                                onClick={() => handleRemoveCriteria(c.id)}
                                className="text-slate-400 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors shrink-0 outline-none"
                                title="Eliminar criterio"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          {isDerivadaIncompleta && c.field2 === 'referencia_extraida' && (
                            <p className="text-[11px] font-medium text-amber-600 mt-1.5 animate-in fade-in">
                              Transformación incompleta
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Validaciones de fila */}
                      {hasMismatch && (
                      <div className="mt-3 space-y-1">
                          <p className="text-[12px] font-medium text-rose-500 animate-in fade-in flex items-center gap-1.5">
                            <span className="w-1 h-3 bg-rose-500 rounded-full inline-block"></span> Los campos seleccionados tienen tipos distintos. Revise este criterio.
                          </p>
                      </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Resultado Esperado */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-6">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Resultado esperado</h4>
            <p className="text-[13px] font-medium text-slate-700 leading-relaxed max-w-3xl">
              {generateExpectedResult()}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-2xl">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={() => {
              // Could add validation logic here to prevent save if invalid
              onSave(formData);
              onClose();
            }}
            disabled={showSourceWarning || showSameSourceWarning || !formData.name || formData.criteria.some(c => !c.field1 || !c.field2)}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar paso
          </button>
        </div>
      </div>
    </div>
  );
};

