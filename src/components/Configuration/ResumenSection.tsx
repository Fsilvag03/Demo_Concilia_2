import React from "react";
import {
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  CircleDashed,
  ChevronRight,
  Activity,
  Clock,
} from "lucide-react";
import type { Process } from "./ProcessCard";

interface ResumenSectionProps {
  onNavigate: (sectionId: string) => void;
  process: Process;
}

export function ResumenSection({ onNavigate, process }: ResumenSectionProps) {
  // Mock data for demonstration
  const nextAction = {
    title: "Definir campos de la fuente",
    description:
      'La fuente "Input" no tiene campos configurados para la conciliación.',
    sectionId: "fuentes",
    actionText: "Ir a Fuentes y campos",
  };

  const pendingItems = [
    {
      id: 1,
      type: "error",
      message: "Falta configurar llave de cruce en estrategia 1 a 1.",
      sectionId: "estrategia",
    },
    {
      id: 2,
      type: "warning",
      message: "Regla de tolerancia sin límite superior.",
      sectionId: "estrategia",
    },
    {
      id: 3,
      type: "info",
      message: "Revisar formato de salida para reportes.",
      sectionId: "resultados",
    },
  ];

  const sectionStatuses = [
    {
      id: "datos",
      label: "Datos del proceso",
      status: "complete",
      textStatus: "Completo",
    },
    {
      id: "fuentes",
      label: "Fuentes y campos",
      status: "incomplete",
      textStatus: "Incompleto",
      pending: "Faltan campos en 1 fuente",
    },
    {
      id: "preparacion",
      label: "Preparación de datos",
      status: "not_started",
      textStatus: "No iniciado",
    },
    {
      id: "estrategia",
      label: "Estrategia y reglas",
      status: "not_started",
      textStatus: "No iniciado",
      pending: "Falta llave de cruce",
    },
    {
      id: "diferencias",
      label: "Gestión de diferencias",
      status: "not_started",
      textStatus: "No iniciado",
    },
    {
      id: "resultados",
      label: "Resultados y salidas",
      status: "not_started",
      textStatus: "No iniciado",
    },
    {
      id: "publicacion",
      label: "Publicación",
      status: "locked",
      textStatus: "Bloqueado",
      pending: "Requiere completar configuración",
    },
  ];

  const recentChanges = [
    {
      user: "Andrea M.",
      action: "guardó un borrador",
      date: "12/04/2026",
      time: "16:40",
    },
    {
      user: "Sistema",
      action: "validación ejecutada con errores",
      date: "12/04/2026",
      time: "15:55",
    },
    {
      user: "Miriam R.",
      action: "modificó Fuentes y campos",
      date: "11/04/2026",
      time: "09:30",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 size={16} className="text-secondary-dark" />;
      case "incomplete":
        return <AlertCircle size={16} className="text-amber-500" />;
      case "not_started":
        return <CircleDashed size={16} className="text-slate-300" />;
      case "locked":
        return (
          <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
        );
      default:
        return null;
    }
  };

  const getPendingIcon = (type: string) => {
    switch (type) {
      case "error":
        return (
          <AlertCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
        );
      case "warning":
        return (
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
        );
      case "info":
        return <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {/* Columna Izquierda (Principal) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Siguiente acción recomendada */}
        <div className="bg-gradient-to-r from-primary/[0.03] to-transparent border border-primary/10 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/60 rounded-l-2xl"></div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <ArrowRight size={14} className="text-primary" />
              </div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                Siguiente paso sugerido
              </h4>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1.5">
              {nextAction.title}
            </h3>
            <p className="text-sm text-slate-600 max-w-lg">
              {nextAction.description}
            </p>
          </div>
          <button
            onClick={() => onNavigate(nextAction.sectionId)}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm hover:shadow-md self-start sm:self-center"
          >
            {nextAction.actionText}
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Pendientes críticos */}
        <div className="bg-white border border-rose-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-rose-50 flex items-center justify-between bg-white relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2.5">
              <div className="p-1 px-[5px] bg-rose-50 rounded-md">
                <AlertCircle size={16} className="text-rose-500" />
              </div>
              Pendientes críticos
            </h3>
            <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-600 rounded-lg">
              {pendingItems.filter((i) => i.type === "error").length}{" "}
              bloqueantes
            </span>
          </div>
          <div className="p-2 space-y-1 bg-slate-50/30">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.sectionId)}
                className="p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white rounded-xl cursor-pointer transition-all hover:shadow-sm border border-transparent hover:border-slate-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 bg-white p-1 rounded-md shadow-sm border border-slate-100">
                    {getPendingIcon(item.type)}
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-snug pt-1">
                    {item.message}
                  </p>
                </div>
                <button className="text-[13px] text-slate-400 font-medium group-hover:text-primary transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0 bg-slate-50 group-hover:bg-primary/5 px-2.5 py-1 rounded-md">
                  Resolver <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Estado por sección */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2.5">
              <div className="p-1 px-[5px] bg-slate-50 border border-slate-100 rounded-md shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              Estado de configuración
            </h3>
          </div>
          <div className="p-2 space-y-1 bg-slate-50/50">
            {sectionStatuses.map((section) => (
              <div
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className="flex items-center justify-between p-3 px-4 hover:bg-white rounded-xl cursor-pointer transition-all hover:shadow-sm border border-transparent hover:border-slate-200 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="bg-white p-1 rounded-md shadow-sm border border-slate-100 shrink-0">
                    {getStatusIcon(section.status)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-slate-700 leading-tight">
                      {section.label}
                    </p>
                    {section.pending && (
                      <p className="text-[12px] text-slate-500 mt-0.5">
                        {section.pending}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[12px] font-bold px-2.5 py-1 rounded-lg ${
                      section.status === "complete"
                        ? "bg-emerald-50 text-emerald-700"
                        : section.status === "incomplete"
                          ? "bg-amber-50 text-amber-700"
                          : section.status === "locked"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    {section.textStatus}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-primary transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna Derecha (Contexto) */}
      <div className="flex flex-col gap-6">
        {/* Contexto del proceso */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
          <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2.5 relative">
            <div className="p-1 px-[5px] bg-slate-50 border border-slate-100 rounded-md shadow-sm">
              <Activity size={16} className="text-slate-500" />
            </div>
            Contexto del proceso
          </h3>

          <div className="space-y-6 relative">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Configuración
              </h4>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">
                    Fuentes configuradas
                  </span>
                  <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {process.sources?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Estrategia</span>
                  <span className="font-semibold text-slate-800">
                    {process.strategy || "No definida"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px] border-b border-transparent">
                  <span className="text-slate-500 font-medium">
                    Fuente rectora
                  </span>
                  <span
                    className="font-semibold text-slate-800 truncate pl-4 text-right max-w-[150px]"
                    title={process.rectorSource || "Ninguna"}
                  >
                    {process.rectorSource || "Ninguna"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Motor
              </h4>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">
                    Reglas activas
                  </span>
                  <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    0
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">
                    Tratamientos
                  </span>
                  <span className="font-semibold text-slate-400">
                    No configurados
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Salidas</span>
                  <span className="font-semibold text-amber-600 bg-amber-50 px-2 rounded w-fit">
                    Pendiente
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Control
              </h4>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">
                    Versión publicada
                  </span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Activa
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">
                    Borrador actual
                  </span>
                  <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 hidden sm:block">
                    Con bloqueantes
                  </span>
                  <span className="font-semibold text-rose-600 sm:hidden">
                    Bloqueantes
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">
                    Última validación
                  </span>
                  <span className="font-semibold text-slate-800">
                    12/04/2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cambios recientes */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
          <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2.5 relative">
            <div className="p-1 px-[5px] bg-slate-50 border border-slate-100 rounded-md shadow-sm">
              <Clock size={16} className="text-slate-500" />
            </div>
            Cambios recientes
          </h3>
          <div className="space-y-5 relative">
            {recentChanges.map((change, idx) => (
              <div
                key={idx}
                className="relative pl-5 pb-5 last:pb-0 border-l border-slate-100 last:border-transparent"
              >
                <div className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-200 -left-[5.5px] top-1"></div>
                <p className="text-[13px] text-slate-600 leading-snug">
                  <span className="font-semibold text-slate-800">
                    {change.user}
                  </span>{" "}
                  {change.action}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                  <Clock size={10} />
                  {change.date} · {change.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
