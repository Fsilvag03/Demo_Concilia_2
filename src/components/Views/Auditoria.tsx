import React from 'react';
import { 
  Shield, Search, Filter, Clock, 
  Terminal, ShieldCheck, ShieldAlert,
  ChevronRight, MoreVertical, Calendar,
  Download, History, User, Activity
} from 'lucide-react';

const events = [
  { id: 'EV-9021', user: 'Ana Silva', event: 'Cambio de regla: Validadores de entrada', time: 'Hoy 11:20 AM', type: 'Configuración' },
  { id: 'EV-9020', user: 'Sistema', event: 'Inicio de ejecución masiva: Bancos', time: 'Hoy 10:45 AM', type: 'Ejecución' },
  { id: 'EV-9019', user: 'Carlos Ruiz', event: 'Descarga de reporte confidencial: Diferencias Q1', time: 'Hoy 09:30 AM', type: 'Acceso' },
  { id: 'EV-9018', user: 'Admin', event: 'Nuevo usuario creado: Javier López', time: 'Hoy 08:00 AM', type: 'Administración' },
  { id: 'EV-9017', user: 'Marta Gómez', event: 'Aprobación de cierre manual', time: 'Ayer 17:30 PM', type: 'Operación' },
];

export function Auditoria() {
  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Auditoría</h1>
        <p className="text-slate-500 text-[16px] font-medium max-w-3xl leading-relaxed">
          Consulta la trazabilidad completa de cargas, reglas, ejecuciones, diferencias, aprobaciones y acciones realizadas.
        </p>
        <p className="text-[13.5px] text-slate-400 font-medium mt-3 italic">
          Registro histórico de eventos para control operativo, revisión interna y soporte de auditoría.
        </p>
      </header>

      {/* Audit Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-slate-50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Integridad del log</h4>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={20} className="text-emerald-500" />
              <span className="text-[14px] font-bold text-emerald-600">Verificada</span>
            </div>
            <p className="text-[12px] text-slate-500 font-medium">Sincronizado hace 2 min.</p>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm relative overflow-hidden">
           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Eventos (Hoy)</h4>
           <h3 className="text-3xl font-black text-slate-800 tracking-tight">1,245</h3>
           <p className="text-[12px] text-emerald-500 font-bold mt-1 inline-flex items-center gap-1">
             <Activity size={12} /> +12% vs ayer
           </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm lg:col-span-2 flex items-center gap-6">
          <div className="flex-1">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Actividad Crítica</h4>
            <div className="flex items-center gap-4">
               <div>
                 <span className="text-2xl font-black text-rose-500">2</span>
                 <p className="text-[11px] font-bold text-slate-400">ALERTAS AUDITORÍA</p>
               </div>
               <div className="w-px h-8 bg-slate-100" />
               <p className="text-[12.5px] text-slate-500 font-medium leading-tight">
                 Se detectó un acceso inusual a cierres históricos desde una IP externa.
               </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-rose-50 text-rose-600 text-[12px] font-black uppercase tracking-wider rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">
            Investigar
          </button>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <History size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Bitácora de eventos</h3>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filtrar por usuario o evento..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13.5px] focus:outline-none focus:border-primary transition-all w-72 shadow-sm"
              />
            </div>
            <button className="p-2.5 text-slate-400 bg-white border border-slate-200 rounded-xl hover:text-primary transition-all shadow-sm">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">ID Evento</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Tipo</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Evento / Acción</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Usuario</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Sello de Tiempo</th>
                  <th className="px-6 py-4 border-b border-slate-100"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.map((ev) => (
                  <tr key={ev.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 font-mono text-[12px] font-bold text-slate-400">{ev.id}</td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                        ev.type === 'Configuración' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                        ev.type === 'Ejecución' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        ev.type === 'Administración' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {ev.type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[14px] font-bold text-slate-700 max-w-sm truncate">{ev.event}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold border border-white shadow-sm">
                          {ev.user.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[13.5px] font-medium text-slate-600">{ev.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[13px] font-medium text-slate-500">
                      {ev.time}
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button className="p-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-all hover:text-slate-600">
                         <ChevronRight size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50/30 text-center">
            <button className="text-[13px] font-bold text-primary hover:underline flex items-center gap-2 mx-auto uppercase tracking-widest">
              Consultar log completo <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="mt-12 text-center py-10 opacity-60">
        <p className="text-[13px] font-medium text-slate-400">
          No se encontraron eventos adicionales de auditoría para los filtros aplicados.
        </p>
      </div>
    </div>
  );
}
