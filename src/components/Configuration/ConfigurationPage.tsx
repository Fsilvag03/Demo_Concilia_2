import React, { useState } from 'react';
import { Search, LayoutGrid, List, Filter, Copy, UploadCloud, Plus } from 'lucide-react';
import { PageHeader } from '../PageHeader';
import { ProcessCard, Process } from './ProcessCard';
import { ProcessConfigModal } from './ProcessConfigModal';

const mockProcesses: Process[] = [
  {
    id: '1',
    name: 'Municipio',
    status: 'Activo',
    sources: ['Banco', 'Municipio', 'Banred'],
    strategy: 'Secuencial',
    completeness: 92,
    lastEditedBy: 'Andrea M.',
    lastEditedAt: '12/04'
  },
  {
    id: '2',
    name: 'Cash Pagos',
    status: 'Activo',
    sources: ['Cuenta 2056', 'Input', 'Portal Empresas'],
    rectorSource: 'Cuenta 2056',
    strategy: 'Multifuente',
    completeness: 88,
    lastEditedBy: 'Miriam R.',
    lastEditedAt: '13/04'
  },
  {
    id: '3',
    name: 'Tarjetas Crédito',
    status: 'En borrador',
    sources: ['Procesadora', 'Adquirente'],
    strategy: '1 a 1',
    completeness: 45,
    lastEditedBy: 'Carlos T.',
    lastEditedAt: '14/04'
  },
  {
    id: '4',
    name: 'Recargas Telefónicas',
    status: 'Incompleto',
    sources: ['Telco A', 'Telco B', 'Sistema Central'],
    strategy: 'Secuencial Compleja',
    completeness: 15,
    lastEditedBy: 'Luis P.',
    lastEditedAt: '10/04'
  },
  {
    id: '5',
    name: 'Transferencias SIP',
    status: 'Pendiente de publicación',
    sources: ['Banco Central', 'Core Bancario'],
    strategy: 'Consolidada',
    completeness: 100,
    lastEditedBy: 'Andrea M.',
    lastEditedAt: '15/04'
  }
];

const filters = ['Todos', 'Activos', 'En borrador', 'Incompletos', 'Inactivos', 'Con cambios pendientes de publicación'];

export function ConfigurationPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const filteredProcesses = mockProcesses.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Activos') return p.status === 'Activo';
    if (activeFilter === 'En borrador') return p.status === 'En borrador';
    if (activeFilter === 'Incompletos') return p.status === 'Incompleto';
    if (activeFilter === 'Inactivos') return p.status === 'Inactivo';
    if (activeFilter === 'Con cambios pendientes de publicación') return p.status === 'Pendiente de publicación';
    return true;
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <PageHeader 
        title="Biblioteca de Procesos"
        description="Gestiona y configura los procesos conciliatorios del sistema."
        primaryAction={{ label: 'Crear proceso', onClick: () => {}, icon: Plus }}
        secondaryActions={[
          { label: 'Duplicar configuración', onClick: () => {}, icon: Copy },
          { label: 'Importar', onClick: () => {}, icon: UploadCloud }
        ]}
      />

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input 
              type="text"
              placeholder="Buscar proceso por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none mask-fade-right">
             {filters.map(filter => (
               <button
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                   activeFilter === filter 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 {filter}
               </button>
             ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shrink-0 self-start xl:self-center">
          <button 
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'cards' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            title="Vista de Tarjetas"
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'table' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            title="Vista de Tabla"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredProcesses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
             <Filter size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No se encontraron procesos</h3>
          <p className="text-slate-500 text-sm max-w-md">
            No hay procesos conciliatorios que coincidan con tu búsqueda o los filtros actuales.
          </p>
        </div>
      ) : (
        viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProcesses.map(process => (
              <div key={process.id} onClick={() => setSelectedProcess(process)}>
                <ProcessCard process={process} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nombre de Proceso</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium">Fuentes Participantes</th>
                    <th className="px-6 py-4 font-medium">Estrategia</th>
                    <th className="px-6 py-4 font-medium text-right">Completitud</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProcesses.map(process => (
                    <tr 
                      key={process.id} 
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedProcess(process)}
                    >
                      <td className="px-6 py-4 font-medium text-primary group-hover:text-primary-dark">{process.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                          {process.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]" title={process.sources.join(', ')}>
                        {process.sources.join(' · ')}
                        {process.rectorSource && <span className="ml-2 text-xs text-slate-400">(Rectora: {process.rectorSource})</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{process.strategy}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-medium ${process.completeness === 100 ? 'text-secondary-dark' : 'text-slate-600'}`}>
                          {process.completeness}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Modal */}
      {selectedProcess && (
        <ProcessConfigModal 
          process={selectedProcess} 
          onClose={() => setSelectedProcess(null)} 
        />
      )}
    </div>
  );
}
