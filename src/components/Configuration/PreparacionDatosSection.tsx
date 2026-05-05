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
  ChevronUp,
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
  Check,
  Power,
  ListFilter
} from "lucide-react";
import type { Process } from "./ProcessCard";

interface PreparacionDatosSectionProps {
  process: Process;
  onChange: () => void;
}

type NivelRegla = "Fuerte" | "Advertencia";
type TipoRegla = "Validación" | "Normalización" | "Transformación";

export type ValidationType =
  | "Campo obligatorio"
  | "Tipo de dato esperado"
  | "Monto válido"
  | "Fecha válida"
  | "Duplicidad"
  | "Cantidad mínima de registros"
  | "Estructura requerida"
  | "Valor permitido / catálogo válido"
  | "Mayúsculas/Minúsculas"
  | "Eliminar bordes (Trim)"
  | "Formato Fecha"
  | "Limpiar Caracteres"
  | "Extraer subcadena"
  | "Concatenar"
  | "Derivación condicional"
  | "Valor fijo";

export type NormalizationType = 
  | "Limpiar espacios"
  | "Cambiar mayúsculas/minúsculas"
  | "Quitar caracteres"
  | "Reemplazar valores"
  | "Homologar valores"
  | "Normalizar fecha"
  | "Normalizar número o monto"
  | "Normalizar valores vacíos";

export type TransformationType = string;

interface ReglaPreparacion {
  id: string;
  nombre: string;
  descripcion: string;
  fuente: string | string[];
  campo: string | string[];
  tipo: TipoRegla;
  subTipo?: ValidationType | NormalizationType | TransformationType | string;
  accion: string;
  activa: boolean;
  nivel: NivelRegla;
  mensaje: string;
  criterio?: string;
  dependenciaInactiva?: boolean;

  // New fields for specific validations
  condicionMonto?: string;
  valorComparacion?: string;
  valorMinimo?: string;
  valorMaximo?: string;
  comparacionFecha?: string;
  desdeFecha?: string;
  hastaFecha?: string;
  cantidadMinima?: number | string;
  valoresPermitidos?: string;

  // New fields for specific normalizations
  opcionLimpiarEspacios?: string;
  modoMayusculas?: string;
  caracteresAQuitar?: string[];
  caracteresManual?: string;
  reemplazos?: {origen: string, destino: string}[];
  homologacionCatalogo?: string;
  formatoFechaOrigen?: string;
  formatoNumero?: string;
  valoresVacios?: string[];
}

const mockReglas: ReglaPreparacion[] = [
  {
    id: "r1",
    nombre: "Validar monto positivo",
    descripcion: "Verifica que el campo MONTO sea mayor que cero.",
    fuente: "Banco",
    campo: "monto",
    tipo: "Validación",
    subTipo: "Monto válido",
    condicionMonto: "Mayor que",
    valorComparacion: "0",
    accion: "",
    activa: true,
    nivel: "Fuerte",
    mensaje: "El campo monto debe ser mayor que 0.",
  },
  {
    id: "r2",
    nombre: "Fecha operativa del pago",
    descripcion: "Controla que la fecha correspondiente sea hoy.",
    fuente: "Municipio",
    campo: "fecha_pago",
    tipo: "Validación",
    subTipo: "Fecha válida",
    comparacionFecha: "Mismo día operativo",
    accion: "",
    activa: true,
    nivel: "Advertencia",
    mensaje: "El campo fecha_pago no corresponde al día operativo.",
  },
  {
    id: "r3",
    nombre: "Control de duplicidad de transacciones",
    descripcion: "No debe haber registros duplicados en fecha_transaccion y monto para Banred.",
    fuente: "Banred",
    campo: ["fecha_transaccion", "monto"],
    tipo: "Validación",
    subTipo: "Duplicidad",
    accion: "",
    activa: true,
    nivel: "Fuerte",
    mensaje: "Se encontró un registro duplicado con la misma fecha transacción y monto.",
  },
  {
    id: "r4",
    nombre: "Validar archivo con registros",
    descripcion: "La fuente recibida debe tener por lo menos una transacción para procesar.",
    fuente: "Extracto Bancario",
    campo: "",
    tipo: "Validación",
    subTipo: "Cantidad mínima de registros",
    cantidadMinima: 1,
    accion: "",
    activa: true,
    nivel: "Fuerte",
    mensaje: "El extracto bancario no contiene registros para procesar.",
  },
  {
    id: "n1",
    nombre: "Limpiar espacios en nombres",
    descripcion: "Elimina los espacios en blanco al principio y al final de los valores.",
    fuente: "Banred",
    campo: "nombre",
    tipo: "Normalización",
    subTipo: "Limpiar espacios",
    opcionLimpiarEspacios: "Quitar espacios al inicio y al final",
    activa: true,
  },
  {
    id: "n2",
    nombre: "Mayúsculas en referencia",
    descripcion: "Convierte todo el texto del campo referencia a mayúsculas para mantener consistencia.",
    fuente: "Extracto Bancario",
    campo: "referencia",
    tipo: "Normalización",
    subTipo: "Cambiar mayúsculas/minúsculas",
    modoMayusculas: "Convertir a mayúsculas",
    activa: true,
  },
  {
    id: "n3",
    nombre: "Estándar de fecha Extracto",
    descripcion: "Asegura que la fecha se procese correctamente desde el formato de origen.",
    fuente: "Extracto Bancario",
    campo: "fecha_transaccion",
    tipo: "Normalización",
    subTipo: "Normalizar fecha",
    formatoFechaOrigen: "DD/MM/YYYY",
    activa: true,
  },
  {
    id: "n4",
    nombre: "Limpieza de formato numérico",
    descripcion: "Ajusta el monto utilizando la coma como separador decimal para unificar criterios.",
    fuente: "Municipio",
    campo: "monto",
    tipo: "Normalización",
    subTipo: "Normalizar número o monto",
    formatoNumero: "Separador decimal: Coma (1.234,56)",
    activa: true,
  },
];

export function PreparacionDatosSection({ process, onChange }: PreparacionDatosSectionProps) {
  const [viewMode, setViewMode] = useState<"stepper" | "detail">("stepper");
  const [selectedSection, setSelectedSection] = useState<TipoRegla | null>(null);
  const [reglas, setReglas] = useState<ReglaPreparacion[]>(mockReglas);
  const [editedBlocks, setEditedBlocks] = useState<Set<TipoRegla>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegla, setEditingRegla] = useState<ReglaPreparacion | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<ReglaPreparacion | null>(null);
  const [currentRuleType, setCurrentRuleType] = useState<TipoRegla>("Validación");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"Todas" | "Activas" | "Inactivas" | "Incompletas" | "Con error">("Todas");
  const [groupBySource, setGroupBySource] = useState(false);
  const [unpublishedRuleIds, setUnpublishedRuleIds] = useState<Set<string>>(new Set());

  const isRuleComplete = (r: Partial<ReglaPreparacion>) => {
    if (!r.nombre) return false;
    
    if (r.tipo === 'Transformación') {
      if (!r.accion) return false;
    }

    if (r.tipo === 'Normalización') {
      if (!r.fuente || typeof r.fuente !== 'string') return false; 
      if (!r.campo || typeof r.campo !== 'string') return false; 
      if (!r.subTipo) return false; 
      
      switch (r.subTipo as NormalizationType) {
        case "Limpiar espacios":
          if (!r.opcionLimpiarEspacios) return false;
          break;
        case "Cambiar mayúsculas/minúsculas":
          if (!r.modoMayusculas) return false;
          break;
        case "Quitar caracteres":
          if (!r.caracteresAQuitar || r.caracteresAQuitar.length === 0) {
            if (!r.caracteresManual) return false;
          }
          break;
        case "Reemplazar valores":
          if (!r.reemplazos || r.reemplazos.length === 0) return false;
          break;
        case "Homologar valores":
          if (!r.homologacionCatalogo) return false;
          break;
        case "Normalizar fecha":
          if (!r.formatoFechaOrigen) return false;
          break;
        case "Normalizar número o monto":
          if (!r.formatoNumero) return false;
          break;
        case "Normalizar valores vacíos":
           if (!r.valoresVacios || r.valoresVacios.length === 0) return false;
           break;
      }
    }
    
    if (r.tipo === 'Validación') {
      if (!r.fuente || !r.nivel || !r.mensaje) return false;
      if (!r.subTipo) return false;
      
      if (r.subTipo !== 'Cantidad mínima de registros' && r.subTipo !== 'Estructura requerida') {
        if (!r.campo || r.campo.length === 0) return false;
      }

      if (r.subTipo === 'Monto válido') {
        if (!r.condicionMonto) return false;
        if (['Mayor que', 'Mayor o igual que', 'Menor que', 'Menor o igual que'].includes(r.condicionMonto)) {
          if (!r.valorComparacion) return false;
        }
        if (r.condicionMonto === 'Entre rango') {
          if (!r.valorMinimo || !r.valorMaximo) return false;
        }
      }
      
      if (r.subTipo === 'Fecha válida') {
        if (!r.comparacionFecha) return false;
        if (r.comparacionFecha === 'Rango relativo al día operativo') {
          if (!r.desdeFecha || !r.hastaFecha) return false;
        }
      }
      
      if (r.subTipo === 'Cantidad mínima de registros') {
        if (!r.cantidadMinima) return false;
      }
      
      if (r.subTipo === 'Valor permitido / catálogo válido') {
        if (!r.valoresPermitidos) return false;
      }
    }
    
    return true;
  };

  const [expandedSections, setExpandedSections] = useState({
    general: true,
    aplicacion: true,
    condicion: true,
    impacto: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getFieldErrorClass = (isMissing: boolean) => {
    return (isMissing && editingRegla) ? "bg-white border border-rose-300 shadow-[0_0_0_3px_rgba(244,63,94,0.1)]" : "bg-white border border-slate-300";
  };

  // Form State
  const [formData, setFormData] = useState<Partial<ReglaPreparacion>>({
    nombre: "",
    descripcion: "",
    fuente: "",
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
    setFilterStatus("Todas");
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
      fuente: "",
      campo: "",
      tipo: tipo,
      subTipo: tipo === "Validación" ? "Campo obligatorio" : tipo === "Normalización" ? "Limpiar espacios" : undefined,
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

  const confirmDeleteRule = () => {
    if (ruleToDelete) {
      setReglas(reglas.filter(r => r.id !== ruleToDelete.id));
      setEditedBlocks(prev => new Set(prev).add(ruleToDelete.tipo));
      onChange();
      setRuleToDelete(null);
    }
  };

  const moveRule = (id: string, direction: 'up' | 'down') => {
    const index = reglas.findIndex(r => r.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === reglas.length - 1) return;

    const newReglas = [...reglas];
    const temp = newReglas[index];
    newReglas[index] = newReglas[index + (direction === 'up' ? -1 : 1)];
    newReglas[index + (direction === 'up' ? -1 : 1)] = temp;
    
    setReglas(newReglas);
    setEditedBlocks(prev => new Set(prev).add(temp.tipo));
    onChange();
  };

  const saveRule = () => {
    const ruleBase = { ...formData };

    if (editingRegla) {
      setReglas(reglas.map(r => r.id === editingRegla.id ? { ...r, ...ruleBase } as ReglaPreparacion : r));
      setUnpublishedRuleIds(prev => new Set(prev).add(editingRegla.id));
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      const newRule: ReglaPreparacion = {
        ...ruleBase,
        id: newId,
      } as ReglaPreparacion;
      setReglas([...reglas, newRule]);
      setUnpublishedRuleIds(prev => new Set(prev).add(newId));
    }

    setEditedBlocks(prev => new Set(prev).add(currentRuleType));
    setIsModalOpen(false);
    onChange();
  };

  type BlockStatus = "Completo" | "Incompleto" | "Sin configurar" | "Requiere revisión";

  const getSectionStats = (tipo: TipoRegla) => {
    const rules = reglas.filter((r) => r.tipo === tipo);
    const total = rules.length;
    const active = rules.filter(r => r.activa).length;
    const blocking = rules.filter(r => r.nivel === "Fuerte").length;
    const incompleteRules = rules.filter(r => !isRuleComplete(r)).length;
    const dependencyErrors = rules.filter(r => r.dependenciaInactiva).length;
    
    let status: BlockStatus = "Sin configurar";
    let message = "";

    if (total > 0) {
      if (incompleteRules > 0) {
        status = "Incompleto";
        message = `Falta configurar datos obligatorios en ${incompleteRules} validación${incompleteRules > 1 ? 'es' : ''}`;
      } else if (dependencyErrors > 0) {
        status = "Requiere revisión";
        message = "Una validación depende de una fuente o campo inexistente";
      } else {
        status = "Completo";
      }
    } else {
      status = "Sin configurar";
    }

    return { total, active, blocking, status, message, incomplete: incompleteRules, withError: dependencyErrors };
  };

  const renderStatusBadge = (status: BlockStatus) => {
    switch (status) {
      case "Completo":
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"><CheckCircle2 size={12} /> Completo</span>;
      case "Incompleto":
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200"><AlertTriangle size={12} /> Incompleto</span>;
      case "Requiere revisión":
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200"><AlertCircle size={12} /> Requiere revisión</span>;
      case "Sin configurar":
      default:
        return <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">Sin configurar</span>;
    }
  };

  const renderReglasGrid = (tipo: TipoRegla, compact: boolean = false, isSidebarMode: boolean = false) => {
    let rules = reglas.filter((r) => r.tipo === tipo);
    const hasAnyRules = rules.length > 0;

    if (compact || isSidebarMode) {
      if (searchQuery) {
        rules = rules.filter(r => 
          r.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
          r.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(r.fuente) ? r.fuente.join(" ") : r.fuente)?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (filterStatus === 'Activas') {
        rules = rules.filter(r => r.activa);
      } else if (filterStatus === 'Inactivas') {
        rules = rules.filter(r => !r.activa);
      } else if (filterStatus === 'Incompletas') {
        rules = rules.filter(r => !isRuleComplete(r));
      } else if (filterStatus === 'Con error') {
        rules = rules.filter(r => r.dependenciaInactiva);
      }
    }

    if (!hasAnyRules) {
      const buttonText = tipo === 'Validación' ? 'Nueva validación' : 
                         tipo === 'Normalización' ? 'Nueva normalización' : 'Nueva transformación';
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
            {buttonText}
          </button>
        </div>
      );
    }

    if ((compact || isSidebarMode) && rules.length === 0) {
       return (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">No se encontraron resultados para los filtros aplicados.</p>
        </div>
       );
    }

    if (isSidebarMode) {
      return (
        <div className="space-y-1">
          {rules.map((regla) => (
            <div
              key={regla.id}
              onClick={() => handleEditRule(regla)}
              className={`px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                editingRegla?.id === regla.id 
                ? 'bg-primary/5 border-primary/30 shadow-sm relative' 
                : 'bg-transparent border-transparent hover:bg-slate-50'
              }`}
            >
              {editingRegla?.id === regla.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[12.5px] font-bold leading-tight ${regla.activa ? 'text-slate-800' : 'text-slate-400'}`}>
                  {regla.nombre} 
                </span>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${regla.activa ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <div className="flex items-center gap-1.5 mt-1 opacity-80">
                <span className="text-[10px] text-slate-500 font-medium">
                  {Array.isArray(regla.fuente) ? 'Múltiples' : regla.fuente}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const getCampoAsociado = (regla: ReglaPreparacion) => {
      if (regla.subTipo === 'Estructura requerida' || regla.subTipo === 'Cantidad mínima de registros') {
        return 'Fuente completa';
      }
      if (Array.isArray(regla.campo)) {
        return regla.campo.join(' + ');
      }
      return regla.campo || 'Fuente completa';
    };

    const getCondicionResumida = (regla: ReglaPreparacion) => {
      if (regla.tipo === 'Transformación') {
        return regla.accion;
      }
      
      if (regla.tipo === 'Normalización') {
        switch (regla.subTipo) {
          case 'Limpiar espacios':
            if (regla.opcionLimpiarEspacios === "Quitar espacios al inicio y al final") return "eliminar espacios al inicio y al final";
            if (regla.opcionLimpiarEspacios === "Reducir espacios múltiples a uno solo") return "reducir espacios consecutivos a un solo espacio";
            if (regla.opcionLimpiarEspacios === "Eliminar todos los espacios internos") return "eliminar todos los espacios internos";
            return "limpiar espacios";
          case 'Cambiar mayúsculas/minúsculas':
            return `convertir a ${regla.modoMayusculas ? regla.modoMayusculas.replace("Convertir a ", "").toLowerCase() : "texto"}`;
          case 'Quitar caracteres':
            const chars = [...(regla.caracteresAQuitar || []), regla.caracteresManual].filter(Boolean);
            return chars.length > 0 ? `eliminar: ${chars.join(", ")}` : "quitar caracteres";
          case 'Reemplazar valores':
            const r = regla.reemplazos || [];
            if (r.length === 1 && r[0].origen && r[0].destino) return `reemplazar ${r[0].origen} por ${r[0].destino}`;
            if (r.length > 1) return `aplicar ${r.length} reemplazos`;
            return "reemplazar valores";
          case 'Homologar valores':
            return `homologar según ${regla.homologacionCatalogo || "catálogo"}`;
          case 'Normalizar fecha':
            return `formato ${regla.formatoFechaOrigen || 'estándar'} a fecha estándar`;
          case 'Normalizar número o monto':
            return "formato numérico estándar";
          case 'Normalizar valores vacíos':
            return `tratar ${regla.valoresVacios ? regla.valoresVacios.join(" y ") : "valores configurados"} como vacío`;
          default:
            return "normalizar valores";
        }
      }
      
      switch (regla.subTipo) {
        case 'Monto válido':
          if (regla.condicionMonto === 'Distinto de cero') return 'distinto de cero';
          if (regla.condicionMonto === 'Entre rango') return `entre ${regla.valorMinimo} y ${regla.valorMaximo}`;
          return `${regla.condicionMonto?.toLowerCase()} ${regla.valorComparacion || ''}`.trim();
        case 'Fecha válida':
          if (regla.comparacionFecha === 'Mismo día operativo') return 'mismo día operativo';
          if (regla.comparacionFecha === 'Día caído') return 'día anterior al día operativo';
          if (regla.comparacionFecha === 'Rango relativo al día operativo') return `entre ${regla.desdeFecha || '_'} y ${regla.hastaFecha || '_'} días relativos`;
          return '';
        case 'Duplicidad':
          return 'no repetir combinación';
        case 'Cantidad mínima de registros':
          const cant = Number(regla.cantidadMinima) || 0;
          return `mínimo ${regla.cantidadMinima || '_'} ${cant === 1 ? 'registro' : 'registros'}`;
        case 'Campo obligatorio':
          return 'no vacío';
        case 'Tipo de dato esperado':
          return 'tipo esperado';
        case 'Estructura requerida':
          return 'campos requeridos';
        case 'Valor permitido / catálogo válido':
          return `valores permitidos`;
        default:
          return regla.accion || regla.subTipo || '';
      }
    };

    const groupedRules = groupBySource 
      ? rules.reduce((acc, rule) => {
          const source = Array.isArray(rule.fuente) ? rule.fuente.join(", ") : (rule.fuente || 'Sin fuente configurada');
          if (!acc[source]) acc[source] = [];
          acc[source].push(rule);
          return acc;
        }, {} as Record<string, ReglaPreparacion[]>)
      : { 'Todas': rules };

    if (compact) {
      return (
        <div className="flex flex-col gap-4">
          {Object.entries(groupedRules).map(([source, sourceRules]) => (
            <div key={source} className={groupBySource ? "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col" : ""}>
              {groupBySource && (
                <div className="px-5 md:px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <Database size={14} className="text-slate-500" />
                  <span className="text-[13px] font-bold text-slate-700 tracking-wide uppercase">{source}</span>
                  <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{sourceRules.length}</span>
                </div>
              )}
              <div className={groupBySource ? "divide-y divide-slate-100 bg-white rounded-b-xl" : "divide-y divide-slate-100"}>
                {sourceRules.map((regla) => (
                  <div
                    key={regla.id}
                    onClick={() => handleEditRule(regla)}
                    className={`px-5 md:px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all hover:bg-slate-50 cursor-pointer`}
                  >
                    <div className="w-full sm:flex-1 min-w-0">
                      <div className="flex items-center justify-start gap-3 mb-1">
                        <span className={`text-[13.5px] font-semibold truncate flex items-center gap-2 ${regla.activa ? 'text-slate-800' : 'text-slate-400'}`}>
                          {unpublishedRuleIds.has(regla.id) && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Cambios sin publicar" />
                          )}
                          {regla.nombre || "Validación sin nombre"}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${regla.activa ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                            {regla.activa ? 'Activa' : 'Inactiva'}
                          </span>
                          {regla.tipo !== 'Normalización' && (
                            regla.nivel === 'Fuerte' ? (
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${regla.activa ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                Bloqueante
                              </span>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${regla.activa ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                Advertencia
                              </span>
                            )
                          )}
                          {!isRuleComplete(regla) && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium border bg-rose-50 text-rose-600 border-rose-100">
                              Incompleta
                            </span>
                          )}
                          {regla.dependenciaInactiva && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium border bg-amber-50 text-amber-600 border-amber-100">
                              {regla.tipo === 'Normalización' ? 'Error de configuración' : 'Revisión pendiente'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-[12.5px] text-slate-500 font-normal truncate mt-1">
                        {!groupBySource && (
                          <>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Database size={13} className="text-slate-400" />
                              <span className="text-slate-600 font-medium">{Array.isArray(regla.fuente) ? regla.fuente.join(", ") : regla.fuente || "Fuente no configurada"}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                          </>
                        )}
                        <span className="text-slate-500 shrink-0">{getCampoAsociado(regla)}</span>
                        <ArrowRight size={13} className="text-slate-300 mx-0.5 shrink-0" />
                        <span className="text-slate-400 italic truncate min-w-0 pr-1">{getCondicionResumida(regla)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end mt-3 sm:mt-0">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const newReglas = reglas.map((r) => r.id === regla.id ? { ...r, activa: !r.activa } : r);
                          setReglas(newReglas);
                          setEditedBlocks(prev => new Set(prev).add(regla.tipo));
                          onChange();
                        }}
                        className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${regla.activa ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'}`}
                        title={regla.activa ? 'Desactivar regla' : 'Activar regla'}
                      >
                        <Power size={18} strokeWidth={regla.activa ? 2.5 : 2} />
                      </button>
                      <div className="w-px h-5 bg-slate-200 mx-1" />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateRule(regla);
                        }}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors border border-transparent"
                        title="Duplicar"
                      >
                        <Copy size={16} />
                      </button>
                      {regla.tipo === 'Normalización' && (
                        <>
                          <div className="w-px h-5 bg-slate-200 mx-1" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveRule(regla.id, 'up'); }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
                            title="Mover arriba"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveRule(regla.id, 'down'); }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
                            title="Mover abajo"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setRuleToDelete(regla);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
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
        <div className="flex flex-col gap-8">
          {Object.entries(groupedRules).map(([source, sourceRules]) => (
            <div key={source}>
              {groupBySource && (
                <div className="flex items-center gap-2 mb-4 pl-1">
                  <Database size={16} className="text-slate-400" />
                  <h4 className="text-[13px] font-bold text-slate-700 tracking-wide uppercase">{source}</h4>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{sourceRules.length}</span>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sourceRules.map((regla) => (
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
                              {regla.tipo !== 'Normalización' && regla.nivel === "Fuerte" && (
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                  <ShieldAlert size={10} />
                                  Bloqueante
                                </span>
                              )}
                              {regla.dependenciaInactiva && (
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100" title="Depende de regla inactiva o incompleta">
                                  <AlertTriangle size={10} />
                                  {regla.tipo === 'Normalización' ? 'Error de config.' : 'Revisión pendiente'}
                                </span>
                              )}
                              {!regla.activa && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                  Inactiva
                                </span>
                              )}
                              {!isRuleComplete(regla) && (
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">
                                  Incompleta
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
                          {!groupBySource && (
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500" title="Fuente">
                              <Database size={12} className="text-slate-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{Array.isArray(regla.fuente) ? regla.fuente.join(", ") : (regla.fuente || "Sin fuente configurada")}</span>
                            </div>
                          )}
                          {regla.campo && (
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500" title="Campo">
                              {!groupBySource && <div className="w-1 h-1 rounded-full bg-slate-300 shrink-0 mx-1" />}
                              <span className="truncate max-w-[150px]">{Array.isArray(regla.campo) ? regla.campo.join(", ") : regla.campo}</span>
                            </div>
                          )}
                       </div>
      
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-tighter">Condición:</span>
                            <span className="text-[11px] text-slate-600 font-medium italic truncate max-w-[200px]">
                              "{regla.accion || getCondicionResumida(regla)}"
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
                            {regla.tipo === 'Normalización' && (
                              <>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveRule(regla.id, 'up'); }}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" 
                                  title="Mover arriba"
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveRule(regla.id, 'down'); }}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" 
                                  title="Mover abajo"
                                >
                                  <ChevronDown size={14} />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); setRuleToDelete(regla); }}
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
      desc: "Administra las validaciones que revisan los datos antes de procesarlos"
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
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
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
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-primary">
                            {config?.title}
                          </h3>
                          {renderStatusBadge(stats.status)}
                        </div>
                        <p className="text-slate-500 text-sm max-w-2xl">
                          {config?.desc}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            {(() => {
              const buttonText = selectedSection === 'Validación' ? 'Nueva validación' : 
                                selectedSection === 'Normalización' ? 'Nueva normalización' : 'Nueva transformación';

              return (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleCreateRule(selectedSection)}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Plus size={16} />
                    {buttonText}
                  </button>
                </div>
              );
            })()}
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative max-w-sm w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input 
                  type="text"
                  placeholder={`Buscar ${selectedSection.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
                />
              </div>
              <button
                onClick={() => setGroupBySource(!groupBySource)}
                className={`p-2 border rounded-lg transition-colors ${groupBySource ? 'bg-primary/5 text-primary border-primary/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                title="Agrupar por fuente"
              >
                <ListFilter size={18} />
              </button>
            </div>

            {(() => {
              const rules = reglas.filter((r) => r.tipo === selectedSection);
              const stats = getSectionStats(selectedSection);
              const filtrosBase = [
                { id: 'Todas', count: stats.total },
                { id: 'Activas', count: stats.active },
                { id: 'Inactivas', count: stats.total - stats.active },
                { id: 'Incompletas', count: stats.incomplete }
              ];
              
              const filtros = selectedSection !== 'Validación' 
                ? [...filtrosBase, { id: 'Con error', count: stats.withError }]
                : filtrosBase;

              return (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                  {filtros.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setFilterStatus(filter.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        filterStatus === filter.id
                          ? 'bg-slate-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {filter.id} <span className={`ml-1 text-[10px] ${filterStatus === filter.id ? 'text-slate-300' : 'text-slate-400'}`}>({filter.count})</span>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          <div className={groupBySource ? "" : "bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden"}>
            {renderReglasGrid(selectedSection, true)}
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                Preparación de datos
              </h3>
              <p className="text-slate-500 text-sm max-w-2xl">
                Configura las reglas previas que validan, normalizan y transforman los datos antes de pasar a la conciliación.
              </p>
              <div className="mt-4 flex items-center gap-2.5 text-sm font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-fit">
                <Info size={16} className="text-primary" />
                <span>Los bloques se ejecutan en secuencia, pero puedes configurarlos en cualquier orden.</span>
              </div>
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
                                    ? `Sin ${step.id === 'Validación' ? 'validaciones' : 'reglas'}`
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
                            <div className="w-2 h-2 rounded-full bg-blue-500" title="Cambios sin guardar" />
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
                  currentRuleType === 'Validación' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
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
                    {currentRuleType === 'Validación' 
                      ? 'Crea una validación para asegurar que los datos estén listos' 
                      : 'Configura los parámetros de la regla para el flujo de preparación.'}
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
                  <button 
                    onClick={() => toggleSection('general')}
                    className="w-full flex items-center justify-between gap-2 mb-4 text-slate-800 hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Info size={16} className="text-primary" />
                      <h4 className="text-[14px] font-bold uppercase tracking-wider">Información General</h4>
                    </div>
                    {expandedSections.general ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                  </button>
                  {expandedSections.general && (
                    <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-top-2 fade-in duration-200">
                      <div className="flex flex-col sm:flex-row gap-6 items-end">
                        <div className="flex-1 w-full">
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            {currentRuleType === 'Validación' ? 'Nombre de la validación' : `Nombre de la ${currentRuleType.toLowerCase()}`} <span className="text-rose-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            placeholder="Ej. Validar montos positivos"
                            className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${getFieldErrorClass(!formData.nombre)}`}
                          />
                        </div>
                        <div className="shrink-0 flex flex-col items-start sm:items-end w-full sm:w-auto">
                          <button 
                            onClick={() => setFormData({...formData, activa: !formData.activa})}
                            className={`flex items-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition-all w-full sm:w-auto justify-center ${
                              formData.activa 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm' 
                              : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${formData.activa ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {formData.activa ? 'Activa' : 'Inactiva'}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción (Opcional)</label>
                        <textarea 
                          rows={2}
                          value={formData.descripcion}
                          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                          placeholder="Explica brevemente qué hace esta regla..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        />
                      </div>
                    </div>
                  )}
                </section>

                <div className="w-full h-px bg-slate-100" />

                {/* Scope & Application Section */}
                <section>
                  <button 
                    onClick={() => toggleSection('aplicacion')}
                    className="w-full flex items-center justify-between gap-2 mb-4 text-slate-800 hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-primary" />
                      <h4 className="text-[14px] font-bold uppercase tracking-wider">Aplicación</h4>
                    </div>
                    {expandedSections.aplicacion ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                  </button>
                  {expandedSections.aplicacion && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-top-2 fade-in duration-200">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {currentRuleType === 'Validación' ? 'Tipo de Validación' : 'Operación'} <span className="text-rose-500">*</span>
                        </label>
                        <select 
                          value={formData.subTipo || ""}
                          onChange={(e) => setFormData({...formData, subTipo: e.target.value as ValidationType})}
                          className={`w-full px-3 py-2 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.subTipo)}`}
                        >
                          {currentRuleType === 'Validación' ? (
                            <>
                              <option value="Campo obligatorio">Campo obligatorio</option>
                              <option value="Tipo de dato esperado">Tipo de dato esperado</option>
                              <option value="Monto válido">Monto válido</option>
                              <option value="Fecha válida">Fecha válida</option>
                              <option value="Duplicidad">Duplicidad</option>
                              <option value="Cantidad mínima de registros">Cantidad mínima de registros</option>
                              <option value="Estructura requerida">Estructura requerida</option>
                              <option value="Valor permitido / catálogo válido">Valor permitido / catálogo válido</option>
                            </>
                          ) : currentRuleType === 'Normalización' ? (
                            <>
                              <option value="Limpiar espacios">Limpiar espacios</option>
                              <option value="Cambiar mayúsculas/minúsculas">Cambiar mayúsculas/minúsculas</option>
                              <option value="Quitar caracteres">Quitar caracteres</option>
                              <option value="Reemplazar valores">Reemplazar valores</option>
                              <option value="Homologar valores">Homologar valores</option>
                              <option value="Normalizar fecha">Normalizar fecha</option>
                              <option value="Normalizar número o monto">Normalizar número o monto</option>
                              <option value="Normalizar valores vacíos">Normalizar valores vacíos</option>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Fuente de aplicación <span className="text-rose-500">*</span></label>
                        <select 
                          value={Array.isArray(formData.fuente) ? 'Multi' : formData.fuente}
                          onChange={(e) => setFormData({...formData, fuente: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.fuente)}`}
                        >
                          <option value="">Selecciona una fuente</option>
                          <option value="Extracto Bancario">Extracto Bancario</option>
                          <option value="Cobros ERP">Cobros ERP</option>
                          <option value="Municipio">Municipio</option>
                          <option value="Banred">Banred</option>
                          <option value="Banco">Banco</option>
                        </select>
                      </div>

                      {!(currentRuleType === 'Validación' && (formData.subTipo === "Estructura requerida" || formData.subTipo === "Cantidad mínima de registros")) && (
                        <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            {currentRuleType === 'Validación' && formData.subTipo === 'Duplicidad' ? 'Campos asociados' : 'Campo asociado'} <span className="text-rose-500">*</span>
                          </label>
                          <div className="mt-2">
                            {currentRuleType === 'Validación' && formData.subTipo === 'Duplicidad' ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {["monto", "fecha_transaccion", "referencia", "id_cliente", "estado", "fecha_valor"].map(c => {
                                  const isSelected = Array.isArray(formData.campo) 
                                      ? formData.campo.includes(c) 
                                      : (typeof formData.campo === 'string' && formData.campo.split(',').map(s=>s.trim()).includes(c));
                                  return (
                                    <label key={c} className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                                      <input 
                                        type="checkbox" 
                                        checked={isSelected}
                                        onChange={(e) => {
                                          let current: string[] = [];
                                          if (Array.isArray(formData.campo)) current = [...formData.campo];
                                          else if (typeof formData.campo === 'string' && formData.campo) current = formData.campo.split(',').map(s=>s.trim());
                                          
                                          if (e.target.checked) {
                                            setFormData({...formData, campo: [...current, c]});
                                          } else {
                                            setFormData({...formData, campo: current.filter(x => x !== c)});
                                          }
                                        }}
                                        className="rounded text-primary focus:ring-primary accent-primary w-4 h-4 cursor-pointer"
                                      />
                                      <span className="text-sm font-medium text-slate-700">{c}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="relative">
                                <select
                                  value={Array.isArray(formData.campo) ? formData.campo[0] || "" : formData.campo || ""}
                                  onChange={(e) => setFormData({...formData, campo: e.target.value})}
                                  className={`w-full px-3 py-2 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.campo || formData.campo.length === 0)}`}
                                >
                                  <option value="">Seleccione un campo...</option>
                                  <option value="monto">monto</option>
                                  <option value="fecha_transaccion">fecha_transaccion</option>
                                  <option value="referencia">referencia</option>
                                  <option value="id_cliente">id_cliente</option>
                                  <option value="estado">estado</option>
                                  <option value="fecha_valor">fecha_valor</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {currentRuleType === 'Validación' && (
                  <>
                    <div className="w-full h-px bg-slate-100" />
                    
                    <section>
                      <button 
                        onClick={() => toggleSection('condicion')}
                        className="w-full flex items-center justify-between gap-2 mb-4 text-slate-800 hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Settings2 size={16} className="text-primary" />
                          <h4 className="text-[14px] font-bold uppercase tracking-wider">Condición</h4>
                        </div>
                        {expandedSections.condicion ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                      </button>
                      {expandedSections.condicion && (
                        <div className="p-5 bg-slate-50/80 border border-slate-100 rounded-xl space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                          {formData.subTipo === 'Monto válido' && (
                            <div className="flex flex-wrap items-start gap-4">
                              <div className={`flex-1 min-w-[200px] ${!["Mayor que", "Mayor o igual que", "Menor que", "Menor o igual que", "Entre rango"].includes(formData.condicionMonto || "") ? "" : "max-w-sm"}`}>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Condición del monto <span className="text-rose-500">*</span></label>
                                <select 
                                  value={formData.condicionMonto || ""}
                                  onChange={(e) => setFormData({...formData, condicionMonto: e.target.value})}
                                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
                                >
                                  <option value="">Selecciona una condición</option>
                                  <option value="Mayor que">Mayor que</option>
                                  <option value="Mayor o igual que">Mayor o igual que</option>
                                  <option value="Menor que">Menor que</option>
                                  <option value="Menor o igual que">Menor o igual que</option>
                                  <option value="Entre rango">Entre rango</option>
                                  <option value="Distinto de cero">Distinto de cero</option>
                                </select>
                              </div>
                              {["Mayor que", "Mayor o igual que", "Menor que", "Menor o igual que"].includes(formData.condicionMonto || "") && (
                                <div className="flex-1 min-w-[200px] max-w-sm">
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Valor de comparación <span className="text-rose-500">*</span></label>
                                  <input 
                                    type="number" 
                                    value={formData.valorComparacion || ""}
                                    onChange={(e) => setFormData({...formData, valorComparacion: e.target.value})}
                                    placeholder="Ej. 0" 
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                </div>
                              )}
                              {formData.condicionMonto === "Entre rango" && (
                                <div className="flex flex-wrap gap-4 items-start flex-[2] min-w-[300px]">
                                  <div className="flex-1 min-w-[140px]">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Valor mínimo <span className="text-rose-500">*</span></label>
                                    <input 
                                       type="number" 
                                       value={formData.valorMinimo || ""}
                                       onChange={(e) => setFormData({...formData, valorMinimo: e.target.value})}
                                       placeholder="Ej. 0.01" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                  </div>
                                  <div className="flex-1 min-w-[140px]">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Valor máximo <span className="text-rose-500">*</span></label>
                                    <input 
                                       type="number" 
                                       value={formData.valorMaximo || ""}
                                       onChange={(e) => setFormData({...formData, valorMaximo: e.target.value})}
                                       placeholder="Ej. 9999.99" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {formData.subTipo === 'Fecha válida' && (
                            <div className="flex flex-wrap items-start gap-4">
                              <div className={`flex-1 min-w-[200px] ${formData.comparacionFecha === "Rango relativo al día operativo" ? 'max-w-sm' : ''}`}>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Comparación de fecha <span className="text-rose-500">*</span></label>
                                <select 
                                   value={formData.comparacionFecha || ""}
                                   onChange={(e) => setFormData({...formData, comparacionFecha: e.target.value})}
                                   className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
                                >
                                  <option value="">Selecciona comparación</option>
                                  <option value="Mismo día operativo">Mismo día operativo</option>
                                  <option value="Día caído">Día caído</option>
                                  <option value="Rango relativo al día operativo">Rango relativo al día operativo</option>
                                </select>
                              </div>
                              {formData.comparacionFecha === "Rango relativo al día operativo" && (
                                <div className="flex flex-wrap gap-4 items-start flex-[2] min-w-[300px]">
                                  <div className="flex-1 min-w-[140px]">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Desde (días) <span className="text-rose-500">*</span></label>
                                    <input type="number" value={formData.desdeFecha || ""} onChange={(e) => setFormData({...formData, desdeFecha: e.target.value})} placeholder="Ej. -1" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                  </div>
                                  <div className="flex-1 min-w-[140px]">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Hasta (días) <span className="text-rose-500">*</span></label>
                                    <input type="number" value={formData.hastaFecha || ""} onChange={(e) => setFormData({...formData, hastaFecha: e.target.value})} placeholder="Ej. 0" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {formData.subTipo === 'Cantidad mínima de registros' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cantidad mínima esperada <span className="text-rose-500">*</span></label>
                              <input 
                                type="number" 
                                value={formData.cantidadMinima || ""}
                                onChange={(e) => setFormData({...formData, cantidadMinima: e.target.value})}
                                placeholder="Ej. 1" 
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                            </div>
                          )}

                          {formData.subTipo === 'Valor permitido / catálogo válido' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Valores permitidos <span className="text-rose-500">*</span></label>
                              <input 
                                type="text" 
                                value={formData.valoresPermitidos || ""}
                                onChange={(e) => setFormData({...formData, valoresPermitidos: e.target.value})}
                                placeholder="Ej. ACTIVO, PROCESADO (separados por coma)" 
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                            </div>
                          )}

                          <div className="bg-white p-4 border border-slate-200 rounded-lg">
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold text-slate-800">Condición generada: </span>
                              {(() => {
                                const fuente = Array.isArray(formData.fuente) && formData.fuente.length > 0 ? formData.fuente.join(", ") : formData.fuente || "seleccionada";
                                const campo = Array.isArray(formData.campo) && formData.campo.length > 0 ? formData.campo.join(", ") : formData.campo || "seleccionado";
                                
                                if (formData.subTipo === 'Campo obligatorio') {
                                  return `El campo ${campo} no debe estar vacío en la fuente ${fuente}.`;
                                }
                                if (formData.subTipo === 'Tipo de dato esperado') {
                                  return `El campo ${campo} de la fuente ${fuente} debe cumplir el tipo de dato definido en Fuentes y campos.`;
                                }
                                if (formData.subTipo === 'Estructura requerida') {
                                  return `La fuente ${fuente} debe contener los campos requeridos definidos en Fuentes y campos.`;
                                }
                                if (formData.subTipo === 'Duplicidad') {
                                  return `No debe repetirse la combinación de campos ${campo} en la fuente ${fuente}.`;
                                }
                                if (formData.subTipo === 'Monto válido') {
                                  if (formData.condicionMonto === 'Distinto de cero') return `El campo ${campo} debe ser distinto de cero.`;
                                  if (formData.condicionMonto === 'Entre rango') return `El campo ${campo} debe estar entre ${formData.valorMinimo || "_"} y ${formData.valorMaximo || "_"}.`;
                                  if (formData.condicionMonto) return `El campo ${campo} debe ser ${formData.condicionMonto.toLowerCase()} ${formData.valorComparacion || "_"}.`;
                                  return "Por favor configura la condición del monto.";
                                }
                                if (formData.subTipo === 'Fecha válida') {
                                  if (formData.comparacionFecha === 'Mismo día operativo') return `El campo ${campo} debe corresponder al día operativo del proceso.`;
                                  if (formData.comparacionFecha === 'Día caído') return `El campo ${campo} debe corresponder al día anterior al día operativo del proceso.`;
                                  if (formData.comparacionFecha === 'Rango relativo al día operativo') {
                                    return `El campo ${campo} debe estar entre ${formData.desdeFecha || "_"} días y ${formData.hastaFecha || "_"} días relativos al día operativo.`;
                                  }
                                  return "Por favor configura la comparación de la fecha.";
                                }
                                if (formData.subTipo === 'Cantidad mínima de registros') {
                                  const cantidad = Number(formData.cantidadMinima) || 0;
                                  return `La fuente ${fuente} debe contener al menos ${formData.cantidadMinima || "_"} ${cantidad === 1 ? 'registro' : 'registros'}.`;
                                }
                                if (formData.subTipo === 'Valor permitido / catálogo válido') {
                                  return `El campo ${campo} solo puede contener los valores ${formData.valoresPermitidos || "_"}.`;
                                }
                                return "Selecciona un tipo de validación para ver la condición generada.";
                              })()}
                            </p>
                            {formData.subTipo === 'Estructura requerida' && (
                              <p className="text-sm text-slate-500 mt-2">
                                <span className="font-semibold text-slate-700">Campos requeridos: </span>
                                fecha_pago, referencia, monto
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </section>
                  </>
                )}

                {currentRuleType === 'Transformación' && (
                  <>
                    <div className="w-full h-px bg-slate-100" />
                    <section>
                      <button 
                        onClick={() => toggleSection('condicion')}
                        className="w-full flex items-center justify-between gap-2 mb-4 text-slate-800 hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Settings2 size={16} className="text-primary" />
                          <h4 className="text-[14px] font-bold uppercase tracking-wider">Configuración de Operación</h4>
                        </div>
                        {expandedSections.condicion ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                      </button>
                      {expandedSections.condicion && (
                        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                           <label className="block text-sm font-medium text-slate-700 mb-1.5">Lógica a aplicar <span className="text-rose-500">*</span></label>
                           <div className={`p-3 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all ${getFieldErrorClass(!formData.accion)}`}>
                             <input 
                               type="text" 
                               value={formData.accion}
                               onChange={(e) => setFormData({...formData, accion: e.target.value})}
                               placeholder='Ej. Condición if/else, prefijo/sufijo a concatenar...'
                               className="w-full bg-transparent border-none p-0 text-[14px] font-medium text-slate-800 focus:ring-0 placeholder:text-slate-400"
                             />
                           </div>
                        </div>
                      )}
                    </section>
                  </>
                )}

                {currentRuleType === 'Normalización' && (
                  <>
                    <div className="w-full h-px bg-slate-100" />
                    <section>
                      <button 
                        onClick={() => toggleSection('condicion')}
                        className="w-full flex items-center justify-between gap-2 mb-4 text-slate-800 hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Settings2 size={16} className="text-primary" />
                          <h4 className="text-[14px] font-bold uppercase tracking-wider">Configuración de Operación</h4>
                        </div>
                        {expandedSections.condicion ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                      </button>
                      
                      {expandedSections.condicion && (
                        <div className="p-5 bg-slate-50/80 border border-slate-100 rounded-xl space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                          {formData.subTipo === 'Limpiar espacios' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Opciones <span className="text-rose-500">*</span></label>
                              <select
                                value={formData.opcionLimpiarEspacios || ""}
                                onChange={(e) => setFormData({...formData, opcionLimpiarEspacios: e.target.value})}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.opcionLimpiarEspacios)}`}
                              >
                                <option value="">Seleccionar una opción...</option>
                                <option value="Quitar espacios al inicio y al final">Quitar espacios al inicio y al final</option>
                                <option value="Reducir espacios múltiples a uno solo">Reducir espacios múltiples a uno solo</option>
                                <option value="Eliminar todos los espacios internos">Eliminar todos los espacios internos</option>
                              </select>
                            </div>
                          )}
                          
                          {formData.subTipo === 'Cambiar mayúsculas/minúsculas' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Modo de conversión <span className="text-rose-500">*</span></label>
                              <select
                                value={formData.modoMayusculas || ""}
                                onChange={(e) => setFormData({...formData, modoMayusculas: e.target.value})}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.modoMayusculas)}`}
                              >
                                <option value="">Seleccionar un modo...</option>
                                <option value="Convertir a mayúsculas">Convertir a mayúsculas</option>
                                <option value="Convertir a minúsculas">Convertir a minúsculas</option>
                                <option value="Capitalizar texto">Capitalizar texto</option>
                              </select>
                            </div>
                          )}

                          {formData.subTipo === 'Quitar caracteres' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Caracteres a eliminar <span className="text-rose-500">*</span></label>
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                {["Guiones (-)", "Puntos (.)", "Comas (,)", "Espacios ( )"].map(char => {
                                  let current: string[] = formData.caracteresAQuitar || [];
                                  const isSelected = current.includes(char);
                                  return (
                                    <label key={char} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                                      <input 
                                        type="checkbox" 
                                        checked={isSelected}
                                        onChange={(e) => {
                                          if (e.target.checked) setFormData({...formData, caracteresAQuitar: [...current, char]});
                                          else setFormData({...formData, caracteresAQuitar: current.filter(x => x !== char)});
                                        }}
                                        className="rounded text-primary focus:ring-primary accent-primary w-4 h-4 cursor-pointer"
                                      />
                                      <span className="text-sm font-medium text-slate-700">{char}</span>
                                    </label>
                                  )
                                })}
                              </div>
                              <input 
                                type="text"
                                value={formData.caracteresManual || ""}
                                onChange={(e) => setFormData({...formData, caracteresManual: e.target.value})}
                                placeholder="Otros caracteres a eliminar (Ej. / \* %)"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                              />
                            </div>
                          )}

                          {formData.subTipo === 'Reemplazar valores' && (
                            <div>
                               <label className="block text-sm font-medium text-slate-700 mb-1.5">Valores de reemplazo <span className="text-rose-500">*</span></label>
                               {(formData.reemplazos || []).map((rem, idx) => (
                                 <div key={idx} className="flex gap-2 mb-2">
                                   <input
                                      type="text"
                                      placeholder="Origen (Ej. OK)"
                                      value={rem.origen}
                                      onChange={(e) => {
                                        const r = [...(formData.reemplazos || [])];
                                        r[idx].origen = e.target.value;
                                        setFormData({...formData, reemplazos: r});
                                      }}
                                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700"
                                   />
                                   <div className="flex items-center text-slate-400">→</div>
                                   <input
                                      type="text"
                                      placeholder="Destino (Ej. APROBADO)"
                                      value={rem.destino}
                                      onChange={(e) => {
                                        const r = [...(formData.reemplazos || [])];
                                        r[idx].destino = e.target.value;
                                        setFormData({...formData, reemplazos: r});
                                      }}
                                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700"
                                   />
                                   <button 
                                      onClick={() => {
                                        const r = [...(formData.reemplazos || [])];
                                        r.splice(idx, 1);
                                        setFormData({...formData, reemplazos: r});
                                      }}
                                      className="p-2 text-rose-500 hover:bg-rose-50 rounded"
                                   >
                                     <X size={16} />
                                   </button>
                                 </div>
                               ))}
                               <button 
                                 onClick={() => setFormData({...formData, reemplazos: [...(formData.reemplazos || []), {origen: '', destino: ''}]})}
                                 className="text-sm font-medium text-primary hover:underline"
                               >
                                 + Añadir reemplazo
                               </button>
                            </div>
                          )}

                          {formData.subTipo === 'Homologar valores' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Catálogo de homologación <span className="text-rose-500">*</span></label>
                              <select
                                value={formData.homologacionCatalogo || ""}
                                onChange={(e) => setFormData({...formData, homologacionCatalogo: e.target.value})}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.homologacionCatalogo)}`}
                              >
                                <option value="">Seleccionar un catálogo...</option>
                                <option value="Catálogo de Estados Generales">Catálogo de Estados Generales</option>
                                <option value="Catálogo de Entidades">Catálogo de Entidades</option>
                                <option value="Catálogo de Códigos Operativos">Catálogo de Códigos Operativos</option>
                              </select>
                            </div>
                          )}

                          {formData.subTipo === 'Normalizar fecha' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Formato de origen a estandarizar <span className="text-rose-500">*</span></label>
                              <select
                                value={formData.formatoFechaOrigen || ""}
                                onChange={(e) => setFormData({...formData, formatoFechaOrigen: e.target.value})}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.formatoFechaOrigen)}`}
                              >
                                <option value="">Seleccionar formato de origen...</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                              </select>
                            </div>
                          )}

                          {formData.subTipo === 'Normalizar número o monto' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Formato numérico detectado <span className="text-rose-500">*</span></label>
                              <select
                                value={formData.formatoNumero || ""}
                                onChange={(e) => setFormData({...formData, formatoNumero: e.target.value})}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.formatoNumero)}`}
                              >
                                <option value="">Seleccionar formato de origen...</option>
                                <option value="Separador decimal: Punto (1,234.56)">Separador decimal: Punto (1,234.56)</option>
                                <option value="Separador decimal: Coma (1.234,56)">Separador decimal: Coma (1.234,56)</option>
                              </select>
                            </div>
                          )}

                          {formData.subTipo === 'Normalizar valores vacíos' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Valores a tratar como vacío <span className="text-rose-500">*</span></label>
                              <div className="flex flex-wrap items-center gap-3">
                                {["N/A", "NA", "NULL", "-", "SIN DATO", "Espacios en blanco"].map(val => {
                                  let current: string[] = formData.valoresVacios || [];
                                  const isSelected = current.includes(val);
                                  return (
                                    <label key={val} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                                      <input 
                                        type="checkbox" 
                                        checked={isSelected}
                                        onChange={(e) => {
                                          if (e.target.checked) setFormData({...formData, valoresVacios: [...current, val]});
                                          else setFormData({...formData, valoresVacios: current.filter(x => x !== val)});
                                        }}
                                        className="rounded text-primary focus:ring-primary accent-primary w-4 h-4 cursor-pointer"
                                      />
                                      <span className="text-sm font-medium text-slate-700">{val}</span>
                                    </label>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          <div className="bg-white p-4 border border-slate-200 rounded-lg">
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold text-slate-800">Resultado esperado: </span>
                              {(() => {
                                const fuente = Array.isArray(formData.fuente) && formData.fuente.length > 0 ? formData.fuente.join(", ") : formData.fuente || "seleccionada";
                                const campo = Array.isArray(formData.campo) && formData.campo.length > 0 ? formData.campo.join(", ") : formData.campo || "seleccionado";
                                
                                if (formData.subTipo === 'Limpiar espacios') {
                                  if (formData.opcionLimpiarEspacios === "Quitar espacios al inicio y al final") return `El campo ${campo} eliminará espacios al inicio y al final.`;
                                  if (formData.opcionLimpiarEspacios === "Reducir espacios múltiples a uno solo") return `El campo ${campo} reducirá espacios consecutivos a un solo espacio.`;
                                  if (formData.opcionLimpiarEspacios === "Eliminar todos los espacios internos") return `El campo ${campo} eliminará todos los espacios internos.`;
                                  return "Selecciona una opción de limpieza.";
                                }
                                if (formData.subTipo === 'Cambiar mayúsculas/minúsculas') {
                                  if (formData.modoMayusculas) return `El campo ${campo} se convertirá a ${formData.modoMayusculas.replace("Convertir a ", "").toLowerCase()}.`;
                                  return "Selecciona el modo de conversión.";
                                }
                                if (formData.subTipo === 'Quitar caracteres') {
                                  const chars = [...(formData.caracteresAQuitar || []), formData.caracteresManual].filter(Boolean);
                                  if (chars.length > 0) return `El campo ${campo} eliminará: ${chars.join(", ")}.`;
                                  return "Selecciona qué caracteres eliminar.";
                                }
                                if (formData.subTipo === 'Reemplazar valores') {
                                  const r = formData.reemplazos || [];
                                  if (r.length === 1 && r[0].origen && r[0].destino) return `El campo ${campo} reemplazará ${r[0].origen} por ${r[0].destino}.`;
                                  if (r.length > 1) return `El campo ${campo} aplicará ${r.length} reemplazos configurados.`;
                                  return "Configura al menos un valor de reemplazo.";
                                }
                                if (formData.subTipo === 'Homologar valores') {
                                  if (formData.homologacionCatalogo) return `El campo ${campo} se homologará según el ${formData.homologacionCatalogo}.`;
                                  return "Selecciona el catálogo de homologación.";
                                }
                                if (formData.subTipo === 'Normalizar fecha') {
                                  if (formData.formatoFechaOrigen) return `El campo ${campo} se convertirá del formato ${formData.formatoFechaOrigen} al estándar de fecha.`;
                                  return "Selecciona el formato de origen de la fecha.";
                                }
                                if (formData.subTipo === 'Normalizar número o monto') {
                                  if (formData.formatoNumero) return `El campo ${campo} se convertirá al formato numérico estándar.`;
                                  return "Selecciona el formato numérico esperado.";
                                }
                                if (formData.subTipo === 'Normalizar valores vacíos') {
                                  if (formData.valoresVacios && formData.valoresVacios.length > 0) return `El campo ${campo} tratará ${formData.valoresVacios.join(" y ")} como vacío.`;
                                  return "Selecciona los valores a tratar como vacíos.";
                                }
                                return "Selecciona una operación de normalización para ver el resultado esperado.";
                              })()}
                            </p>
                          </div>
                        </div>
                      )}
                    </section>
                  </>
                )}

                {currentRuleType !== 'Normalización' && (
                  <>
                    <div className="w-full h-px bg-slate-100" />

                    {/* Severity & Message */}
                    <section>
                      <button 
                        onClick={() => toggleSection('impacto')}
                        className="w-full flex items-center justify-between gap-2 mb-4 text-slate-800 hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={16} className="text-primary" />
                          <h4 className="text-[14px] font-bold uppercase tracking-wider">Impacto</h4>
                        </div>
                        {expandedSections.impacto ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                      </button>
                      {expandedSections.impacto && (
                        <div className="flex flex-col gap-6 animate-in slide-in-from-top-2 fade-in duration-200">
                          <div className="w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Severidad <span className="text-rose-500">*</span></label>
                            <div className="flex gap-4">
                         <button 
                           onClick={() => setFormData({...formData, nivel: "Fuerte"})}
                           className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-all ${
                             formData.nivel === "Fuerte" 
                             ? 'bg-slate-700 border-slate-700 text-white shadow-sm' 
                             : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                           }`}
                         >
                           <ShieldAlert size={16} />
                           Bloqueante
                         </button>
                         <button 
                           onClick={() => setFormData({...formData, nivel: "Advertencia"})}
                           className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-all ${
                             formData.nivel === "Advertencia" 
                             ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                             : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                           }`}
                         >
                           <AlertTriangle size={16} />
                           Advertencia
                         </button>
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Mensaje al usuario (Si no se cumple) <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.mensaje || ""}
                        onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                        placeholder={(() => {
                          const fuente = Array.isArray(formData.fuente) && formData.fuente.length > 0 ? formData.fuente.join(", ") : formData.fuente || "seleccionada";
                          const campo = Array.isArray(formData.campo) && formData.campo.length > 0 ? formData.campo.join(", ") : formData.campo || "seleccionado";
                          return `Ej. El campo ${campo} es obligatorio para procesar la fuente ${fuente}.`;
                        })()}
                        className={`w-full px-3 py-2 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${getFieldErrorClass(!formData.mensaje)}`}
                      />
                      <p className="mt-2 text-[11px] text-slate-400">
                        El sistema mostrará este mensaje en los reportes de calidad si la validación falla.
                      </p>
                    </div>
                  </div>
                  )}
                </section>
                </>
              )}
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
                className="px-8 py-2.5 bg-primary text-white text-[14px] font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {editingRegla ? 'Guardar Cambios' : `Crear ${currentRuleType.toLowerCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {ruleToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Eliminar validación</h3>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              ¿Estás seguro de que deseas eliminar la validación <span className="font-semibold text-slate-800">"{ruleToDelete.nombre}"</span>? Esta acción no se puede deshacer.
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full">
              <button 
                onClick={() => setRuleToDelete(null)}
                className="w-full sm:w-1/2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteRule}
                className="w-full sm:w-1/2 px-4 py-2.5 bg-rose-500 text-white text-sm font-bold rounded-xl shadow-md shadow-rose-500/20 hover:bg-rose-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

