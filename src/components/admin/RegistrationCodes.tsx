import React, { useEffect } from 'react';
import { useRegistrationCodesStore } from '../../stores/registrationCodesStore';
import RegistrationCodeList from './registration/RegistrationCodeList';
import AutomaticCodeGenerator from './registration/AutomaticCodeGenerator';
import RegistrationCodeForm from './registration/RegistrationCodeForm';
import type { RegistrationCode } from '../../types/registrationCode';

const RegistrationCodes = () => {
  const { 
    codes, 
    cleanExpiredCodes,
    deleteCode,
    updateCode
  } = useRegistrationCodesStore();

  const [showForm, setShowForm] = React.useState(false);
  const [editingCode, setEditingCode] = React.useState<RegistrationCode | null>(null);

  // Limpiar códigos expirados cada minuto
  useEffect(() => {
    cleanExpiredCodes();
    const interval = setInterval(cleanExpiredCodes, 60000);
    return () => clearInterval(interval);
  }, [cleanExpiredCodes]);

  const handleEdit = (code: RegistrationCode) => {
    setEditingCode(code);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este código?')) {
      deleteCode(id);
    }
  };

  const handleSubmit = (data: Omit<RegistrationCode, 'id'>) => {
    if (editingCode) {
      updateCode(editingCode.id, data);
    }
    setShowForm(false);
    setEditingCode(null);
  };

  return (
    <div className="space-y-8">
      <AutomaticCodeGenerator />
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Códigos Activos
        </h3>
        <RegistrationCodeList 
          codes={codes} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <RegistrationCodeForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingCode(null);
          }}
          initialData={editingCode}
        />
      )}
    </div>
  );
};

export default RegistrationCodes;