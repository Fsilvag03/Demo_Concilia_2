import React, { useState } from "react";
import {
  Database,
  Plus,
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle2,
  Wand2,
  GripVertical,
  Settings2,
  FileCode,
} from "lucide-react";
import type { Process } from "./ProcessCard";

interface FuentesCamposSectionProps {
  process: Process;
  onChange: () => void;
}

// Mocks for demonstration
type CargaModo = "Manual" | "Ruta" | "Integración";
type FuenteParticipacion =
  | "Obligatoria"
  | "Opcional"
  | "Auxiliar"
  | "Informativa";
type TipoOrigen =
  | "Excel"
  | "CSV"
  | "TXT"
  | "Manual"
  | "Cuenta contable"
  | "Reporte"
  | "Ruta"
  | "API";

interface Campo {
  id: string;
  nombreOrigen: string;
  campoEstandar: string;
  tipoDato: string;
  usoFuncional: string;
  formato: string;
  obligatorio: boolean;
}

interface FuenteConfig {
  id: string;
  nombre: string;
  descripcion: string;
  tipoOrigen: TipoOrigen;
  participacion: FuenteParticipacion;
  modoCarga: CargaModo;
  estado: "completo" | "incompleto" | "pendiente";
  campos: Campo[];
}

const mockFuentes: FuenteConfig[] = [
  {
    id: "f1",
    nombre: "Extracto Bancario",
    descripcion: "Reporte diario de movimientos consolidado del banco.",
    tipoOrigen: "Excel",
    participacion: "Obligatoria",
    modoCarga: "Manual",
    estado: "completo",
    campos: [
      {
        id: "c1",
        nombreOrigen: "FECHA_TRX",
        campoEstandar: "fecha_transaccion",
        tipoDato: "Fecha",
        formato: "DD/MM/YYYY",
        usoFuncional: "Contexto",
        obligatorio: true,
      },
      {
        id: "c2",
        nombreOrigen: "MONTO",
        campoEstandar: "monto",
        tipoDato: "Numérico",
        formato: "2 decimales",
        usoFuncional: "Validación",
        obligatorio: true,
      },
      {
        id: "c3",
        nombreOrigen: "REFERENCIA",
        campoEstandar: "referencia_1",
        tipoDato: "Texto",
        formato: "",
        usoFuncional: "Identidad",
        obligatorio: true,
      },
    ],
  },
  {
    id: "f2",
    nombre: "Sistema Core (Operaciones)",
    descripcion: "Archivo generado por el core de ventas.",
    tipoOrigen: "CSV",
    participacion: "Obligatoria",
    modoCarga: "Ruta",
    estado: "incompleto",
    campos: [
      {
        id: "c4",
        nombreOrigen: "FEC_PAGO",
        campoEstandar: "fecha_transaccion",
        tipoDato: "Fecha",
        formato: "YYYY-MM-DD",
        usoFuncional: "Contexto",
        obligatorio: true,
      },
      {
        id: "c5",
        nombreOrigen: "VALOR_TOT",
        campoEstandar: "",
        tipoDato: "Numérico",
        formato: "",
        usoFuncional: "",
        obligatorio: true,
      },
    ],
  },
];

export function FuentesCamposSection({
  process,
  onChange,
}: FuentesCamposSectionProps) {
  const [view, setView] = useState<"list" | "edit">("list");
  const [fuentes, setFuentes] = useState<FuenteConfig[]>(mockFuentes);
  const [selectedFuenteId, setSelectedFuenteId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setSelectedFuenteId(id);
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedFuenteId(null);
  };

  const selectedFuente = fuentes.find((f) => f.id === selectedFuenteId) || null;

  const renderStatus = (estado: string) => {
    switch (estado) {
      case "completo":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 size={12} /> Completa
          </span>
        );
      case "incompleto":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold">
            <AlertCircle size={12} /> Incompleta
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
            Pendiente
          </span>
        );
    }
  };

  const getSourceIcon = (tipo: TipoOrigen) => {
    switch (tipo) {
      case "Excel":
        return <FileSpreadsheet size={24} className="text-emerald-600" />;
      case "CSV":
         return <FileCode size={24} className="text-sky-500" />;
      case "TXT":
        return <FileText size={24} className="text-slate-500" />;
      default:
        return <Database size={24} className="text-primary/70" />;
    }
  };

  if (view === "edit" && selectedFuente) {
    return (
      <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Nav Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                Configurar fuente: {selectedFuente.nombre}
              </h3>
              {renderStatus(selectedFuente.estado)}
            </div>
            <p className="text-sm text-slate-500">
              Define los datos base y mapea los campos al estándar del sistema.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Nivel 1: Configuración de la fuente */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h4 className="text-base font-semibold text-primary flex items-center gap-2">
                <Settings2 size={16} className="text-slate-400" />
                Datos generales de la fuente
              </h4>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nombre de la fuente <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={selectedFuente.nombre}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descripción
                </label>
                <input
                  type="text"
                  defaultValue={selectedFuente.descripcion}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Propósito de esta fuente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tipo de origen
                </label>
                <select
                  defaultValue={selectedFuente.tipoOrigen}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option>Excel</option>
                  <option>CSV</option>
                  <option>TXT</option>
                  <option>Manual</option>
                  <option>Cuenta contable</option>
                  <option>Reporte</option>
                  <option>Ruta</option>
                  <option>API</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Participación <span className="text-rose-500">*</span>
                </label>
                <select
                  defaultValue={selectedFuente.participacion}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option>Obligatoria</option>
                  <option>Opcional</option>
                  <option>Auxiliar</option>
                  <option>Informativa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Modo de carga
                </label>
                <select
                  defaultValue={selectedFuente.modoCarga}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option>Manual</option>
                  <option>Ruta</option>
                  <option>Integración</option>
                </select>
              </div>
            </div>
          </div>

          {/* Nivel 2: Estructura y campos */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-semibold text-primary flex items-center gap-2">
                  <Database size={16} className="text-slate-400" />
                  Estructura y mapeo de campos
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define las columnas origen y homológalas al modelo estándar.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                  <Wand2 size={14} className="text-primary" /> Sugerir desde
                  archivo
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors flex items-center gap-1.5">
                  <Plus size={14} /> Fila manual
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-medium w-8"></th>
                    <th className="px-4 py-3 font-medium">
                      Campo origen (Archivo)
                    </th>
                    <th className="px-4 py-3 font-medium">Campo estándar</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Uso funcional</th>
                    <th className="px-4 py-3 font-medium text-center">Req.</th>
                    <th className="px-4 py-3 font-medium w-16">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedFuente.campos.map((campo, i) => (
                    <tr
                      key={campo.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-4 py-3 text-slate-300 cursor-grab hover:text-slate-500">
                        <GripVertical size={16} />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          defaultValue={campo.nombreOrigen}
                          onChange={onChange}
                          className="w-40 px-2.5 py-1.5 border border-slate-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          defaultValue={campo.campoEstandar}
                          onChange={onChange}
                          className="w-40 px-2.5 py-1.5 border border-slate-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Seleccionar...</option>
                          <option value="fecha_transaccion">
                            fecha_transaccion
                          </option>
                          <option value="monto">monto</option>
                          <option value="referencia_1">referencia_1</option>
                          <option value="referencia_2">referencia_2</option>
                          <option value="estado">estado</option>
                        </select>
                        {campo.campoEstandar === "" && (
                          <AlertCircle
                            size={14}
                            className="inline-block ml-2 text-amber-500"
                            title="Mapeo requerido"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          defaultValue={campo.tipoDato}
                          onChange={onChange}
                          className="w-28 px-2.5 py-1.5 border border-transparent hover:border-slate-200 rounded bg-transparent focus:bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option>Texto</option>
                          <option>Numérico</option>
                          <option>Fecha</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          defaultValue={campo.usoFuncional}
                          onChange={onChange}
                          className="w-32 px-2.5 py-1.5 border border-transparent hover:border-slate-200 rounded bg-transparent focus:bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">No definido</option>
                          <option value="Identidad">Identidad</option>
                          <option value="Validación">Validación</option>
                          <option value="Contexto">Contexto</option>
                          <option value="Salida">Salida</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          defaultChecked={campo.obligatorio}
                          onChange={onChange}
                          className="rounded text-primary focus:ring-primary w-4 h-4 text-slate-400 border-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                            title="Eliminar fila"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {selectedFuente.campos.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        <Database
                          size={32}
                          className="mx-auto mb-3 text-slate-300"
                        />
                        <p className="text-sm font-medium text-slate-700">
                          Sin campos configurados
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Usa "Sugerir desde archivo" o añade filas manualmente.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-primary mb-2">
            Fuentes y campos
          </h3>
          <p className="text-slate-500 text-sm max-w-2xl">
            Registra los insumos que participan en el proceso y mapea su
            estructura hacia el modelo estándar de conciliación. No determines
            aquí la lógica de cruce, solo el inventario de datos.
          </p>
        </div>
        <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">
          <Plus size={16} />
          Nueva fuente
        </button>
      </div>

      <div className="space-y-4">
        {fuentes.map((fuente) => (
          <div
            key={fuente.id}
            className="bg-white border border-slate-200 hover:border-primary/30 hover:shadow-md rounded-xl p-5 transition-all group flex flex-col sm:flex-row gap-5"
          >
            <div className="shrink-0 w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
              {getSourceIcon(fuente.tipoOrigen)}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {fuente.nombre}
                  </h4>
                  <div className="flex items-center gap-3">
                    {renderStatus(fuente.estado)}
                    <div className="flex items-center gap-1">
                      <button
                        className="text-slate-400 hover:text-primary p-1 rounded-md hover:bg-primary/5 transition-colors"
                        title="Duplicar fuente"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-colors"
                        title="Eliminar fuente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 line-clamp-1">
                  {fuente.descripcion}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <strong>Origen:</strong> {fuente.tipoOrigen}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <strong>Participación:</strong> {fuente.participacion}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <strong>Campos mapeados:</strong>{" "}
                  {fuente.campos.filter((c) => c.campoEstandar).length} /{" "}
                  {fuente.campos.length}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-end sm:border-l sm:border-slate-100 sm:pl-5">
              <button
                onClick={() => handleEdit(fuente.id)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-50 hover:bg-slate-100 text-primary text-sm font-medium rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
              >
                Configurar estructura
              </button>
            </div>
          </div>
        ))}

        {fuentes.length === 0 && (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center">
            <Database size={40} className="mx-auto text-slate-300 mb-4" />
            <h4 className="text-lg font-semibold text-slate-700 mb-2">
              No hay fuentes configuradas
            </h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Aún no se han definido los insumos para este proceso
              conciliatorio. Agrega una nueva fuente para comenzar a mapear sus
              campos.
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">
              <Plus size={16} />
              Agregar primera fuente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
