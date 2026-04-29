import React from 'react';
import { Target, AlertCircle, FileEdit, Database, Activity, CheckCircle2, Clock } from 'lucide-react';

export interface Process {
  id: string;
  name: string;
  status: 'Activo' | 'En borrador' | 'Incompleto' | 'Inactivo' | 'Pendiente de publicación';
  sources: string[];
  strategy: string;
  completeness: number;
  lastEditedBy: string;
  lastEditedAt: string;
  rectorSource?: string;
}

interface ProcessCardProps {
  process: Process;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({ process }) => {
  const getStatusColor = (status: Process['status']) => {
    switch (status) {
      case 'Activo': return 'bg-secondary text-secondary-dark ring-secondary/20';
      case 'En borrador': return 'bg-amber-400 text-amber-700 ring-amber-400/20';
      case 'Incompleto': return 'bg-rose-400 text-rose-700 ring-rose-400/20';
      case 'Pendiente de publicación': return 'bg-blue-400 text-blue-700 ring-blue-400/20';
      default: return 'bg-slate-300 text-slate-600 ring-slate-300/20';
    }
  };

  const statusColor = getStatusColor(process.status);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-primary tracking-tight group-hover:text-primary-dark transition-colors">
            {process.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
             <div className={`w-2 h-2 rounded-full ${statusColor.split(' ')[0]}`} />
             <span className="text-xs font-medium text-slate-600">{process.status}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-6">
        <div className="flex gap-2.5 items-start">
          <Database size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-tight">
            {process.sources.join(' · ')}
          </p>
        </div>
        
        {process.rectorSource && (
          <div className="flex gap-2.5 items-start">
            <Target size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600 leading-tight">
              <span className="text-slate-500 mr-1">Rectora:</span> 
              <span className="font-medium text-slate-700">{process.rectorSource}</span>
            </p>
          </div>
        )}

        <div className="flex gap-2.5 items-start">
          <Activity size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-tight">
            <span className="text-slate-500 mr-1">Estrategia:</span> 
            {process.strategy}
          </p>
        </div>
        
        <div className="flex gap-2.5 items-center">
           {process.completeness === 100 ? (
              <CheckCircle2 size={14} className="text-secondary-dark mt-0.5 shrink-0" />
           ) : (
             <AlertCircle size={14} className={process.completeness > 80 ? "text-amber-500 mt-0.5 shrink-0" : "text-rose-500 mt-0.5 shrink-0"} />
           )}
           <div className="flex items-center gap-2 flex-1 pt-0.5">
             <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${process.completeness === 100 ? 'bg-secondary' : process.completeness > 80 ? 'bg-amber-400' : 'bg-rose-400'}`} 
                  style={{ width: `${process.completeness}%` }}
                />
             </div>
             <span className="text-xs font-medium text-slate-600 w-8">{process.completeness}%</span>
           </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
        <div className="flex items-center gap-1.5">
           <FileEdit size={12} className="text-slate-400" />
           <span className="truncate max-w-[120px]">{process.lastEditedBy}</span>
        </div>
        <div className="flex items-center gap-1.5">
           <Clock size={12} className="text-slate-400" />
           <span>{process.lastEditedAt}</span>
        </div>
      </div>
    </div>
  );
}
