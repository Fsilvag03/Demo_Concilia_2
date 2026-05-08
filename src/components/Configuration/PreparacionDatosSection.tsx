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
  ListFilter,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import type { Process } from "./ProcessCard";
import { PreviewTestModal } from "./PreviewTestModal";
import { FieldSelect } from './FieldSelect';

interface PreparacionDatosSectionProps {
  process: Process;
  onChange: () => void;
}

type NivelRegla = "Fuerte" | "Advertencia";
type TipoRegla = "Validación" | "Normalización" | "Transformación" | "Control de consistencia";

export type ConsistencyControlType =
  | "Suma contra valor de control"
  | "Conteo de registros"
  | "Comparación de totales entre fuentes";

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

export type TransformationType = 
  | "Extraer valor de un campo"
  | "Separar campo en varios campos"
  | "Unir campos"
  | "Crear campo calculado"
  | "Ajustar signo o naturaleza del monto"
  | "Clasificar registros"
  | "Derivar fecha"
  | "Excluir registros del cruce";

interface CampoDestinoDef {
  nombre: string;
  etiqueta?: string;
  tipo: string;
  descripcion?: string;
  segmentoOrigen?: string;
  posicionInicial?: string;
  longitud?: string;
}

interface EquivalenciaSigno {
  valor: string;
  accion: string;
}

export interface ReglaPreparacion {
  id: string;
  nombre: string;
  descripcion: string;
  fuente: string | string[];
  campo: string | string[];
  tipo: TipoRegla;
  subTipo?: ValidationType | NormalizationType | TransformationType | ConsistencyControlType | string;
  accion?: string;
  activa: boolean;
  nivel?: NivelRegla;
  mensaje?: string;
  criterio?: string;
  dependenciaInactiva?: boolean;
  orden?: number;

  // For Control de consistencia
  registrosConsiderados?: string;
  registrosConsideradosB?: string;
  campoControl?: string;
  origenValorControl?: string;
  valorFijoControl?: string;
  origenTotal?: string;
  campoTotalInformado?: string;
  valorTotalInformado?: string;
  condicionComparacion?: string;
  condicionConteo?: string;
  tolerancia?: string;
  fuenteAdicional?: string;
  campoAdicional?: string;
  cantidadMinimaRegistros?: number | string;
  cantidadMaximaRegistros?: number | string;
  campoASumar?: string;

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

  // New fields for specific transformations
  campoDestino?: string | string[];
  campoDestinoNombre?: string;
  campoDestinoEtiqueta?: string;
  campoDestinoTipoDato?: string;
  campoDestinoDesc?: string;
  metodoExtraccion?: string;
  parametrosExtraccion?: string;
  delimitador?: string;
  posicionInicial?: string;
  longitud?: string;
  segmentoAExtraer?: string;
  numeroSegmento?: string;
  textoReferencia?: string;
  patronExtraccion?: string;
  descripcionPatron?: string;
  separador?: string;
  operadorCalculo?: string;
  valorConstante?: string;
  criterioAjuste?: string;
  campoApoyo?: string;
  condicionClasificacion?: string;
  valorAsignado?: string;
  reglaDerivacionFecha?: string;
  cantidadDias?: number | string;
  condicionExclusion?: string;
  motivoExclusion?: string;

  metodoSeparacion?: string;
  longitudesFragmentos?: string;
  tipoCalculo?: string;
  campoARestar?: string;
  campoOperador?: string;
  primerCampo?: string;
  segundoCampo?: string;
  operacionConstante?: string;
  valorConstanteCalculo?: string;
  criterioAjusteSigno?: string;
  campoIndicador?: string;
  equivalenciasSigno?: EquivalenciaSigno[];
  operadorCondicion?: string;
  valorCondicion?: string;
  valorCondicionMin?: string;
  valorCondicionMax?: string;
  baseFecha?: string;
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
    activa: false,
    nivel: "Advertencia",
    mensaje: "El campo fecha_pago no corresponde al día operativo.",
  },
  {
    id: "r3",
    nombre: "Control de duplicidad de transacciones",
    descripcion: "No debe haber registros duplicados en fecha_transaccion y monto para Banred.",
    fuente: "Banred",
    campo: "",
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
    dependenciaInactiva: true,
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
    activa: false,
  },
  {
    id: "n3",
    nombre: "Estándar de fecha Extracto",
    descripcion: "Asegura que la fecha se procese correctamente desde el formato de origen.",
    fuente: "Extracto Bancario",
    campo: "fecha_transaccion",
    tipo: "Normalización",
    subTipo: "Normalizar fecha",
    formatoFechaOrigen: "",
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
    dependenciaInactiva: true,
  },
  {
    id: "t1",
    nombre: "Extraer orden de descripción",
    descripcion: "Obtiene el código de la orden contenido dentro del campo concepto.",
    fuente: "Banco",
    campo: "concepto",
    tipo: "Transformación",
    subTipo: "Extraer valor de un campo",
    metodoExtraccion: "Por patrón (Regex)",
    campoDestino: "orden_extraida",
    activa: true,
  },
  {
    id: "t2",
    nombre: "Calcular monto neto",
    descripcion: "Resta la comisión al monto para obtener el valor neto de la operación.",
    fuente: "Cash Pagos",
    campo: ["monto", "comision"],
    tipo: "Transformación",
    subTipo: "Crear campo calculado",
    operadorCalculo: "Resta",
    campoDestino: "monto_neto",
    activa: false,
  },
  {
    id: "t3",
    nombre: "Clasificar movimientos",
    descripcion: "Clasifica el registro como sobrante o faltante según el signo del monto.",
    fuente: "Banco",
    campo: "monto",
    tipo: "Transformación",
    subTipo: "Clasificar registros",
    condicionClasificacion: "",
    valorAsignado: "",
    campoDestino: "",
    activa: true,
  },
  {
    id: "t4",
    nombre: "Excluir consultas sin costo",
    descripcion: "Elimina del cruce los registros que tengan monto 0, que corresponden a consultas.",
    fuente: "Banred",
    campo: "monto",
    tipo: "Transformación",
    subTipo: "Excluir registros del cruce",
    condicionExclusion: "Monto igual a 0",
    operadorCondicion: "Igual a",
    valorCondicion: "0",
    motivoExclusion: "Consultas sin costo",
    activa: true,
    dependenciaInactiva: true,
  },
  {
    id: "c1",
    nombre: "Control cuadre saldos",
    descripcion: "Validar que la suma de abonos coincida con el saldo final reportado en el extracto.",
    fuente: "Extracto Bancario",
    campo: "",
    tipo: "Control de consistencia",
    subTipo: "Suma contra valor de control",
    campoASumar: "abonos",
    origenValorControl: "Último valor de un campo",
    campoControl: "saldo_final",
    condicionComparacion: "Igual a",
    registrosConsiderados: "Registros incluidos para conciliación",
    activa: true,
    nivel: "Fuerte",
  },
];

export function PreparacionDatosSection({ process, onChange }: PreparacionDatosSectionProps) {
  const [viewMode, setViewMode] = useState<"stepper" | "detail">("stepper");
  const [selectedSection, setSelectedSection] = useState<TipoRegla | null>(null);
  const [reglas, setReglas] = useState<ReglaPreparacion[]>(() => {
    const s1 = process.sources[0] || "Fuente 1";
    const s2 = process.sources[1] || "Fuente 2";
    const s3 = process.sources.length > 2 ? process.sources[2] : (process.sources[0] || "Fuente 3");

    return mockReglas.map(r => {
      let f = r.fuente;
      if (typeof f === 'string') {
        if (f === "Banco" || f === "Extracto Bancario" || f === "Cash Pagos") f = s1;
        else if (f === "Municipio" || f === "Cobros ERP" || f === "Cuenta 2056" || f === "Input") f = s2;
        else if (f === "Banred" || f === "Portal Empresas") f = s3;
        else f = s1;
      } else if (Array.isArray(f)) {
        f = f.map(x => {
          if (x === "Banco" || x === "Extracto Bancario" || x === "Cash Pagos") return s1;
          if (x === "Municipio" || x === "Cobros ERP" || x === "Cuenta 2056" || x === "Input") return s2;
          if (x === "Banred" || x === "Portal Empresas") return s3;
          return s1;
        });
      }
      return { ...r, fuente: f };
    });
  });
  const [editedBlocks, setEditedBlocks] = useState<Set<TipoRegla>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegla, setEditingRegla] = useState<ReglaPreparacion | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<ReglaPreparacion | null>(null);
  const [currentRuleType, setCurrentRuleType] = useState<TipoRegla>("Validación");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"Todas" | "Activas" | "Inactivas" | "Incompletas" | "Con error">("Todas");
  const [groupBySource, setGroupBySource] = useState(false);
  const [unpublishedRuleIds, setUnpublishedRuleIds] = useState<Set<string>>(new Set());
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const [isCreatingDestino, setIsCreatingDestino] = useState(false);
  const [newDestinoState, setNewDestinoState] = useState({ id: '', type: 'Texto', label: '' });

  const getAvailableFieldsList = (fuenteFiltro?: string | string[]) => {
    const baseFields: { id: string; source: string; type: string; fuenteApp?: string | string[]; orden?: number }[] = [
      { id: "monto", source: "Fuente", type: "base" },
      { id: "fecha_transaccion", source: "Fuente", type: "base" },
      { id: "referencia", source: "Fuente", type: "base" },
      { id: "id_cliente", source: "Fuente", type: "base" },
      { id: "estado", source: "Fuente", type: "base" },
      { id: "fecha_valor", source: "Fuente", type: "base" },
      { id: "concepto", source: "Fuente", type: "base" },
      { id: "comision", source: "Fuente", type: "base" },
      { id: "nombre", source: "Fuente", type: "base" },
    ];
    
    const normalizedFields = new Set<string>();
    for (const r of reglas) {
      if (editingRegla && r.id === editingRegla.id) break;
      if (r.tipo === 'Normalización' && r.activa && isRuleComplete(r)) {
        if (Array.isArray(r.campo)) r.campo.forEach(c => normalizedFields.add(c));
        else if (r.campo) r.campo.split(',').map(s=>s.trim()).forEach(c => normalizedFields.add(c));
      }
    }

    baseFields.forEach(f => {
      if (normalizedFields.has(f.id)) {
        f.source = "Fuente normalizada";
        f.type = "normalizado";
      }
    });

    const derivedFields: { id: string, source: string, type: string, fuenteApp?: string | string[], orden?: number }[] = [];
    
    // Sort rules by order first to ensure proper step numbering
    const sortedTransformations = [...reglas].filter(r => r.tipo === 'Transformación' && r.activa && isRuleComplete(r)).sort((a, b) => (a.orden || 1) - (b.orden || 1));
    
    // Counter for steps based on source
    const stepsBySource: Record<string, number> = {};

    for (const r of sortedTransformations) {
      if (editingRegla && r.id === editingRegla.id) break;
      
      const sourceKey = Array.isArray(r.fuente) ? r.fuente.join(',') : (r.fuente || 'default');
      stepsBySource[sourceKey] = (stepsBySource[sourceKey] || 0) + 1;
      const step = stepsBySource[sourceKey];

      if (r.campoDestino) {
        if (Array.isArray(r.campoDestino)) {
          r.campoDestino.forEach(c => derivedFields.push({ id: c, source: r.nombre, type: "derivado", fuenteApp: r.fuente, orden: step }));
        } else {
          derivedFields.push({ id: r.campoDestino, source: r.nombre, type: "derivado", fuenteApp: r.fuente, orden: step });
        }
      }
    }
    
    let deduplicated: { id: string; source: string; type: string; fuenteApp?: string | string[]; orden?: number }[] = [...baseFields];
    for (const d of derivedFields) {
      if (!deduplicated.find(f => f.id === d.id)) deduplicated.push(d);
    }
    
    // Solo mostramos campos base para todas las fuentes (mock)
    // Pero si un campo es extra, lo filtramos por la fuente
    if (fuenteFiltro && !Array.isArray(fuenteFiltro) && fuenteFiltro !== "") {
      deduplicated = deduplicated.filter(f => f.type !== "derivado" || f.fuenteApp === fuenteFiltro || (Array.isArray(f.fuenteApp) && f.fuenteApp.includes(fuenteFiltro)));
    }
    return deduplicated;
  };

  const renderCampoOrigen = (multiple: boolean = false) => {
    const fields = getAvailableFieldsList(formData.fuente);
    if (multiple) {
      const selectedFields = Array.isArray(formData.campo) ? formData.campo : (typeof formData.campo === 'string' && formData.campo ? formData.campo.split(',').map(s=>s.trim()) : []);
      
      const handleFieldSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val && !selectedFields.includes(val)) {
           setFormData({...formData, campo: [...selectedFields, val]});
        }
        e.target.value = ""; // reset
      };
      
      const handleRemoveField = (f: string) => {
        setFormData({...formData, campo: selectedFields.filter(x => x !== f)});
      };

      return (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Campos origen <span className="text-rose-500">*</span></label>
          <div className="flex flex-col gap-3">
            {selectedFields.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFields.map(f => {
                   const fDef = fields.find(x => x.id === f);
                   return (
                     <div key={f} className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20 text-sm">
                       <span className="font-medium">{f}</span>
                       <span className={`text-[10px] ${fDef?.type === 'derivado' ? 'text-amber-600' : fDef?.type === 'normalizado' ? 'text-blue-600' : 'text-slate-500'}`}>
                         ({fDef ? (fDef.type === 'derivado' ? 'Derivado' : fDef.source) : 'Desconocido'})
                       </span>
                       <button type="button" onClick={() => handleRemoveField(f)} className="hover:text-primary/70 ml-1">
                         <X size={14} />
                       </button>
                     </div>
                   );
                })}
              </div>
            )}
            <div className="relative">
              <FieldSelect
                value=""
                onChange={(val) => {
                  if (val && !selectedFields.includes(val)) {
                    setFormData({...formData, campo: [...selectedFields, val]});
                  }
                }}
                options={fields.filter(f => !selectedFields.includes(f.id)).map(f => ({
                  value: f.id,
                  label: f.id,
                  type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente'
                }))}
                hasError={selectedFields.length === 0}
                placeholder="Añadir campo..."
              />
            </div>
          </div>
        </div>
      );
    }

    const disabledEmpty = !formData.fuente || formData.fuente.length === 0;

    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Campo origen <span className="text-rose-500">*</span></label>
        <div className="relative">
          <FieldSelect
            value={Array.isArray(formData.campo) ? formData.campo[0] || "" : formData.campo || ""}
            onChange={(val) => setFormData({...formData, campo: val})}
            options={fields.map(f => ({
              value: f.id,
              label: f.id,
              type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente'
            }))}
            disabled={disabledEmpty}
            hasError={!formData.campo || formData.campo.length === 0}
            placeholder={disabledEmpty ? "Selecciona una fuente primero" : "Seleccione un campo..."}
          />
        </div>
      </div>
    );
  };

  const renderCampoDestino = (multiple: boolean = false) => {
    const allFields = getAvailableFieldsList();
    const derivedFields = allFields.filter(f => f.type === 'derivado');

    if (multiple) {
      const selected = Array.isArray(formData.campoDestino) ? formData.campoDestino : (formData.campoDestino ? (formData.campoDestino as string).split(',').map(s=>s.trim()) : []);
      
      const handleAddMultiple = () => {
        if (newDestinoState.id) {
          if (!selected.includes(newDestinoState.id)) {
             setFormData({...formData, campoDestino: [...selected, newDestinoState.id]});
          }
          setIsCreatingDestino(false);
          setNewDestinoState({ id: '', type: 'Texto', label: '' });
        }
      };
      
      const handleRemoveMultiple = (f: string) => {
          setFormData({...formData, campoDestino: selected.filter(x => x !== f)});
      };

      return (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Campos Destino <span className="text-rose-500">*</span>
              </h5>
              {!isCreatingDestino && (
                <button type="button" onClick={() => setIsCreatingDestino(true)} className="text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 bg-primary/5 px-2 py-1 rounded">
                  <Plus size={14} /> Añadir campo nuevo
                </button>
              )}
            </div>
            
            {selected.length > 0 && !isCreatingDestino && (
              <div className="flex flex-wrap gap-2 mt-1">
                {selected.map(f => (
                  <div key={f} className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-lg text-[13px] font-medium shadow-sm">
                    {f}
                    <button type="button" onClick={() => handleRemoveMultiple(f)} className="hover:text-rose-500 transition-colors ml-1">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {isCreatingDestino ? (
              <div className="bg-white border text-sm border-primary/20 rounded-lg p-4 space-y-3 mt-2 shadow-sm">
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1">Nombre técnico (ID) <span className="text-rose-500">*</span></label>
                  <input type="text" value={newDestinoState.id} onChange={e => setNewDestinoState({...newDestinoState, id: e.target.value.toLowerCase().replace(/\s+/g, '_')})} placeholder="Ej. orden_extraida" className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-slate-700 mb-1">Tipo de dato</label>
                    <select value={newDestinoState.type} onChange={e => setNewDestinoState({...newDestinoState, type: e.target.value})} className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                      <option value="Texto">Texto</option>
                      <option value="Número">Número</option>
                      <option value="Fecha">Fecha</option>
                      <option value="Booleano">Booleano</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-700 mb-1">Etiqueta visible</label>
                    <input type="text" value={newDestinoState.label} onChange={e => setNewDestinoState({...newDestinoState, label: e.target.value})} placeholder="Ej. Orden extraída" className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2">
                  <button type="button" onClick={handleAddMultiple} disabled={!newDestinoState.id} className="px-3 py-1.5 bg-primary text-white text-[12px] font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-50">
                    Guardar y añadir
                  </button>
                  <button type="button" onClick={() => setIsCreatingDestino(false)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[12px] font-medium rounded hover:bg-slate-200 transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative mt-2">
                <FieldSelect
                  value=""
                  onChange={(val) => {
                    if (val === '__crear_nuevo__') {
                      setIsCreatingDestino(true);
                    } else if (val && !selected.includes(val)) {
                      setFormData({...formData, campoDestino: [...selected, val]});
                    }
                  }}
                  options={[
                    { value: "__crear_nuevo__", label: "+ Crear nuevo campo", type: "" },
                    ...derivedFields.filter(f => !selected.includes(f.id)).map(f => ({
                      value: f.id,
                      label: f.id,
                      type: 'Derivado'
                    }))
                  ]}
                  hasError={selected.length === 0}
                  placeholder="Seleccionar del listado (si existe)..."
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            Campos Destino <span className="text-rose-500">*</span>
          </h5>
          {!isCreatingDestino && (
            <button type="button" onClick={() => setIsCreatingDestino(true)} className="text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 bg-primary/5 px-2 py-1 rounded">
              <Plus size={14} /> Crear campo nuevo
            </button>
          )}
        </div>
        
        {isCreatingDestino ? (
          <div className="bg-white border text-sm border-primary/20 rounded-lg p-4 space-y-3 shadow-sm">
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1">Nombre técnico (ID) <span className="text-rose-500">*</span></label>
              <input type="text" value={formData.campoDestino as string || ""} onChange={e => setFormData({...formData, campoDestino: e.target.value.toLowerCase().replace(/\s+/g, '_')})} placeholder="Ej. orden_extraida" className={`w-full px-2.5 py-1.5 border rounded focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none ${getFieldErrorClass(!formData.campoDestino) || 'border-slate-300'}`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1">Tipo de dato <span className="text-rose-500">*</span></label>
                <select value={formData.campoDestinoTipoDato || "Texto"} onChange={e => setFormData({...formData, campoDestinoTipoDato: e.target.value})} className={`w-full px-2.5 py-1.5 border rounded focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none bg-white ${getFieldErrorClass(!formData.campoDestinoTipoDato) || 'border-slate-300'}`}>
                  <option value="Texto">Texto</option>
                  <option value="Número">Número</option>
                  <option value="Entero">Entero</option>
                  <option value="Decimal">Decimal</option>
                  <option value="Fecha">Fecha</option>
                  <option value="Booleano">Booleano</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1">Etiqueta visible</label>
                <input type="text" value={formData.campoDestinoEtiqueta || ""} onChange={e => setFormData({...formData, campoDestinoEtiqueta: e.target.value})} placeholder="Ej. Orden extraída" className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1">Descripción (Opcional)</label>
              <input type="text" value={formData.campoDestinoDesc || ""} onChange={e => setFormData({...formData, campoDestinoDesc: e.target.value})} placeholder="Breve explicación" className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2">
              <button type="button" onClick={() => setIsCreatingDestino(false)} className="px-3 py-1.5 bg-primary text-white text-[12px] font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={!formData.campoDestino}>
                Guardar campo
              </button>
              <button type="button" onClick={() => {
                setIsCreatingDestino(false);
                setFormData({
                  ...formData, 
                  campoDestino: '', 
                  campoDestinoTipoDato: '', 
                  campoDestinoEtiqueta: '', 
                  campoDestinoDesc: ''
                });
              }} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[12px] font-medium rounded hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative">
              <FieldSelect
                value={(formData.campoDestino as string) || ""}
                onChange={(val) => {
                  if (val === '__crear_nuevo__') {
                    setIsCreatingDestino(true);
                    setFormData({...formData, campoDestino: ''});
                  } else {
                    setFormData({...formData, campoDestino: val});
                  }
                }}
                options={[
                  { value: "__crear_nuevo__", label: "+ Crear nuevo campo", type: "" },
                  ...derivedFields.map(f => ({ value: f.id, label: f.id, type: 'Derivado' })),
                  ...(formData.campoDestino && !derivedFields.find(f => f.id === formData.campoDestino) && formData.campoDestino !== '__crear_nuevo__' 
                    ? [{ value: formData.campoDestino as string, label: formData.campoDestino as string, type: 'Derivado' }] 
                    : [])
                ]}
                hasError={!formData.campoDestino || formData.campoDestino.length === 0}
                placeholder="Seleccionar del listado (si existe)..."
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const isRuleComplete = (r: Partial<ReglaPreparacion>) => {
    if (!r.nombre) return false;
    
    if (r.tipo === 'Transformación') {
      if (!r.subTipo) return false;

      // Almost all need a source except maybe some generalized ones, but let's assume they all need at least a source configured
      if (!r.fuente || r.fuente.length === 0) return false;

      switch (r.subTipo as TransformationType) {
        case "Extraer valor de un campo":
          if (!r.campo || r.campo.length === 0) return false;
          if (!r.metodoExtraccion) return false;
          if (r.metodoExtraccion === 'Por posición fija') {
            if (!r.posicionInicial || Number(r.posicionInicial) <= 0 || !r.longitud || Number(r.longitud) <= 0) return false;
          }
          if (r.metodoExtraccion === 'Por delimitador') {
            if (!r.delimitador || !r.segmentoAExtraer) return false;
            if (r.segmentoAExtraer === 'Número de segmento específico' && (!r.numeroSegmento || Number(r.numeroSegmento) <= 0)) return false;
          }
          if (r.metodoExtraccion === 'Antes de un texto' || r.metodoExtraccion === 'Después de un texto') {
             if (!r.textoReferencia) return false;
          }
          if (r.metodoExtraccion === 'Por patrón') {
             if (!r.patronExtraccion) return false;
          }
          if (!r.campoDestino || r.campoDestino.length === 0) return false;
          break;
    case "Separar campo en varios campos":
      if (!r.campo || r.campo.length === 0) return false;
      if (!r.metodoSeparacion) return false;
      if (r.metodoSeparacion === 'Por delimitador' && !r.delimitador) return false;
      if (r.metodoSeparacion === 'Por posición fija' && !r.longitudesFragmentos) return false;
      if (!r.campoDestino || r.campoDestino.length === 0) return false;
      break;
        case "Unir campos":
          if (!r.campo || r.campo.length === 0) return false;
          if (r.separador === undefined) return false;
          if (!r.campoDestino || r.campoDestino.length === 0) return false;
          break;
        case "Crear campo calculado":
          if (!r.campo || r.campo.length === 0) return false;
          if (!r.operadorCalculo) return false;
          if (!r.campoDestino || r.campoDestino.length === 0) return false;
          break;
        case "Ajustar signo o naturaleza del monto":
          if (!r.campo || r.campo.length === 0) return false;
          if (!r.criterioAjuste) return false;
          if (!r.campoDestino || r.campoDestino.length === 0) return false;
          break;
        case "Clasificar registros":
          if (!r.valorAsignado) return false;
          if (!r.campoDestino || r.campoDestino.length === 0) return false;
          if (!r.campo || !r.operadorCondicion) return false;
          if (['Igual a', 'Diferente de', 'Contiene', 'No contiene', 'Mayor que', 'Menor que'].includes(r.operadorCondicion) && !r.valorCondicion) return false;
          if (r.operadorCondicion === 'Entre rango' && (!r.valorCondicionMin || !r.valorCondicionMax)) return false;
          break;
        case "Derivar fecha":
          if (!r.baseFecha) return false;
          if (r.baseFecha === 'Campo fecha' && (!r.campo || r.campo.length === 0)) return false;
          if (!r.reglaDerivacionFecha) return false;
          if ((r.reglaDerivacionFecha === 'Sumar días' || r.reglaDerivacionFecha === 'Restar días') && !r.cantidadDias) return false;
          if (!r.campoDestino || r.campoDestino.length === 0) return false;
          break;
        case "Excluir registros del cruce":
          if (!r.motivoExclusion) return false;
          if (!r.campo || !r.operadorCondicion) return false;
          if (['Igual a', 'Diferente de', 'Contiene', 'No contiene', 'Mayor que', 'Menor que'].includes(r.operadorCondicion) && !r.valorCondicion) return false;
          if (r.operadorCondicion === 'Entre rango' && (!r.valorCondicionMin || !r.valorCondicionMax)) return false;
          break;
        default:
          return false;
      }
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
    subTipo: "",
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

  const handleMoveRule = (id: string, direction: 'up' | 'down') => {
    setReglas(currentRules => {
      const idx = currentRules.findIndex(r => r.id === id);
      if (idx === -1) return currentRules;
      if (direction === 'up' && idx === 0) return currentRules;
      if (direction === 'down' && idx === currentRules.length - 1) return currentRules;
      
      const newIndex = direction === 'up' ? idx - 1 : idx + 1;
      const newRules = [...currentRules];
      const temp = newRules[idx];
      newRules[idx] = newRules[newIndex];
      newRules[newIndex] = temp;
      
      const updatedSet = new Set(unpublishedRuleIds);
      updatedSet.add(temp.id);
      updatedSet.add(newRules[idx].id);
      setUnpublishedRuleIds(updatedSet);
      
      const editedSet = new Set(editedBlocks);
      editedSet.add(temp.tipo);
      setEditedBlocks(editedSet);
      onChange();
      
      return newRules;
    });
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
      subTipo: "",
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
        return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-widest"><CheckCircle2 size={10} /> Completo</span>;
      case "Incompleto":
        return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-widest"><AlertTriangle size={10} /> Incompleto</span>;
      case "Requiere revisión":
        return <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 uppercase tracking-widest"><AlertCircle size={10} /> Revisión</span>;
      case "Sin configurar":
      default:
        return <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest">Sin configurar</span>;
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
      if (regla.tipo === 'Transformación') {
        if (regla.subTipo === 'Excluir registros del cruce' || regla.subTipo === 'Clasificar registros') {
          return regla.campo ? (Array.isArray(regla.campo) ? regla.campo[0] : regla.campo) : 'Registros específicos';
        }
        if (regla.subTipo === 'Derivar fecha') {
          return regla.baseFecha === 'Campo fecha' && regla.campo ? (Array.isArray(regla.campo) ? regla.campo[0] : regla.campo) : (regla.baseFecha || 'Fecha');
        }
      }
      if (regla.subTipo === 'Estructura requerida' || regla.subTipo === 'Cantidad mínima de registros') {
        return 'Fuente completa';
      }
      if (Array.isArray(regla.campo)) {
        if (regla.tipo === 'Transformación' && regla.subTipo === 'Crear campo calculado' && regla.operadorCalculo) {
          const ops: Record<string, string> = {"Suma": "+", "Resta": "-", "Multiplicación": "x", "División": "÷", "Diferencia absoluta": "diff"};
          const op = ops[regla.operadorCalculo] || '+';
          return regla.campo.join(` ${op} `);
        }
        return regla.campo.join(' + ');
      }
      return regla.campo || 'Fuente completa';
    };

    const getCondicionResumida = (regla: ReglaPreparacion) => {
      if (regla.tipo === 'Transformación') {
        const d = (c: any) => Array.isArray(c) ? c.join(', ') : c;
        
        switch (regla.subTipo as TransformationType) {
          case 'Extraer valor de un campo':
            return `extraer ${regla.metodoExtraccion} a ${d(regla.campoDestino)}`;
          case 'Separar campo en varios campos':
            const dMult = Array.isArray(regla.campoDestino) ? regla.campoDestino.join(' y ') : (regla.campoDestino || '[destino]');
            if (regla.metodoSeparacion === 'Por delimitador') return `separar por ${regla.delimitador || 'delimitador'} a ${dMult}`;
            return `separar a ${dMult}`;
          case 'Unir campos':
            return `unir a ${d(regla.campoDestino)}`;
          case 'Crear campo calculado':
            return `calcular ${d(regla.campoDestino)} (${regla.tipoCalculo})`;
          case 'Ajustar signo o naturaleza del monto':
            return `ajustar signo a ${d(regla.campoDestino)}`;
          case 'Clasificar registros':
            const eqC = regla.operadorCondicion === 'Entre rango' ? `entre ${regla.valorCondicionMin} y ${regla.valorCondicionMax}` : `${regla.operadorCondicion} ${regla.valorCondicion || ''}`.trim();
            return `clasificar como ${regla.valorAsignado} a ${d(regla.campoDestino)}`;
          case 'Derivar fecha':
            const baseD = regla.baseFecha === 'Campo fecha' ? d(regla.campo) : regla.baseFecha;
            const resD = regla.reglaDerivacionFecha === 'Sumar días' ? `sumando ${regla.cantidadDias} días a ${baseD}` : 
                         regla.reglaDerivacionFecha === 'Restar días' ? `restando ${regla.cantidadDias} días a ${baseD}` :
                         `en base a ${baseD} (${regla.reglaDerivacionFecha})`;
            return `derivar a ${d(regla.campoDestino)} ${resD}`;
          case 'Excluir registros del cruce':
            const eqE = regla.operadorCondicion === 'Entre rango' ? `entre ${regla.valorCondicionMin} y ${regla.valorCondicionMax}` : `${regla.operadorCondicion} ${regla.valorCondicion || ''}`.trim();
            return `excluir si ${d(regla.campo)} es ${eqE} (Motivo: ${regla.motivoExclusion})`;
        }
        return regla.accion || regla.subTipo || 'transformación';
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

    const groupedRules: Record<string, ReglaPreparacion[]> = groupBySource 
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
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className={`text-[13.5px] font-semibold truncate flex items-center gap-2 ${regla.activa ? 'text-slate-800' : 'text-slate-400'}`}>
                          {unpublishedRuleIds.has(regla.id) && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Cambios sin publicar" />
                          )}
                          {regla.nombre || "Validación sin nombre"}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {regla.activa ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100">
                              Activa
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                              Inactiva
                            </span>
                          )}
                          {(!isRuleComplete(regla)) && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                              Incompleta
                            </span>
                          )}
                          {regla.dependenciaInactiva && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100" title="Depende de regla inactiva o incompleta">
                              <AlertTriangle size={10} />
                              Error de configuración
                            </span>
                          )}
                          {regla.tipo === 'Validación' && regla.nivel === 'Fuerte' && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">
                              <ShieldAlert size={10} />
                              Bloqueante
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
                      {regla.tipo === 'Transformación' && !groupBySource && !searchQuery && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleMoveRule(regla.id, 'up'); }}
                            className="p-1.5 rounded-md transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            title="Mover arriba"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleMoveRule(regla.id, 'down'); }}
                            className="p-1.5 rounded-md transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            title="Mover abajo"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <div className="w-px h-5 bg-slate-200 mx-1" />
                        </>
                      )}
                      {regla.tipo === 'Normalización' && (
                        <>
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
                          <div className="w-px h-5 bg-slate-200 mx-1" />
                        </>
                      )}
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
                              {(() => {
                                if (!regla.activa) {
                                  return (
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                                      Inactiva
                                    </span>
                                  );
                                }
                                return (
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100">
                                    Activa
                                  </span>
                                );
                              })()}
                              {(!isRuleComplete(regla)) && (
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                                  Incompleta
                                </span>
                              )}
                              {(regla.dependenciaInactiva) && (
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100" title="Depende de regla inactiva o incompleta">
                                  <AlertTriangle size={10} />
                                  Error de configuración
                                </span>
                              )}
                              {regla.tipo === 'Validación' && regla.nivel === "Fuerte" && (
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">
                                  <ShieldAlert size={10} />
                                  Bloqueante
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
                              onClick={(e) => {
                                e.stopPropagation();
                                const newReglas = reglas.map((r) => r.id === regla.id ? { ...r, activa: !r.activa } : r);
                                setReglas(newReglas);
                                setEditedBlocks(prev => new Set(prev).add(regla.tipo));
                                onChange();
                              }}
                              className={`p-1.5 rounded-md transition-colors ${regla.activa ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'}`}
                              title={regla.activa ? 'Desactivar regla' : 'Activar regla'}
                            >
                              <Power size={14} strokeWidth={regla.activa ? 2.5 : 2} />
                            </button>
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
      desc: "Revisa condiciones mínimas antes de procesar los datos."
    },
    {
      id: "Normalización" as TipoRegla,
      num: "2",
      icon: Settings2,
      iconClasses: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100",
      title: "Normalizaciones",
      desc: "Estandariza formatos y valores sin cambiar su significado."
    },
    {
      id: "Transformación" as TipoRegla,
      num: "3",
      icon: Wand2,
      iconClasses: "bg-violet-50 text-violet-600 border-violet-100 group-hover:bg-violet-100",
      title: "Transformaciones",
      desc: "Genera campos derivados o estructuras necesarias para conciliar."
    },
    {
      id: "Control de consistencia" as TipoRegla,
      num: "4",
      icon: AlertTriangle,
      iconClasses: "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100",
      title: "Controles de consistencia",
      desc: "Verifica coherencia del conjunto de datos antes del cruce."
    }
  ];

  if (isPreviewModalOpen) {
    return (
      <PreviewTestModal
        onClose={() => setIsPreviewModalOpen(false)}
        reglas={reglas}
      />
    );
  }

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
            <div className="space-y-4">
              {stepsConfig.map((step, index) => {
                const stats = getSectionStats(step.id);
                
                return (
                  <div key={step.id}>
                    {index > 0 && (
                      <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
                        <div className="bg-slate-50 border border-slate-200 rounded-full p-1 shadow-sm">
                          <ArrowDown size={14} className="text-slate-400" />
                        </div>
                      </div>
                    )}
                    <div 
                      onClick={() => openSection(step.id)}
                      className="group relative cursor-pointer flex items-center z-0"
                    >
                      <div className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-primary/30">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-2.5 rounded-xl border transition-all duration-300 shrink-0 ${step.iconClasses}`}>
                            <step.icon size={20} />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-0.5">
                              <h4 className="text-[15px] font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                                {step.title}
                              </h4>
                              {renderStatusBadge(stats.status)}
                            </div>
                            <p className="text-[13px] text-slate-500 line-clamp-1 mb-1.5">
                              {step.desc}
                            </p>
                            
                            {/* Metrics Line */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <Layers size={13} className="text-slate-400" />
                                <span className="text-[11px] font-semibold text-slate-600">
                                  {stats.total === 0 
                                    ? `Sin ${step.id === 'Validación' ? 'validaciones' : step.id === 'Normalización' ? 'normalizaciones' : 'transformaciones'}`
                                    : (stats.total === 1 ? `1 ${step.id === 'Validación' ? 'validación' : step.id === 'Normalización' ? 'normalización' : 'transformación'}` : `${stats.total} ${step.id === 'Validación' ? 'validaciones' : step.id === 'Normalización' ? 'normalizaciones' : 'transformaciones'}`)}
                                </span>
                              </div>
                              {stats.total > 0 && (
                                <>
                                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={13} className="text-slate-400" />
                                    <span className="text-[11px] font-semibold text-slate-500">
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
                                    <span className="text-[11px] font-semibold text-slate-500">
                                      {stats.blocking === 1 ? '1 con bloqueo' : `${stats.blocking} con bloqueo`}
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
                          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300 hidden sm:block">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Block 4: Vista previa / Prueba */}
              <div>
                <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
                  <div className="bg-slate-50 border border-slate-200 rounded-full p-1 shadow-sm">
                    <ArrowDown size={14} className="text-slate-400" />
                  </div>
                </div>
                <div className="relative flex items-center w-full z-0">                
                  <div className="flex-1 bg-slate-800 transition-all rounded-2xl shadow-sm hover:shadow-md border border-slate-700">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white shrink-0">
                            <Eye size={20} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                              <h4 className="text-[15px] font-bold text-white tracking-tight">
                                Vista previa y prueba
                              </h4>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/10 uppercase tracking-widest">
                                No probado
                              </span>
                            </div>
                            <p className="text-[13px] text-slate-400 line-clamp-1 mb-1.5">
                              Aplica las reglas sobre una muestra para revisar el resultado.
                            </p>
                          </div>
                        </div>
                        
                        <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-2 shrink-0 md:pl-4 pt-3 md:pt-0">
                          <button 
                            onClick={() => setIsPreviewModalOpen(true)}
                            className="flex items-center justify-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[13px] font-bold rounded-lg shadow-sm transition-colors group"
                          >
                            <PlayCircle size={16} className="text-white/70 group-hover:text-white transition-colors" />
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
                        <div className="shrink-0 flex flex-col justify-end w-full sm:w-auto">
                          <button 
                            onClick={() => setFormData({...formData, activa: !formData.activa})}
                            className={`flex items-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition-all w-full sm:w-auto justify-center h-[38px] ${
                              formData.activa 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm' 
                              : 'bg-stone-50 border-stone-200 text-stone-600'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${formData.activa ? 'bg-emerald-500' : 'bg-stone-400'}`} />
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
                          placeholder={currentRuleType === 'Transformación' ? "Define cómo se generará o preparará un dato para la conciliación." : "Explica brevemente qué hace esta regla..."}
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
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Fuente de aplicación <span className="text-rose-500">*</span></label>
                        <select 
                          value={Array.isArray(formData.fuente) ? 'Multi' : formData.fuente}
                          onChange={(e) => setFormData({...formData, fuente: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.fuente)}`}
                        >
                          <option value="">Selecciona una fuente</option>
                          {process.sources.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {currentRuleType === 'Validación' ? 'Tipo de validación' : currentRuleType === 'Transformación' ? 'Operación de transformación' : currentRuleType === 'Control de consistencia' ? 'Operación de control' : 'Operación de normalización'} <span className="text-rose-500">*</span>
                        </label>
                        <select 
                          value={formData.subTipo || ""}
                          onChange={(e) => {
                            const newSubTipo = e.target.value as any;
                            // Limpiar dependencias
                            setFormData({
                              ...formData,
                              subTipo: newSubTipo,
                              campo: newSubTipo === 'Unir campos' ? [] : "", 
                              campoDestino: newSubTipo === 'Separar campo en varios campos' ? [] : "",
                              patronExtraccion: "",
                              metodoExtraccion: "",
                              metodoSeparacion: "",
                              delimitador: "",
                              separador: "",
                              textoReferencia: "",
                              criterioAjusteSigno: "",
                              campoIndicador: "",
                              equivalenciasSigno: [],
                              campoARestar: "",
                              campoOperador: "",
                              primerCampo: "",
                              segundoCampo: "",
                              operacionConstante: "Sumar",
                              valorConstanteCalculo: "",
                              tipoCalculo: "",
                              valorAsignado: "",
                              condicionClasificacion: "",
                              motivoExclusion: "",
                              condicionExclusion: "",
                              reglaDerivacionFecha: "",
                            });
                            setIsCreatingDestino(false);
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.subTipo)}`}
                        >
                          <option value="">Seleccione una operación</option>
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
                          ) : currentRuleType === 'Transformación' ? (
                            <>
                              <option value="Extraer valor de un campo">Extraer valor de un campo</option>
                              <option value="Separar campo en varios campos">Separar campo en varios campos</option>
                              <option value="Unir campos">Unir campos</option>
                              <option value="Crear campo calculado">Crear campo calculado</option>
                              <option value="Ajustar signo o naturaleza del monto">Ajustar signo o naturaleza del monto</option>
                              <option value="Clasificar registros">Clasificar registros</option>
                              <option value="Derivar fecha">Derivar fecha</option>
                              <option value="Excluir registros del cruce">Excluir registros del cruce</option>
                            </>
                          ) : (
                            <>
                              <option value="Suma contra valor de control">Suma contra valor de control</option>
                              <option value="Conteo de registros">Conteo de registros</option>
                              <option value="Comparación de totales entre fuentes">Comparación de totales entre fuentes</option>
                            </>
                          )}
                        </select>
                      </div>

                      {!(currentRuleType === 'Control de consistencia' || currentRuleType === 'Transformación' || (currentRuleType === 'Validación' && (formData.subTipo === "Estructura requerida" || formData.subTipo === "Cantidad mínima de registros"))) && (
                        <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            {currentRuleType === 'Validación' && formData.subTipo === 'Duplicidad' ? 'Campos asociados' : 'Campo asociado'} <span className="text-rose-500">*</span>
                          </label>
                          <div className="mt-2">
                            {currentRuleType === 'Validación' && formData.subTipo === 'Duplicidad' ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {getAvailableFieldsList().map(field => {
                                  let c = field.id;
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
                                      {field.type === 'derivado' && <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Derivado</span>}
                                    </label>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="relative">
                                <FieldSelect
                                  value={Array.isArray(formData.campo) ? formData.campo[0] || "" : formData.campo || ""}
                                  onChange={val => setFormData({...formData, campo: val})}
                                  options={getAvailableFieldsList().map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                                  hasError={!formData.campo || formData.campo.length === 0}
                                  placeholder="Seleccione un campo..."
                                />
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
                    <div className="w-full h-px bg-slate-100 mt-6 mb-6" />
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Settings2 size={16} className="text-primary" />
                        <h4 className="text-[14px] font-bold uppercase tracking-wider">Parámetros de la Operación</h4>
                      </div>
                      <div className="space-y-4 animate-in fade-in duration-300">
                        {formData.subTipo === 'Extraer valor de un campo' && (
                          <div className="space-y-4">
                            {renderCampoOrigen(false)}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Método de extracción <span className="text-rose-500">*</span></label>
                              <div className="relative">
                                <select value={formData.metodoExtraccion || ""} onChange={e => setFormData({...formData, metodoExtraccion: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.metodoExtraccion) || 'border-slate-300'}`}>
                                  <option value="">Selecciona método</option>
                                  <option value="Por posición fija">Por posición fija</option>
                                  <option value="Por delimitador">Por delimitador</option>
                                  <option value="Antes de un texto">Antes de un texto</option>
                                  <option value="Después de un texto">Después de un texto</option>
                                  <option value="Por patrón">Por patrón (Regex)</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              </div>
                            </div>
                            {formData.metodoExtraccion === 'Por posición fija' && (
                              <div className="flex flex-wrap gap-4">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Posición inicial <span className="text-rose-500">*</span></label>
                                  <input type="number" min="1" value={formData.posicionInicial || ""} onChange={e => setFormData({...formData, posicionInicial: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.posicionInicial || Number(formData.posicionInicial) <= 0) || 'border-slate-300'}`} placeholder="Ej. 1" />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cantidad de caracteres <span className="text-rose-500">*</span></label>
                                  <input type="number" min="1" value={formData.longitud || ""} onChange={e => setFormData({...formData, longitud: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.longitud || Number(formData.longitud) <= 0) || 'border-slate-300'}`} placeholder="Ej. 10" />
                                </div>
                              </div>
                            )}
                            {formData.metodoExtraccion === 'Por delimitador' && (
                              <div className="flex flex-wrap items-end gap-4">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Delimitador <span className="text-rose-500">*</span></label>
                                  <input type="text" value={formData.delimitador || ""} onChange={e => setFormData({...formData, delimitador: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.delimitador) || 'border-slate-300'}`} placeholder="Ej. -" />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Segmento a extraer <span className="text-rose-500">*</span></label>
                                  <div className="relative">
                                    <select value={formData.segmentoAExtraer || ""} onChange={e => setFormData({...formData, segmentoAExtraer: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.segmentoAExtraer) || 'border-slate-300'}`}>
                                      <option value="">Selecciona segmento</option>
                                      <option value="Primer segmento">Primer segmento</option>
                                      <option value="Segundo segmento">Segundo segmento</option>
                                      <option value="Último segmento">Último segmento</option>
                                      <option value="Número de segmento específico">Número de segmento específico</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                  </div>
                                </div>
                                {formData.segmentoAExtraer === 'Número de segmento específico' && (
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Número de segmento <span className="text-rose-500">*</span></label>
                                    <input type="number" min="1" value={formData.numeroSegmento || ""} onChange={e => setFormData({...formData, numeroSegmento: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.numeroSegmento) || 'border-slate-300'}`} placeholder="Ej. 3" />
                                  </div>
                                )}
                              </div>
                            )}
                            {(formData.metodoExtraccion === 'Antes de un texto' || formData.metodoExtraccion === 'Después de un texto') && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Texto de referencia <span className="text-rose-500">*</span></label>
                                <input type="text" value={formData.textoReferencia || ""} onChange={e => setFormData({...formData, textoReferencia: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.textoReferencia) || 'border-slate-300'}`} placeholder="Ej. Orden Nro: " />
                              </div>
                            )}
                            {formData.metodoExtraccion === 'Por patrón' && (
                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Patrón de extracción (Regex) <span className="text-rose-500">*</span></label>
                                  <input type="text" value={formData.patronExtraccion || ""} onChange={e => setFormData({...formData, patronExtraccion: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm font-mono ${getFieldErrorClass(!formData.patronExtraccion) || 'border-slate-300'}`} placeholder="Ej. \d{4}-\d{2}" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción del patrón (Opcional)</label>
                                  <input type="text" value={formData.descripcionPatron || ""} onChange={e => setFormData({...formData, descripcionPatron: e.target.value})} className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-sm" placeholder="Ej. Extrae el formato 0000-00" />
                                </div>
                              </div>
                            )}
                            {renderCampoDestino(false)}
                          </div>
                        )}

                        {formData.subTipo === 'Separar campo en varios campos' && (
                          <div className="space-y-4">
                            {renderCampoOrigen(false)}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Método de separación <span className="text-rose-500">*</span></label>
                              <div className="relative">
                                <select value={formData.metodoSeparacion || ""} onChange={e => setFormData({...formData, metodoSeparacion: e.target.value, campoDestino: []})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.metodoSeparacion) || 'border-slate-300'}`}>
                                  <option value="">Selecciona método</option>
                                  <option value="Por delimitador">Por delimitador</option>
                                  <option value="Por posición fija">Por posición fija</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              </div>
                            </div>
                            
                            {formData.metodoSeparacion === 'Por delimitador' && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Delimitador <span className="text-rose-500">*</span></label>
                                <input type="text" value={formData.delimitador || ""} onChange={e => setFormData({...formData, delimitador: e.target.value})} placeholder="Ej. -" className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.delimitador) || 'border-slate-300'}`} />
                              </div>
                            )}

                            {formData.metodoSeparacion === 'Por posición fija' && (
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Longitudes de segmentos (separadas por coma) <span className="text-rose-500">*</span></label>
                                <input type="text" value={formData.longitudesFragmentos || ""} onChange={e => setFormData({...formData, longitudesFragmentos: e.target.value})} placeholder="Ej. 4, 2, 8" className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.longitudesFragmentos) || 'border-slate-300'}`} />
                              </div>
                            )}

                            {formData.metodoSeparacion && (
                              <div className="mt-6">
                                {renderCampoDestino(true)}
                              </div>
                            )}
                          </div>
                        )}

                        {formData.subTipo === 'Unir campos' && (
                          <div className="space-y-4">
                            {renderCampoOrigen(true)}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Separador <span className="text-rose-500">*</span></label>
                              <input type="text" value={formData.separador || ""} onChange={e => setFormData({...formData, separador: e.target.value})} placeholder="Ej. - (Deja en blanco para no usar separador)" className={`w-full px-3 py-2 border bg-white rounded-lg text-sm border-slate-300`} />
                            </div>
                            {renderCampoDestino(false)}
                          </div>
                        )}

                        {formData.subTipo === 'Crear campo calculado' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de cálculo <span className="text-rose-500">*</span></label>
                              <div className="relative">
                                <select value={formData.tipoCalculo || ""} onChange={e => setFormData({...formData, tipoCalculo: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.tipoCalculo) || 'border-slate-300'}`}>
                                  <option value="">Selecciona cálculo</option>
                                  <option value="Suma">Suma</option>
                                  <option value="Resta">Resta</option>
                                  <option value="Multiplicación">Multiplicación</option>
                                  <option value="División">División</option>
                                  <option value="Diferencia absoluta">Diferencia absoluta</option>
                                  <option value="Campo más/menos valor constante">Campo más/menos valor constante</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              </div>
                            </div>

                            {formData.tipoCalculo === 'Suma' && (
                              <>
                                {renderCampoOrigen(true)}
                              </>
                            )}

                            {formData.tipoCalculo === 'Resta' && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {renderCampoOrigen(false)}
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Campo a restar <span className="text-rose-500">*</span></label>
                                  <FieldSelect
                                    value={formData.campoARestar || ""}
                                    onChange={val => setFormData({...formData, campoARestar: val})}
                                    options={getAvailableFieldsList(formData.fuente).map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                                    hasError={!formData.campoARestar}
                                    placeholder="Selecciona campo..."
                                  />
                                </div>
                              </div>
                            )}

                            {(formData.tipoCalculo === 'Multiplicación' || formData.tipoCalculo === 'División') && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {renderCampoOrigen(false)}
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Campo operador <span className="text-rose-500">*</span></label>
                                  <FieldSelect
                                    value={formData.campoOperador || ""}
                                    onChange={val => setFormData({...formData, campoOperador: val})}
                                    options={getAvailableFieldsList(formData.fuente).map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                                    hasError={!formData.campoOperador}
                                    placeholder="Selecciona campo..."
                                  />
                                </div>
                              </div>
                            )}

                            {formData.tipoCalculo === 'Diferencia absoluta' && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Primer campo <span className="text-rose-500">*</span></label>
                                  <FieldSelect
                                    value={formData.primerCampo || ""}
                                    onChange={val => setFormData({...formData, primerCampo: val})}
                                    options={getAvailableFieldsList(formData.fuente).map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                                    hasError={!formData.primerCampo}
                                    placeholder="Selecciona campo..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Segundo campo <span className="text-rose-500">*</span></label>
                                  <FieldSelect
                                    value={formData.segundoCampo || ""}
                                    onChange={val => setFormData({...formData, segundoCampo: val})}
                                    options={getAvailableFieldsList(formData.fuente).map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                                    hasError={!formData.segundoCampo}
                                    placeholder="Selecciona campo..."
                                  />
                                </div>
                              </div>
                            )}

                            {formData.tipoCalculo === 'Campo más/menos valor constante' && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {renderCampoOrigen(false)}
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Operación <span className="text-rose-500">*</span></label>
                                  <select value={formData.operacionConstante || ""} onChange={e => setFormData({...formData, operacionConstante: e.target.value})} className={`w-full px-3 py-2 border rounded-lg text-sm bg-white ${getFieldErrorClass(!formData.operacionConstante) || 'border-slate-300'}`}>
                                    <option value="">Selecciona...</option>
                                    <option value="Sumar">Sumar</option>
                                    <option value="Restar">Restar</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Valor constante <span className="text-rose-500">*</span></label>
                                  <input type="number" value={formData.valorConstanteCalculo || ""} onChange={e => setFormData({...formData, valorConstanteCalculo: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.valorConstanteCalculo) || 'border-slate-300'}`} placeholder="Ej. 100" />
                                </div>
                              </div>
                            )}

                            {formData.tipoCalculo === 'División' && (
                              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-[13px] flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>Durante la ejecución, el sistema omitirá o informará con error las divisiones donde el campo operador sea igual a cero.</p>
                              </div>
                            )}
                            
                            {formData.tipoCalculo && renderCampoDestino(false)}
                          </div>
                        )}

                        {formData.subTipo === 'Ajustar signo o naturaleza del monto' && (
                          <div className="space-y-4">
                            {/* Campo monto is represented by campoOrigen(false) */}
                            {renderCampoOrigen(false)}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Criterio de ajuste <span className="text-rose-500">*</span></label>
                              <div className="relative">
                                <select value={formData.criterioAjusteSigno || ""} onChange={e => setFormData({...formData, criterioAjusteSigno: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.criterioAjusteSigno) || 'border-slate-300'}`}>
                                  <option value="">Selecciona criterio</option>
                                  <option value="Invertir signo siempre">Invertir signo siempre</option>
                                  <option value="Convertir a positivo">Convertir a positivo</option>
                                  <option value="Convertir a negativo">Convertir a negativo</option>
                                  <option value="Según campo indicador">Según campo indicador</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              </div>
                            </div>
                            
                            {formData.criterioAjusteSigno === 'Según campo indicador' && (
                              <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Campo indicador <span className="text-rose-500">*</span></label>
                                  <FieldSelect
                                    value={formData.campoIndicador || ""}
                                    onChange={val => setFormData({...formData, campoIndicador: val, equivalenciasSigno: formData.equivalenciasSigno?.length ? formData.equivalenciasSigno : [{valor: '', accion: 'Dejar positivo'}]})}
                                    options={getAvailableFieldsList(formData.fuente).map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                                    hasError={!formData.campoIndicador}
                                    placeholder="Selecciona campo indicador..."
                                  />
                                </div>
                                
                                {formData.campoIndicador && (
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <label className="block text-sm font-medium text-slate-700">Equivalencias</label>
                                      <button onClick={() => setFormData({...formData, equivalenciasSigno: [...(formData.equivalenciasSigno || []), {valor: '', accion: 'Dejar positivo'}]})} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                                        <Plus className="w-3 h-3" /> Agregar
                                      </button>
                                    </div>
                                    <div className="space-y-2">
                                      {(formData.equivalenciasSigno || []).map((eq, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                          <div className="flex-1">
                                            <input type="text" value={eq.valor} onChange={(e) => {
                                              const updated = [...(formData.equivalenciasSigno || [])];
                                              updated[index].valor = e.target.value;
                                              setFormData({...formData, equivalenciasSigno: updated});
                                            }} className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded text-sm outline-none focus:border-primary" placeholder="Valor (ej. D)" />
                                          </div>
                                          <ArrowRight className="w-4 h-4 text-slate-400" />
                                          <div className="flex-1">
                                            <select value={eq.accion} onChange={(e) => {
                                              const updated = [...(formData.equivalenciasSigno || [])];
                                              updated[index].accion = e.target.value;
                                              setFormData({...formData, equivalenciasSigno: updated});
                                            }} className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded text-sm outline-none focus:border-primary">
                                              <option value="Dejar positivo">Dejar positivo</option>
                                              <option value="Convertir a negativo">Convertir a negativo</option>
                                              <option value="Invertir signo">Invertir signo</option>
                                            </select>
                                          </div>
                                          {(formData.equivalenciasSigno || []).length > 1 && (
                                            <button onClick={() => setFormData({...formData, equivalenciasSigno: (formData.equivalenciasSigno || []).filter((_, i) => i !== index)})} className="text-slate-400 hover:text-rose-500 p-1">
                                              <X className="w-4 h-4" />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {renderCampoDestino(false)}
                          </div>
                        )}

                          {formData.subTipo === 'Clasificar registros' && (
                            <div className="space-y-4">
                              {renderCampoOrigen(false)}
                              <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Operador <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                      <select value={formData.operadorCondicion || ""} onChange={e => setFormData({...formData, operadorCondicion: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.operadorCondicion) || 'border-slate-300'}`}>
                                        <option value="">Selecciona operador</option>
                                        <option value="Igual a">Igual a</option>
                                        <option value="Diferente de">Diferente de</option>
                                        <option value="Contiene">Contiene</option>
                                        <option value="No contiene">No contiene</option>
                                        <option value="Mayor que">Mayor que</option>
                                        <option value="Menor que">Menor que</option>
                                        <option value="Entre rango">Entre rango</option>
                                        <option value="Está vacío">Está vacío</option>
                                        <option value="No está vacío">No está vacío</option>
                                      </select>
                                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                  </div>
                                  {!['Está vacío', 'No está vacío', 'Entre rango'].includes(formData.operadorCondicion || '') && (
                                    <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Valor de comparación <span className="text-rose-500">*</span></label>
                                      <input type="text" value={formData.valorCondicion || ""} onChange={e => setFormData({...formData, valorCondicion: e.target.value})} placeholder="Valor..." className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.valorCondicion && ['Igual a', 'Diferente de', 'Contiene', 'No contiene', 'Mayor que', 'Menor que'].includes(formData.operadorCondicion || '')) || 'border-slate-300'}`} />
                                    </div>
                                  )}
                                  {formData.operadorCondicion === 'Entre rango' && (
                                    <div className="flex gap-2">
                                      <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Mínimo <span className="text-rose-500">*</span></label>
                                        <input type="text" value={formData.valorCondicionMin || ""} onChange={e => setFormData({...formData, valorCondicionMin: e.target.value})} placeholder="Min..." className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.valorCondicionMin) || 'border-slate-300'}`} />
                                      </div>
                                      <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Máximo <span className="text-rose-500">*</span></label>
                                        <input type="text" value={formData.valorCondicionMax || ""} onChange={e => setFormData({...formData, valorCondicionMax: e.target.value})} placeholder="Max..." className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.valorCondicionMax) || 'border-slate-300'}`} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Valor asignado <span className="text-rose-500">*</span></label>
                                <input type="text" value={formData.valorAsignado || ""} onChange={e => setFormData({...formData, valorAsignado: e.target.value})} placeholder="Ej. Sobrante" className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.valorAsignado) || 'border-slate-300'}`} />
                              </div>
                              {renderCampoDestino(false)}
                            </div>
                          )}

                          {formData.subTipo === 'Derivar fecha' && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Base de fecha <span className="text-rose-500">*</span></label>
                                  <div className="relative">
                                    <select value={formData.baseFecha || ""} onChange={e => setFormData({...formData, baseFecha: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.baseFecha) || 'border-slate-300'}`}>
                                      <option value="">Selecciona base</option>
                                      <option value="Campo fecha">Campo fecha</option>
                                      <option value="Día operativo del proceso">Día operativo del proceso</option>
                                      <option value="Fecha de ejecución">Fecha de ejecución</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                  </div>
                                </div>
                                {formData.baseFecha === 'Campo fecha' && (
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Campo fecha origen <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                      <FieldSelect
                                        value={Array.isArray(formData.campo) ? formData.campo[0] || "" : formData.campo || ""}
                                        onChange={val => setFormData({...formData, campo: val})}
                                        options={getAvailableFieldsList(formData.fuente).map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                                        hasError={!formData.campo || formData.campo.length === 0}
                                        placeholder="Selecciona campo origen"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Regla de derivación <span className="text-rose-500">*</span></label>
                                  <div className="relative">
                                    <select value={formData.reglaDerivacionFecha || ""} onChange={e => setFormData({...formData, reglaDerivacionFecha: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.reglaDerivacionFecha) || 'border-slate-300'}`}>
                                      <option value="">Selecciona regla</option>
                                      <option value="Tomar mismo día">Tomar mismo día</option>
                                      <option value="Sumar días">Sumar días</option>
                                      <option value="Restar días">Restar días</option>
                                      <option value="Tomar día anterior">Tomar día anterior</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                  </div>
                                </div>
                                {["Sumar días", "Restar días"].includes(formData.reglaDerivacionFecha || "") && (
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Cantidad de días <span className="text-rose-500">*</span></label>
                                    <input type="number" min="1" value={formData.cantidadDias || ""} onChange={e => setFormData({...formData, cantidadDias: e.target.value})} placeholder="Ej. 1" className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.cantidadDias) || 'border-slate-300'}`} />
                                  </div>
                                )}
                              </div>
                              {renderCampoDestino(false)}
                            </div>
                          )}

                          {formData.subTipo === 'Excluir registros del cruce' && (
                            <div className="space-y-4">
                              {renderCampoOrigen(false)}
                              <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Condición de exclusión</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Operador <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                      <select value={formData.operadorCondicion || ""} onChange={e => setFormData({...formData, operadorCondicion: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.operadorCondicion) || 'border-slate-300'}`}>
                                        <option value="">Selecciona operador</option>
                                        <option value="Igual a">Igual a</option>
                                        <option value="Diferente de">Diferente de</option>
                                        <option value="Contiene">Contiene</option>
                                        <option value="No contiene">No contiene</option>
                                        <option value="Mayor que">Mayor que</option>
                                        <option value="Menor que">Menor que</option>
                                        <option value="Entre rango">Entre rango</option>
                                        <option value="Está vacío">Está vacío</option>
                                        <option value="No está vacío">No está vacío</option>
                                      </select>
                                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                  </div>
                                  {!['Está vacío', 'No está vacío', 'Entre rango'].includes(formData.operadorCondicion || '') && (
                                    <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Valor de comparación <span className="text-rose-500">*</span></label>
                                      <input type="text" value={formData.valorCondicion || ""} onChange={e => setFormData({...formData, valorCondicion: e.target.value})} placeholder="Valor..." className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.valorCondicion && ['Igual a', 'Diferente de', 'Contiene', 'No contiene', 'Mayor que', 'Menor que'].includes(formData.operadorCondicion || '')) || 'border-slate-300'}`} />
                                    </div>
                                  )}
                                  {formData.operadorCondicion === 'Entre rango' && (
                                    <div className="flex gap-2">
                                      <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Mínimo <span className="text-rose-500">*</span></label>
                                        <input type="text" value={formData.valorCondicionMin || ""} onChange={e => setFormData({...formData, valorCondicionMin: e.target.value})} placeholder="Min..." className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.valorCondicionMin) || 'border-slate-300'}`} />
                                      </div>
                                      <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5 border-b border-slate-100 pb-1">Máximo <span className="text-rose-500">*</span></label>
                                        <input type="text" value={formData.valorCondicionMax || ""} onChange={e => setFormData({...formData, valorCondicionMax: e.target.value})} placeholder="Max..." className={`w-full px-3 py-2 border bg-white rounded-lg text-sm ${getFieldErrorClass(!formData.valorCondicionMax) || 'border-slate-300'}`} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Motivo de exclusión <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                  <select value={formData.motivoExclusion || ""} onChange={e => setFormData({...formData, motivoExclusion: e.target.value})} className={`w-full px-3 py-2 border bg-white rounded-lg text-sm appearance-none ${getFieldErrorClass(!formData.motivoExclusion) || 'border-slate-300'}`}>
                                    <option value="">Selecciona motivo</option>
                                    <option value="Consulta sin costo">Consulta sin costo</option>
                                    <option value="Registro informativo">Registro informativo</option>
                                    <option value="Movimiento no conciliable">Movimiento no conciliable</option>
                                    <option value="Otro">Otro</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="bg-white p-4 border border-slate-200 rounded-lg mt-6">
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold text-slate-800">Resultado esperado: </span>
                              {formData.subTipo 
                                ? (() => {
                                    const d = (c: any) => Array.isArray(c) && c.length > 0 ? c.join(', ') : (c || "[destino]");
                                    const orig = Array.isArray(formData.campo) && formData.campo.length > 0 ? formData.campo.join(', ') : (formData.campo || "[origen]");
                                    switch(formData.subTipo) {
                                      case 'Extraer valor de un campo': 
                                        if (!formData.campoDestino) return `Completa el campo destino para generar el resultado esperado.`;
                                        if (formData.metodoExtraccion === 'Por posición fija') {
                                          if (!formData.posicionInicial || !formData.longitud) return `Completa los parámetros de extracción para generar el resultado.`;
                                          return `Desde el campo ${orig} se extraerán ${formData.longitud} caracteres desde la posición ${formData.posicionInicial} y se guardarán en ${d(formData.campoDestino)}.`;
                                        } else if (formData.metodoExtraccion === 'Por delimitador') {
                                          if (!formData.delimitador || !formData.segmentoAExtraer) return `Completa los parámetros de extracción para generar el resultado.`;
                                          let segmentoStr = formData.segmentoAExtraer.toLowerCase();
                                          if (formData.segmentoAExtraer === 'Número de segmento específico') {
                                             if (!formData.numeroSegmento) return `Completa el número de segmento para generar el resultado.`;
                                             segmentoStr = `segmento ${formData.numeroSegmento}`;
                                          }
                                          return `Desde el campo ${orig} se extraerá el ${segmentoStr} separado por '${formData.delimitador}' y se guardará en ${d(formData.campoDestino)}.`;
                                        } else if (formData.metodoExtraccion === 'Antes de un texto') {
                                          if (!formData.textoReferencia) return `Completa el texto de referencia para generar el resultado.`;
                                          return `Desde el campo ${orig} se extraerá el texto ubicado antes de '${formData.textoReferencia}' y se guardará en ${d(formData.campoDestino)}.`;
                                        } else if (formData.metodoExtraccion === 'Después de un texto') {
                                          if (!formData.textoReferencia) return `Completa el texto de referencia para generar el resultado.`;
                                          return `Desde el campo ${orig} se extraerá el texto ubicado después de '${formData.textoReferencia}' y se guardará en ${d(formData.campoDestino)}.`;
                                        } else if (formData.metodoExtraccion === 'Por patrón') {
                                          if (!formData.patronExtraccion) return `Completa el patrón de extracción para generar el resultado.`;
                                          return `Desde el campo ${orig} se extraerá el valor que cumpla el patrón definido y se guardará en ${d(formData.campoDestino)}.`;
                                        }
                                        return `Desde el campo ${orig} se extraerá un valor y se guardará en ${d(formData.campoDestino)}.`;
                                      case 'Separar campo en varios campos': 
                                        const destinosMultiples = Array.isArray(formData.campoDestino) ? formData.campoDestino.join(' y ') : (formData.campoDestino || '[destinos]');
                                        return `El campo ${orig} se separará en ${destinosMultiples}.`;
                                      case 'Unir campos': 
                                        return `Los campos ${orig} se unirán en ${d(formData.campoDestino)}.`;
                                      case 'Crear campo calculado': 
                                        if (formData.tipoCalculo === 'Suma') return `Se calculará ${d(formData.campoDestino)} sumando los campos ${orig}.`;
                                        if (formData.tipoCalculo === 'Resta') return `Se calculará ${d(formData.campoDestino)} restando ${formData.campoARestar || '[campo]'} a ${orig}.`;
                                        if (formData.tipoCalculo === 'Multiplicación') return `Se calculará ${d(formData.campoDestino)} multiplicando ${orig} por ${formData.campoOperador || '[campo]'}.`;
                                        if (formData.tipoCalculo === 'División') return `Se calculará ${d(formData.campoDestino)} dividiendo ${orig} entre ${formData.campoOperador || '[campo]'}.`;
                                        if (formData.tipoCalculo === 'Diferencia absoluta') return `Se calculará la diferencia absoluta entre ${formData.primerCampo || '[campo]'} y ${formData.segundoCampo || '[campo]'} guardándola en ${d(formData.campoDestino)}.`;
                                        if (formData.tipoCalculo === 'Campo más/menos valor constante') return `Se calculará ${d(formData.campoDestino)} al ${formData.operacionConstante === 'Restar' ? 'restar' : 'sumar'} ${formData.valorConstanteCalculo || '[valor]'} a ${orig}.`;
                                        return `Se calculará ${d(formData.campoDestino)} usando ${orig}.`;
                                      case 'Ajustar signo o naturaleza del monto': 
                                        if (formData.criterioAjusteSigno === 'Invertir signo siempre') return `Se generará ${d(formData.campoDestino)} invirtiendo el signo del campo ${orig}.`;
                                        if (formData.criterioAjusteSigno === 'Convertir a positivo') return `Se generará ${d(formData.campoDestino)} convirtiendo a positivo el campo ${orig}.`;
                                        if (formData.criterioAjusteSigno === 'Convertir a negativo') return `Se generará ${d(formData.campoDestino)} convirtiendo a negativo el campo ${orig}.`;
                                        if (formData.criterioAjusteSigno === 'Según campo indicador') return `Se generará ${d(formData.campoDestino)} aplicando el signo según ${formData.campoIndicador || '[indicador]'}.`;
                                        return `Se generará ${d(formData.campoDestino)} aplicando signo según criterio.`;
                                      case 'Clasificar registros': 
                                        const eqC = formData.operadorCondicion === 'Entre rango' ? `entre ${formData.valorCondicionMin || '[mín]'} y ${formData.valorCondicionMax || '[máx]'}` : `${formData.operadorCondicion || '[operador]'} ${!['Está vacío', 'No está vacío', 'Entre rango'].includes(formData.operadorCondicion || '') ? (formData.valorCondicion || '[valor]') : ''}`.trim();
                                        return `Los registros donde ${orig} sea ${eqC} se clasificarán como ${formData.valorAsignado || "[valor]"} en ${d(formData.campoDestino)}.`;
                                      case 'Derivar fecha': 
                                        const baseD = formData.baseFecha === 'Campo fecha' ? orig : formData.baseFecha || '[base]';
                                        const resD = formData.reglaDerivacionFecha === 'Sumar días' ? `sumando ${formData.cantidadDias || '[N]'} días a ${baseD}` : 
                                                     formData.reglaDerivacionFecha === 'Restar días' ? `restando ${formData.cantidadDias || '[N]'} días a ${baseD}` :
                                                     `tomando la base de ${baseD} (${formData.reglaDerivacionFecha || 'regla'})`;
                                        return `Se generará ${d(formData.campoDestino)} ${resD}.`;
                                      case 'Excluir registros del cruce': 
                                        const eqE = formData.operadorCondicion === 'Entre rango' ? `entre ${formData.valorCondicionMin || '[mín]'} y ${formData.valorCondicionMax || '[máx]'}` : `${formData.operadorCondicion || '[operador]'} ${!['Está vacío', 'No está vacío', 'Entre rango'].includes(formData.operadorCondicion || '') ? (formData.valorCondicion || '[valor]') : ''}`.trim();
                                        return `Los registros donde ${orig} sea ${eqE} se excluirán del cruce. Motivo: ${formData.motivoExclusion || "[motivo]"}`;
                                      default: return "Configuración no completada";
                                    }
                                  })()
                                : "Seleccione una operación para ver el resultado esperado"}
                            </p>
                          </div>
                        </div>
                    </section>
                  </>
                )}

                {currentRuleType === 'Normalización' && (
                  <>
                    <div className="w-full h-px bg-slate-100" />
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Settings2 size={16} className="text-primary" />
                        <h4 className="text-[14px] font-bold uppercase tracking-wider">Parámetros de la Operación</h4>
                      </div>
                      
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
                    </section>
                  </>
                )}

                {currentRuleType === 'Control de consistencia' && (
                  <>
                    <div className="w-full h-px bg-slate-100" />
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Settings2 size={16} className="text-primary" />
                        <h4 className="text-[14px] font-bold uppercase tracking-wider">Parámetros del Control</h4>
                      </div>
                      <div className="p-5 bg-slate-50/80 border border-slate-100 rounded-xl space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                        {/* Registros considerados */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Registros considerados <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <select
                              value={formData.registrosConsiderados || "Registros incluidos para conciliación"}
                              onChange={(e) => setFormData({...formData, registrosConsiderados: e.target.value})}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
                            >
                              <option value="Registros incluidos para conciliación">Registros incluidos para conciliación</option>
                              <option value="Todos los registros cargados">Todos los registros cargados</option>
                              <option value="Registros excluidos">Registros excluidos</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Extra fields based on subTipo */}
                        {(formData.subTipo === 'Suma contra valor de control' || formData.subTipo === 'Comparación de totales entre fuentes') && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                              {formData.subTipo === 'Comparación de totales entre fuentes' ? 'Campo numérico de Fuente A' : 'Campo a sumar'} <span className="text-rose-500">*</span>
                            </label>
                            <FieldSelect
                              value={formData.campoASumar || ""}
                              onChange={val => setFormData({...formData, campoASumar: val})}
                              options={getAvailableFieldsList(formData.fuente).map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                              hasError={!formData.campoASumar}
                              placeholder="Seleccionar campo..."
                            />
                          </div>
                        )}

                        {(formData.subTipo === 'Suma contra valor de control' || formData.subTipo === 'Comparación de totales entre fuentes') && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Condición de comparación <span className="text-rose-500">*</span></label>
                              <select
                                value={formData.condicionComparacion || "Igual a"}
                                onChange={(e) => setFormData({...formData, condicionComparacion: e.target.value})}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.condicionComparacion)}`}
                              >
                                <option value="Igual a">Igual a</option>
                                <option value="Igual con tolerancia">Igual con tolerancia</option>
                              </select>
                            </div>
                            {formData.condicionComparacion === 'Igual con tolerancia' && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tolerancia máxima permitida <span className="text-rose-500">*</span></label>
                                <input 
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={formData.tolerancia || ""}
                                  onChange={(e) => setFormData({...formData, tolerancia: e.target.value})}
                                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${getFieldErrorClass(!formData.tolerancia)}`}
                                  placeholder="Ej. 1.50"
                                />
                              </div>
                            )}
                          </>
                        )}

                        {formData.subTipo === 'Suma contra valor de control' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Origen del valor de control <span className="text-rose-500">*</span></label>
                              <select
                                value={formData.origenValorControl || ""}
                                onChange={(e) => setFormData({...formData, origenValorControl: e.target.value, campoControl: '', valorFijoControl: ''})}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.origenValorControl)}`}
                              >
                                <option value="">Seleccionar origen...</option>
                                <option value="Último valor de un campo">Último valor de un campo</option>
                                <option value="Primer valor de un campo">Primer valor de un campo</option>
                                <option value="Valor fijo ingresado">Valor fijo ingresado</option>
                              </select>
                            </div>
                            
                            {(formData.origenValorControl === 'Último valor de un campo' || formData.origenValorControl === 'Primer valor de un campo') && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Campo de control <span className="text-rose-500">*</span></label>
                                <FieldSelect
                                  value={formData.campoControl || ""}
                                  onChange={val => setFormData({...formData, campoControl: val})}
                                  options={getAvailableFieldsList(formData.fuente).map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                                  hasError={!formData.campoControl}
                                  placeholder="Seleccionar campo..."
                                />
                              </div>
                            )}

                            {formData.origenValorControl === 'Valor fijo ingresado' && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Valor fijo de control <span className="text-rose-500">*</span></label>
                                <input 
                                  type="number"
                                  step="0.01"
                                  value={formData.valorFijoControl || ""}
                                  onChange={(e) => setFormData({...formData, valorFijoControl: e.target.value})}
                                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${getFieldErrorClass(!formData.valorFijoControl)}`}
                                  placeholder="Ej. 10000.50"
                                />
                              </div>
                            )}
                          </>
                        )}



                        {formData.subTipo === 'Conteo de registros' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Condición de conteo <span className="text-rose-500">*</span></label>
                              <select
                                value={formData.condicionConteo || ""}
                                onChange={(e) => setFormData({...formData, condicionConteo: e.target.value})}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.condicionConteo)}`}
                              >
                                <option value="">Seleccionar condición...</option>
                                <option value="Mayor o igual que">Mayor o igual que</option>
                                <option value="Igual a">Igual a</option>
                                <option value="Entre rango">Entre rango</option>
                              </select>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                  {formData.condicionConteo === 'Entre rango' ? 'Cantidad mínima' : 'Cantidad esperada'} <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                  type="number"
                                  min="0"
                                  value={formData.cantidadMinimaRegistros || ""}
                                  onChange={(e) => setFormData({...formData, cantidadMinimaRegistros: e.target.value})}
                                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${getFieldErrorClass(!formData.cantidadMinimaRegistros)}`}
                                  placeholder="Ej. 1"
                                />
                              </div>
                              {formData.condicionConteo === 'Entre rango' && (
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cantidad máxima <span className="text-rose-500">*</span></label>
                                  <input 
                                    type="number"
                                    min="0"
                                    value={formData.cantidadMaximaRegistros || ""}
                                    onChange={(e) => setFormData({...formData, cantidadMaximaRegistros: e.target.value})}
                                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${getFieldErrorClass(!formData.cantidadMaximaRegistros)}`}
                                    placeholder="Ej. 100"
                                  />
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {formData.subTipo === 'Comparación de totales entre fuentes' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fuente B <span className="text-rose-500">*</span></label>
                              <select
                                value={formData.fuenteAdicional || ""}
                                onChange={(e) => setFormData({...formData, fuenteAdicional: e.target.value, campoAdicional: ''})}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${getFieldErrorClass(!formData.fuenteAdicional)}`}
                              >
                                <option value="">Seleccionar fuente...</option>
                                {process.sources.filter(s => s !== formData.fuente).map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Registros considerados de Fuente B <span className="text-rose-500">*</span></label>
                              <div className="relative">
                                <select
                                  value={formData.registrosConsideradosB || "Registros incluidos para conciliación"}
                                  onChange={(e) => setFormData({...formData, registrosConsideradosB: e.target.value})}
                                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
                                >
                                  <option value="Registros incluidos para conciliación">Registros incluidos para conciliación</option>
                                  <option value="Todos los registros cargados">Todos los registros cargados</option>
                                  <option value="Registros excluidos">Registros excluidos</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              </div>
                            </div>
                            {formData.fuenteAdicional && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Campo numérico de Fuente B <span className="text-rose-500">*</span></label>
                                <FieldSelect
                                  value={formData.campoAdicional || ""}
                                  onChange={val => setFormData({...formData, campoAdicional: val})}
                                  options={getAvailableFieldsList(formData.fuenteAdicional).map(f => ({ value: f.id, label: f.id, type: f.type === 'derivado' ? 'Derivado' : f.type === 'normalizado' ? 'Normalizado' : 'Fuente' }))}
                                  hasError={!formData.campoAdicional}
                                  placeholder="Seleccionar campo..."
                                />
                              </div>
                            )}
                          </>
                        )}


                        <div className="bg-white p-4 border border-slate-200 rounded-lg mt-4">
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-800">Resultado esperado: </span>
                            {(() => {
                              if (!formData.subTipo) return "Selecciona un tipo de control para ver el resultado esperado.";
                              const regs = formData.registrosConsiderados === "Todos los registros cargados" ? "todos los registros" : formData.registrosConsiderados === "Registros excluidos" ? "los registros excluidos" : "los registros incluidos";
                              
                              if (formData.subTipo === 'Suma contra valor de control') {
                                if (formData.campoASumar && formData.origenValorControl) {
                                  const ref = formData.origenValorControl === 'Valor fijo ingresado' ? `el valor ${formData.valorFijoControl || 'fijo'}` :
                                    `${formData.origenValorControl.toLowerCase()} ${formData.campoControl || ''}`;
                                  return `Se validará que la suma del campo ${formData.campoASumar} de ${regs} en ${formData.fuente} sea ${formData.condicionComparacion?.toLowerCase() || 'igual a'} ${ref}${formData.condicionComparacion === 'Igual con tolerancia' && formData.tolerancia ? ` (±${formData.tolerancia})` : ''}.`;
                                }
                                return "Completa los parámetros para ver el resultado esperado.";
                              }

                              if (formData.subTipo === 'Conteo de registros') {
                                if (formData.condicionConteo && formData.cantidadMinimaRegistros) {
                                  if (formData.condicionConteo === 'Entre rango') {
                                    return `Se validará que la cantidad de ${regs} en ${formData.fuente} esté entre ${formData.cantidadMinimaRegistros} y ${formData.cantidadMaximaRegistros || '...'}.`;
                                  }
                                  return `Se validará que la cantidad de ${regs} en ${formData.fuente} sea ${formData.condicionConteo?.toLowerCase()} ${formData.cantidadMinimaRegistros}.`;
                                }
                                return "Ingresa la condición y cantidad esperada.";
                              }
                              if (formData.subTipo === 'Comparación de totales entre fuentes') {
                                if (formData.campoASumar && formData.fuenteAdicional && formData.campoAdicional) {
                                  const regsB = formData.registrosConsideradosB === "Todos los registros cargados" ? "todos los registros" : formData.registrosConsideradosB === "Registros excluidos" ? "los registros excluidos" : "los registros incluidos";
                                  return `Se comparará que la suma del campo ${formData.campoASumar} de ${regs} en ${formData.fuente} sea ${formData.condicionComparacion?.toLowerCase() || 'igual a'} a la suma del campo ${formData.campoAdicional} de ${regsB} en ${formData.fuenteAdicional}${formData.condicionComparacion === 'Igual con tolerancia' && formData.tolerancia ? ` (±${formData.tolerancia})` : ''}.`;
                                }
                                return "Completa los parámetros de campos y fuentes para ver el resultado esperado.";
                              }
                              return "Configura los parámetros.";
                            })()}
                          </p>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {(currentRuleType === 'Validación' || currentRuleType === 'Control de consistencia') && (
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
                           onClick={(e) => { e.preventDefault(); setFormData({...formData, nivel: "Fuerte"}); }}
                           className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-all ${
                             formData.nivel === "Fuerte" 
                             ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                             : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                           }`}
                         >
                           <ShieldAlert size={16} />
                           Bloqueante
                         </button>
                         <button 
                           onClick={(e) => { e.preventDefault(); setFormData({...formData, nivel: "Advertencia"}); }}
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

