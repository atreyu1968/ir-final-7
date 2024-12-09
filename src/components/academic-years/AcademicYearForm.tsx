import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { AcademicYear, AcademicYearFormData, Quarter } from '../../types/academicYear';

interface AcademicYearFormProps {
  onSubmit: (data: AcademicYearFormData & { quarters: Quarter[] }) => void;
  onClose: () => void;
  initialData?: AcademicYear;
}

const AcademicYearForm: React.FC<AcademicYearFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<AcademicYearFormData>({
    name: initialData?.name || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    isActive: initialData?.isActive ?? false,
  });

  const [quarters, setQuarters] = useState<Quarter[]>(
    initialData?.quarters || [
      {
        id: '1',
        name: 'Primer Trimestre',
        startDate: '',
        endDate: '',
        isActive: false,
      },
      {
        id: '2',
        name: 'Segundo Trimestre',
        startDate: '',
        endDate: '',
        isActive: false,
      },
      {
        id: '3',
        name: 'Tercer Trimestre',
        startDate: '',
        endDate: '',
        isActive: false,
      },
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate quarter dates are within academic year range
    const yearStart = new Date(formData.startDate);
    const yearEnd = new Date(formData.endDate);
    
    const invalidQuarters = quarters.some(quarter => {
      const quarterStart = new Date(quarter.startDate);
      const quarterEnd = new Date(quarter.endDate);
      return quarterStart < yearStart || quarterEnd > yearEnd;
    });

    if (invalidQuarters) {
      alert('Las fechas de los trimestres deben estar dentro del rango del curso académico');
      return;
    }

    onSubmit({ ...formData, quarters });
  };

  const handleQuarterChange = (index: number, field: keyof Quarter, value: string | boolean) => {
    setQuarters(prev => prev.map((quarter, i) => 
      i === index ? { ...quarter, [field]: value } : quarter
    ));
  };

  const addQuarter = () => {
    setQuarters(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: `Trimestre ${prev.length + 1}`,
        startDate: '',
        endDate: '',
        isActive: false,
      }
    ]);
  };

  const removeQuarter = (index: number) => {
    setQuarters(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Editar' : 'Nuevo'} Curso Académico
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Curso
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Ej: Curso 2024-2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio del Curso
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin del Curso
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Trimestres</h3>
              <button
                type="button"
                onClick={addQuarter}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Trimestre</span>
              </button>
            </div>

            <div className="space-y-4">
              {quarters.map((quarter, index) => (
                <div key={quarter.id} className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={quarter.name}
                      onChange={(e) => handleQuarterChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={quarter.startDate}
                      onChange={(e) => handleQuarterChange(index, 'startDate', e.target.value)}
                      min={formData.startDate}
                      max={formData.endDate}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={quarter.endDate}
                      onChange={(e) => handleQuarterChange(index, 'endDate', e.target.value)}
                      min={quarter.startDate || formData.startDate}
                      max={formData.endDate}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-2 flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={quarter.isActive}
                        onChange={(e) => handleQuarterChange(index, 'isActive', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Activo</span>
                    </label>
                  </div>

                  <div className="col-span-1 flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeQuarter(index)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                      title="Eliminar trimestre"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Curso Activo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {initialData ? 'Guardar Cambios' : 'Crear Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcademicYearForm;