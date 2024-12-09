import React from 'react';
import { Database, Server, Activity, AlertCircle } from 'lucide-react';
import { useDatabaseConfigStore } from '../../../stores/databaseConfigStore';

const DatabaseStatus = () => {
  const { status, refreshStatus } = useDatabaseConfigStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Estado de la Base de Datos</h3>
        <button
          onClick={refreshStatus}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Actualizar Estado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                status.connected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <Database className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Conexión</p>
                <p className="text-lg font-semibold text-gray-900">
                  {status.connected ? 'Conectada' : 'Desconectada'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Server className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pool Size</p>
                <p className="text-lg font-semibold text-gray-900">
                  {status.poolSize}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Activity className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Conexiones Activas</p>
                <p className="text-lg font-semibold text-gray-900">
                  {status.activeConnections}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Conexiones Inactivas</p>
                <p className="text-lg font-semibold text-gray-900">
                  {status.idleConnections}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;