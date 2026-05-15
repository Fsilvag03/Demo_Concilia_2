import React, { useState } from "react";
import {
  FileWarning,
  ShieldCheck,
  ChevronRight,
  Settings2,
  FileText,
  AlertTriangle,
  GitBranch,
  ArrowRightLeft,
  Clock,
  Key,
  ArrowLeft,
  HelpCircle,
  AlignCenterHorizontal,
  Save,
  X,
  Info,
  Activity,
  Shield,
  Users,
  Bell,
  Power,
  Pencil,
} from "lucide-react";
import type { Process } from "./ProcessCard";

interface ConfiguracionDiferenciasSectionProps {
  process: Process;
  onChange: () => void;
  onNavigate?: (sectionId: string) => void;
}

const diferencias = [
  {
    id: "1",
    name: "Registro solo en fuente principal",
    icon: GitBranch,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    accent: "bg-indigo-500",
  },
  {
    id: "2",
    name: "Registro solo en fuente contraparte",
    icon: ArrowRightLeft,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    accent: "bg-indigo-500",
  },
  {
    id: "3",
    name: "Diferencia de monto",
    icon: FileWarning,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    accent: "bg-amber-500",
  },
  {
    id: "4",
    name: "Diferencia de fecha",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    accent: "bg-amber-500",
  },
  {
    id: "5",
    name: "Diferencia de campo clave",
    icon: Key,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    accent: "bg-amber-500",
  },
  {
    id: "6",
    name: "Coincidencia parcial",
    icon: AlignCenterHorizontal,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    accent: "bg-emerald-500",
  },
  {
    id: "7",
    name: "Pendiente de clasificación",
    icon: HelpCircle,
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    accent: "bg-slate-400",
  },
];

type DiferenciaConfig = {
  nombreVisible: string;
  descripcion: string;
  modoAtencion: string;
  bloqueaCierre: "Si" | "No";
  comentarioObligatorio: "Si" | "No";
  codigoObligatorio: "Si" | "No";
  adjuntoObligatorio: "Si" | "No";
  requiereAprobacion: "Si" | "No";
  slaValor: string;
  slaUnidad: string;
  tipoDestinatario: string;
  destinatarios: string;
  estado: "Completa" | "Incompleta" | "Con observaciones";
};

const initialConfigs: Record<string, DiferenciaConfig> = {
  "1": {
    nombreVisible: "Faltante en FACILITO",
    descripcion: "",
    modoAtencion: "Justificar",
    bloqueaCierre: "Si",
    comentarioObligatorio: "Si",
    codigoObligatorio: "No",
    adjuntoObligatorio: "Si",
    requiereAprobacion: "Si",
    slaValor: "1",
    slaUnidad: "Días",
    tipoDestinatario: "Usuario",
    destinatarios: "usuario1",
    estado: "Completa",
  },
  "2": {
    nombreVisible: "",
    descripcion: "",
    modoAtencion: "Revisar",
    bloqueaCierre: "No",
    comentarioObligatorio: "No",
    codigoObligatorio: "No",
    adjuntoObligatorio: "No",
    requiereAprobacion: "No",
    slaValor: "",
    slaUnidad: "Días",
    tipoDestinatario: "Ninguno",
    destinatarios: "",
    estado: "Incompleta",
  },
};

type ReglaAprobacion = {
  id: string;
  nombre: string;
  descripcion: string;
  aplicaA: "Diferencias" | "Registros conciliados";
  campo: string;
  operador: string;
  valor: string;
  estado: "Completa" | "Incompleta";
  uso: "Activo" | "Inactivo";
};

export const ConfiguracionDiferenciasSection: React.FC<
  ConfiguracionDiferenciasSectionProps
> = ({ process, onChange, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<"tratamiento" | "aprobacion">(
    "tratamiento",
  );
  const [selectedDiferencia, setSelectedDiferencia] = useState<string | null>(
    null,
  );

  const [selectedReglaId, setSelectedReglaId] = useState<string | null>(null);
  const [isCreatingRegla, setIsCreatingRegla] = useState(false);
  const [reglas, setReglas] = useState<ReglaAprobacion[]>([
    {
      id: "1",
      nombre: "Aprobación por monto alto",
      descripcion: "Requiere aprobación para diferencias mayores a 10,000",
      aplicaA: "Diferencias",
      campo: "Monto principal",
      operador: "Mayor que",
      valor: "10000",
      estado: "Completa",
      uso: "Activo",
    },
    {
      id: "2",
      nombre: "Revisión de conciliados",
      descripcion: "Aprobación para registros conciliados de alto valor",
      aplicaA: "Registros conciliados",
      campo: "Monto principal",
      operador: "Mayor o igual que",
      valor: "50000",
      estado: "Completa",
      uso: "Activo",
    },
    {
      id: "3",
      nombre: "Aprobación estricta",
      descripcion: "Regla temporal para diferencias pequeñas",
      aplicaA: "Diferencias",
      campo: "Monto principal",
      operador: "Mayor o igual que",
      valor: "500",
      estado: "Completa",
      uso: "Inactivo",
    },
  ]);

  // Use state to keep configs so updates will realistically reflect in UI
  const [configs, setConfigs] =
    useState<Record<string, DiferenciaConfig>>(initialConfigs);

  const getSustentos = (config: DiferenciaConfig) => {
    const s = [];
    if (config.comentarioObligatorio === "Si") s.push("Comentario");
    if (config.codigoObligatorio === "Si") s.push("Código");
    if (config.adjuntoObligatorio === "Si") s.push("Adjunto");
    return s.length > 0 ? s.join(" + ") : "Sin sustento obligatorio";
  };

  const handleSaveConfig = (id: string, config: DiferenciaConfig) => {
    setConfigs((prev) => ({ ...prev, [id]: config }));
    setSelectedDiferencia(null);
    onChange();
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300 pb-12">
      {!selectedDiferencia && (
        <>
          <div className="flex border-b border-slate-200 mb-6 gap-8 px-2">
            <button
              onClick={() => setActiveTab("tratamiento")}
              className={`pb-3 text-[13.5px] font-bold border-b-2 transition-colors relative ${activeTab === "tratamiento" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Tratamiento de diferencias
            </button>
            <button
              onClick={() => setActiveTab("aprobacion")}
              className={`pb-3 text-[13.5px] font-bold border-b-2 transition-colors relative ${activeTab === "aprobacion" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Reglas de aprobación
            </button>
          </div>
        </>
      )}

      {activeTab === "tratamiento" && !selectedDiferencia && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {diferencias.map((dif) => {
            const Icon = dif.icon;
            const config = configs[dif.id] || {
              nombreVisible: "",
              modoAtencion: "Informativo",
              bloqueaCierre: "No",
              comentarioObligatorio: "No",
              codigoObligatorio: "No",
              adjuntoObligatorio: "No",
              requiereAprobacion: "No",
              slaValor: "",
              slaUnidad: "Días",
              tipoDestinatario: "Ninguno",
              estado: "Incompleta",
            };

            return (
              <button
                key={dif.id}
                className="group flex flex-col p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 hover:border-slate-300 transition-all shadow-sm hover:shadow text-left relative overflow-hidden"
                onClick={() => setSelectedDiferencia(dif.id)}
              >
                <div
                  className={`absolute top-0 left-0 w-full h-[3px] ${dif.accent} opacity-80`}
                />

                <div className="flex items-start gap-3 mb-5 w-full mt-1">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${dif.bg} ${dif.color} ${dif.border} transition-all`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors truncate">
                      {dif.name}
                    </h4>
                    <p className="text-[11.5px] font-medium text-slate-500 mt-0.5 truncate italic">
                      {config.nombreVisible
                        ? `Visible como: ${config.nombreVisible}`
                        : "Sin nombre visible"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 mb-4 w-full px-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">
                      Atención
                    </span>
                    <span className="text-[11.5px] font-semibold text-slate-700">
                      {config.modoAtencion}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">
                      Bloqueo al cierre
                    </span>
                    <span
                      className={`text-[11.5px] font-semibold ${config.bloqueaCierre === "Si" ? "text-rose-600" : "text-slate-600"}`}
                    >
                      {config.bloqueaCierre === "Si" ? "Sí" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">
                      Sustento
                    </span>
                    <span
                      className="text-[11px] font-semibold text-slate-700 truncate ml-4 max-w-[140px] text-right"
                      title={getSustentos(config)}
                    >
                      {getSustentos(config)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">
                      SLA
                    </span>
                    <span className="text-[11.5px] font-semibold text-slate-700">
                      {config.slaValor
                        ? `${config.slaValor} ${config.slaUnidad.toLowerCase()}`
                        : "Sin SLA"}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2 w-full px-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${config.estado === "Completa" ? "bg-emerald-500" : config.estado === "Incompleta" ? "bg-slate-300" : "bg-amber-500"}`}
                  ></div>
                  <span
                    className={`text-[11px] font-semibold ${config.estado === "Completa" ? "text-emerald-700" : config.estado === "Incompleta" ? "text-slate-500" : "text-amber-700"}`}
                  >
                    {config.estado}
                  </span>

                  <div className="ml-auto flex items-center gap-2">
                    {config.tipoDestinatario !== "Ninguno" && (
                      <div
                        className="text-slate-400 group-hover:text-blue-500 transition-colors"
                        title="Notifica"
                      >
                        <Bell size={14} />
                      </div>
                    )}
                    {config.requiereAprobacion === "Si" && (
                      <div
                        className="text-slate-400 group-hover:text-amber-500 transition-colors"
                        title="Requiere aprobación"
                      >
                        <Shield size={14} />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedDiferencia && (
        <DiferenciaConfigForm
          id={selectedDiferencia}
          initialConfig={configs[selectedDiferencia]}
          onClose={() => setSelectedDiferencia(null)}
          onSave={(config) => handleSaveConfig(selectedDiferencia, config)}
        />
      )}

      {activeTab === "aprobacion" &&
        !selectedDiferencia &&
        !isCreatingRegla &&
        !selectedReglaId && (
          <>
            {reglas.length === 0 ? (
              <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
                  <ShieldCheck size={20} className="text-slate-400" />
                </div>
                <h4 className="text-[14px] font-bold text-slate-700 mb-1">
                  Sin reglas de aprobación
                </h4>
                <p className="text-[12.5px] text-slate-500 max-w-sm mb-4">
                  Configura cuándo se requiere revisión de un supervisor o
                  comité para autorizar ajustes.
                </p>
                <button
                  onClick={() => setIsCreatingRegla(true)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-primary/50 hover:bg-primary/5 text-primary text-[12.5px] font-bold rounded-lg transition-colors shadow-sm"
                >
                  Añadir Regla de Aprobación
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsCreatingRegla(true)}
                    className="px-4 py-1.5 bg-primary text-white hover:bg-primary/90 text-[12.5px] font-bold rounded-lg transition-colors shadow-sm border border-transparent"
                  >
                    + Añadir Regla
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-200">
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Regla
                        </th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Aplica a
                        </th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Condición
                        </th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reglas.map((regla) => (
                        <tr
                          key={regla.id}
                          className={`transition-colors group ${regla.uso === "Activo" ? "hover:bg-slate-50/50" : "bg-slate-50/30 grayscale-[20%] opacity-80"}`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${regla.uso === "Activo" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                              >
                                <ShieldCheck size={14} />
                              </div>
                              <div>
                                <p
                                  className={`text-[13px] font-bold leading-tight ${regla.uso === "Activo" ? "text-slate-700" : "text-slate-500 line-through decoration-slate-300"}`}
                                >
                                  {regla.nombre}
                                </p>
                                <p className="text-[11.5px] font-medium text-slate-500 max-w-[200px] truncate mt-0.5">
                                  {regla.descripcion || "Sin descripción"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[12.5px] font-medium text-slate-700">
                              {regla.aplicaA}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[12.5px] font-medium text-slate-700">
                                {regla.campo}
                              </span>
                              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {regla.operador.toLowerCase()}
                              </span>
                              <span className="text-[12.5px] font-bold text-slate-800">
                                {regla.valor}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setReglas(
                                    reglas.map((r) =>
                                      r.id === regla.id
                                        ? {
                                            ...r,
                                            uso:
                                              r.uso === "Activo"
                                                ? "Inactivo"
                                                : "Activo",
                                          }
                                        : r,
                                    ),
                                  );
                                }}
                                title={
                                  regla.uso === "Activo"
                                    ? "Desactivar regla"
                                    : "Activar regla"
                                }
                                className={`p-1.5 rounded-lg transition-colors ${regla.uso === "Activo" ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
                              >
                                <Power size={15} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => setSelectedReglaId(regla.id)}
                                title="Editar regla"
                                className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                              >
                                <Pencil size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      {(isCreatingRegla || selectedReglaId) && (
        <ReglaAprobacionForm
          initialConfig={
            selectedReglaId
              ? reglas.find((r) => r.id === selectedReglaId)
              : undefined
          }
          onClose={() => {
            setIsCreatingRegla(false);
            setSelectedReglaId(null);
          }}
          onSave={(regla) => {
            if (isCreatingRegla) {
              setReglas([...reglas, { ...regla, id: Date.now().toString() }]);
            } else {
              setReglas(reglas.map((r) => (r.id === regla.id ? regla : r)));
            }
            setIsCreatingRegla(false);
            setSelectedReglaId(null);
          }}
        />
      )}
    </div>
  );
};

interface DiferenciaConfigFormProps {
  id: string;
  initialConfig?: DiferenciaConfig;
  onClose: () => void;
  onSave: (config: DiferenciaConfig) => void;
}

const DiferenciaConfigForm: React.FC<DiferenciaConfigFormProps> = ({
  id,
  initialConfig,
  onClose,
  onSave,
}) => {
  const dif = diferencias.find((d) => d.id === id);
  const Icon = dif?.icon || Info;

  const [formData, setFormData] = useState<DiferenciaConfig>(
    initialConfig || {
      nombreVisible: "",
      descripcion: "",
      modoAtencion: "Revisar",
      bloqueaCierre: "Si",
      comentarioObligatorio: "No",
      codigoObligatorio: "No",
      adjuntoObligatorio: "No",
      requiereAprobacion: "No",
      slaValor: "",
      slaUnidad: "Días",
      tipoDestinatario: "Ninguno",
      destinatarios: "",
      estado: "Incompleta",
    },
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Basic logic to determine completeness
    const isComplete =
      formData.modoAtencion &&
      (formData.requiereAprobacion === "No" || formData.slaValor !== "");
    const estado = isComplete ? "Completa" : "Incompleta";
    onSave({ ...formData, estado });
  };

  const Toggle = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center gap-3 py-1">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-primary" : "bg-slate-200"}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${checked ? "translate-x-4.5" : "translate-x-0.5"}`}
        />
      </button>
      <span className="text-[12px] font-semibold text-slate-700">{label}</span>
    </div>
  );

  if (!dif) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl shrink-0">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                <Icon size={16} />
              </span>
              Configurar {dif.name}
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 custom-scrollbar space-y-5">
          {/* Nombre operativo */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
              <div
                className={`w-1.5 h-1.5 rounded-full ${dif.accent || "bg-slate-400"}`}
              ></div>
              <h5 className="text-[12.5px] font-bold text-slate-800">
                Nombre operativo
              </h5>
            </div>

            <div className="p-4 grid grid-cols-1 gap-5">
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                  Nombre visible
                </label>
                <input
                  type="text"
                  value={formData.nombreVisible}
                  onChange={(e) =>
                    handleChange("nombreVisible", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  placeholder="Ej. Diferencia de monto"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                  Descripción operativa
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-16 resize-none shadow-sm"
                  placeholder="Ej. Los valores no coinciden"
                />
              </div>
            </div>
          </div>

          {/* Atención de la diferencia */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
              <div
                className={`w-1.5 h-1.5 rounded-full ${dif.accent || "bg-slate-400"}`}
              ></div>
              <h5 className="text-[12.5px] font-bold text-slate-800">
                Atención de la diferencia
              </h5>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                  Modo de atención
                </label>
                <select
                  value={formData.modoAtencion}
                  onChange={(e) => handleChange("modoAtencion", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                >
                  <option value="Informativo">Informativo</option>
                  <option value="Revisar">Revisar</option>
                  <option value="Justificar">Justificar</option>
                  <option value="Regularizar">Regularizar</option>
                </select>
              </div>

              <div className="flex flex-col justify-end pb-1.5">
                <Toggle
                  label="Bloquea cierre de conciliación"
                  checked={formData.bloqueaCierre === "Si"}
                  onChange={(v) =>
                    handleChange("bloqueaCierre", v ? "Si" : "No")
                  }
                />
              </div>
            </div>
          </div>

          {/* Sustento requerido */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
              <div
                className={`w-1.5 h-1.5 rounded-full ${dif.accent || "bg-slate-400"}`}
              ></div>
              <h5 className="text-[12.5px] font-bold text-slate-800">
                Sustento requerido
              </h5>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Toggle
                label="Comentario obligatorio"
                checked={formData.comentarioObligatorio === "Si"}
                onChange={(v) =>
                  handleChange("comentarioObligatorio", v ? "Si" : "No")
                }
              />
              <Toggle
                label="Código/Ref. obligatoria"
                checked={formData.codigoObligatorio === "Si"}
                onChange={(v) =>
                  handleChange("codigoObligatorio", v ? "Si" : "No")
                }
              />
              <Toggle
                label="Adjunto obligatorio"
                checked={formData.adjuntoObligatorio === "Si"}
                onChange={(v) =>
                  handleChange("adjuntoObligatorio", v ? "Si" : "No")
                }
              />
            </div>
          </div>

          {/* Aprobación, SLA y Notificación */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
              <div
                className={`w-1.5 h-1.5 rounded-full ${dif.accent || "bg-slate-400"}`}
              ></div>
              <h5 className="text-[12.5px] font-bold text-slate-800">
                Flujo y Notificaciones
              </h5>
            </div>

            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                    SLA de atención
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.slaValor}
                      onChange={(e) => handleChange("slaValor", e.target.value)}
                      className="w-[80px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      placeholder="Ej. 2"
                    />
                    <select
                      value={formData.slaUnidad}
                      onChange={(e) =>
                        handleChange("slaUnidad", e.target.value)
                      }
                      className="w-[90px] px-2 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    >
                      <option value="Horas">Horas</option>
                      <option value="Dias">Días</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col justify-end pb-1.5">
                  <Toggle
                    label="Requiere aprobación"
                    checked={formData.requiereAprobacion === "Si"}
                    onChange={(v) =>
                      handleChange("requiereAprobacion", v ? "Si" : "No")
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-slate-100">
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                    Tipo de destinatario
                  </label>
                  <select
                    value={formData.tipoDestinatario}
                    onChange={(e) =>
                      handleChange("tipoDestinatario", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  >
                    <option value="Ninguno">Ninguno</option>
                    <option value="Usuario">Usuario</option>
                    <option value="Equipo">Equipo</option>
                    <option value="Correo manual">Correo manual</option>
                  </select>
                </div>

                {formData.tipoDestinatario === "Usuario" && (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                      Destinatario de notificación
                    </label>
                    <select
                      value={formData.destinatarios}
                      onChange={(e) =>
                        handleChange("destinatarios", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="usuario1">Juan (juan@empresa.com)</option>
                      <option value="usuario2">
                        María (maria@empresa.com)
                      </option>
                    </select>
                  </div>
                )}

                {formData.tipoDestinatario === "Equipo" && (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                      Destinatario de notificación
                    </label>
                    <select
                      value={formData.destinatarios}
                      onChange={(e) =>
                        handleChange("destinatarios", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="equipo1">Contabilidad</option>
                      <option value="equipo2">Sistemas</option>
                    </select>
                  </div>
                )}

                {formData.tipoDestinatario === "Correo manual" && (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                      Destinatario de notificación
                    </label>
                    <input
                      type="text"
                      value={formData.destinatarios}
                      onChange={(e) =>
                        handleChange("destinatarios", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      placeholder="Correos separados por ;"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[12.5px] font-bold rounded-lg shadow-sm transition-colors"
          >
            <Save size={14} />
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

const getFieldType = (campo: string) => {
  if (["Monto principal", "Valor calculado"].includes(campo)) return "numero";
  if (["Fecha operativa"].includes(campo)) return "fecha";
  if (["Requiere aprobación"].includes(campo)) return "booleano";
  if (
    [
      "Clasificación detectada",
      "Nombre visible de diferencia",
      "Fuente asociada",
      "Estado de atención",
      "Fuente A",
      "Fuente B",
      "Estado de conciliación",
      "Paso de cruce",
    ].includes(campo)
  )
    return "catalogo";
  return "texto";
};

const getOperators = (type: string) => {
  switch (type) {
    case "texto":
      return ["Es igual a", "Contiene", "Empieza con", "Termina con"];
    case "numero":
      return [
        "Mayor que",
        "Mayor o igual que",
        "Igual a",
        "Menor o igual que",
        "Menor que",
      ];
    case "fecha":
      return ["Es igual a", "Antes de", "Después de"];
    case "catalogo":
      return ["Es igual a", "Está en"];
    case "booleano":
      return ["Es igual a"];
    default:
      return ["Es igual a"];
  }
};

const getCatalogOptions = (campo: string) => {
  switch (campo) {
    case "Clasificación detectada":
      return [
        "Registros solo en una fuente",
        "Diferencias de monto",
        "Diferencias de fecha",
        "Diferencias de campo clave",
        "Coincidencias parciales",
        "Casos sin clasificación clara",
      ];
    case "Nombre visible de diferencia":
      return [
        "Faltante en FACILITO",
        "Solo en GIBS",
        "Diferencia de valor",
        "Pendiente de análisis",
      ];
    case "Fuente asociada":
    case "Fuente A":
    case "Fuente B":
      return ["FACILITO", "GIBS", "CORE", "TRAMA"];
    case "Estado de atención":
      return ["Pendiente", "En revisión", "Justificado", "Regularizado"];
    case "Paso de cruce":
      return [
        "Cruce por referencia y monto",
        "Cruce por fecha y monto",
        "Acercamiento manual",
      ];
    case "Estado de conciliación":
      return [
        "Conciliado",
        "Conciliado pendiente de aprobación",
        "Conciliado aprobado",
        "Conciliado rechazado",
      ];
    default:
      return ["Opción 1", "Opción 2", "Opción 3"];
  }
};

interface ReglaAprobacionFormProps {
  initialConfig?: ReglaAprobacion;
  onClose: () => void;
  onSave: (regla: ReglaAprobacion) => void;
}

const ReglaAprobacionForm: React.FC<ReglaAprobacionFormProps> = ({
  initialConfig,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ReglaAprobacion>(
    initialConfig || {
      id: "",
      nombre: "",
      descripcion: "",
      aplicaA: "Diferencias",
      campo: "Monto principal",
      operador: "Mayor que",
      valor: "",
      estado: "Incompleta",
      uso: "Activo",
    },
  );

  const handleChange = (field: keyof ReglaAprobacion, value: any) => {
    setFormData((prev) => {
      const nextData = { ...prev, [field]: value };
      if (field === "aplicaA") {
        nextData.campo = "Monto principal";
        const type = getFieldType(nextData.campo);
        nextData.operador = getOperators(type)[0];
        nextData.valor = "";
      }
      if (field === "campo") {
        const type = getFieldType(nextData.campo);
        nextData.operador = getOperators(type)[0];
        nextData.valor = "";
      }
      if (field === "operador") {
        nextData.valor = "";
      }
      return nextData;
    });
  };

  const handleSave = () => {
    const isComplete =
      formData.nombre &&
      formData.aplicaA &&
      formData.campo &&
      formData.operador &&
      formData.valor;
    onSave({
      ...formData,
      estado: isComplete ? "Completa" : "Incompleta",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl shrink-0">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <ShieldCheck size={16} />
              </span>
              {initialConfig
                ? "Editar Regla de Aprobación"
                : "Nueva Regla de Aprobación"}
            </h4>
            <p className="text-[11.5px] text-slate-500 mt-1 pl-9">
              Determina qué casos requieren aprobación adicional
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors self-start"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 custom-scrollbar space-y-5">
          {/* Nombre y Descripción */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <h5 className="text-[12.5px] font-bold text-slate-800">
                Identificación de la regla
              </h5>
            </div>

            <div className="p-4 grid grid-cols-1 gap-5">
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                  Nombre de la regla <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  placeholder="Ej. Aprobación por monto alto"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                  Descripción operativa (Opcional)
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-16 resize-none shadow-sm"
                  placeholder="Explica el criterio de esta regla"
                />
              </div>
            </div>
          </div>

          {/* Condición */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <h5 className="text-[12.5px] font-bold text-slate-800">
                Condición de activación
              </h5>
            </div>

            <div className="p-4 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                    Aplica a <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.aplicaA}
                    onChange={(e) => handleChange("aplicaA", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  >
                    <option value="Diferencias">Diferencias</option>
                    <option value="Registros conciliados">
                      Registros conciliados
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                    Campo evaluado <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.campo}
                    onChange={(e) => handleChange("campo", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  >
                    {formData.aplicaA === "Diferencias" ? (
                      <>
                        <optgroup label="Datos del sistema">
                          <option value="Monto principal">
                            Monto principal
                          </option>
                          <option value="Clasificación detectada">
                            Clasificación detectada
                          </option>
                          <option value="Nombre visible de diferencia">
                            Nombre visible de diferencia
                          </option>
                          <option value="Fuente asociada">
                            Fuente asociada
                          </option>
                          <option value="Estado de atención">
                            Estado de atención
                          </option>
                          <option value="Requiere aprobación">
                            Requiere aprobación
                          </option>
                          <option value="Fecha operativa">
                            Fecha operativa
                          </option>
                        </optgroup>
                        <optgroup label="Campos preparados">
                          <option value="Campo preparado 1">
                            Campo preparado 1
                          </option>
                          <option value="Campo preparado 2">
                            Campo preparado 2
                          </option>
                        </optgroup>
                        <optgroup label="Campos derivados">
                          <option value="Referencia extraída">
                            Referencia extraída
                          </option>
                          <option value="Llave de conciliación">
                            Llave de conciliación
                          </option>
                          <option value="Valor calculado">
                            Valor calculado
                          </option>
                        </optgroup>
                      </>
                    ) : (
                      <>
                        <optgroup label="Datos del sistema">
                          <option value="Monto principal">
                            Monto principal
                          </option>
                          <option value="Fuente A">Fuente A</option>
                          <option value="Fuente B">Fuente B</option>
                          <option value="Paso de cruce">Paso de cruce</option>
                          <option value="Fecha operativa">
                            Fecha operativa
                          </option>
                          <option value="Estado de conciliación">
                            Estado de conciliación
                          </option>
                        </optgroup>
                        <optgroup label="Campos preparados">
                          <option value="Campo preparado 1">
                            Campo preparado 1
                          </option>
                          <option value="Campo preparado 2">
                            Campo preparado 2
                          </option>
                        </optgroup>
                        <optgroup label="Campos derivados">
                          <option value="Referencia extraída">
                            Referencia extraída
                          </option>
                          <option value="Llave de conciliación">
                            Llave de conciliación
                          </option>
                          <option value="Valor calculado">
                            Valor calculado
                          </option>
                        </optgroup>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                    Operador <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.operador}
                    onChange={(e) => handleChange("operador", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  >
                    {getOperators(getFieldType(formData.campo)).map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                    Valor de comparación <span className="text-red-500">*</span>
                  </label>
                  {getFieldType(formData.campo) === "numero" && (
                    <input
                      type="number"
                      value={formData.valor}
                      onChange={(e) => handleChange("valor", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      placeholder="Ej. 10000.00"
                    />
                  )}
                  {getFieldType(formData.campo) === "texto" && (
                    <input
                      type="text"
                      value={formData.valor}
                      onChange={(e) => handleChange("valor", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      placeholder="Ej. REV, FC., RECHAZO"
                    />
                  )}
                  {getFieldType(formData.campo) === "fecha" && (
                    <input
                      type="date"
                      value={formData.valor}
                      onChange={(e) => handleChange("valor", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                  )}
                  {getFieldType(formData.campo) === "booleano" && (
                    <select
                      value={formData.valor}
                      onChange={(e) => handleChange("valor", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  )}
                  {getFieldType(formData.campo) === "catalogo" &&
                    formData.operador === "Es igual a" && (
                      <select
                        value={formData.valor}
                        onChange={(e) => handleChange("valor", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      >
                        <option value="">Seleccionar valor...</option>
                        {getCatalogOptions(formData.campo).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  {getFieldType(formData.campo) === "catalogo" &&
                    formData.operador === "Está en" && (
                      <div className="w-full max-h-32 overflow-y-auto px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm custom-scrollbar space-y-1">
                        {getCatalogOptions(formData.campo).map((opt) => {
                          const isSelected = formData.valor
                            .split(", ")
                            .includes(opt);
                          return (
                            <label
                              key={opt}
                              className="flex items-start gap-2.5 py-1 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  let vals = formData.valor
                                    ? formData.valor.split(", ")
                                    : [];
                                  if (e.target.checked) {
                                    if (!vals.includes(opt)) vals.push(opt);
                                  } else {
                                    vals = vals.filter((v) => v !== opt);
                                  }
                                  handleChange("valor", vals.join(", "));
                                }}
                                className="mt-0.5 rounded text-primary focus:ring-primary/20 border-slate-300"
                              />
                              <span className="text-[13px] text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">
                                {opt}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                  Resultado sistemático
                </label>
                <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-600 cursor-not-allowed italic">
                  Requiere aprobación
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Los casos que cumplan esta condición serán enrutados
                  automáticamente para aprobación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11.5px] font-semibold text-slate-500">
              Estado de uso:
            </span>
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                className={`px-3 py-1.5 text-[11.5px] font-bold transition-colors shadow-none ${formData.uso === "Activo" ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}
                onClick={() => handleChange("uso", "Activo")}
              >
                Activo
              </button>
              <div className="w-px h-4 bg-slate-200"></div>
              <button
                className={`px-3 py-1.5 text-[11.5px] font-bold transition-colors shadow-none ${formData.uso === "Inactivo" ? "bg-slate-100 text-slate-700" : "text-slate-500 hover:bg-slate-50"}`}
                onClick={() => handleChange("uso", "Inactivo")}
              >
                Inactivo
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[12.5px] font-bold rounded-lg transition-colors shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[12.5px] font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
              disabled={!formData.nombre || !formData.valor}
            >
              <Save size={14} />
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
