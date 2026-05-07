import React from "react";
import { Target, Clock, Users, Activity } from "lucide-react";
import type { Process } from "./ProcessCard";

interface DatosProcesoSectionProps {
  process: Process;
  onChange: () => void;
}

export function DatosProcesoSection({
  process,
  onChange,
}: DatosProcesoSectionProps) {
  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-primary mb-2">
          Datos del proceso
        </h3>
        <p className="text-slate-500 text-sm max-w-2xl">
          Define la información funcional, alcance operativo y responsables
          del proceso conciliatorio.
        </p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden divide-y divide-slate-100">
        {/* Identificación */}
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="md:w-1/3 shrink-0">
            <h4 className="text-[14px] font-bold text-slate-800 flex items-center gap-2 mb-1.5">
              <Target size={16} className="text-primary" />
              Identificación
            </h4>
            <p className="text-[12.5px] text-slate-500 leading-relaxed md:pr-4">
              Nombre oficial, código y propósito de la conciliación.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Nombre del proceso <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={process.name}
                onChange={onChange}
                placeholder="Ej. Municipio, Cash Pagos"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Código interno <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={`PRC-${process.id.padStart(3, "0")}`}
                onChange={onChange}
                placeholder="Ej. MUN-001"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Categoría operativa <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                className="w-full sm:w-1/2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="">Seleccionar categoría...</option>
                <option value="Servicios públicos">Servicios públicos</option>
                <option value="Cash">Cash</option>
                <option value="ATM">ATM</option>
                <option value="SPI">SPI</option>
                <option value="Tarjetas">Tarjetas</option>
                <option value="Recaudaciones">Recaudaciones</option>
                <option value="Transferencias">Transferencias</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Descripción
              </label>
              <textarea
                onChange={onChange}
                placeholder="Explica brevemente el objetivo de este proceso conciliatorio..."
                className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-20 resize-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
        
        {/* Alcance operativo */}
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50/30">
          <div className="md:w-1/3 shrink-0">
            <h4 className="text-[14px] font-bold text-slate-800 flex items-center gap-2 mb-1.5">
              <Clock size={16} className="text-slate-500" />
              Alcance operativo
            </h4>
            <p className="text-[12.5px] text-slate-500 leading-relaxed md:pr-4">
              Definición de frecuencia y el periodo de información.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Frecuencia <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="Diaria">Diaria</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
                <option value="Bajo demanda">Bajo demanda</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Base de fecha operativa <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="Día caído">Día caído</option>
                <option value="Día actual">Día actual</option>
                <option value="Acumulado fin de semana / feriado">
                  Acumulado fin de fin de semana / feriado
                </option>
                <option value="Rango definido por el usuario">
                  Rango definido por el usuario
                </option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Horario esperado
              </label>
              <input
                type="time"
                defaultValue="08:00"
                onChange={onChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Ventana límite
              </label>
              <input
                type="time"
                defaultValue="14:00"
                onChange={onChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Responsables */}
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="md:w-1/3 shrink-0">
            <h4 className="text-[14px] font-bold text-slate-800 flex items-center gap-2 mb-1.5">
              <Users size={16} className="text-sky-600" />
              Responsables
            </h4>
            <p className="text-[12.5px] text-slate-500 leading-relaxed md:pr-4">
              Equipo y referentes encargados de la operación.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Responsable funcional <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                defaultValue={
                  process.lastEditedBy.includes("Andrea") ? "user1" : ""
                }
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="">Seleccionar responsable...</option>
                <option value="user1">Andrea M. (Analista Sr)</option>
                <option value="user2">Carlos T. (Especialista)</option>
                <option value="user3">Miriam R. (Líder Ops)</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Equipo a cargo <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="">Seleccionar equipo...</option>
                <option value="Conciliaciones">Conciliaciones</option>
                <option value="Canales electrónicos">
                  Canales electrónicos
                </option>
                <option value="Transferencias">Transferencias</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Contabilidad">Contabilidad</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Supervisor / aprobador base <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                className="w-full sm:w-1/2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="">Seleccionar supervisor...</option>
                <option value="sup1">Jefatura Conciliaciones</option>
                <option value="sup2">Gerencia Operaciones</option>
                <option value="sup3">Supervisor Turno AMS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50/30">
          <div className="md:w-1/3 shrink-0">
            <h4 className="text-[14px] font-bold text-slate-800 flex items-center gap-2 mb-1.5">
              <Activity size={16} className="text-slate-500" />
              Estado y notas
            </h4>
            <p className="text-[12.5px] text-slate-500 leading-relaxed md:pr-4">
              Situación actual de la configuración y anotaciones adicionales.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Estado de configuración
              </label>
              <div className="relative">
                <select
                  onChange={onChange}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-[14px] text-slate-500 focus:outline-none cursor-not-allowed appearance-none font-medium"
                >
                  <option>{process.status}</option>
                </select>
              </div>
              <p className="text-[12px] text-slate-400 mt-1.5">
                Calculado automáticamente.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Observaciones
              </label>
              <textarea
                onChange={onChange}
                placeholder="Comentarios adicionales o notas relevantes (opcional)..."
                className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-20 resize-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
