import React from 'react';
import { 
  Home, RefreshCw, AlertCircle, CheckSquare, 
  FileText, Shield, Settings, Users, 
  ChevronLeft, ChevronRight, LayoutDashboard // layout dashboard as placeholder
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
      className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-20 cursor-pointer ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg leading-none">C</span>
            </div>
            <span className="font-bold text-primary text-xl tracking-tight whitespace-nowrap">Concilia 2.0</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 mx-auto rounded bg-primary flex items-center justify-center shrink-0">
             <span className="text-white font-bold text-lg leading-none">C</span>
          </div>
        )}
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`text-slate-400 hover:text-slate-600 transition-colors ${isCollapsed ? 'absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 shadow-sm' : ''}`}
          title={isCollapsed ? "Expandir" : "Colapsar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6" onClick={(e) => e.stopPropagation()}>
            {!isCollapsed ? (
              <h3 className="px-5 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {group.title}
              </h3>
            ) : (
                <div className="border-t border-slate-100 my-2 mx-4" />
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
                          ? 'text-primary bg-slate-50 font-medium' 
                          : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r" />
                      )}
                      
                      <Icon size={20} className={`shrink-0 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                      
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
