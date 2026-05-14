import React from 'react';
import { 
  Home, RefreshCw, AlertCircle, CheckSquare, 
  FileText, Shield, Settings, Users, 
  ChevronLeft, ChevronRight, LayoutDashboard, GitCompare
} from 'lucide-react';

import { ViewType } from '../App';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const menuGroups = [
  {
    title: 'Operación',
    items: [
      { id: 'inicio', label: 'Inicio', icon: Home },
      { id: 'conciliaciones', label: 'Conciliaciones', icon: RefreshCw },
      { id: 'diferencias', label: 'Diferencias', icon: AlertCircle },
      { id: 'aprobaciones', label: 'Aprobaciones', icon: CheckSquare },
    ] as { id: ViewType, label: string, icon: any }[]
  },
  {
    title: 'Consulta',
    items: [
      { id: 'resultados', label: 'Resultados', icon: FileText },
      { id: 'auditoria', label: 'Auditoría', icon: Shield },
    ] as { id: ViewType, label: string, icon: any }[]
  },
  {
    title: 'Gestión',
    items: [
      { id: 'configuracion', label: 'Configuración', icon: Settings },
      { id: 'administracion', label: 'Administración', icon: Users },
    ] as { id: ViewType, label: string, icon: any }[]
  }
];

export function Sidebar({ isCollapsed, onToggle, currentView, onNavigate }: SidebarProps) {
  return (
    <aside 
      onClick={onToggle}
      className={`bg-gradient-to-b from-primary to-primary-dark border-r border-slate-800/50 flex flex-col transition-all duration-300 ease-in-out z-20 cursor-pointer relative overflow-hidden ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Decorative shape */}
      <div className="absolute left-0 top-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 z-0 pointer-events-none"></div>

      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0 z-10 relative">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shrink-0 shadow-[0_0_15px_-3px_rgba(var(--color-secondary),0.4)] relative border border-secondary-dark/20">
              <div className="absolute inset-0 bg-white/20 rounded-lg mix-blend-overlay"></div>
              <GitCompare size={18} className="text-primary-dark relative z-10" />
            </div>
            <span className="font-bold text-white text-[20px] tracking-tight whitespace-nowrap flex items-baseline">
              CONCIL
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-secondary to-secondary-dark font-black drop-shadow-[0_0_8px_rgba(var(--color-secondary),0.5)]">
                IA
              </span>
              <span className="font-light text-slate-300 ml-2 tracking-widest text-[14px] uppercase mb-px">
                Pro
              </span>
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shrink-0 shadow-[0_0_15px_-3px_rgba(var(--color-secondary),0.4)] relative border border-secondary-dark/20">
             <div className="absolute inset-0 bg-white/20 rounded-lg mix-blend-overlay"></div>
             <GitCompare size={18} className="text-primary-dark relative z-10" />
          </div>
        )}
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`text-slate-500 hover:text-white transition-colors ${isCollapsed ? 'absolute -right-3 top-20 bg-primary border border-slate-800/50 rounded-full p-1 shadow-sm' : ''}`}
          title={isCollapsed ? "Expandir" : "Colapsar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin z-10 relative">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6" onClick={(e) => e.stopPropagation()}>
            {!isCollapsed ? (
              <h3 className="px-5 mb-2 text-[11px] font-bold text-slate-400 capitalize tracking-wider">
                {group.title}
              </h3>
            ) : (
                <div className="border-t border-white/5 my-2 mx-4" />
            )}
            
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <li key={item.id}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(item.id);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors relative group
                        ${isActive 
                          ? 'text-white bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r" />
                      )}
                      
                      <Icon size={20} className={`shrink-0 ${isActive ? 'text-secondary' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
