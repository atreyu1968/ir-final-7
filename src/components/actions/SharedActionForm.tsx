import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useActionsStore } from '../../stores/actionsStore';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import type { Action } from '../../types/action';

interface SharedActionFormProps {
  onSubmit: (data: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const SharedActionForm: React.FC<SharedActionFormProps> = ({ onSubmit }) => {
  const { token } = useParams();
  const { departments, families } = useMasterRecordsStore();
  const [managerInfo, setManagerInfo] = useState<{
    id: string;
    center: string;
    network: string;
  } | null>(null);
  const [formData, setFormData] = useState<Partial<Action>>({});

  useEffect(() => {
    // Decode token to get manager info
    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        setManagerInfo(decoded);
      } catch (error) {
        console.error('Invalid token');
      }
    }
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerInfo) return;

    onSubmit({
      ...formData as Required<Omit<Action, 'id' | 'createdAt' | 'updatedAt'>>,
      createdBy: managerInfo.id,
      center: managerInfo.center,
      network: managerInfo.network
    });
  };

  if (!managerInfo) {
    return <div>Enlace inválido</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Registro de Acción
            </h1>
            <p className="mt-2 text-gray-600">
              Centro: {managerInfo.center}
            </p>
          </div>

          {/* Formulario similar al ActionForm pero simplificado */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... campos del formulario ... */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SharedActionForm;