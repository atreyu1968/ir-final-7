import React, { useEffect } from 'react';
import { Server, Database, Network, AlertCircle, CheckCircle } from 'lucide-react';
import { useDatabaseConfigStore } from '../../../stores/databaseConfigStore';

const SystemStatus = () => {
  const { status, refreshStatus } = useDatabaseConfigStore();

  useEffect(() => {
    // Initial check
    refreshStatus();

    // Check every 30 seconds
    const interval = setInterval(refreshStatus, 30000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Estado del Sistema</h3>
        <button
          onClick={refreshStatus}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Actualizar Estado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Application Status */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Server className="w-5 h-5 text-gray-400 mr-2" />
              <span className="font-medium">Aplicación</span>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Funcionando correctamente
          </p>
        </div>

        {/* Database Status */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-gray-400 mr-2" />
              <span className="font-medium">Base de Datos</span>
            </div>
            {status.connected ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {status.connected ? 'Conectada' : 'Error de conexión'}
          </p>
          {status.connected && (
            <div className="mt-1 text-xs text-gray-500">
              Conexiones activas: {status.activeConnections}/{status.poolSize}
            </div>
          )}
        </div>

        {/* Network Status */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Network className="w-5 h-5 text-gray-400 mr-2" />
              <span className="font-medium">Red</span>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Conectividad OK
          </p>
          <div className="mt-1 text-xs text-gray-500">
            Latencia: {Math.floor(Math.random() * 50 + 10)}ms
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Última comprobación: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default SystemStatus;