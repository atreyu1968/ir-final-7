import React from 'react';
import { Filter, AlertCircle, FileText, Calendar } from 'lucide-react';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import { useAuthStore } from '../../stores/authStore';

interface ActionFilters {
  status?: 'imported' | 'error' | 'incomplete';
  network?: string;
  center?: string;
  quarter?: string;
  department?: string;
  family?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

interface ActionFiltersProps {
  filters: ActionFilters;
  onFiltersChange: (filters: ActionFilters) => void;
}

const ActionFilters: React.FC<ActionFiltersProps> = ({ filters, onFiltersChange }) => {
  const { user } = useAuthStore();
  const { activeYear } = useAcademicYearStore();
  const { networks, centers, departments, families } = useMasterRecordsStore();

  // Filtrar centros basados en la red seleccionada
  const availableCenters = centers.filter(center => {
    if (!filters.network) return true;
    return center.network === filters.network;
  });

  return (
    <dialog id="filters-dialog" className="modal p-0 rounded-lg shadow-xl">
      <div className="bg-white w-full max-w-4xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium">Filtros de Acciones</h3>
          </div>
          <button
            onClick={() => (document.getElementById('filters-dialog') as HTMLDialogElement)?.close()}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form method="dialog" className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
                placeholder="Buscar por nombre o descripción..."
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  status: e.target.value as ActionFilters['status'] || undefined 
                })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="imported">Importados</option>
                <option value="error">Con errores</option>
                <option value="incomplete">Incompletos</option>
              </select>
            </div>

            {(user?.role === 'admin' || user?.role === 'general_coordinator') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Red
                </label>
                <select
                  value={filters.network || ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    network: e.target.value || undefined,
                    center: undefined // Reset center when network changes
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas las redes</option>
                  {networks.map(network => (
                    <option key={network.id} value={network.code}>
                      {network.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centro
              </label>
              <select
                value={filters.center || ''}
                onChange={(e) => onFiltersChange({ ...filters, center: e.target.value || undefined })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={user?.role === 'manager'}
              >
                <option value="">Todos los centros</option>
                {availableCenters.map(center => (
                  <option key={center.id} value={center.name}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trimestre
              </label>
              <select
                value={filters.quarter || ''}
                onChange={(e) => onFiltersChange({ ...filters, quarter: e.target.value || undefined })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los trimestres</option>
                {activeYear?.quarters.map(quarter => (
                  <option key={quarter.id} value={quarter.id}>
                    {quarter.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <select
                value={filters.department || ''}
                onChange={(e) => onFiltersChange({ ...filters, department: e.target.value || undefined })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los departamentos</option>
                {departments.map(department => (
                  <option key={department.id} value={department.code}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Familia Profesional
              </label>
              <select
                value={filters.family || ''}
                onChange={(e) => onFiltersChange({ ...filters, family: e.target.value || undefined })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las familias</option>
                {families.map(family => (
                  <option key={family.id} value={family.code}>
                    {family.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value || undefined })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value || undefined })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => onFiltersChange({})}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border rounded-md"
            >
              Limpiar Filtros
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ActionFilters;