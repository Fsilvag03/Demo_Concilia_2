import React from 'react';
import { Bell, HelpCircle, ChevronRight, Server } from 'lucide-react';
import { ViewType } from '../App';

interface TopbarProps {
  currentView?: string;
  subPath?: string | null;
  onNavigate?: (view: string) => void;
}

export function Topbar({ currentView = 'inicio', subPath, onNavigate }: TopbarProps) {
  const viewLabels: Record<string, string> = {
    inicio: 'Inicio',
    conciliaciones: 'Conciliaciones',
    diferencias: 'Gestión de Diferencias',
    aprobaciones: 'Aprobaciones',
    resultados: 'Resultados',
    auditoria: 'Auditoría',
    configuracion: 'Configuración',
    administracion: 'Administración'
  };

  return (
    <header className="relative h-16 bg-white flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
      <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500 uppercase tracking-wider relative z-10">
        <button 
          onClick={() => onNavigate && onNavigate(currentView)}
          className={`transition-colors ${subPath ? 'hover:text-primary cursor-pointer' : 'text-primary-dark cursor-default'}`}
          disabled={!subPath}
        >
          {viewLabels[currentView]?.toUpperCase() || 'INICIO'}
        </button>
        {subPath && (
          <>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-secondary-dark">{subPath.toUpperCase()}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Environment Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
          <Server size={14} className="text-slate-400" />
          <span>PROD</span>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <button className="text-slate-400 hover:text-slate-600 relative p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <HelpCircle size={20} />
        </button>

        <button className="text-slate-400 hover:text-slate-600 relative p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <button className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
             <span className="text-xs font-bold text-primary">AS</span>
          </div>
          <div className="hidden md:flex flex-col items-start min-w-0 pr-1">
             <span className="text-sm font-semibold text-primary leading-tight truncate max-w-[120px]">Admin System</span>
          </div>
        </button>
      </div>
    </header>
  );
}
