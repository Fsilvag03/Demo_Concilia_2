import React from 'react';
import { 
  RefreshCw, AlertCircle, CheckSquare, 
  ArrowRight, Activity, Clock, TrendingUp, AlertTriangle, ShieldCheck, 
  ChevronRight, Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  { label: 'Conciliaciones en proceso', value: '12', secondary: '+2 desde ayer', icon: RefreshCw, color: 'sky' },
  { label: 'Diferencias pendientes', value: '45', secondary: '15 críticas', icon: AlertCircle, color: 'rose' },
  { label: 'Aprobaciones por atender', value: '8', secondary: '3 vencen hoy', icon: CheckSquare, color: 'amber' },
  { label: 'Procesos con alerta', value: '3', secondary: 'Nivel: Medio', icon: AlertTriangle, color: 'orange' },
];

const activity = [
  { id: 1, user: 'Ana Silva', action: 'Regularizó diferencia #1024', time: 'Hace 10 min', status: 'success' },
  { id: 2, user: 'Sistema', action: 'Carga automática: Banco Central', time: 'Hace 25 min', status: 'info' },
  { id: 3, user: 'Carlos Ruiz', action: 'Solicitó aprobación de cierre mensual', time: 'Hace 1h', status: 'warning' },
  { id: 4, user: 'Marta Gómez', action: 'Generó reporte: Conciliación de Tarjetas', time: 'Hace 2h', status: 'success' },
];

export function Inicio() {
  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Inicio</h1>
        <p className="text-slate-500 text-[16px] font-medium max-w-3xl leading-relaxed">
          Monitorea el estado general de las conciliaciones, pendientes críticos, diferencias abiertas y actividades que requieren atención.
        </p>
        <div className="mt-4 flex items-center gap-3 py-2 px-4 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-[13px] font-bold text-slate-700">Miércoles, 29 de Abril de 2026</span>
          <div className="w-px h-3 bg-slate-200 mx-1" />
          <span className="text-[13px] font-medium text-slate-500">Vista consolidada del avance operativo y alertas del día.</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="group bg-white border border-slate-200 p-6 rounded-[24px] hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer overflow-hidden relative"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-${stat.color}-500/5 group-hover:scale-110 transition-transform`} />
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4 shadow-sm border border-${stat.color}-100`}>
                <stat.icon size={24} />
              </div>
              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {stat.value}
                </h2>
                <span className={`text-[12px] font-bold ${stat.color === 'rose' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {stat.secondary}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <section className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <Activity size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Actividad reciente</h3>
              </div>
              <button className="text-[13px] font-bold text-primary hover:underline flex items-center gap-1">
                Ver toda <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {activity.map((item) => (
                <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[13px] border border-white shadow-sm">
                      {item.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[14px] text-slate-700 font-medium">
                        <span className="font-bold">{item.user}</span> {item.action}
                      </p>
                      <p className="text-[12px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                        <Clock size={12} />
                        {item.time}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-all hover:text-primary hover:bg-white hover:shadow-sm rounded-lg">
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Últimos resultados */}
          <section className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Últimos resultados generados</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Bancos Local', 'Tarjetas Crédito'].map((name) => (
                <div key={name} className="p-4 border border-slate-100 rounded-2xl hover:border-primary/20 transition-all bg-slate-50/30 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{name}</span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">FINALIZADO</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-800 mb-1">Cierre Operativo 28/04</h4>
                  <p className="text-[13px] text-slate-500 font-medium">1.2M registros conciliados con 98.2% efectividad.</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Alerts */}
        <div className="space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-xl shadow-slate-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-400" />
                Alertas críticas
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                  <p className="text-rose-400 text-[12px] font-black uppercase tracking-widest mb-1">CRÍTICO</p>
                  <p className="text-white text-[14px] font-medium leading-snug group-hover:text-primary transition-colors">Diferencia abultada detectada en Banco Central (Cuenta #4456)</p>
                </div>
                <div className="py-10 px-4 text-center">
                  <p className="text-slate-500 text-[13px] font-medium">No hay más alertas críticas por el momento.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
            <h3 className="text-slate-800 font-bold text-[16px] mb-4">Próximos a vencer</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-[13.5px] font-bold text-slate-700">Aprobación Cierre Quincenal</p>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">Vence en 2 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-200 mt-1.5 shrink-0" />
                <div>
                  <p className="text-[13.5px] font-bold text-slate-500">Regularización Lote #990</p>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">Vence mañana 09:00</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
