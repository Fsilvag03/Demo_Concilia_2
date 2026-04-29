import React from 'react';
import { 
  FileText, Search, Download, ExternalLink, 
  TrendingUp, BarChart3, PieChart, Layers,
  ChevronRight, Calendar, Filter, Share2, Eye
} from 'lucide-react';

const reports = [
  { id: 'REP-01', title: 'Cierre de Conciliación Bancos - 28/04', type: 'PDF / Excel', date: 'Hoy 10:15 AM', size: '2.4 MB' },
  { id: 'REP-02', title: 'Resumen Diferencias de Tarjetas Q1', type: 'PDF', date: 'Hoy 09:00 AM', size: '1.8 MB' },
  { id: 'REP-03', title: 'Reporte Auditoría Cargas Automáticas', type: 'Excel', date: 'Ayer 15:45 PM', size: '840 KB' },
  { id: 'REP-04', title: 'Consolidado General de Operaciones', type: 'PDF', date: 'Ayer 08:30 AM', size: '5.2 MB' },
];

export function Resultados() {
  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700 text-slate-800">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-3">Resultados</h1>
        <p className="text-slate-500 text-[16px] font-medium max-w-3xl leading-relaxed">
          Consulta los resultados de conciliación, cierres operativos, reportes generados y salidas listas para compartir.
        </p>
        <p className="text-[13.5px] text-slate-400 font-medium mt-3 italic">
          Consolida el resultado final de cada proceso conciliado, incluyendo totales, diferencias tratadas y evidencias.
        </p>
      </header>

      {/* Grid Quick Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-6 lg:col-span-2 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 mb-2 text-primary font-black text-[11px] uppercase tracking-widest">
              <TrendingUp size={14} />
              Efectividad Global - Abril
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">99.12%</h2>
            <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
              La efectividad ha incrementado un <span className="text-emerald-600 font-bold">1.2%</span> respecto al cierre del mes anterior. 
              Diferencias tratadas oportunamente: <b>98.5%</b>.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button className="px-5 py-2.5 bg-primary text-white text-[13.5px] font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                Ver estadísticas
              </button>
            </div>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-white rounded-3xl border border-primary/10 shadow-xl shadow-primary/5">
             <BarChart3 size={120} className="text-primary/20" />
          </div>
        </div>

        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <PieChart size={100} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Cierres Diarios</h3>
            <p className="text-slate-400 text-[14px] leading-relaxed">Fueron completados exitosamente los 12 cierres operativos del día.</p>
          </div>
          <div className="mt-8 relative z-10 flex items-center justify-between">
            <div>
              <span className="text-2xl font-black">12/12</span>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">OPERACIONES</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center">
              <span className="text-[10px] font-bold">100%</span>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500">
               <FileText size={20} />
            </div>
            <h3 className="text-lg font-bold tracking-tight">Reportes generados recientemente</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar reporte..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl text-[13.5px] focus:bg-white focus:border-slate-200 focus:outline-none transition-all w-60"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 divide-y divide-slate-50">
            {reports.map((report) => (
              <div key={report.id} className="p-5 hover:bg-slate-50/80 group transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{report.id}</span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{report.type}</span>
                    </div>
                    <h4 className="text-[15.5px] font-bold text-slate-800 group-hover:text-primary transition-colors">{report.title}</h4>
                    <p className="text-[13px] text-slate-500 font-medium mt-1 inline-flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {report.date}</span>
                      <span className="inline-flex items-center gap-1.5"><Layers size={12} /> {report.size}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:pl-10">
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-primary hover:text-primary text-[13px] font-bold rounded-xl shadow-sm transition-all">
                    <Eye size={16} />
                    Ver
                  </button>
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-[13px] font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary/90 transition-all">
                    <Download size={16} />
                    Bajar
                  </button>
                  <button className="p-2.5 text-slate-300 hover:text-slate-500 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 bg-slate-50/50 text-center">
            <button className="text-[13.5px] font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2 mx-auto">
              Ver historial completo de reportes <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="mt-12 py-10 border-t border-dashed border-slate-200 text-center">
         <p className="text-slate-400 text-[14px] font-medium">
          No hay más resultados generados para el período de hoy seleccionado.
        </p>
      </div>
    </div>
  );
}
