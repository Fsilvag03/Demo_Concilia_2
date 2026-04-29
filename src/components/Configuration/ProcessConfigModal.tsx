import React, { useState } from 'react';
import { 
  X, Save, CheckCircle2, Play, AlertCircle, Circle, 
  FileText, Database, Wand2, GitMerge, FileWarning, 
  ArrowRightSquare, UploadCloud, Info, CheckCircle, CircleDashed
} from 'lucide-react';
import { Process } from './ProcessCard';
import { ResumenSection } from './ResumenSection';
import { DatosProcesoSection } from './DatosProcesoSection';
import { FuentesCamposSection } from './FuentesCamposSection';
import { PreparacionDatosSection } from './PreparacionDatosSection';

interface ProcessConfigModalProps {
  process: Process;

  onClose: () => void;
}

type SectionId = 
  | 'resumen' 
  | 'datos' 
  | 'fuentes' 
  | 'preparacion' 
  | 'estrategia' 
  | 'diferencias' 
  | 'resultados' 
  | 'publicacion';

interface Section {
  id: SectionId;
  label: string;
  icon: React.ElementType;
  status: 'complete' | 'incomplete' | 'not_started' | 'locked';
}

const sections: Section[] = [
  { id: 'resumen', label: 'Resumen', icon: FileText, status: 'complete' },
  { id: 'datos', label: 'Datos del proceso', icon: Info, status: 'complete' },
  { id: 'fuentes', label: 'Fuentes y campos', icon: Database, status: 'incomplete' },
  { id: 'preparacion', label: 'Preparación de datos', icon: Wand2, status: 'not_started' },
  { id: 'estrategia', label: 'Estrategia y reglas', icon: GitMerge, status: 'not_started' },
  { id: 'diferencias', label: 'Gestión de diferencias', icon: FileWarning, status: 'not_started' },
  { id: 'resultados', label: 'Resultados y salidas', icon: ArrowRightSquare, status: 'not_started' },
  { id: 'publicacion', label: 'Publicación', icon: UploadCloud, status: 'locked' }
];

export const ProcessConfigModal: React.FC<ProcessConfigModalProps> = ({ process, onClose }) => {
  const [activeSection, setActiveSection] = useState<SectionId>('resumen');
  const [unsavedSections, setUnsavedSections] = useState<Set<SectionId>>(new Set());
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const hasUnsavedChanges = unsavedSections.size > 0;

  const markUnsaved = () => {
    setUnsavedSections(prev => {
      const next = new Set(prev);
      next.add(activeSection);
      return next;
    });
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const renderStatusIcon = (status: Section['status']) => {
    switch (status) {
      case 'complete': return <CheckCircle2 size={16} className="text-secondary-dark" />;
      case 'incomplete': return <AlertCircle size={16} className="text-amber-500" />;
      case 'not_started': return <CircleDashed size={16} className="text-slate-300" />;
      case 'locked': return <Circle size={16} className="text-slate-200" />;
      default: return null;
    }
  };

  const getStatusColor = (status: Process['status']) => {
    switch (status) {
      case 'Activo': return 'bg-secondary text-secondary-dark ring-secondary/20';
      case 'En borrador': return 'bg-amber-400 text-amber-700 ring-amber-400/20';
      case 'Incompleto': return 'bg-rose-400 text-rose-700 ring-rose-400/20';
      case 'Pendiente de publicación': return 'bg-blue-400 text-blue-700 ring-blue-400/20';
      default: return 'bg-slate-300 text-slate-600 ring-slate-300/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 sm:p-8">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-[1400px] h-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-20 border-b border-slate-200 px-8 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary tracking-tight leading-tight">Configuración: {process.name}</h2>
              <div className="flex items-center gap-3 mt-1.5">
                <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(process.status)}`}>
                  {process.status}
                </span>
                <span className="text-xs text-slate-500">
                  ID: {process.id.padStart(5, '0')}
                </span>
                <div className="h-3 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Completitud general:</span>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${process.completeness === 100 ? 'bg-secondary' : process.completeness > 80 ? 'bg-amber-400' : 'bg-rose-400'}`}
                      style={{ width: `${process.completeness}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{process.completeness}%</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Inner Sidebar */}
          <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col py-6 overflow-y-auto hidden md:flex">
            <h3 className="px-6 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Menú de Configuración
            </h3>
            <div className="flex-1 flex flex-col space-y-1">
              {sections.map(section => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center justify-between px-6 py-3 transition-colors relative group
                      ${isActive 
                        ? 'text-primary bg-white font-medium border-y border-transparent shadow-sm' 
                        : 'text-slate-600 hover:text-primary hover:bg-slate-100'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                    )}
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={`${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                      <span className="text-sm">{section.label}</span>
                      {unsavedSections.has(section.id) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Cambios sin guardar" />
                      )}
                    </div>
                    {renderStatusIcon(section.status)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
            <div className="mx-auto h-full">
              <div className={activeSection === 'resumen' ? 'block' : 'hidden'}>
                <ResumenSection onNavigate={setActiveSection} process={process} />
              </div>
              
              <div className={activeSection !== 'resumen' ? 'block' : 'hidden'}>
                {activeSection === 'datos' && (
                  <DatosProcesoSection process={process} onChange={markUnsaved} />
                )}
                {activeSection === 'fuentes' && (
                  <FuentesCamposSection process={process} onChange={markUnsaved} />
                )}
                {activeSection === 'preparacion' && (
                  <PreparacionDatosSection process={process} onChange={markUnsaved} />
                )}
                {activeSection !== 'datos' && activeSection !== 'fuentes' && activeSection !== 'preparacion' && (
                  <div className="max-w-4xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-8">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {sections.find(s => s.id === activeSection)?.label}
                    </h3>
                    <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="mt-0.5">
                        {renderStatusIcon(sections.find(s => s.id === activeSection)?.status || 'not_started')}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 mb-1">Estado de esta sección</h4>
                        <p className="text-sm text-slate-600">
                          Esta sección contiene información clave y parámetros operacionales del proceso. Actualmente se encuentra incompleta y requiere revisión de las reglas asociadas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder Content for the section */}
                  <div className="space-y-8">
                    {/* Visual Block 1 */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-primary mb-4 border-b border-slate-100 pb-2">Datos Generales</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del Proceso</label>
                          <input 
                            type="text" 
                            defaultValue={process.name} 
                            onChange={markUnsaved}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Estrategia de Conciliación</label>
                          <select 
                            onChange={markUnsaved}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          >
                            <option>{process.strategy}</option>
                            <option>Secuencial</option>
                            <option>Multifuente</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción Funcional</label>
                          <textarea 
                            onChange={markUnsaved}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary h-24" 
                            placeholder="Describe brevemente el propósito de este proceso..."
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Visual Block 2 */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-primary mb-4 border-b border-slate-100 pb-2">Parametrización Avanzada</h4>
                      <div className="grid grid-cols-1 gap-6">
                        <div 
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={markUnsaved}
                          >
                          <div>
                            <p className="font-medium text-slate-900 text-sm">Habilitar notificaciones de cierre</p>
                            <p className="text-xs text-slate-500 mt-0.5">Envía alertas automáticas cuando el proceso finaliza la conciliación del día.</p>
                          </div>
                          <div className="w-10 h-5 bg-secondary rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <button 
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setUnsavedSections(new Set())}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Save size={16} className="text-slate-400" />
              Guardar borrador
            </button>
            <button className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <CheckCircle size={16} className="text-slate-400" />
              Validar configuración
            </button>
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm">
              <UploadCloud size={16} />
              Publicar
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cambios sin guardar</h3>
            <p className="text-sm text-slate-600 mb-6">
              Tienes cambios sin guardar en algunas secciones del proceso. Si cierras el configurador ahora, perderás dichos cambios. ¿Deseas salir de todos modos?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                Volver
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm"
              >
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
