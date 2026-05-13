import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Calendar, FileBox, Database, SlidersHorizontal, CheckCircle2, Play, AlertCircle, X, FileText, FileSpreadsheet, Settings2, UploadCloud, RefreshCw, AlertTriangle, Check, ArrowRight, FileCheck, FileX, ChevronDown, ChevronRight, Layers, GitMerge
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FormularioProcesoProps {
  isOpen: boolean;
  onClose: () => void;
  onStartIngesta?: (procesoId: string, fecha: string) => void;
  procesoParams?: { procesoId: string, fecha: string };
}

type EstadoCarga = 'pendiente' | 'cargada' | 'cargada_advertencias' | 'error';

interface FuenteData {
  id: string;
  name: string;
  type: 'TXT' | 'CSV' | 'Excel';
  required: boolean;
  sheetExpected?: string;
  estado: EstadoCarga;
  archivo?: string;
  hojaLeida?: string;
  registrosLeidos?: number;
  mensaje?: string;
}

export function FormularioProceso({ isOpen, onClose, onStartIngesta, procesoParams }: FormularioProcesoProps) {
  const isEmbedded = !!procesoParams;
  const [procesoId, setProcesoId] = useState(procesoParams?.procesoId || '1');
  const [fechaOperativa, setFechaOperativa] = useState(procesoParams?.fecha || new Date().toISOString().split('T')[0]);

  const [fase, setFase] = useState<'ingesta' | 'preparacion_loading' | 'preparacion_results'>('ingesta');
  const [prepResult, setPrepResult] = useState<any>(null);
  const [selectedRuleCategory, setSelectedRuleCategory] = useState<Record<string, string | null>>({});

  // Mock data for the selected process
  const procesos = [
    { id: '1', name: 'Conciliación Bancaria Local', version: 'v2.4.1 (Publicada)', baseFecha: 'Día actual' },
    { id: '2', name: 'Tarjetas de Crédito Visa/MC', version: 'v1.1.0 (Publicada)', baseFecha: 'Día anterior' },
    { id: '3', name: 'Recaudación App Móvil', version: 'v3.0.0 (Publicada)', baseFecha: 'Fecha definida por el usuario' },
  ];

  const currentProceso = procesos.find(p => p.id === procesoId) || procesos[0];

  const initialFuentes: FuenteData[] = useMemo(() => procesoId === '1' ? [
    { id: 'f1', name: 'Core Bancario', type: 'TXT', required: true, estado: isEmbedded ? 'error' : 'pendiente', archivo: isEmbedded ? 'core_bancario_error.txt' : undefined, mensaje: isEmbedded ? 'No se encontró el campo configurado "Creditos".' : undefined },
    { id: 'f2', name: 'Switch Transaccional', type: 'CSV', required: true, estado: isEmbedded ? 'cargada_advertencias' : 'pendiente', archivo: isEmbedded ? 'switch_trx_0512.csv' : undefined, registrosLeidos: isEmbedded ? 4518 : undefined, mensaje: isEmbedded ? 'Se encontraron los campos configurados para la fuente, pero faltan algunos campos no críticos mapeados.' : undefined },
    { id: 'f3', name: 'Reversos y anulaciones', type: 'Excel', required: false, sheetExpected: 'Reversos_Hoy', estado: isEmbedded ? 'cargada' : 'pendiente', archivo: isEmbedded ? 'reversos_final.xlsx' : undefined, hojaLeida: isEmbedded ? 'Reversos_Hoy' : undefined, registrosLeidos: isEmbedded ? 342 : undefined }
  ] : [
    { id: 'f1', name: 'Extracto TC', type: 'Excel', required: true, sheetExpected: 'Extracto', estado: isEmbedded ? 'cargada' : 'pendiente', archivo: isEmbedded ? 'extracto_tc_0512.xlsx' : undefined, hojaLeida: 'Extracto', registrosLeidos: isEmbedded ? 1250 : undefined },
    { id: 'f2', name: 'Adquirencia', type: 'CSV', required: true, estado: isEmbedded ? 'cargada_advertencias' : 'pendiente', archivo: isEmbedded ? 'adquirencia_0512.csv' : undefined, registrosLeidos: isEmbedded ? 1245 : undefined, mensaje: isEmbedded ? 'Faltan campos no críticos en la estructura.' : undefined },
  ], [procesoId, isEmbedded]);

  const [fuentes, setFuentes] = useState<FuenteData[]>(initialFuentes);

  // Reset state when opening/closing or changing process
  React.useEffect(() => {
    if (isOpen) {
      setFuentes(initialFuentes);
    }
  }, [isOpen, procesoId, initialFuentes]);

  const handleNextStep = () => {
    onStartIngesta?.(procesoId, fechaOperativa);
  };

  const handleSimularCarga = (id: string, result: 'ok' | 'warn' | 'error' | 'pendiente') => {
    setFuentes(prev => prev.map(f => {
      if (f.id === id) {
        if (result === 'ok') {
          return { ...f, estado: 'cargada', archivo: `archivo_${f.name.toLowerCase().replace(/ /g, '_')}.${f.type.toLowerCase()}`, hojaLeida: f.sheetExpected, registrosLeidos: Math.floor(Math.random() * 5000) + 1000, mensaje: undefined };
        } else if (result === 'warn') {
          return { ...f, estado: 'cargada_advertencias', archivo: `archivo_warn_${f.name.toLowerCase().replace(/ /g, '_')}.${f.type.toLowerCase()}`, hojaLeida: f.sheetExpected, registrosLeidos: Math.floor(Math.random() * 5000) + 1000, mensaje: `Se encontraron los campos configurados para la fuente, pero falta el campo no crítico "Campo_Opcional".` };
        } else if (result === 'error') {
          const rand = Math.random();
          let msj = 'El archivo no pudo procesarse. Verifica que no esté dañado o protegido.';
          if (rand > 0.7) {
            msj = f.type === 'Excel' ? `No se encontró la hoja configurada "${f.sheetExpected}".` : `El archivo debe tener formato ${f.type}.`;
          } else if (rand > 0.4) {
            msj = 'No se encontraron registros para cargar.';
          } else if (rand > 0.1) {
            msj = 'No se encontró el campo configurado "Crédito".';
          }
          
          return { ...f, estado: 'error', archivo: `error_${f.name.toLowerCase().replace(/ /g, '_')}.${f.type.toLowerCase()}`, hojaLeida: undefined, registrosLeidos: 0, mensaje: msj };
        } else if (result === 'pendiente') {
          return { ...f, estado: 'pendiente', archivo: undefined, hojaLeida: undefined, registrosLeidos: undefined, mensaje: undefined };
        }
      }
      return f;
    }));
  };

  const handleStartPreparacion = () => {
    setFase('preparacion_loading');
    
    // Determine result based on sources state
    const hasError = fuentes.some(f => f.estado === 'error');
    const hasWarn = fuentes.some(f => f.estado === 'cargada_advertencias');
    const hasPendingRequired = fuentes.some(f => f.required && f.estado === 'pendiente');

    const totalLeidos = fuentes.reduce((acc, f) => acc + (f.registrosLeidos || 0), 0);
    const mockErrors = hasError || hasPendingRequired ? [
      {
        id: 1,
        bloque: 'validaciones',
        fuente: fuentes.find(f => f.estado === 'error')?.name || 'Core Bancario',
        reglaOControl: 'Validación de estructura',
        registrosAfectados: null,
        motivo: 'El archivo está corrupto o falta el campo "Crédito".',
        severidad: 'alta',
        bloqueante: true
      }
    ] : hasWarn ? [
      {
        id: 1,
        bloque: 'consistencia',
        fuente: fuentes.find(f => f.estado === 'cargada_advertencias')?.name || 'Adquirencia',
        reglaOControl: 'Campos opcionales',
        registrosAfectados: 15,
        motivo: 'Faltan campos no críticos en la estructura.',
        severidad: 'baja',
        bloqueante: false
      }
    ] : [];

    const mockResult = {
      estado: mockErrors.some(e => e.bloqueante) ? 'Preparación con errores' : mockErrors.length > 0 ? 'Preparación con observaciones' : 'Listo para conciliar',
      registrosLeidos: totalLeidos,
      registrosIncluidos: mockErrors.some(e => e.bloqueante) ? 0 : totalLeidos - (hasWarn ? 15 : 0),
      registrosExcluidos: mockErrors.some(e => e.bloqueante) ? totalLeidos : (hasWarn ? 15 : 0),
      validacionesEjecutadas: 18,
      normalizacionesAplicadas: mockErrors.some(e => e.bloqueante) ? 0 : 4,
      transformacionesEjecutadas: mockErrors.some(e => e.bloqueante) ? 0 : 2,
      controlesEjecutados: mockErrors.some(e => e.bloqueante) ? 1 : 5,
      detalles: mockErrors,
      fuentesResultados: fuentes.filter(f => f.estado !== 'pendiente').map(f => {
        const isFuenteError = f.estado === 'error';
        const isFuenteWarn = f.estado === 'cargada_advertencias';
        const leidos = f.registrosLeidos || 0;
        const totalEjecutadasRule = isFuenteError ? 0 : 1; // Simplify logic just for mock

        return {
          id: f.id,
          name: f.name,
          archivo: f.archivo,
          required: f.required,
          estado: isFuenteError ? 'error' : isFuenteWarn ? 'advertencia' : 'ok',
          detallesFuente: mockErrors.filter(e => e.fuente === f.name),
          resumenEjecucion: {
            evaluados: leidos,
            correctos: isFuenteError ? 0 : leidos - (isFuenteWarn ? 15 : 0),
            observaciones: isFuenteWarn ? 15 : 0,
            error: isFuenteError ? leidos : 0,
            excluidos: isFuenteError ? leidos : (isFuenteWarn ? 15 : 0)
          },
          resumenReglas: {
            validaciones: { total: 5, ejecutadas: isFuenteError ? 1 : 5, aplicadas: [
              { nombre: 'Validación de estructura', estado: isFuenteError ? 'error' : 'ok', detalle: isFuenteError ? 'El archivo está corrupto o falta el campo "Crédito".' : 'La estructura del archivo coincide con el formato esperado.' },
              { nombre: 'Comprobación de tipos', estado: isFuenteError ? 'pendiente' : 'ok', detalle: 'Los tipos de datos de las columnas numéricas y de fecha han sido validados.' },
              { nombre: 'Campos requeridos', estado: isFuenteError ? 'pendiente' : 'ok', detalle: 'Se validó la existencia de todos los campos marcados como obligatorios.' },
              { nombre: 'Longitud de campos', estado: isFuenteError ? 'pendiente' : 'ok', detalle: 'Las cadenas de texto y valores en campos coinciden con longitudes requeridas.' },
              { nombre: 'Formato UTF-8', estado: isFuenteError ? 'pendiente' : 'ok', detalle: 'La codificación del archivo se procesa correctamente.' },
            ]},
            normalizaciones: { total: 3, ejecutadas: isFuenteError ? 0 : 3, aplicadas: [
              { nombre: 'Normalización de moneda', estado: isFuenteError ? 'pendiente' : 'ok', detalle: 'Se unificaron los símbolos y formatos de moneda.' },
              { nombre: 'Formato de fecha', estado: isFuenteError ? 'pendiente' : 'ok', detalle: 'Las fechas fueron transformadas al estándar de la aplicación (YYYY-MM-DD).' },
              { nombre: 'Limpieza de espacios', estado: isFuenteError ? 'pendiente' : 'ok', detalle: 'Se eliminaron espacios vacíos en descripciones.' },
            ]},
            transformaciones: { total: 2, ejecutadas: isFuenteError ? 0 : 2, aplicadas: [
              { nombre: 'Generación de ID único', estado: isFuenteError ? 'pendiente' : 'ok', detalle: 'Se generaron hashes únicos para cada registro basados en sus campos clave.' },
              { nombre: 'Columna de agrupamiento', estado: isFuenteError ? 'pendiente' : 'ok', detalle: 'Columna calculada para clasificación del registro generada.' },
            ]},
            consistencia: { total: 2, ejecutadas: isFuenteError ? 0 : (isFuenteWarn ? 1 : 2), aplicadas: [
              { nombre: 'Campos opcionales', estado: isFuenteWarn ? 'advertencia' : isFuenteError ? 'pendiente' : 'ok', detalle: isFuenteWarn ? 'Faltan campos no críticos en la estructura, pero el proceso puede continuar.' : 'Los campos opcionales requeridos para cruces avanzados están presentes.' },
              { nombre: 'Balances numéricos', estado: isFuenteWarn ? 'pendiente' : isFuenteError ? 'pendiente' : 'ok', detalle: 'No se dectectan montos sin sentido numérico.' },
            ]},
          }
        };
      })
    };

    setTimeout(() => {
      setPrepResult(mockResult);
      setFase('preparacion_results');
    }, 2500);
  };

  const processIdString = useMemo(() => `CONC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, []);
  const [activeTab, setActiveTab] = useState<'config' | 'ingesta'>('ingesta');

  const estadoGeneralIngesta = useMemo(() => {
    // ... rest of useMemo
    const requeridas = fuentes.filter(f => f.required);
    const faltanRequeridas = requeridas.some(f => f.estado === 'pendiente');
    const requeridasConError = requeridas.some(f => f.estado === 'error');
    const requeridasConWarn = requeridas.some(f => f.estado === 'cargada_advertencias');
    const algunaConError = requeridasConError || fuentes.some(f => f.estado === 'error');

    if (requeridas.every(f => f.estado === 'cargada') && fuentes.every(f => f.estado === 'cargada' || f.estado === 'pendiente')) {
      return { status: 'Lista para preparación', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={16}/>, allowed: true };
    }
    if (faltanRequeridas && !algunaConError) {
      return { status: 'Pendiente de carga', color: 'text-slate-600 bg-slate-100 border-slate-200', icon: <AlertCircle size={16}/>, allowed: false };
    }
    if (faltanRequeridas || requeridasConError) {
      return { status: 'Carga incompleta', color: 'text-rose-600 bg-rose-50 border-rose-200', icon: <FileX size={16}/>, allowed: false };
    }
    if (requeridasConWarn || fuentes.some(f => f.estado === 'cargada_advertencias')) {
      return { status: 'Carga con advertencias', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <AlertTriangle size={16}/>, allowed: true };
    }
    return { status: 'Lista para preparación', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={16}/>, allowed: true };
  }, [fuentes]);


  const content = (
          <div className="w-full max-h-[90vh] overflow-hidden flex flex-col bg-slate-50 rounded-2xl shadow-2xl relative">
            {/* Header */}
            <div className="bg-white border-b border-primary/10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.04)] relative overflow-hidden shrink-0 z-20 rounded-t-2xl">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-secondary opacity-70"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.03] rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="px-6 md:px-8 py-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[10px] bg-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/40"></div>
                    <GitMerge size={20} className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-0.5">Nuevo Proceso</span>
                    <h1 className="text-[16px] font-bold text-slate-800 tracking-tight flex items-center gap-2 leading-tight">
                      Configurar conciliación
                    </h1>
                  </div>
                </div>
                
                <button 
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors relative z-10 shadow-sm border border-transparent hover:border-rose-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto w-full bg-slate-50/50">
              <div className="max-w-6xl mx-auto h-full relative">
                <div className="p-8 pb-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center relative h-full">
                  
                  {/* Left Column: Inputs */}
                  <div className="md:col-span-6 relative mt-6 md:mt-0">
                    <h3 className="text-[14px] font-black text-slate-800 tracking-tight mb-4 flex items-center gap-2 pb-2 border-b border-slate-100/50">
                      <Settings2 size={16} className="text-primary" /> Parámetros de ejecución
                    </h3>

                    <div className="space-y-6">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Proceso a ejecutar
                          </label>
                          <div className={`relative ${isEmbedded ? 'opacity-70 pointer-events-none' : ''}`}>
                            <select 
                              className="w-full border border-slate-200 bg-white text-slate-700 text-[13.5px] font-medium rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer appearance-none shadow-sm"
                              value={procesoId}
                              disabled={isEmbedded}
                              onChange={(e) => {
                                setProcesoId(e.target.value);
                                const p = procesos.find(x => x.id === e.target.value);
                                if (p?.baseFecha === 'Día actual') {
                                  setFechaOperativa(new Date().toISOString().split('T')[0]);
                                } else if (p?.baseFecha === 'Día anterior') {
                                  const d = new Date();
                                  d.setDate(d.getDate() - 1);
                                  setFechaOperativa(d.toISOString().split('T')[0]);
                                } else {
                                  setFechaOperativa('');
                                }
                              }}
                            >
                              {procesos.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Fecha operativa
                          </label>
                          <div className={`relative ${isEmbedded ? 'opacity-70 pointer-events-none' : ''}`}>
                            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="date"
                              required
                              disabled={isEmbedded}
                              value={fechaOperativa}
                              onChange={(e) => setFechaOperativa(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13.5px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer shadow-sm"
                            />
                          </div>
                          <div className="mt-3 flex items-start gap-2 bg-indigo-50/50 border border-indigo-100/50 rounded-lg px-3 py-2.5">
                            <Calendar size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                            <p className="text-[11.5px] font-medium text-slate-600 leading-tight">
                              Regla configurada: <span className="font-bold text-indigo-700">{currentProceso.baseFecha}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                  </div>

                  {/* Right Column: Informational Summary */}
                  <div className="md:col-span-6 bg-white relative rounded-3xl border border-slate-100 p-6 shadow-sm shadow-slate-200/50">
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
                        <SlidersHorizontal size={16} className="text-slate-400" />
                        Resumen de configuración
                      </h3>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 whitespace-nowrap shrink-0">
                        <span className="uppercase tracking-widest text-[9px] font-bold text-slate-400">Versión</span>
                        <span className="text-[11px] font-bold text-slate-600">{currentProceso.version}</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[13px] font-black text-slate-800 tracking-tight mb-3 flex items-center gap-2">
                          <Database size={14} className="text-primary" /> Fuentes y datos requeridos
                        </h4>
                        <ul className="space-y-3 ml-1">
                          {fuentes.map(f => (
                            <li key={f.id} className="flex items-center gap-2.5">
                              {f.type === 'Excel' ? <FileSpreadsheet size={14} className={f.required ? "text-emerald-500 shrink-0" : "text-emerald-400 shrink-0"} /> : f.type === 'CSV' ? <Database size={14} className={f.required ? "text-sky-500 shrink-0" : "text-sky-400 shrink-0"} /> : <FileText size={14} className={f.required ? "text-indigo-500 shrink-0" : "text-indigo-400 shrink-0"} />}
                              <span className={`text-[13px] ${f.required ? 'font-medium text-slate-700' : 'font-medium text-slate-600'}`}>{f.name}</span>
                              <span className="text-[12px] text-slate-400 font-medium whitespace-nowrap">· {f.type}</span>
                              {!f.required && (
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-200/50 px-1.5 py-0.5 rounded-md ml-auto">Opcional</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[13px] font-black text-slate-800 tracking-tight mb-3 flex items-center gap-2">
                          <FileBox size={14} className="text-primary" /> Entregables a generar
                        </h4>
                        {procesoId === '3' ? (
                          <div className="flex items-start gap-2.5 text-[12.5px] text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-100 shadow-sm">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                            <span className="font-medium leading-relaxed">No hay archivos de salida configurados. Vista solo en pantalla.</span>
                          </div>
                        ) : (
                          <ul className="space-y-2.5 ml-1">
                            <li className="flex items-center gap-2.5">
                              <FileSpreadsheet size={14} className="text-emerald-600 shrink-0" />
                              <span className="text-[13px] font-medium text-slate-700">Reporte de diferencias</span>
                              <span className="text-[12px] text-slate-400 font-medium">· Excel</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                              <FileSpreadsheet size={14} className="text-emerald-600 shrink-0" />
                              <span className="text-[13px] font-medium text-slate-700">Resumen de conciliación</span>
                              <span className="text-[12px] text-slate-400 font-medium">· Excel</span>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white shrink-0 border-t border-slate-100 relative z-10 w-full">
              <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
                <>
                  <button 
                    onClick={onClose}
                    className="px-5 py-2.5 text-[13.5px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleNextStep}
                    className="px-6 py-2.5 text-[14px] font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    Continuar a ingesta
                    <ArrowRight size={16} className="text-white/80" />
                  </button>
                </>
              </div>
            </div>
          </div>
  );

  if (isEmbedded) {
    return (
      <div className="flex-1 flex flex-col bg-slate-100 relative w-full h-full overflow-hidden">
        {/* Bright Professional Header */}
        <div className="bg-white border-b border-slate-200/80 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden shrink-0 z-20">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          <div className="w-full flex flex-col pt-5 pb-4 px-6 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-2.5 py-0.5 rounded border border-primary/20 text-primary-dark text-[10px] font-bold tracking-widest uppercase bg-primary/5 shadow-sm">
                    {fase === 'ingesta' ? 'Fase 1: Ingesta' : fase.startsWith('preparacion') ? 'Fase 2: Preparación' : 'Fase 3: Conciliación'}
                  </div>
                  {fase === 'ingesta' && (
                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded border text-[10px] font-bold tracking-widest uppercase shadow-sm ${
                      estadoGeneralIngesta.allowed ? 'border-secondary/40 bg-secondary/10 text-emerald-700' : 'border-rose-500/30 bg-rose-500/10 text-rose-600'
                    }`}>
                      {estadoGeneralIngesta.allowed ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {estadoGeneralIngesta.allowed ? 'Listo para preparación' : 'Faltan requerimientos'}
                    </div>
                  )}
                  {fase.startsWith('preparacion') && prepResult && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded border text-[11px] font-bold tracking-widest uppercase shadow-sm ${prepResult.estado === 'Listo para conciliar' ? 'border-secondary/40 bg-secondary/10 text-emerald-700' : prepResult.estado === 'Preparación con observaciones' ? 'border-amber-500/30 bg-amber-500/10 text-amber-600' : 'border-rose-500/30 bg-rose-500/10 text-rose-600'}`}>
                      {prepResult.estado === 'Listo para conciliar' ? <CheckCircle2 size={12} /> : prepResult.estado === 'Preparación con observaciones' ? <AlertTriangle size={12} /> : <AlertCircle size={12} />}
                      {prepResult.estado}
                    </div>
                  )}
                </div>
                {/* Título: Proceso + Identificador */}
                <h1 className="text-2xl font-bold text-primary-dark tracking-tight flex items-center">
                  {currentProceso.name} 
                  <span className="text-primary/40 font-semibold ml-2 text-xl tracking-normal">#{processIdString}</span>
                </h1>
              </div>

              {/* Contenedor Versión, Fecha Operativa y Cerrar */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-6 px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 shadow-sm ring-1 ring-primary/5 h-[52px]">
                  <div className="flex justify-center flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Versión</span>
                    <span className="text-[13px] font-bold text-slate-800 leading-none">{currentProceso.version}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="flex justify-center flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Fecha Operativa</span>
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800 leading-none">
                      <Calendar size={14} className="text-secondary" />
                      {fechaOperativa}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={onClose}
                  className="w-[52px] h-[52px] flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 border border-slate-200 bg-white rounded-lg transition-colors shadow-sm"
                  title="Cerrar y volver a Conciliaciones"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Fases / Stepper Visual */}
            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between gap-2 md:gap-4 w-full relative max-w-5xl">
              {[
                { id: 1, name: 'Ingesta de Datos', state: fase === 'ingesta' ? 'current' : 'completed' },
                { id: 2, name: 'Preparación', state: fase.startsWith('preparacion') ? 'current' : fase === 'reglas_y_cruces' ? 'completed' : 'pending' },
                { id: 3, name: 'Reglas y Cruces', state: fase === 'reglas_y_cruces' ? 'current' : 'pending' },
                { id: 4, name: 'Resultados', state: 'pending' }
              ].map((step, idx, arr) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 group shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shadow-sm transition-all duration-300 z-10 ${
                      step.state === 'completed' ? 'bg-secondary text-primary-dark' :
                      step.state === 'current' ? 'bg-primary text-white ring-4 ring-primary/10' :
                      'bg-slate-100 border border-slate-200 text-slate-400'
                    }`}>
                      {step.state === 'completed' ? <Check size={14} strokeWidth={3} /> : step.id}
                    </div>
                    <span className={`text-[12px] font-bold tracking-wide whitespace-nowrap hidden sm:block ${
                      step.state === 'completed' ? 'text-slate-500' :
                      step.state === 'current' ? 'text-primary' :
                      'text-slate-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className={`flex-1 min-w-[20px] h-px hidden sm:block ${
                      step.state === 'completed' ? 'bg-secondary' : 'bg-slate-200'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Body Area */}
        <div className="flex-1 overflow-y-auto w-full px-8 py-8 md:px-12 relative bg-slate-100/80">
          
          {fase === 'ingesta' && (
            <div className="w-full relative z-10 animate-in fade-in duration-300">
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-primary-dark">Fuentes de información requeridas</h2>
                  <p className="text-[15px] text-slate-500 mt-1">Carga los archivos necesarios para iniciar la preparación de datos.</p>
                </div>
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${estadoGeneralIngesta.color} shadow-sm transition-colors`}>
                  {estadoGeneralIngesta.icon}
                  <span className="text-[14px] font-bold tracking-wide">{estadoGeneralIngesta.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fuentes.map((fuente) => (
                  <div key={fuente.id} className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col h-full group ${fuente.estado === 'cargada' ? 'border-secondary/40 ring-1 ring-secondary/20' : 'border-primary/10 hover:border-primary/30'}`}>
                    
                    {/* Top info */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${fuente.estado === 'cargada' ? 'border-secondary/20 bg-secondary/5 text-secondary-dark' : 'border-primary/10 bg-primary/5 text-primary'}`}>
                          {fuente.type === 'Excel' ? <FileSpreadsheet size={20} /> : fuente.type === 'CSV' ? <Database size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                          <h4 className="text-[15px] font-bold text-primary-dark leading-tight mb-1">{fuente.name}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${fuente.required ? 'text-primary/70 bg-primary/5 border border-primary/10' : 'text-slate-500 bg-white border border-slate-200 border-dashed'}`}>
                            {fuente.required ? 'Requerida' : 'Opcional'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[13px] text-zinc-600 mb-5 border-t border-zinc-100 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-zinc-500">Formato:</span>
                        <strong className="text-zinc-800 font-medium">{fuente.type}</strong>
                      </div>
                      {fuente.sheetExpected && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-zinc-500">Hoja:</span>
                          <strong className="text-zinc-800 font-medium max-w-[120px] truncate" title={fuente.sheetExpected}>{fuente.sheetExpected}</strong>
                        </div>
                      )}
                    </div>

                    {/* Upload Actions / Status */}
                    <div className="mt-auto pt-2">
                      {fuente.estado === 'pendiente' ? (
                        <div className="border border-dashed border-zinc-300 rounded-xl p-5 bg-zinc-50 flex flex-col items-center justify-center text-center hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300 cursor-pointer relative overflow-hidden group/drop">
                          <UploadCloud size={28} className="text-zinc-400 group-hover/drop:text-zinc-600 mb-2 transition-colors duration-300" />
                          <span className="text-[13px] font-bold text-zinc-700 group-hover/drop:text-zinc-900">Seleccionar archivo</span>
                          
                          {/* Hidden dummy buttons for prototype simulation */}
                          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-2 opacity-0 group-hover/drop:opacity-100 transition-all duration-300">
                             <div className="flex gap-2">
                               <button onClick={(e) => { e.stopPropagation(); handleSimularCarga(fuente.id, 'ok') }} className="px-3 py-1.5 text-[11px] font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded transition-colors">OK</button>
                               <button onClick={(e) => { e.stopPropagation(); handleSimularCarga(fuente.id, 'warn') }} className="px-3 py-1.5 text-[11px] font-bold border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded transition-colors">WARN</button>
                               <button onClick={(e) => { e.stopPropagation(); handleSimularCarga(fuente.id, 'error') }} className="px-3 py-1.5 text-[11px] font-bold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded transition-colors">ERR</button>
                             </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`border rounded-xl p-4 transition-all duration-300 ${fuente.estado === 'cargada' ? 'bg-emerald-50/30 border-emerald-200' : fuente.estado === 'cargada_advertencias' ? 'bg-amber-50/30 border-amber-200' : 'bg-rose-50/30 border-rose-200'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`shrink-0 mt-0.5 p-1 rounded-full bg-white shadow-sm border ${fuente.estado === 'cargada' ? 'text-emerald-600 border-emerald-100' : fuente.estado === 'cargada_advertencias' ? 'text-amber-600 border-amber-100' : 'text-rose-600 border-rose-100'}`}>
                              {fuente.estado === 'cargada' ? <CheckCircle2 size={16} /> : fuente.estado === 'cargada_advertencias' ? <AlertTriangle size={16} /> : <AlertCircle size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block text-[13px] font-medium text-zinc-900 truncate" title={fuente.archivo}>{fuente.archivo}</span>
                              <span className="block text-[12px] text-zinc-500 mt-1">
                                {fuente.estado === 'error' ? 'Validación fallida' : <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{fuente.registrosLeidos?.toLocaleString() || 0} registros leídos</span>}
                              </span>
                              
                              {fuente.mensaje && (
                                <div className={`mt-3 text-[12px] leading-relaxed p-2.5 rounded-lg border ${fuente.estado === 'error' ? 'bg-rose-50 text-rose-800 border-rose-100' : 'bg-amber-50 text-amber-800 border-amber-100'}`}>
                                  {fuente.mensaje}
                                </div>
                              )}
                            </div>
                            <button 
                              onClick={() => handleSimularCarga(fuente.id, 'pendiente')}
                              className="text-zinc-400 hover:text-zinc-800 transition-colors shrink-0 p-1.5 bg-white rounded flex items-center justify-center border border-zinc-200 shadow-sm"
                              title="Reemplazar archivo"
                            >
                              <RefreshCw size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fase === 'preparacion_loading' && (
            <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-300 min-h-[400px]">
              <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-slate-800 border-r-slate-800 animate-spin mb-8 shadow-sm"></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Preparando Datos</h3>
              <p className="text-slate-500 text-[15px] max-w-md text-center">
                Ejecutando validaciones, normalizaciones, transformaciones y controles de consistencia...
              </p>
            </div>
          )}

          {fase === 'preparacion_results' && prepResult && (
            <div className="w-full relative z-10 animate-in fade-in duration-300">
               <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Resultados de la Preparación</h2>
                  <p className="text-[15px] text-slate-500 mt-1">Resumen de la etapa de preparación de datos.</p>
                </div>
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-sm ${
                   prepResult.estado === 'Listo para conciliar' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
                   prepResult.estado === 'Preparación con observaciones' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
                   'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {prepResult.estado === 'Listo para conciliar' ? <CheckCircle2 size={18} /> : prepResult.estado === 'Preparación con observaciones' ? <AlertTriangle size={18} /> : <AlertCircle size={18} />}
                  <span className="text-[14px] font-bold tracking-wide">{prepResult.estado}</span>
                </div>
              </div>

              {/* Fuentes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {prepResult.fuentesResultados?.map((fuente: any) => (
                  <div key={fuente.id} className="bg-white border flex flex-col text-left rounded-2xl shadow-sm border-slate-200 overflow-hidden">
                    {/* Header Fuente */}
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                      <div className={`p-1.5 rounded-full ${fuente.estado === 'error' ? 'bg-rose-100 text-rose-600' : fuente.estado === 'advertencia' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {fuente.estado === 'error' ? <FileX size={18} /> : fuente.estado === 'advertencia' ? <AlertTriangle size={18} /> : <FileCheck size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[14px] font-bold leading-none text-slate-800">{fuente.name}</h3>
                          <span className={`text-[8.5px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${fuente.required ? 'text-primary border border-primary/20 bg-primary/5' : 'text-slate-500 border border-slate-200 bg-white border-dashed'}`}>
                            {fuente.required ? 'Requerida' : 'Opcional'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{fuente.archivo}</p>
                      </div>
                    </div>
                    
                    {/* Resumen Ejecución */}
                    <div className="p-4 border-b border-slate-100 bg-white">
                      <h4 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Resumen de Ejecución</h4>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex-1 flex flex-col p-2 bg-slate-50 rounded-lg border border-slate-100 items-center justify-center text-center">
                          <span className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Evaluados</span>
                          <span className="text-[14px] font-bold text-slate-700 leading-none">{fuente.resumenEjecucion.evaluados.toLocaleString()}</span>
                        </div>
                        <div className="flex-1 flex flex-col p-2 bg-emerald-50 rounded-lg border border-emerald-100/50 items-center justify-center text-center">
                          <span className="text-[9px] uppercase font-bold text-emerald-600 mb-0.5">Correctos</span>
                          <span className="text-[14px] font-bold text-emerald-600 leading-none">{fuente.resumenEjecucion.correctos.toLocaleString()}</span>
                        </div>
                        <div className="flex-1 flex flex-col p-2 bg-amber-50 rounded-lg border border-amber-100/50 items-center justify-center text-center">
                          <span className="text-[9px] uppercase font-bold text-amber-600 mb-0.5">Obs.</span>
                          <span className="text-[14px] font-bold text-amber-500 leading-none">{fuente.resumenEjecucion.observaciones.toLocaleString()}</span>
                        </div>
                        <div className="flex-1 flex flex-col p-2 bg-rose-50 rounded-lg border border-rose-100/50 items-center justify-center text-center">
                          <span className="text-[9px] uppercase font-bold text-rose-500 mb-0.5">Errores</span>
                          <span className="text-[14px] font-bold text-rose-500 leading-none">{fuente.resumenEjecucion.error.toLocaleString()}</span>
                        </div>
                        <div className="flex-1 flex flex-col p-2 bg-indigo-50 rounded-lg border border-indigo-100/50 items-center justify-center text-center">
                          <span className="text-[9px] uppercase font-bold text-indigo-500 mb-0.5">Excluidos</span>
                          <span className="text-[14px] font-bold text-indigo-500 leading-none">{fuente.resumenEjecucion.excluidos.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Resumen Reglas */}
                    <div className="p-3 border-b border-slate-100 bg-slate-50/30">
                      <h4 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        Reglas Aplicadas
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                          {Object.values(fuente.resumenReglas).reduce((acc: any, val: any) => acc + val.ejecutadas, 0)} totales
                        </span>
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(fuente.resumenReglas).map(([key, data]: [string, any]) => {
                          const isSelected = selectedRuleCategory[fuente.id] === key;
                          return (
                            <button
                               key={key} 
                               onClick={() => setSelectedRuleCategory(prev => ({ ...prev, [fuente.id]: isSelected ? null : key }))}
                               className={`w-full flex justify-between items-center px-2 py-1.5 rounded-lg border transition-all text-left group ${isSelected ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-white border-transparent hover:border-slate-300 shadow-sm'}`}
                            >
                              <span className={`text-[11px] font-bold capitalize transition-colors ${isSelected ? 'text-primary' : 'text-slate-600 group-hover:text-slate-800'}`}>{key}</span>
                              <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
                                <span className={data.ejecutadas < data.total ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>{data.ejecutadas}</span>
                                <span className="text-slate-300 text-[10px]">/</span>
                                <span>{data.total}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Detalle de Reglas (Conditional) */}
                    <div className="p-4 bg-white flex-1 flex flex-col">
                       {selectedRuleCategory[fuente.id] ? (
                          <div className="animate-in fade-in duration-300">
                             <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                                Detalle de {selectedRuleCategory[fuente.id]}
                                <div className="h-px bg-slate-100 flex-1"></div>
                             </h5>
                             <ul className="space-y-2">
                               {fuente.resumenReglas[selectedRuleCategory[fuente.id]].aplicadas.map((regla: any, i: number) => (
                                 <li key={i} className="flex flex-col gap-1 p-2 rounded-xl border border-slate-100 bg-slate-50/50">
                                   <div className="flex items-center gap-2">
                                      {regla.estado === 'error' ? <X size={14} className="text-rose-500 shrink-0"/> :
                                       regla.estado === 'advertencia' ? <AlertTriangle size={14} className="text-amber-500 shrink-0"/> :
                                       regla.estado === 'pendiente' ? <div className="w-1.5 h-1.5 m-1 rounded-full bg-slate-300 shrink-0"></div> :
                                       <Check size={14} className="text-emerald-500 shrink-0"/>}
                                      <span className={`text-[11.5px] font-bold ${regla.estado === 'pendiente' ? 'text-slate-400' : 'text-slate-700'}`}>{regla.nombre}</span>
                                   </div>
                                   {regla.detalle && (
                                     <p className="text-[10.5px] text-slate-500 pl-6 leading-snug">
                                       {regla.detalle}
                                     </p>
                                   )}
                                 </li>
                               ))}
                             </ul>
                          </div>
                       ) : (
                          <div className="animate-in fade-in duration-300 h-full flex flex-col">
                             <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                                 Alertas Detección
                                <div className="h-px bg-slate-100 flex-1"></div>
                             </h5>
                             
                             {fuente.detallesFuente && fuente.detallesFuente.length > 0 ? (
                               <div className="space-y-2">
                                 {fuente.detallesFuente.map((detalle: any, idx: number) => (
                                   <div key={idx} className={`p-2 rounded-lg border ${detalle.bloqueante ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                                     <div className="flex justify-between items-start mb-0.5 gap-2">
                                       <span className="text-[11.5px] font-bold text-slate-800 leading-tight">{detalle.reglaOControl}</span>
                                       <span className={`px-1.5 py-[1px] text-[8.5px] font-bold uppercase tracking-widest rounded shrink-0 ${detalle.bloqueante ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                          {detalle.bloqueante ? 'Error' : 'Aviso'}
                                       </span>
                                     </div>
                                     <p className="text-[10.5px] text-slate-600 mt-1 leading-snug">{detalle.motivo}</p>
                                   </div>
                                 ))}
                               </div>
                             ) : (
                               <div className="h-full min-h-[100px] flex flex-col items-center justify-center text-center p-3 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                                  <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-1.5 shadow-sm text-emerald-500">
                                    <CheckCircle2 size={12} />
                                  </div>
                                  <span className="text-[11.5px] font-bold text-slate-700">Sin alertas detectadas</span>
                                  <span className="text-[10px] text-slate-500 max-w-[180px]">Haz clic en cualquier categoría para examinar las reglas aplicadas.</span>
                               </div>
                             )}
                          </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Refined Footer Actions - Full Width */}
        <div className="bg-white px-6 py-4 md:px-10 shrink-0 relative flex items-center justify-between border-t border-slate-200/80 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.08)] z-20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none"></div>
          {fase === 'ingesta' ? (
            <>
               <button 
                 onClick={onClose}
                 className="px-5 py-2 text-[13px] font-semibold text-primary hover:text-primary-dark bg-white hover:bg-slate-50 rounded-lg transition-colors border border-primary/20 hover:border-primary/30 shadow-sm"
               >
                 Guardar y continuar luego
               </button>
               
               <button 
                 disabled={!estadoGeneralIngesta.allowed}
                 onClick={handleStartPreparacion}
                 className={`px-7 py-2.5 text-[14px] font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                   estadoGeneralIngesta.allowed 
                     ? 'text-white bg-primary hover:bg-primary-dark shadow-sm hover:shadow-primary/20 cursor-pointer' 
                     : 'text-slate-400 bg-slate-100 shadow-none cursor-not-allowed border border-slate-200'
                 }`}
               >
                 Iniciar Preparación
                 <ArrowRight size={16} className={estadoGeneralIngesta.allowed ? "text-secondary" : "text-slate-400"} />
               </button>
            </>
          ) : fase === 'preparacion_loading' ? (
             <div className="w-full flex justify-end">
               <button 
                 disabled
                 className="px-7 py-2.5 text-[14px] font-semibold rounded-lg transition-all flex items-center gap-2 text-white bg-primary/60 shadow-sm cursor-not-allowed"
               >
                 Preparando...
               </button>
             </div>
          ) : (
            <>
               <button 
                 onClick={() => setFase('ingesta')}
                 className="px-5 py-2 text-[13px] font-semibold text-primary hover:text-primary-dark bg-white hover:bg-slate-50 rounded-lg transition-colors border border-primary/20 hover:border-primary/30 shadow-sm"
               >
                 Volver a Ingesta
               </button>
               
               <button 
                 disabled={prepResult?.estado === 'Preparación con errores'}
                 onClick={() => {
                   /* onClose(); in real app move to conciliar */
                 }}
                 className={`px-7 py-2.5 text-[14px] font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    prepResult?.estado !== 'Preparación con errores'
                     ? 'text-white bg-primary hover:bg-primary-dark shadow-sm hover:shadow-primary/20 cursor-pointer' 
                     : 'text-slate-400 bg-slate-100 shadow-none cursor-not-allowed border border-slate-200'
                 }`}
               >
                 Continuar a Conciliación
                 <ArrowRight size={16} className={prepResult?.estado !== 'Preparación con errores' ? "text-secondary" : "text-slate-400"} />
               </button>
            </>
          )}
        </div>

      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl max-h-[90vh] z-[101] overflow-visible`}
          >
            {content}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

