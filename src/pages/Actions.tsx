import React, { useState, useEffect } from 'react';
import { Plus, Upload, Filter } from 'lucide-react';
import { useActionsStore } from '../stores/actionsStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import { useAuthStore } from '../stores/authStore';
import ActionList from '../components/actions/ActionList';
import ActionForm from '../components/actions/ActionForm';
import ImportActions from '../components/actions/ImportActions';
import ActionFilters from '../components/actions/ActionFilters';
import ShareActionButton from '../components/actions/ShareActionButton';
import { mockActions } from '../data/mockActions';
import type { Action } from '../types/action';

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

const Actions = () => {
  const { actions, setActions, addAction, updateAction, deleteAction } = useActionsStore();
  const { activeYear } = useAcademicYearStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [filters, setFilters] = useState<ActionFilters>({});

  useEffect(() => {
    setActions(mockActions);
  }, [setActions]);

  const handleEdit = (action: Action) => {
    setEditingAction(action);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta acción?')) {
      deleteAction(id);
    }
  };

  const handleSubmit = (data: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAction) {
      // Check if all required fields are filled
      const isComplete = !Object.values(data).some(value => !value);
      
      // Check if all fields are valid (no validation errors)
      const hasNoErrors = !editingAction.importErrors?.some(error => {
        const fieldValue = data[error.field as keyof typeof data];
        return !fieldValue; // Field is still empty or invalid
      });

      // Update action with cleared error flags if corrected
      updateAction(editingAction.id, {
        ...data,
        importErrors: hasNoErrors ? undefined : editingAction.importErrors,
        isIncomplete: !isComplete,
        isImported: editingAction.isImported,
      });
    } else {
      addAction(data);
    }
    setShowForm(false);
    setEditingAction(null);
  };

  const handleImport = (actions: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    actions.forEach(action => {
      addAction(action);
    });
  };

  const canEditAction = (action: Action) => {
    if (user?.role === 'admin') return true;
    if (!activeYear) return false;

    const quarter = activeYear.quarters.find(q => q.id === action.quarter);
    if (!quarter?.isActive) return false;

    if (user?.role === 'general_coordinator') return true;
    if (user?.role === 'subnet_coordinator' && action.network === user.network) return true;
    return action.createdBy === user?.id;
  };

  const canImport = user?.role === 'admin' || user?.role === 'general_coordinator';

  // Filter actions based on selected filters
  const filteredActions = actions.filter(action => {
    if (filters.status) {
      if (filters.status === 'imported' && !action.isImported) return false;
      if (filters.status === 'error' && !action.importErrors?.length) return false;
      if (filters.status === 'incomplete' && !action.isIncomplete) return false;
    }

    if (filters.network && action.network !== filters.network) return false;
    if (filters.center && action.center !== filters.center) return false;
    if (filters.quarter && action.quarter !== filters.quarter) return false;
    if (filters.department && !action.departments.includes(filters.department)) return false;
    if (filters.family && !action.professionalFamilies.includes(filters.family)) return false;
    if (filters.startDate && action.startDate < filters.startDate) return false;
    if (filters.endDate && action.endDate > filters.endDate) return false;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        action.name.toLowerCase().includes(searchTerm) ||
        action.description.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Acciones</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => (document.getElementById('filters-dialog') as HTMLDialogElement)?.showModal()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </button>
          <ShareActionButton />
          {canImport && (
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
            >
              <Upload className="w-5 h-5" />
              <span>Importar</span>
            </button>
          )}
          <button
            onClick={() => {
              setEditingAction(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Acción</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <ActionList
            actions={filteredActions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEditAction}
          />
        </div>
      </div>

      {showForm && (
        <ActionForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingAction(null);
          }}
          initialData={editingAction}
        />
      )}

      {showImport && (
        <ImportActions
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}

      <ActionFilters
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
};

export default Actions;