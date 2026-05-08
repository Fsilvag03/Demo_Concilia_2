import React, { useState } from 'react';

export interface FieldOption {
  value: string;
  label: string;
  type: string;
}

interface FieldSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: FieldOption[];
  hasError?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const FieldSelect: React.FC<FieldSelectProps> = ({ 
  value, 
  onChange, 
  options, 
  hasError = false, 
  placeholder = "Seleccionar campo...",
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('derivado')) return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100';
    if (t.includes('normalizado')) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    if (t.includes('fuente')) return 'bg-slate-100 text-slate-600 border-slate-200';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="relative min-w-0">
      <div 
        className={`w-full px-3 py-2 border rounded-lg text-[13px] transition-colors flex items-center justify-between min-w-0 ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-70' : 'bg-slate-50 hover:bg-white cursor-pointer'} ${hasError ? 'border-amber-300' : 'border-slate-200'} ${!value ? 'text-slate-400' : 'text-slate-800'}`}
        onClick={() => { if (!disabled) setOpen(!open); }}
      >
        <div className="flex items-center justify-between flex-1 truncate pr-2 min-w-0">
          <span className="truncate block min-w-0">{selected ? selected.label : placeholder}</span>
          {selected && selected.type && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ml-2 shrink-0 ${getTypeColor(selected.type)}`}>
              {selected.type}
            </span>
          )}
        </div>
        <div className="text-slate-400 shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
      
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1">
          {options.map(opt => (
            <div 
              key={opt.value}
              className="px-3 py-2 text-[13px] hover:bg-slate-50 cursor-pointer flex items-center justify-between min-w-0"
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              <span className="text-slate-800 truncate pr-2 block min-w-0">{opt.label}</span>
              {opt.type && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${getTypeColor(opt.type)}`}>
                  {opt.type}
                </span>
              )}
            </div>
          ))}
          {options.length === 0 && (
             <div className="px-3 py-4 text-center text-[12px] text-slate-500">
               No hay campos disponibles
             </div>
          )}
        </div>
      )}
      
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
};
