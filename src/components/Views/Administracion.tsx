import React from 'react';
import { 
  Users, Shield, Settings, Database, 
  Calendar, Bell, Grid, Plus, Search,
  ChevronRight, Lock, Key, Globe, Layout
} from 'lucide-react';

const blocks = [
  { title: 'Usuarios y roles', icon: Users, desc: 'Gestiona accesos y perfiles de seguridad' },
  { title: 'Permisos', icon: Lock, desc: 'Configura privilegios a nivel de módulo' },
  { title: 'Catálogos', icon: Grid, desc: 'Tablas maestras y parámetros base' },
  { title: 'Fuentes de datos', icon: Database, desc: 'Conexiones y estructuras externas' },
  { title: 'Parámetros generales', icon: Settings, desc: 'Flags globales y comportamiento' },
  { title: 'Calendarios y horarios', icon: Calendar, desc: 'Días feriados y slots operativos' },
  { title: 'Notificaciones', icon: Bell, desc: 'Plantillas de correo y reglas de envío' },
  { title: 'Ambientes', icon: Globe, desc: 'Configuración multi-entorno' },
];

export function Administracion() {
  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Administración</h1>
        <p className="text-slate-500 text-[16px] font-medium max-w-3xl leading-relaxed">
          Administra usuarios, roles, permisos, catálogos, parámetros generales y elementos base del sistema.
        </p>
        <p className="text-[13.5px] text-slate-400 font-medium mt-3 italic">
          Configuración transversal para controlar accesos, estructuras maestras y parámetros operativos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {blocks.map((block) => (
          <div key={block.title} className="bg-white border border-slate-200 p-6 rounded-[28px] hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center mb-5 shadow-inner border border-slate-100 group-hover:border-primary">
              <block.icon size={24} />
            </div>
            <h3 className="text-[16px] font-bold text-slate-800 mb-1.5 group-hover:text-primary transition-colors">{block.title}</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-4">{block.desc}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest group-hover:text-primary/40 transition-colors">Configurar</span>
              <div className="p-1 bg-slate-50 rounded-lg text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-slate-900 rounded-[32px] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-primary/20 blur-3xl rounded-full" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary-light border border-white/10 shrink-0 shadow-2xl">
               <Key size={32} className="text-secondary" />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold mb-1">Centro de Seguridad</h3>
              <p className="text-slate-400 text-[14.5px] max-w-md">Revisa la política de contraseñas, factor de doble autenticación y auditoría de accesos críticos.</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-slate-900 text-[14.5px] font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl">
            Gestionar Seguridad
          </button>
        </div>
      </div>
    </div>
  );
}
