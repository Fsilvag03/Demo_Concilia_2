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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-primary mb-2">
            Datos del proceso
          </h3>
          <p className="text-slate-500 text-sm max-w-2xl">
            Define la información funcional, alcance operativo y responsables
            del proceso conciliatorio.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 md:p-8 divide-y divide-slate-100">
        {/* Identificación */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2.5 mb-1.5">
              <div className="p-1 px-[5px] bg-primary/5 border border-primary/10 rounded-md shadow-sm">
                <Target size={16} className="text-primary" />
              </div>
              Identificación
            </h4>
            <p className="text-[13px] text-slate-500 leading-relaxed pr-4">
              Establece el nombre oficial, el código único y el propósito
              principal de esta conciliación.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Nombre del proceso <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={process.name}
                onChange={onChange}
                placeholder="Ej. Municipio, Cash Pagos"
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
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
                className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-[14px] text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Descripción
              </label>
              <textarea
                onChange={onChange}
                placeholder="Explica brevemente el objetivo de este proceso conciliatorio..."
                className="w-full px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 resize-none placeholder:text-slate-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Categoría operativa <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                className="w-full sm:w-1/2 px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
          </div>
        </section>

        {/* Alcance operativo */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2.5 mb-1.5">
              <div className="p-1 px-[5px] bg-slate-50 border border-slate-200 rounded-md shadow-sm">
                <Clock size={16} className="text-slate-500" />
              </div>
              Alcance operativo
            </h4>
            <p className="text-[13px] text-slate-500 leading-relaxed pr-4">
              Define cada cuánto se ejecuta el proceso y qué periodo de
              información debe considerarse.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Frecuencia <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </section>

        {/* Responsables */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2.5 mb-1.5">
              <div className="p-1 px-[5px] bg-sky-50 border border-sky-100 rounded-md shadow-sm">
                <Users size={16} className="text-sky-600" />
              </div>
              Responsables
            </h4>
            <p className="text-[13px] text-slate-500 leading-relaxed pr-4">
              Identifica al equipo y a los referentes encargados de la
              operación, seguimiento y validación.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Responsable funcional <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                defaultValue={
                  process.lastEditedBy.includes("Andrea") ? "user1" : ""
                }
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Seleccionar responsable...</option>
                <option value="user1">Andrea M. (Analista Sr)</option>
                <option value="user2">Carlos T. (Especialista)</option>
                <option value="user3">Miriam R. (Líder Ops)</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Equipo responsable <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                Supervisor / aprobador base{" "}
                <span className="text-rose-500">*</span>
              </label>
              <select
                onChange={onChange}
                className="w-full sm:w-1/2 px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Seleccionar supervisor...</option>
                <option value="sup1">Jefatura Conciliaciones</option>
                <option value="sup2">Gerencia Operaciones</option>
                <option value="sup3">Supervisor Turno AMS</option>
              </select>
            </div>
          </div>
        </section>

        {/* Estado */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2.5 mb-1.5">
              <div className="p-1 px-[5px] bg-slate-50 border border-slate-200 rounded-md shadow-sm">
                <Activity size={16} className="text-slate-500" />
              </div>
              Estado y notas
            </h4>
            <p className="text-[13px] text-slate-500 leading-relaxed pr-4">
              Situación actual de la configuración general y espacio para
              anotaciones funcionales.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 gap-5">
            <div className="sm:w-1/2">
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
                Calculado automáticamente por el nivel de completitud.
              </p>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Observaciones
              </label>
              <textarea
                onChange={onChange}
                placeholder="Comentarios adicionales o notas relevantes (opcional)..."
                className="w-full px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 resize-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
