import React from "react";
import {
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Info,
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
    title: "Completar campos de la fuente “Input”",
    description: "La fuente aún no tiene campos configurados para continuar.",
    sectionId: "fuentes",
    actionText: "Ir a Fuentes y campos",
  };

  const pendingItems = [
    {
      id: 1,
      type: "error",
      message: "Falta configurar llave de cruce en estrategia 1 a 1.",
      sectionId: "estrategia",
      moduleName: "Estrategia y reglas",
    },
    {
      id: 2,
      type: "warning",
      message: "Regla de tolerancia sin límite superior.",
      sectionId: "estrategia",
      moduleName: "Estrategia y reglas",
    },
    {
      id: 3,
      type: "info",
      message: "Revisar formato de salida para reportes.",
      sectionId: "resultados",
      moduleName: "Resultados y salidas",
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
        <div className="bg-primary/5 border border-primary/20 border-l-[3px] border-l-primary rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <ArrowRight size={14} className="text-primary" />
              <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Siguiente paso sugerido
              </h4>
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 leading-snug">
              {nextAction.title}
            </h3>
            <p className="text-[13px] text-slate-600 max-w-xl pr-4 mt-1">
              {nextAction.description}
            </p>
          </div>
          <button
            onClick={() => onNavigate(nextAction.sectionId)}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-slate-800 text-[13px] font-bold rounded-lg hover:bg-slate-50 transition-all border border-slate-200 self-start sm:self-center shadow-sm hover:shadow"
          >
            {nextAction.actionText}
            <ChevronRight size={14} className="text-slate-400" />
          </button>
        </div>

        {/* Pendientes por resolver */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2.5">
              <div className="p-1 px-[5px] bg-slate-50 border border-slate-100 rounded-md shadow-sm">
                <AlertCircle size={16} className="text-slate-500" />
              </div>
              Pendientes por resolver
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
              {pendingItems.filter((i) => i.type === "error").length} bloqueantes
            </span>
          </div>
          <div className="p-1.5 space-y-1 bg-slate-50/50">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.sectionId)}
                className="p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-lg cursor-pointer transition-all hover:shadow-sm border border-transparent hover:border-slate-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 bg-slate-50 p-1 rounded border border-slate-100">
                    {getPendingIcon(item.type)}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[13px] font-medium text-slate-800 leading-snug mb-0.5">
                      {item.message}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      {item.moduleName}
                    </p>
                  </div>
                </div>
                <button className="text-[12px] font-bold text-slate-500 group-hover:text-primary transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0 bg-slate-50 group-hover:bg-primary/5 px-2 py-1.5 rounded-md border border-slate-100 group-hover:border-primary/20">
                  Resolver <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resultado de la última validación */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="p-5 flex-1 relative overflow-hidden bg-gradient-to-br from-emerald-50/50 to-transparent">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Última validación</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm font-semibold text-emerald-800">Exitosa (con advertencias)</h3>
            </div>
            <p className="text-[13px] text-slate-500 mb-4">Ejecutada sobre fuente "Input" mostrando un 98% de completitud y 2% de datos anómalos.</p>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Clock size={12} />
              Hace 2 horas por Sistema
            </p>
          </div>
          <div className="p-5 flex-1 bg-white flex flex-col justify-center">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Resultados en muestra (fuente "Input")</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1 text-[12px]">
                  <span className="text-slate-600 font-medium">Completitud</span>
                  <span className="text-slate-800 font-bold">98%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-[12px]">
                  <span className="text-slate-600 font-medium">Datos anómalos</span>
                  <span className="text-slate-800 font-bold">2%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha (Lateral) */}
      <div className="flex flex-col gap-6">
        {/* Configuración clave */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 relative overflow-hidden">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2.5">
            <div className="p-1 px-[5px] bg-slate-50 border border-slate-100 rounded-md shadow-sm">
              <Activity size={16} className="text-slate-500" />
            </div>
            Configuración clave
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-slate-500 font-medium">Fuentes</span>
              <span className="font-semibold text-slate-800">{process.sources?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-slate-500 font-medium">Estrategia</span>
              <span className="font-semibold text-slate-800">{process.strategy || "No definida"}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-slate-500 font-medium">F. rectora</span>
              <span className="font-semibold text-slate-800 truncate pl-2 max-w-[140px]" title={process.rectorSource || "Ninguna"}>
                {process.rectorSource || "Ninguna"}
              </span>
            </div>
          </div>
        </div>

        {/* Estado de publicación */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 relative overflow-hidden">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2.5">
            <div className="p-1 px-[5px] bg-slate-50 border border-slate-100 rounded-md shadow-sm">
              <Info size={16} className="text-slate-500" />
            </div>
            Estado de publicación
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Borrador actual</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                <span className="text-[13px] font-semibold text-slate-800">Con bloqueantes</span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Versión activa</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-[13px] font-medium text-slate-600">v1.2 (Publicada 10/03/26)</span>
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
