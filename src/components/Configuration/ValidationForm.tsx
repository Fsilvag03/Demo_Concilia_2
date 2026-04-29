import React, { useState } from "react";
import { CheckSquare, ShieldAlert, AlertTriangle, Save, X, Database, Settings2 } from "lucide-react";
import type { ValidationType } from "./PreparacionDatosSection";

interface ValidationFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ValidationForm({ initialData, onSave, onCancel }: ValidationFormProps) {
  const [formData, setFormData] = useState<any>({
    nombre: "",
    descripcion: "",
    subTipo: "",
    fuente: "",
    campo: "",
    campos: [], // for multiplicidad
    nivel: "Advertencia",
    mensaje: "",
    activa: true,
    condicion: "",
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const isStructureValid = formData.subTipo === "Estructura requerida" || formData.subTipo === "Fuente sin registros" || formData.subTipo === "Cantidad mínima de registros";
  const isMultiField = formData.subTipo === "Duplicidad";

  const handleSave = () => {
    if (!formData.nombre.trim() || !formData.subTipo) return;
    
    // Convert array field if needed
    let campoToSave = formData.campo;
    if (isMultiField) {
      campoToSave = formData.campos.length > 0 ? formData.campos : "";
    } else if (isStructureValid) {
      campoToSave = "";
    }

    onSave({
      ...formData,
      campo: campoToSave,
      tipo: "Validación",
      accion: formData.subTipo,
    });
  };

  return (
    <div className="bg-white rounded-xl h-full flex flex-col shadow-sm border border-slate-200">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
        <div>
          <h4 className="text-[16px] font-bold text-slate-800">
            {initialData ? "Editar validación" : "Nueva validación"}
          </h4>
          <p className="text-[12px] text-slate-500 mt-0.5">
            <span className={formData.activa ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
              {formData.activa ? "Activa" : "Inactiva"}
            </span>
            {" • "}
            <span className={(!formData.nombre || !formData.subTipo) ? "text-rose-500 font-medium" : ""}>
              {(!formData.nombre || !formData.subTipo) ? "Incompleta" : "Completa"}
            </span>
          </p>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        {/* Datos generales */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Datos generales</h5>
            <label className="flex items-center gap-2 text-[13px] font-medium text-slate-600 cursor-pointer">
              <input 
                 type="checkbox" 
                 name="activa" 
                 checked={formData.activa} 
                 onChange={handleChange}
                 className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0"
              />
              Activa
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Nombre de la validación <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Validar que el monto no esté vacío"
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Explica qué se valida y por qué..."
                className="w-full px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-20 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Aplicación */}
        <section>
          <h5 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider mb-4 border-t border-slate-100 pt-6">Aplicación</h5>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Tipo de validación <span className="text-rose-500">*</span>
              </label>
              <select
                name="subTipo"
                value={formData.subTipo}
                onChange={(e) => {
                  handleChange(e);
                  const isStruct = e.target.value === "Estructura requerida" || e.target.value === "Fuente sin registros" || e.target.value === "Cantidad mínima de registros";
                  if (isStruct) {
                    setFormData((prev: any) => ({ ...prev, campo: "", campos: [] }));
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Seleccionar tipo...</option>
                <option value="Estructura requerida">Estructura requerida</option>
                <option value="Campo obligatorio">Campo obligatorio</option>
                <option value="Tipo de dato">Tipo de dato</option>
                <option value="Fecha dentro del periodo operativo">Fecha dentro del periodo operativo</option>
                <option value="Monto válido">Monto válido</option>
                <option value="Duplicidad">Duplicidad (múltiples campos)</option>
                <option value="Fuente sin registros">Fuente sin registros</option>
                <option value="Cantidad mínima de registros">Cantidad mínima de registros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Fuente de aplicación <span className="text-rose-500">*</span>
              </label>
              <select
                name="fuente"
                value={formData.fuente}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Seleccionar fuente...</option>
                <option value="Extracto Bancario">Extracto Bancario</option>
                <option value="Cobros ERP">Cobros ERP</option>
                <option value="Todas las fuentes">Todas las fuentes</option>
              </select>
            </div>

            {!isStructureValid && !isMultiField && (
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Campo asociado <span className="text-rose-500">*</span>
                </label>
                <select
                  name="campo"
                  value={formData.campo}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">Seleccionar campo...</option>
                  <option value="monto">MONTO</option>
                  <option value="fecha_transaccion">FECHA_TRANSACCION</option>
                  <option value="referencia_1">REFERENCIA_1</option>
                  <option value="estado">ESTADO</option>
                </select>
              </div>
            )}

            {isMultiField && (
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Campos asociados para llave de duplicidad <span className="text-rose-500">*</span>
                </label>
                <select
                  multiple
                  name="campos"
                  value={formData.campos || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                    setFormData((prev: any) => ({ ...prev, campos: values }));
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
                >
                  <option value="monto">MONTO</option>
                  <option value="fecha_transaccion">FECHA_TRANSACCION</option>
                  <option value="referencia_1">REFERENCIA_1</option>
                  <option value="estado">ESTADO</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1.5">Mantén presionada la tecla Ctrl/Cmd para seleccionar múltiples.</p>
              </div>
            )}
          </div>
        </section>

        {/* Comportamiento */}
        <section>
          <h5 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider mb-4 border-t border-slate-100 pt-6">Comportamiento</h5>
          <div className="space-y-4">
            {formData.subTipo === "Cantidad mínima de registros" && (
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Cantidad mínima esperada <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="condicion"
                  value={formData.condicion}
                  onChange={handleChange}
                  placeholder="Ej. 100"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Severidad <span className="text-rose-500">*</span>
              </label>
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, nivel: "Fuerte" }))}
                  className={`flex-1 flex justify-center items-center gap-2 py-1.5 px-3 rounded-lg text-[13px] font-bold transition-all ${
                    formData.nivel === "Fuerte" 
                      ? "bg-white text-rose-600 shadow-sm ring-1 ring-slate-200/50" 
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <ShieldAlert size={14} />
                  Bloqueante
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, nivel: "Advertencia" }))}
                  className={`flex-1 flex justify-center items-center gap-2 py-1.5 px-3 rounded-lg text-[13px] font-bold transition-all ${
                    formData.nivel === "Advertencia" 
                      ? "bg-white text-amber-600 shadow-sm ring-1 ring-slate-200/50" 
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <AlertTriangle size={14} />
                  Advertencia
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Mensaje al usuario
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Mensaje que se mostrará si la validación falla..."
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-20 resize-none"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Descartar
        </button>
        <button
          onClick={handleSave}
          disabled={!formData.nombre.trim() || !formData.subTipo}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors"
        >
          <Save size={16} />
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

