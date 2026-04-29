import React from 'react';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
  secondaryActions?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  }[];
}

export function PageHeader({ title, description, primaryAction, secondaryActions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight mb-1">{title}</h1>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      
      <div className="flex items-center gap-3">
        {secondaryActions?.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button 
              key={idx}
              onClick={action.onClick}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              {Icon && <Icon size={16} />}
              {action.label}
            </button>
          );
        })}
        
        {primaryAction && (
          <button 
            onClick={primaryAction.onClick}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm"
          >
            {primaryAction.icon ? <primaryAction.icon size={16} /> : <Plus size={16} />}
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
