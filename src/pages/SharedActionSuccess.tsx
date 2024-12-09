import React from 'react';
import { CheckCircle } from 'lucide-react';

const SharedActionSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Acción Registrada!
        </h1>
        <p className="text-gray-600 mb-8">
          La acción ha sido registrada exitosamente. El gestor podrá revisarla en el sistema.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => window.close()}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Cerrar Ventana
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-lg"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedActionSuccess;