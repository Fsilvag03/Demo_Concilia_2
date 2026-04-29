import React, { useState } from "react";
import {
  CheckSquare,
  Settings2,
  Wand2,
  Eye,
  Plus,
  Trash2,
  Edit2,
  Copy,
  AlertTriangle,
  PlayCircle,
  Database,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Search,
  MoreVertical,
  Layers,
  ArrowUpDown,
  ArrowLeft,
  Check
} from "lucide-react";
import type { Process } from "./ProcessCard";

interface PreparacionDatosSectionProps {
  process: Process;
  onChange: () => void;
}

type NivelRegla = "Fuerte" | "Advertencia";
type TipoRegla = "Validación" | "Normalización" | "Transformación";

export type ValidationType =
  | "Estructura requerida"
  | "Campo obligatorio"
  | "Tipo de dato"
  | "Fecha dentro del periodo operativo"
  | "Monto válido"
  | "Duplicidad"
  | "Fuente sin registros"
  | "Cantidad mínima de registros";

interface ReglaPreparacion {
  id: string;
  nombre: string;
  descripcion: string;
  fuente: string | string[];
  campo: string | string[];
  tipo: TipoRegla;
  subTipo?: ValidationType;
  accion: string;
  activa: boolean;
  nivel: NivelRegla;
  mensaje: string;
  criterio?: string;
  dependenciaInactiva?: boolean;
}

const mockReglas: ReglaPreparacion[] = [
  {
    id: "r1",
    nombre: "Validar monto obligatorio",
    descripcion: "Verifica que el campo MONTO no esté vacío ni sea cero.",
    fuente: "Extracto Bancario",
    campo: "monto",
    tipo: "Validación",
    subTipo: "Monto válido",
    accion: "Es numérico y mayor a 0",
    activa: true,
    nivel: "Fuerte",
    mensaje: "El registro no contiene un monto válido o es cero.",
  },
  {
    id: "r2",
    nombre: "Normalizar formato de fecha",
    descripcion: "Convierte cualquier formato de fecha a YYYY-MM-DD para el cruce.",
    fuente: "Extracto Bancario",
    campo: "fecha_transaccion",
    tipo: "Normalización",
    accion: "Formato fecha (YYYY-MM-DD)",
    activa: true,
    nivel: "Advertencia",
    mensaje: "Formato de fecha ajustado.",
  },
  {
    id: "r3",
    nombre: "Extracción de referencia ERP",
    descripcion: "Extrae el código numérico de 8 dígitos al final del texto de descripción.",
    fuente: "Cobros ERP",
    campo: "referencia_1",
    tipo: "Transformación",
    accion: "Extraer último número (8 pos)",
    activa: true,
    dependenciaInactiva: true,
    nivel: "Advertencia",
    mensaje: "Referencia extraída del campo descripción.",
  },
  {
    id: "r4",
    nombre: "Limpiar espacios en blanco",
    descripcion: "Elimina espacios al inicio y final del campo referencia.",
    fuente: "Todas las fuentes",
    campo: "referencia_1",
    tipo: "Normalización",
    accion: "Trim (eliminar bordes)",
    activa: true,
    nivel: "Advertencia",
    mensaje: "Espacios en blanco eliminados.",
  },
];

export function PreparacionDatosSection({ process, onChange }: PreparacionDatosSectionProps) {
  const [viewMode, setViewMode] = useState<"stepper" | "detail">("stepper");
  const [selectedSection, setSelectedSection] = useState<TipoRegla | null>(null);
  const [reglas, setReglas] = useState<ReglaPreparacion[]>(mockReglas);
  const [editedBlocks, setEditedBlocks] = useState<Set<TipoRegla>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegla, setEditingRegla] = useState<ReglaPreparacion | null>(null);
  const [currentRuleType, setCurrentRuleType] = useState<TipoRegla>("Validación");

  // Form State
  const [formData, setFormData] = useState<Partial<ReglaPreparacion>>({
    nombre: "",
    descripcion: "",
    fuente: "Todas las fuentes",
    campo: "",
    tipo: "Validación",
    subTipo: "Campo obligatorio",
    accion: "",
    activa: true,
    nivel: "Fuerte",
    mensaje: "",
    criterio: ""
  });

  const openSection = (section: TipoRegla) => {
    setSelectedSection(section);
    setViewMode("detail");
  };

  const closeSection = () => {
    setSelectedSection(null);
    setViewMode("stepper");
  };

  const handleCreateRule = (tipo: TipoRegla) => {
    setCurrentRuleType(tipo);
    setEditingRegla(null);
    setFormData({
      nombre: "",
      descripcion: "",
      fuente: "Todas las fuentes",
      campo: "",
      tipo: tipo,
      subTipo: tipo === "Validación" ? "Campo obligatorio" : undefined,
      accion: "",
      activa: true,
      nivel: "Fuerte",
      mensaje: "",
      criterio: ""
    });
    setIsModalOpen(true);
  };

  const handleEditRule = (regla: ReglaPreparacion) => {
    setEditingRegla(regla);
    setCurrentRuleType(regla.tipo);
    setFormData({ ...regla });
    setIsModalOpen(true);
  };

  const handleDuplicateRule = (regla: ReglaPreparacion) => {
    const newRule = {
      ...regla,
      id: Math.random().toString(36).substr(2, 9),
      nombre: `${regla.nombre} (Copia)`,
      activa: false
    };
    setReglas([...reglas, newRule]);
    setEditedBlocks(prev => new Set(prev).add(regla.tipo));
    onChange();
  };

  const handleDeleteRule = (id: string, tipo: TipoRegla) => {
    setReglas(reglas.filter(r => r.id !== id));
    setEditedBlocks(prev => new Set(prev).add(tipo));
    onChange();
  };

  const saveRule = () => {
    if (!formData.nombre || !formData.accion) return;

    if (editingRegla) {
      setReglas(reglas.map(r => r.id === editingRegla.id ? { ...r, ...formData } as ReglaPreparacion : r));
    } else {
      const newRule: ReglaPreparacion = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as ReglaPreparacion;
      setReglas([...reglas, newRule]);
    }

    setEditedBlocks(prev => new Set(prev).add(currentRuleType));
    setIsModalOpen(false);
    onChange();
  };

  type BlockStatus = "Completo" | "Incompleto" | "Sin configurar" | "Requiere revisión" | "Error de configuración" | "Opcional";

  const getSectionStats = (tipo: TipoRegla) => {
    const rules = reglas.filter((r) => r.tipo === tipo);
    const total = rules.length;
    const active = rules.filter(r => r.activa).length;
    const blocking = rules.filter(r => r.nivel === "Fuerte").length;
    const incompleteRules = rules.filter(r => r.nombre === "" || !r.accion).length;
    const dependencyErrors = rules.filter(r => r.dependenciaInactiva).length;
    
    let status: BlockStatus = "Sin configurar";
    let message = "";

    if (total > 0) {
      if (incompleteRules > 0) {
        status = "Incompleto";
        message = `Falta completar configuración en ${incompleteRules} regla${incompleteRules > 1 ? 's' : ''}`;
      } else if (dependencyErrors > 0) {
        status = "Requiere revisión";
        message = "Pendiente: depende de una regla inactiva";
      } else {
        status = "Completo";
      }
    } else {
      if (tipo === "Transformación") {
        status = "Opcional";
        message = "Este bloque es opcional si el proceso no requiere campos derivados.";
      }
    }

    return { total, active, blocking, status, message };
  };

  const renderStatusBadge = (status: BlockStatus) => {
    switch (status) {
      case "Completo":
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"><CheckCircle2 size={12} /> Completo</span>;
      case "Incompleto":
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200"><AlertTriangle size={12} /> Incompleto</span>;
      case "Requiere revisión":
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200"><AlertCircle size={12} /> Requiere revisión</span>;
      case "Error de configuración":
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200"><AlertCircle size={12} /> Error de configuración</span>;
      case "Opcional":
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">Opcional</span>;
      case "Sin configurar":
      default:
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">Sin configurar</span>;
    }
  };

  const renderReglasGrid = (tipo: TipoRegla, compact: boolean = false) => {
    const rules = reglas.filter((r) => r.tipo === tipo);

    if (rules.length === 0) {
      return (
        <div className="py-12 px-4 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
            <Settings2 size={28} className="text-slate-300" />
          </div>
          <h5 className="text-[16px] font-bold text-slate-800">No hay configuraciones</h5>
          <p className="text-[13.5px] text-slate-500 mt-2 max-w-sm mx-auto font-medium">
            Agrega reglas para procesar los datos en este paso. Las reglas configuradas aparecerán aquí.
          </p>
          <button 
            onClick={() => handleCreateRule(tipo)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-[13px] font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <Plus size={18} />
            Configurar primera regla
          </button>
        </div>
      );
    }

    if (compact) {
      return (
        <div className="space-y-3">
          {rules.map((regla) => (
            <div
              key={regla.id}
              className={`bg-white border rounded-xl p-4 flex items-center justify-between gap-4 transition-all hover:border-primary/30 hover:shadow-sm group ${!regla.activa ? 'bg-slate-50/50' : 'border-slate-200'}`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div 
                  onClick={() => {
                    const newReglas = reglas.map((r) => r.id === regla.id ? { ...r, activa: !r.activa } : r);
                    setReglas(newReglas);
                    setEditedBlocks(prev => new Set(prev).add(regla.tipo));
                    onChange();
                  }}
                  className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer shrink-0 transition-colors ${regla.activa ? "bg-primary border-primary shadow-sm" : "border-slate-300 bg-white"}`}
                >
                  {regla.activa && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-[13.5px] font-bold truncate ${regla.activa ? 'text-slate-800' : 'text-slate-400'}`}>
                      {regla.nombre}
                    </span>
                    {regla.subTipo && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-tight">
                        {regla.subTipo}
                      </span>
                    )}
                    {regla.nivel === "Fuerte" && (
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        <ShieldAlert size={10} />
                        BLOQUEANTE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 overflow-hidden">
                    <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 font-medium whitespace-nowrap shrink-0">
                      <Database size={12} className="text-slate-400" />
                      <span className="truncate max-w-[120px]">{Array.isArray(regla.fuente) ? regla.fuente.join(", ") : regla.fuente}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 font-medium italic truncate">
                      <ArrowRight size={12} className="text-slate-300 shrink-0" />
                      <span className="truncate">"{regla.accion}"</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditRule(regla)}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDuplicateRule(regla)}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  title="Duplicar"
                >
                  <Copy size={16} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button 
                  onClick={() => handleDeleteRule(regla.id, regla.tipo)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => handleCreateRule(tipo)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-[13px] font-bold text-primary hover:bg-primary/20 rounded-lg transition-all"
          >
            <Plus size={16} />
            Nuevo registro
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rules.map((regla) => (
            <div
              key={regla.id}
              className={`bg-white border ${regla.activa ? "border-slate-200 shadow-sm" : "border-slate-200/50 bg-slate-50/50"} rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-md group`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      <div
                        onClick={() => {
                          const newReglas = reglas.map((r) =>
                            r.id === regla.id ? { ...r, activa: !r.activa } : r,
                          );
                          setReglas(newReglas);
                          setEditedBlocks(prev => new Set(prev).add(regla.tipo));
                          onChange();
                        }}
                        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${regla.activa ? "bg-primary border-primary" : "border-slate-300 bg-white"}`}
                      >
                        {regla.activa && <CheckSquare size={14} className="text-white" />}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className={`text-[14px] font-bold truncate ${regla.activa ? "text-slate-800" : "text-slate-500"}`}>
                          {regla.nombre}
                        </h5>
                        {regla.subTipo && (
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                            {regla.subTipo}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5 mb-2">
                        {regla.nivel === "Fuerte" && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                            <ShieldAlert size={10} />
                            Bloqueante
                          </span>
                        )}
                        {regla.dependenciaInactiva && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100" title="Depende de regla inactiva">
                            <AlertTriangle size={10} />
                            Revision pendiente
                          </span>
                        )}
                        {!regla.activa && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                            Inactiva
                          </span>
                        )}
                      </div>
                      <p className={`text-[12px] leading-relaxed line-clamp-2 ${regla.activa ? "text-slate-600" : "text-slate-400"}`}>
                        {regla.descripcion || regla.mensaje}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500" title="Fuente">
                      <Database size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{Array.isArray(regla.fuente) ? regla.fuente.join(", ") : regla.fuente}</span>
                    </div>
                    {regla.campo && (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500" title="Campo">
                        <ArrowRight size={12} className="text-slate-300" />
                        <span className="truncate max-w-[150px]">{Array.isArray(regla.campo) ? regla.campo.join(", ") : regla.campo}</span>
                      </div>
                    )}
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-tighter">Condición:</span>
                      <span className="text-[11px] text-slate-600 font-medium italic truncate max-w-[200px]">
                        "{regla.accion}"
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditRule(regla); }}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" 
                        title="Configurar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDuplicateRule(regla); }}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" 
                        title="Duplicar"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteRule(regla.id, regla.tipo); }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors" 
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const stepsConfig = [
    {
      id: "Validación" as TipoRegla,
      num: "1",
      icon: CheckSquare,
      iconClasses: "bg-teal-50 text-teal-700 border-teal-100 group-hover:bg-teal-100",
      title: "Validaciones de entrada",
      desc: "Reglas para verificar cumplimiento de condiciones mínimas"
    },
    {
      id: "Normalización" as TipoRegla,
      num: "2",
      icon: Settings2,
      iconClasses: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100",
      title: "Normalizaciones",
      desc: "Ajustes simples para estandarizar valores sin alterar el significado"
    },
    {
      id: "Transformación" as TipoRegla,
      num: "3",
      icon: Wand2,
      iconClasses: "bg-violet-50 text-violet-600 border-violet-100 group-hover:bg-violet-100",
      title: "Transformaciones",
      desc: "Reglas complejas que derivan, extraen o calculan nuevos datos"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-16 animate-in fade-in duration-500">
      {viewMode === "detail" && selectedSection ? (
        <div className="animate-in slide-in-from-right-8 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <button 
                onClick={closeSection}
                className="group p-2.5 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-500 rounded-xl transition-all shadow-sm flex items-center justify-center"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <div className="flex items-center gap-4">
                {(() => {
                  const config = stepsConfig.find(s => s.id === selectedSection);
                  const stats = getSectionStats(selectedSection);
                  return (
                    <>
                      <div className={`p-3 rounded-2xl shadow-sm border ${config?.iconClasses}`}>
                        {config && <config.icon size={26} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                            {config?.title}
                          </h3>
                          {renderStatusBadge(stats.status)}
                        </div>
                        <p className="text-[14px] text-slate-500 font-medium">
                          {config?.desc}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            {(() => {
              const stats = getSectionStats(selectedSection);
              return (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                      {stats.total} {stats.total === 1 ? 'CONFIGURADA' : 'CONFIGURADAS'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">
                      {stats.active} {stats.active === 1 ? 'ACTIVA' : 'ACTIVAS'}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleCreateRule(selectedSection)}
                    className="px-6 py-3 bg-primary text-white text-[14.5px] font-bold rounded-2xl shadow-xl shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 flex items-center gap-2.5 transition-all"
                  >
                    <Plus size={20} />
                    Configurar regla
                  </button>
                </div>
              );
            })()}
          </div>

          <div className="bg-slate-50/40 border border-slate-200/60 rounded-[28px] p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-[15px] font-bold text-slate-700 flex items-center gap-2">
                <Layers size={18} className="text-slate-400" />
                Listado de configuraciones
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-slate-400 font-medium">Filtrar por:</span>
                <select className="bg-transparent border-none text-[12px] font-bold text-primary focus:ring-0 cursor-pointer">
                  <option>Todos los estados</option>
                  <option>Activas</option>
                  <option>Inactivas</option>
                </select>
              </div>
            </div>
            {renderReglasGrid(selectedSection, true)}
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10 text-center sm:text-left">
            <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
              Preparación de datos
            </h3>
            <p className="text-slate-500 text-[15px] max-w-3xl leading-relaxed font-medium">
              Configura las reglas previas que validan, normalizan y transforman los datos antes de pasar a la conciliación.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-[13.5px] font-medium text-slate-500 shadow-sm">
              <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
                <Info size={16} />
              </div>
              <span>Los bloques se ejecutan en secuencia, pero puedes configurarlos en cualquier orden.</span>
            </div>
          </div>

          <div className="relative">
            {/* Línea conectora del Stepper */}
            <div className="hidden sm:block absolute left-[15px] top-8 bottom-8 w-[2px] bg-slate-100 z-0" />

            <div className="space-y-5">
              {stepsConfig.map((step) => {
                const stats = getSectionStats(step.id);
                
                return (
                  <div key={step.id} 
                    onClick={() => openSection(step.id)}
                    className="group relative cursor-pointer flex items-center gap-4 sm:gap-6"
                  >
                    {/* Stepper Number */}
                    <div className="hidden sm:flex relative z-10 w-8 h-8 rounded-full bg-white border-2 border-slate-200 shadow-sm items-center justify-center text-[13px] font-black text-slate-400 group-hover:border-primary group-hover:text-primary transition-colors shrink-0">
                      {step.num}
                    </div>

                    <div className={`flex-1 bg-white border-2 border-transparent ring-1 ring-slate-200/80 shadow-sm hover:shadow-md shadow-slate-200/40 group-hover:ring-primary/40 group-hover:border-primary/20 rounded-2xl overflow-hidden transition-all duration-400 group-hover:-translate-y-0.5`}>
                      <div className="w-full flex items-center justify-between p-6 text-left bg-white transition-colors">
                        <div className="flex items-center gap-5 flex-1">
                          <div className={`p-3 rounded-xl shadow-sm border transition-all duration-300 shrink-0 ${step.iconClasses}`}>
                            <step.icon size={24} />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                              <h4 className="text-[17px] font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                                {step.title}
                              </h4>
                              {renderStatusBadge(stats.status)}
                            </div>
                            <p className="text-[13.5px] text-slate-500 leading-relaxed font-medium line-clamp-1">
                              {step.desc}
                            </p>
                            
                            {/* Metrics Line */}
                            <div className="mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-2">
                              <div className="flex items-center gap-1.5">
                                <Layers size={14} className="text-slate-400" />
                                <span className="text-[12px] font-bold text-slate-600 tracking-tight">
                                  {stats.total === 0 
                                    ? (stats.status === "Opcional" ? "Opcional (sin reglas)" : `Sin ${step.id === 'Validación' ? 'validaciones' : 'reglas'}`)
                                    : (stats.total === 1 ? `1 ${step.id === 'Validación' ? 'validación' : 'regla'} configurada` : `${stats.total} ${step.id === 'Validación' ? 'validaciones' : 'reglas'} configuradas`)}
                                </span>
                              </div>
                              {stats.total > 0 && (
                                <>
                                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={13} className="text-slate-400" />
                                    <span className="text-[12px] font-bold text-slate-500 tracking-tight">
                                      {stats.active === 1 ? '1 activa' : `${stats.active} activas`}
                                    </span>
                                  </div>
                                </>
                              )}
                              {stats.blocking > 0 && (
                                <>
                                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                                  <div className="flex items-center gap-1.5">
                                    <ShieldAlert size={13} className="text-slate-400" />
                                    <span className="text-[12px] font-bold text-slate-500 tracking-tight">
                                      {stats.blocking === 1 ? 'incluye 1 regla de bloqueo' : `incluye ${stats.blocking} reglas de bloqueo`}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="shrink-0 flex items-center gap-4 ml-4">
                          {editedBlocks.has(step.id) && (
                            <div className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest border border-sky-100 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                              <span className="hidden md:inline">Pendiente</span>
                            </div>
                          )}
                          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 hidden sm:block">
                            <ChevronRight size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Block 4: Vista previa / Prueba */}
              <div className="relative mt-6 flex items-center gap-4 sm:gap-6">
                <div className="hidden sm:flex relative z-10 w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-200 shadow-sm items-center justify-center text-[13px] font-black text-slate-400 shrink-0">
                  4
                </div>
                
                <div className="flex-1 bg-primary shadow-md rounded-2xl overflow-hidden transition-all">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                      <div className="flex items-center gap-5 flex-1">
                        <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white shrink-0">
                          <Eye size={24} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <h4 className="text-[17px] font-bold text-white tracking-tight">
                              Vista previa y prueba
                            </h4>
                            <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-widest">
                              No probado
                            </span>
                          </div>
                          <p className="text-[13.5px] text-slate-300 leading-relaxed font-medium line-clamp-1">
                            Aplica las reglas sobre una muestra para comparar el antes y el después.
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-2 shrink-0 border-t md:border-t-0 border-white/10 md:pl-5 pt-4 md:pt-0">
                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13.5px] font-bold rounded-xl shadow-sm transition-colors group">
                          <PlayCircle size={18} className="text-emerald-100 group-hover:text-white transition-colors" />
                          Ejecutar prueba
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rule Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  currentRuleType === 'Validación' ? 'bg-rose-100 text-rose-600' :
                  currentRuleType === 'Normalización' ? 'bg-sky-100 text-sky-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {currentRuleType === 'Validación' ? <CheckSquare size={20} /> : 
                   currentRuleType === 'Normalización' ? <Settings2 size={20} /> : <Wand2 size={20} />}
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-slate-800">
                    {editingRegla ? 'Editar' : 'Nueva'} {currentRuleType.toLowerCase()}
                  </h3>
                  <p className="text-[12px] text-slate-500 font-medium">
                    Configura los parámetros de la regla para el flujo de preparación.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="space-y-8">
                {/* General Info Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <Info size={16} className="text-primary" />
                    <h4 className="text-[14px] font-bold uppercase tracking-wider">Información General</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase">Nombre de la regla</label>
                      <input 
                        type="text" 
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        placeholder="Ej. Validar montos positivos"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase">Descripción (Opcional)</label>
                      <textarea 
                        rows={2}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        placeholder="Explica brevemente qué hace esta regla..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                </section>

                <div className="w-full h-px bg-slate-100" />

                {/* Scope & Logic Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <Layers size={16} className="text-primary" />
                    <h4 className="text-[14px] font-bold uppercase tracking-wider">Alcance y Lógica</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase">
                        {currentRuleType === 'Validación' ? 'Tipo de Validación' : 'Operación'}
                      </label>
                      <select 
                        value={formData.subTipo || ""}
                        onChange={(e) => setFormData({...formData, subTipo: e.target.value as ValidationType})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        {currentRuleType === 'Validación' ? (
                          <>
                            <option value="Estructura requerida">Estructura requerida</option>
                            <option value="Campo obligatorio">Campo obligatorio</option>
                            <option value="Tipo de dato">Tipo de dato</option>
                            <option value="Monto válido">Monto válido</option>
                            <option value="Fecha dentro del periodo operativo">Fecha dentro del periodo</option>
                            <option value="Duplicidad">Duplicidad</option>
                            <option value="Fuente sin registros">Fuente sin registros</option>
                            <option value="Cantidad mínima de registros">Mínimo de registros</option>
                          </>
                        ) : currentRuleType === 'Normalización' ? (
                          <>
                            <option value="Mayúsculas/Minúsculas">Mayúsculas/Minúsculas</option>
                            <option value="Eliminar bordes (Trim)">Eliminar bordes (Trim)</option>
                            <option value="Formato Fecha">Formato Fecha</option>
                            <option value="Limpiar Caracteres">Limpiar Caracteres</option>
                          </>
                        ) : (
                          <>
                            <option value="Extraer subcadena">Extraer subcadena</option>
                            <option value="Concatenar">Concatenar</option>
                            <option value="Derivación condicional">Derivación condicional</option>
                            <option value="Valor fijo">Valor fijo</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase">Fuente Origen</label>
                      <select 
                        value={Array.isArray(formData.fuente) ? 'Multi' : formData.fuente}
                        onChange={(e) => setFormData({...formData, fuente: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="Todas las fuentes">Todas las fuentes</option>
                        <option value="Extracto Bancario">Extracto Bancario</option>
                        <option value="Cobros ERP">Cobros ERP</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase">Campo(s) Asociado(s)</label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            disabled={formData.fuente === "Todas las fuentes" && currentRuleType === 'Validación' && (formData.subTipo === "Fuente sin registros" || formData.subTipo === "Cantidad mínima de registros")}
                            value={Array.isArray(formData.campo) ? formData.campo.join(", ") : formData.campo}
                            onChange={(e) => setFormData({...formData, campo: e.target.value})}
                            placeholder="Buscar o seleccionar campos..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-all"
                          />
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-all">
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase">Criterio / Condición de cumplimiento</label>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <input 
                          type="text" 
                          value={formData.accion}
                          onChange={(e) => setFormData({...formData, accion: e.target.value})}
                          placeholder="Ej. Valor != 0, Longitud == 8, Coincide con Regex..."
                          className="w-full bg-transparent border-none p-0 text-[14px] font-medium text-slate-800 focus:ring-0 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="w-full h-px bg-slate-100" />

                {/* Severity & Message */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <ShieldAlert size={16} className="text-primary" />
                    <h4 className="text-[14px] font-bold uppercase tracking-wider">Comunicación y Severidad</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase">Severidad del impacto</label>
                      <div className="flex gap-3">
                         <button 
                           onClick={() => setFormData({...formData, nivel: "Fuerte"})}
                           className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-[13px] font-bold transition-all ${
                             formData.nivel === "Fuerte" 
                             ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' 
                             : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                           }`}
                         >
                           <ShieldAlert size={16} />
                           Bloqueante
                         </button>
                         <button 
                           onClick={() => setFormData({...formData, nivel: "Advertencia"})}
                           className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-[13px] font-bold transition-all ${
                             formData.nivel === "Advertencia" 
                             ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' 
                             : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                           }`}
                         >
                           <AlertTriangle size={16} />
                           Advertencia
                         </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase">Estado Inicial</label>
                      <button 
                        onClick={() => setFormData({...formData, activa: !formData.activa})}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-[13px] font-bold transition-all ${
                          formData.activa 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${formData.activa ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {formData.activa ? 'Activa por defecto' : 'Inactiva'}
                      </button>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase">Mensaje al usuario (Si no se cumple)</label>
                      <input 
                        type="text" 
                        value={formData.mensaje}
                        onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                        placeholder="Ej. El monto cargado no puede ser cero."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      <p className="mt-2 text-[11px] text-slate-400">
                        Este mensaje se mostrará en los reportes de calidad de datos durante la ejecución.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-[14px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={saveRule}
                disabled={!formData.nombre || !formData.accion}
                className="px-8 py-2.5 bg-primary text-white text-[14px] font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {editingRegla ? 'Guardar Cambios' : 'Crear Regla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

