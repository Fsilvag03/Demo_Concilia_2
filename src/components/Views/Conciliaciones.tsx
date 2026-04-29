import React from 'react';
import { 
  RefreshCw, Plus, Search, Filter, 
  Settings2, Database, Zap, History,
  ChevronRight, MoreVertical, PlayCircle
} from 'lucide-react';
import { motion } from 'motion/react';

import { ViewType } from '../../App';

interface ConciliacionesProps {
  onNavigate?: (view: ViewType) => void;
}

const procesos = [
  { id: 1, name: 'Conciliación Bancaria Local', status: 'Activo', lastRun: 'Hoy 08:30 AM', progress: 100, color: 'sky' },
  { id: 2, name: 'Tarjetas de Crédito Visa/MC', status: 'Activo', lastRun: 'Hoy 08:45 AM', progress: 100, color: 'indigo' },
  { id: 3, name: 'Recaudación App Móvil', status: 'Ejecutando', lastRun: 'Ahora', progress: 65, color: 'emerald' },
  { id: 4, name: 'Pagos Proveedores Exterior', status: 'Pausado', lastRun: 'Ayer 18:00 PM', progress: 0, color: 'rose' },
];

export function Conciliaciones({ onNavigate }: ConciliacionesProps) {
  const subsecciones = [
    { title: 'Procesos configurados', icon: Settings2, desc: 'Define y gestiona el flujo de trabajo' },
    { title: 'Ejecuciones del día', icon: PlayCircle, desc: 'Monitorea el avance tiempo real' },
    { title: 'Cargas de información', icon: Database, desc: 'Administra la ingesta de fuentes' },
    { title: 'Preparación de datos', icon: Zap, desc: 'Reglas de limpieza y normalización', onClick: () => onNavigate?.('configuracion') },
    { title: 'Historial', icon: History, desc: 'Consulta corridas anteriores' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Conciliaciones</h1>
          <p className="text-slate-500 text-[16px] font-medium max-w-3xl leading-relaxed">
            Gestiona los procesos de conciliación, carga fuentes, ejecuta cruces y revisa el avance de cada flujo operativo.
          </p>
          <div className="mt-4 flex items-center gap-3 text-[13px] font-medium text-slate-400">
            <span>Aquí se administran las conciliaciones por proceso, fecha, fuente y estado.</span>
          </div>
        </div>
        <button className="px-6 py-3 bg-primary text-white text-[14.5px] font-bold rounded-2xl shadow-xl shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 flex items-center gap-2.5 transition-all">
          <Plus size={20} />
          Nuevo Proceso
        </button>
      </header>

      {/* Subsecciones Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {subsecciones.map((sub, idx) => (
          <div 
            key={sub.title} 
            onClick={sub.onClick}
            className={`p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center text-center gap-3 transition-all shadow-sm ${sub.onClick ? 'cursor-pointer hover:border-primary/30 hover:shadow-md' : ''} group`}
          >
            <div className="p-3 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
              <sub.icon size={22} />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{sub.title}</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">{sub.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Processes View */}
      <section className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <RefreshCw size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Procesos activos hoy</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar proceso..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl text-[13.5px] focus:bg-white focus:border-slate-200 focus:outline-none transition-all w-64"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Proceso</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Estado</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Última Ejecución</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Progreso</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {procesos.map((proc) => (
                <tr key={proc.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-${proc.color}-50 text-${proc.color}-500 flex items-center justify-center shadow-sm border border-${proc.color}-100`}>
                        <RefreshCw size={20} />
                      </div>
                      <span className="text-[14.5px] font-bold text-slate-700 group-hover:text-primary transition-colors">{proc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      proc.status === 'Ejecutando' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 active-pulse' :
                      proc.status === 'Pausado' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${proc.status === 'Ejecutando' ? 'bg-emerald-500 animate-pulse' : proc.status === 'Pausado' ? 'bg-rose-500' : 'bg-slate-400'}`} />
                      {proc.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[13.5px] font-medium text-slate-500">
                    {proc.lastRun}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${proc.color}-500 transition-all duration-1000`} 
                          style={{ width: `${proc.progress}%` }} 
                        />
                      </div>
                      <span className="text-[13px] font-bold text-slate-600">{proc.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/30 text-center">
          <p className="text-[13px] font-medium text-slate-400">
            Aún no hay conciliaciones ejecutadas para los filtros seleccionados fuera de estas activas.
          </p>
        </div>
      </section>
    </div>
  );
}
