import React from 'react';
import { 
  AlertCircle, Search, Filter, 
  User, MessageSquare, Clock, ArrowRight,
  ShieldX, Layers, CheckCircle2, ChevronRight,
  MoreVertical, Share2, FileEdit, Trash2
} from 'lucide-react';

const tabs = [
  { id: 'abiertas', label: 'Diferencias abiertas', count: 45, color: 'rose' },
  { id: 'analisis', label: 'En análisis', count: 12, color: 'amber' },
  { id: 'regularizada', label: 'Regularizadas', count: 156, color: 'emerald' },
  { id: 'descartadas', label: 'Descartadas', count: 24, color: 'slate' },
];

const items = [
  { id: 'DF-1025', desc: 'Sobrante no identificado - BP Local', amount: '$12,450.00', date: 'Hace 45 min', user: 'Ana Silva', importance: 'Alta' },
  { id: 'DF-1024', desc: 'Faltante lote #889 - Terminal Tarjetas', amount: '$2,100.25', date: 'Hace 2h', user: 'Pendiente', importance: 'Media' },
  { id: 'DF-1023', desc: 'Discrepancia cambio moneda ext.', amount: '$850.12', date: 'Ayer', user: 'Carlos Ruiz', importance: 'Baja' },
];

export function Diferencias() {
  const [activeTab, setActiveTab] = React.useState('abiertas');

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Diferencias</h1>
            <p className="text-slate-500 text-[16px] font-medium max-w-3xl leading-relaxed">
              Revisa, clasifica y da tratamiento a las diferencias encontradas durante la conciliación.
            </p>
            <p className="text-[13.5px] text-slate-400 font-medium mt-3">
              Centraliza sobrantes, faltantes, diferidos, registros no encontrados y casos pendientes de análisis.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-[13.5px] font-bold rounded-xl shadow-sm hover:border-primary hover:text-primary transition-all flex items-center gap-2">
              <Share2 size={18} />
              Exportar
            </button>
            <button className="px-5 py-2.5 bg-primary text-white text-[13.5px] font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
              <CheckCircle2 size={18} />
              Regularizar Masivo
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 pb-4 px-1 text-[14.5px] font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por ID, descripción o monto..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13.5px] focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all w-80 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={16} />
              Más filtros
            </button>
          </div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Ordenado por: Más reciente</p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-0.5 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${
                    item.importance === 'Alta' ? 'bg-rose-50 text-rose-500 border border-rose-100' :
                    item.importance === 'Media' ? 'bg-amber-50 text-amber-500 border border-amber-100' :
                    'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}>
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">{item.id}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.importance === 'Alta' ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20' : 'bg-slate-100 text-slate-500'
                      }`}>
                        Prioridad {item.importance}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-800 group-hover:text-primary transition-colors">{item.desc}</h3>
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500 font-medium">
                        <User size={14} className="text-slate-300" />
                        {item.user}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500 font-medium font-mono">
                        <Clock size={14} className="text-slate-300" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-rose-600">
                        {item.amount}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:border-l md:border-slate-100 md:pl-6 overflow-x-auto pb-1 md:pb-0">
                  <button className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-primary/5 hover:text-primary text-slate-600 text-[12.5px] font-bold rounded-xl transition-all" title="Asignar responsable">
                    Asignar
                  </button>
                  <button className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-primary/5 hover:text-primary text-slate-600 text-[12.5px] font-bold rounded-xl transition-all" title="Registrar observación">
                    Comentar
                  </button>
                  <div className="w-px h-6 bg-slate-100 mx-1 hidden md:block" />
                  <button className="p-2.5 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="py-12 text-center">
          <p className="text-slate-400 text-[14px] font-medium">
            No se encontraron más diferencias para los criterios seleccionados.
          </p>
        </div>
      </section>
    </div>
  );
}
