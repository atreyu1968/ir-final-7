import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useDatabaseConfigStore } from '../../stores/databaseConfigStore';

const DatabaseStatus = () => {
  const { config, testConnection } = useDatabaseConfigStore();
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const success = await testConnection();
      setStatus(success ? 'connected' : 'error');
      setError(success ? null : 'No se pudo conectar a la base de datos');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de la Base de Datos</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              status === 'connected' ? 'bg-green-100' :
              status === 'error' ? 'bg-red-100' :
              'bg-gray-100'
            }`}>
              <Database className={`w-5 h-5 ${
                status === 'connected' ? 'text-green-600' :
                status === 'error' ? 'text-red-600' :
                'text-gray-600'
              }`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                {status === 'checking' ? (
                  <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />
                ) : status === 'connected' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="font-medium">
                  {status === 'checking' ? 'Verificando conexión...' :
                   status === 'connected' ? 'Conectado' :
                   'Error de conexión'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Última verificación: {lastCheck.toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <button
            onClick={checkConnection}
            disabled={status === 'checking'}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <RefreshCw className={`w-5 h-5 ${status === 'checking' ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700">Host</div>
            <div className="text-sm text-gray-600">{config.settings.url}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700">Base de Datos</div>
            <div className="text-sm text-gray-600">{import.meta.env.VITE_DB_NAME}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;