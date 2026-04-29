import React from 'react';
import { 
  CheckSquare, Clock, User, Filter, 
  CheckCircle2, XCircle, HelpCircle, Undo2, 
  ExternalLink, FileText, ChevronRight, MoreVertical
} from 'lucide-react';

const stats = [
  { label: 'Pendientes', value: '8', icon: Clock, color: 'amber' },
  { label: 'Aprobadas (hoy)', value: '24', icon: CheckCircle2, color: 'emerald' },
  { label: 'Rechazadas (hoy)', value: '2', icon: XCircle, color: 'rose' },
];

const pendientes = [
  { id: 'APR-7721', type: 'Cierre Operativo', requester: 'Marta Gómez', amount: '$420,500.00', date: 'Hace 15 min', priority: 'Urgente' },
  { id: 'APR-7720', type: 'Diferencia Regularizada', requester: 'Ana Silva', amount: '$12,450.00', date: 'Hace 1h', priority: 'Alta' },
  { id: 'APR-7719', type: 'Solicitud Compensación', requester: 'Carlos Ruiz', amount: '$8,200.00', date: 'Hace 3h', priority: 'Normal' },
];

export function Aprobaciones() {
  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Aprobaciones</h1>
        <p className="text-slate-500 text-[16px] font-medium max-w-3xl leading-relaxed">
          Revisa y aprueba acciones que impactan el cierre operativo, regularizaciones o cambios de estado.
        </p>
        <p className="text-[13.5px] text-slate-400 font-medium mt-3 italic">
          Bandeja de decisiones pendientes para validar ajustes, compensaciones, cierres o excepciones tratadas.
        </p>
      </header>

      {/* Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-800">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Pendientes de aprobación</h3>
          <span className="bg-slate-100 text-slate-500 text-[11px] font-black px-2 py-0.5 rounded-full">EN LÍNEA</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[13px] font-bold rounded-lg transition-all">
            <Filter size={16} />
            Filtrar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {pendientes.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-[24px] p-6 hover:shadow-xl hover:shadow-slate-200/40 group transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-start gap-5 flex-1 min-w-0">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <FileText size={28} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">{item.id}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      item.priority === 'Urgente' ? 'bg-rose-500 text-white shadow-sm' :
                      item.priority === 'Alta' ? 'bg-amber-500 text-white shadow-sm' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-800 tracking-tight leading-snug">{item.type}</h3>
                  <div className="flex items-center gap-6 mt-3 text-[13px] font-medium text-slate-500 overflow-hidden">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <User size={14} className="text-slate-300" />
                      <span>Solicitado por: <span className="font-bold text-slate-700">{item.requester}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Clock size={14} className="text-slate-300" />
                      {item.date}
                    </div>
                    <div className="text-primary font-black shrink-0">{item.amount}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:border-l lg:border-slate-100 lg:pl-8">
                <button 
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 text-[13.5px] font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  title="Aprobar inmediatamente"
                >
                  <CheckCircle2 size={18} />
                  Aprobar
                </button>
                <button 
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 text-[13.5px] font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                  title="Rechazar solicitud"
                >
                  <XCircle size={18} />
                  Rechazar
                </button>
                <button 
                  className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                  title="Ver detalle y evidencia"
                >
                  <ExternalLink size={20} />
                </button>
                <div className="w-px h-6 bg-slate-100 mx-1 hidden lg:block" />
                <button className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="py-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <CheckSquare size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-400 text-[14px] font-medium max-w-xs">
            No tienes más aprobaciones pendientes en este momento.
          </p>
        </div>
      </div>
    </div>
  );
}
